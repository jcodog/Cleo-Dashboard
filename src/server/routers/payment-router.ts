import { Prisma } from "@/prisma/client";
import { dashProcedure, j } from "@/server/jstack";
import z from "zod";

type ProductWithPrices = Prisma.ProductsGetPayload<{
  include: { prices: true };
}>;

export const paymentRouter = j.router({
  additionalMessageBundles: dashProcedure.query(async ({ c, ctx: { db } }) => {
    const product = (await db.products.findFirst({
      where: {
        name: "Cleo AI Additional Messages",
        type: "onetime",
      },
      include: {
        prices: true,
      },
    })) as ProductWithPrices | null;

    return c.json(
      product
        ? {
            product: product,
            message: "Additional message product found",
          }
        : {
            product: null,
            message: "Failed to find the product",
          }
    );
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
    .mutation(async ({ c, ctx: { db, user, stripe, authUser }, input }) => {
      let customerId: string;
      // Ensure a Stripe customer exists for this user
      if (!user.customerId) {
        const customer = await stripe.customers.create({
          email: user.email ?? undefined,
          name: (authUser.name ?? user.username) || undefined,
          metadata: {
            app_user_id: String(user.id ?? ""),
          },
        });

        await db.users.update({
          where: {
            id: user.id,
          },
          data: {
            customerId: customer.id,
          },
        });

        customerId = customer.id;
      } else {
        customerId = user.customerId;
      }

      const checkout = await stripe.checkout.sessions.create({
        adaptive_pricing: {
          enabled: true,
        },
        customer: customerId,
        mode: input.type,
        line_items: [
          {
            price: input.price,
            quantity: 1,
          },
        ],
        success_url: `${input.domain}/dashboard/purchase?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${input.domain}/${input.path}`,
      });

      return c.json({
        url: checkout.url,
        message: "Checkout session created",
      });
    }),
});
