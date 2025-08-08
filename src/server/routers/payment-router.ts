import { dashProcedure, j } from "@/server/jstack";
import { env } from "hono/adapter";
import type Stripe from "stripe";
import z from "zod";

export const paymentRouter = j.router({
  additionalMessageBundles: dashProcedure.query(async ({ c, ctx: { db } }) => {
    const product = await db.products.findFirst({
      where: {
        AND: {
          name: "Cleo AI Additional Messages",
          type: "onetime",
        },
      },
      include: {
        prices: true,
      },
    });

    if (!product)
      return c.json({
        product: null,
        message: "Failed to find the product",
      });

    return c.json({
      product,
      message: "Additional message product found",
    });
  }),

  checkout: dashProcedure
    .input(
      z.object({
        price: z.string(),
        type: z.enum(["payment", "subscription", "setup"]),
        domain: z.string(),
        path: z.string(),
      })
    )
    .mutation(async ({ c, ctx: { user, stripe }, input }) => {
      const checkout = await stripe.checkout.sessions.create({
        adaptive_pricing: {
          enabled: true,
        },
        customer: user.customerId!,
        mode: input.type,
        line_items: [
          {
            price: input.price,
            quantity: 1,
          },
        ],
        success_url: `${input.domain}/dashboard/purchase?s=processing`,
        cancel_url: `${input.domain}/${input.path}`,
      });

      return c.json({
        url: checkout.url,
        message: "Checkout session created",
      });
    }),
});
