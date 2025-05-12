import { dashProcedure, j } from "@/server/jstack";
import {
	RESTGetAPICurrentUserGuildsResult,
	RESTGetAPIGuildMemberResult,
	RESTGetAPIGuildResult,
} from "discord-api-types/v10";
import { env } from "hono/adapter";
import { z } from "zod";

const DISCORD_INVITE_REGEX =
	/^https:\/\/(?:discord\.gg\/|discord\.com\/invite\/)([A-Za-z0-9_-]{2,32})\/?$/i;

export const dashRouter = j.router({
	getHeaderInfo: dashProcedure
		.input(z.object({ guildId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const botToken = env(c).DISCORD_BOT_TOKEN;
			try {
				// Fetch user guilds to check permissions
				const userGuildsRes = await fetch(
					"https://discord.com/api/v10/users/@me/guilds",
					{
						headers: {
							Authorization: `Bearer ${ctx.accessToken}`,
						},
					}
				);

				if (!userGuildsRes.ok) {
					throw new Error(
						`Failed to fetch user guilds [${userGuildsRes.status}]`
					);
				}

				const userGuilds: RESTGetAPICurrentUserGuildsResult =
					await userGuildsRes.json();

				// Check if user has MANAGE_GUILD or ADMINISTRATOR permissions
				const hasPerm = userGuilds.some(
					(g) =>
						g.id === input.guildId &&
						(BigInt(g.permissions) & (BigInt(8) | BigInt(32))) !==
							BigInt(0)
				);

				if (!hasPerm) {
					return c.json({
						noPerm: true,
						error: "Forbidden - missing required server permissions",
					});
				}

				// Fetch guild info using bot token
				const guildRes = await fetch(
					`https://discord.com/api/v10/guilds/${input.guildId}`,
					{
						headers: {
							Authorization: `Bot ${botToken}`,
						},
					}
				);

				if (!guildRes.ok) {
					return c.json({
						success: false,
						error: `Failed to fetch guild info`,
					});
				}

				const guild: RESTGetAPIGuildResult = await guildRes.json();

				return c.json({
					success: true,
					data: {
						name: guild.name,
						description: guild.description,
						icon: guild.icon
							? `https://cdn.discordapp.com/icons/${guild.id}/${
									guild.icon
							  }.${guild.icon.startsWith("a_") ? "gif" : "png"}`
							: "https://archive.org/download/discordprofilepictures/discordblue.png",
					},
				});
			} catch (err: any) {
				console.error("getHeaderInfo error:", err);
				return c.json({
					success: false,
					error: err.message || "Internal error",
				});
			}
		}),

	getGuildInfo: dashProcedure
		.input(z.object({ guildId: z.string() }))
		.query(async ({ c, ctx: { db }, input: { guildId } }) => {
			const botToken = env(c).DISCORD_BOT_TOKEN;

			try {
				const guildRes = await fetch(
					`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
					{ headers: { Authorization: `Bot ${botToken}` } }
				);

				if (!guildRes.ok) {
					return c.json({
						success: false,
						error: `Guild fetch failed [${guildRes.status}]`,
					});
				}

				const guildData =
					(await guildRes.json()) as RESTGetAPIGuildResult;

				const dbGuildData = await db.servers.findUnique({
					where: { id: guildId },
				});

				let dbGuild;
				if (!dbGuildData) {
					dbGuild = await db.servers.create({
						data: {
							id: guildData.id,
							name: guildData.name,
							ownerId: guildData.owner_id,
						},
					});
				} else {
					dbGuild = dbGuildData;
				}

				return c.json({
					success: true,
					data: {
						guild: guildData,
						dbGuild: dbGuild,
					},
				});
			} catch (err: any) {
				console.error("getGuild error:", err);
				return c.json({
					success: false,
					error: err.message || "Internal error",
				});
			}
		}),

	getGuild: dashProcedure
		.input(z.object({ guildId: z.string() }))
		.query(
			async ({
				c,
				ctx: { user, accessToken, db },
				input: { guildId },
			}) => {
				const botToken = env(c).DISCORD_BOT_TOKEN;
				try {
					// run DB + all Discord fetches in parallel
					const [dbGuild, guildRes, memberRes, permsRes] =
						await Promise.all([
							db.servers.findUnique({ where: { id: guildId } }),
							fetch(
								`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
								{
									headers: {
										Authorization: `Bot ${botToken}`,
									},
								}
							),
							fetch(
								`https://discord.com/api/v10/guilds/${guildId}/members/${user.discordId}`,
								{
									headers: {
										Authorization: `Bot ${botToken}`,
									},
								}
							),
							fetch(
								`https://discord.com/api/v10/users/@me/guilds`,
								{
									headers: {
										Authorization: `Bearer ${accessToken}`,
									},
								}
							),
						]);

					if (!guildRes.ok)
						return c.json({
							success: false,
							error: `Guild fetch failed [${guildRes.status}]`,
						});
					if (!memberRes.ok)
						return c.json({
							success: false,
							error: `Member fetch failed [${memberRes.status}]`,
						});
					if (!permsRes.ok)
						return c.json({
							success: false,
							error: `Permissions fetch failed [${permsRes.status}]`,
						});

					// parse JSON
					const [guildData, memberData, permsData] =
						await Promise.all([
							guildRes.json() as Promise<RESTGetAPIGuildResult>,
							memberRes.json() as Promise<RESTGetAPIGuildMemberResult>,
							permsRes.json() as Promise<RESTGetAPICurrentUserGuildsResult>,
						]);

					// ensure user has MANAGE_GUILD or ADMINISTRATOR perms
					const hasPerm = permsData.some(
						(g) =>
							g.id === guildId &&
							(BigInt(g.permissions) &
								(BigInt(8) | BigInt(32))) !==
								BigInt(0)
					);
					if (!hasPerm)
						return c.json({ success: false, error: "Forbidden" });

					return c.json({
						success: true,
						data: { dbGuild, guildData, memberData },
					});
				} catch (err: any) {
					console.error("getGuild error:", err);
					return c.json({
						success: false,
						error: err.message || "Internal error",
					});
				}
			}
		),

	setGuildInfo: dashProcedure
		.input(
			z.object({
				guildId: z.string(),
				name: z.string(),
				description: z.string(),
				initialName: z.string(),
				initialDescription: z.string(),
			})
		)
		.mutation(
			async ({
				c,
				input: {
					guildId,
					name,
					description,
					initialName,
					initialDescription,
				},
			}) => {
				const botToken = env(c).DISCORD_BOT_TOKEN;

				const updates: Record<string, string> = {};
				if (name !== initialName) updates.name = name;
				if (description !== initialDescription)
					updates.description = description;

				if (Object.keys(updates).length === 0) {
					return c.json({
						success: false,
						error: "No changes detected",
					});
				}

				const updateRes = await fetch(
					`https://discord.com/api/v10/guilds/${guildId}`,
					{
						method: "PATCH",
						headers: {
							"X-Audit-Log-Reason":
								"Changed by server manager on Cleo dashboard.",
							"Content-Type": "application/json",
							Authorization: `Bot ${botToken}`,
						},
						body: JSON.stringify(updates),
					}
				);

				if (!updateRes.ok) {
					console.error(updateRes.body);
					console.error(await updateRes.json());
					return c.json({
						success: false,
						error: `Error updating guild info [${updateRes.status}]`,
					});
				}

				return c.json({
					success: true,
				});
			}
		),

	setGuildInvite: dashProcedure
		.input(
			z.object({
				inviteLink: z
					.string()
					.url({ message: "Please only provide a valid url." })
					.regex(DISCORD_INVITE_REGEX, {
						message:
							"Please only provide a valid discord invite link.",
					}),
			})
		)
		.mutation(async ({ c, ctx, input }) => {
			const { inviteLink } = input;
			const [fullUrl, code] = DISCORD_INVITE_REGEX.exec(inviteLink)!;

			const isDotCom = fullUrl.includes("discord.com/invite");
			const url = isDotCom
				? fullUrl
				: `https://discord.com/invite/${code}`;

			console.log({
				url,
				code,
			});

			return c.json({
				success: true,
				message: "Set the invite link",
			});
		}),
});
