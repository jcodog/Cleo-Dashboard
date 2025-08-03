import { getDb } from "@/lib/prisma";
import { loadStripe } from "@/lib/stripe";
import { Role } from "@/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

const db = getDb(process.env.DATABASE_URL!);
const stripe = loadStripe({ secretKey: process.env.STRIPE_SECRET_KEY! });

export async function POST(req: NextRequest) {
	// Verify webhook signature
	let evt;
	try {
		evt = await verifyWebhook(req);
	} catch (error) {
		console.error("Failed to verify Clerk webhook", error);
		return new Response("Invalid webhook signature", { status: 401 });
	}
	const eventType = evt.type;
	// Handle event
	try {
		switch (eventType) {
			case "user.created": {
				// sync to db a new user if none exists
				const {
					id,
					username,
					email_addresses,
					primary_email_address_id,
					external_accounts,
					first_name,
					last_name,
				} = evt.data;

				const emailAddress = email_addresses.filter(
					(email) => email.id === primary_email_address_id
				)[0];
				const discord = external_accounts.filter(
					(account) => account.provider === "oauth_discord"
				)[0];

				const user = await db.users.findFirst({
					where: {
						extId: id,
					},
				});

				if (user) {
					return new Response("User already synced", { status: 200 });
				}

				const customer = await stripe.customers.create({
					name: last_name
						? `${first_name} ${last_name}`
						: `${first_name}`,
					email: emailAddress!.email_address,
				});

				const newUser = await db.users.create({
					data: {
						extId: id,
						username: username!,
						discordId: discord!.provider_user_id,
						email: emailAddress!.email_address,
						customerId: customer.id,
						limits: {
							create: {
								date: new Date(),
							},
						},
					},
					include: { limits: true },
				});

				const client = await clerkClient();
				await client.users.updateUserMetadata(id, {
					privateMetadata: {
						role: newUser.role,
					},
				});

				return new Response("User synced", { status: 200 });
			}

			case "user.deleted": {
				// remove user from db if exists
				const { id } = evt.data;
				const existing = await db.users.findFirst({
					where: { extId: id },
				});
				if (!existing) {
					return new Response("User not found", { status: 200 });
				}

				if (existing.customerId)
					await stripe.customers.del(existing.customerId!);

				// delete related records to avoid foreign key constraints
				await db.limits.deleteMany({ where: { id: existing.id } });
				await db.premiumSubscriptions.deleteMany({
					where: { id: existing.id },
				});
				await db.users.delete({ where: { extId: id } });
				return new Response("User deleted", { status: 200 });
			}

			case "user.updated": {
				// track email changes only
				const {
					id,
					email_addresses,
					primary_email_address_id,
					private_metadata,
				} = evt.data;
				const emailEntry = email_addresses.find(
					(e) => e.id === primary_email_address_id
				);
				if (!emailEntry) {
					return new Response("No primary email found", {
						status: 400,
					});
				}
				const role = private_metadata.role as Role | undefined | null;
				if (!role) {
					return new Response("No user role found", { status: 400 });
				}
				const updated = await db.users.update({
					where: { extId: id },
					data: { email: emailEntry.email_address, role },
				});
				return new Response("User email updated", { status: 200 });
			}
			default:
				return new Response("Event type not handled", { status: 400 });
		}
	} catch (error) {
		console.error("Error handling webhook event", error);
		return new Response("Internal server error", { status: 500 });
	}
}
