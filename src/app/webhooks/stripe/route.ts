import { getDb } from "@/lib/prisma";
import { loadStripe } from "@/lib/stripe";
import Stripe from "stripe";

// Ensure this route runs on Node.js runtime for Stripe webhook verification
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const validateWebhook = async ({
  body,
  signature,
}: {
  body: string;
  signature: string;
}) => {
  const { STRIPE_WEBHOOK_SECRET } = process.env;
  if (!STRIPE_WEBHOOK_SECRET) return { event: null };
  try {
    const event = Stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
    return { event };
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return { event: null };
  }
};

const db = getDb(process.env.DATABASE_URL ?? "");
const stripe = loadStripe({ secretKey: process.env.STRIPE_SECRET_KEY! });

export const POST = async (req: Request) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Error: Missing 'stripe-signature' header", {
      status: 400,
    });
  }

  const payload = await req.text();

  const { event } = await validateWebhook({
    body: payload,
    signature,
  });

  if (!event) {
    return new Response("Unauthorized: Webhook signature verification failed", {
      status: 403,
    });
  }

  const { data, type } = event as Stripe.Event;

  switch (type) {
    case "checkout.session.completed": {
      const session = data.object as Stripe.Checkout.Session;
      // Retrieve full session to access metadata and ensure we have customer id
      let fullSession: Stripe.Checkout.Session;
      try {
        fullSession = await stripe.checkout.sessions.retrieve(session.id);
      } catch (err) {
        console.error("Failed to retrieve checkout session", err);
        return new Response("Failed to retrieve checkout session", {
          status: 500,
        });
      }

      // Basic idempotency: if we've already marked this session as handled in Stripe metadata, no-op
      if (fullSession.metadata && fullSession.metadata["handled"] === "true") {
        return new Response("Duplicate webhook event", {
          status: 200,
          statusText: "DUPLICATE",
        });
      }
      // List line items with price expanded
      let lineItems: Array<Stripe.LineItem & { price?: Stripe.Price | null }> =
        [];
      try {
        const listed = await stripe.checkout.sessions.listLineItems(
          session.id,
          { expand: ["data.price"] }
        );
        lineItems = listed.data as any;
      } catch (err) {
        console.error("Failed to list line items for session", err);
        return new Response("Checkout session has no line items", {
          status: 400,
        });
      }

      // Helper to infer message quantity from amount (in pence)
      const inferMessages = (amount: number): number | null => {
        if (amount <= 600) return 100;
        if (amount <= 1100) return 250;
        if (amount <= 1600) return 500;
        if (amount <= 3100) return 1000;
        const approx = Math.round((amount / 100) * 20);
        return approx > 0 ? approx : null;
      };

      // Aggregate top-up messages across eligible line items
      let totalTopup = 0;
      for (const item of lineItems) {
        const price = (item as any).price as Stripe.Price | null;
        if (!price?.id || price.unit_amount == null) continue;

        // Verify the price belongs to our Additional Messages product
        const product = await db.products.findFirst({
          where: {
            AND: [
              { name: "Cleo AI Additional Messages" },
              { type: "onetime" },
              {
                prices: {
                  some: { id: price.id },
                },
              },
            ],
          },
          include: { prices: true },
        });
        if (!product) continue; // ignore unrelated items

        const perUnit = inferMessages(price.unit_amount);
        if (!perUnit) continue;

        const qty = item.quantity ?? 1;
        totalTopup += perUnit * qty;
      }

      if (totalTopup <= 0) {
        return new Response("No eligible items found to top up", {
          status: 200,
          statusText: "NOOP",
        });
      }

      try {
        const customerId = (fullSession.customer as string) ?? null;
        if (!customerId) {
          return new Response("Missing Stripe customer on session", {
            status: 400,
          });
        }

        const user = await db.users.findFirst({ where: { customerId } });
        if (!user) {
          return new Response("No user found for Stripe customer", {
            status: 404,
          });
        }

        // Ensure Limits row exists and increment
        await db.limits.upsert({
          where: { id: user.id },
          update: { additionalMessages: { increment: totalTopup } },
          create: {
            id: user.id,
            date: new Date(),
            additionalMessages: totalTopup,
          },
        });

        // Mark session as handled to avoid double processing on retries
        try {
          const newMetadata = {
            ...(fullSession.metadata ?? {}),
            handled: "true",
            handledAt: new Date().toISOString(),
          } as Record<string, string>;
          await stripe.checkout.sessions.update(session.id, {
            metadata: newMetadata,
          });
        } catch (metaErr) {
          console.warn(
            "Failed to mark session as handled; will rely on DB idempotency",
            metaErr
          );
        }

        return new Response("User additional messages topped up", {
          status: 200,
          statusText: "TOP UP COMPLETED",
        });
      } catch (err: any) {
        console.error("Failed to apply message top-up", err);
        return new Response("Internal error applying top-up", { status: 500 });
      }
    }
    // case "customer.subscription.created":
    //   break;
    // case "customer.subscription.updated":
    //   break;
    // case "customer.subscription.deleted":
    //   break;
    // case "customer.subscription.paused":
    //   break;
    // case "customer.subscription.resumed":
    //   break;
    default:
      return new Response("Unhandled event type", {
        status: 200,
        statusText: "UNHANDLED",
      });
  }
};
