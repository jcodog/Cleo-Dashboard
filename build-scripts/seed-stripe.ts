import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import type Stripe from "stripe";
import { loadStripe } from "@/lib/stripe";
import { getDb } from "@/lib/prisma";
import { ProductType } from "@/prisma";
import { oneTimePurchaseProducts } from "./stripe-product-templates/oneTimePurchases";
import { subscriptions } from "./stripe-product-templates/subscriptions";

const stripe = loadStripe({ secretKey: process.env.STRIPE_SECRET_KEY! });
const db = getDb(process.env.DATABASE_URL!);

// Determine integer amount: prefer unit_amount, fallback to custom_unit_amount.preset
function getPriceAmount(price: Stripe.Price): number {
  return price.unit_amount ?? price.custom_unit_amount?.preset ?? 0;
}

const seedProduct = async (
  product: Stripe.ProductCreateParams,
  type: ProductType
) => {
  console.log(`Seeding ${type} product: ${product.name}`);

  // Check if the product exists on stripe already
  const stripeProduct = await stripe.products.search({
    query: `name: '${product.name}'`,
    limit: 1,
    expand: ["data.default_price"],
  });

  // Helper to fully sync a Stripe product (and ALL its prices) into the DB
  const syncProductIntoDb = async (stripeProductId: string) => {
    // Re-retrieve the product to ensure default_price is up to date
    const fullProduct = await stripe.products.retrieve(stripeProductId, {
      expand: ["default_price"],
    });

    // Get all prices for this product
    const allPrices = await stripe.prices.list({
      product: fullProduct.id,
      limit: 100,
    });

    const defaultPriceId =
      typeof fullProduct.default_price === "string"
        ? fullProduct.default_price
        : (fullProduct.default_price as Stripe.Price | null)?.id ?? null;

    const priceCreates = allPrices.data.map((p) => ({
      id: p.id,
      amount: getPriceAmount(p),
      default: defaultPriceId ? p.id === defaultPriceId : false,
    }));

    // If a product with the same name exists in the DB but with a different id,
    // remove it so we can replace it with the current Stripe product id.
    // This handles cases where a Stripe product was deleted/recreated.
    const existingByName = await db.products.findFirst({
      where: {
        name: fullProduct.name,
        NOT: { id: fullProduct.id }, // exclude the same product id
      },
      select: { id: true },
    });

    if (existingByName) {
      // Clean up dependent prices first to satisfy FK constraints, then delete the product.
      await db.prices.deleteMany({ where: { productId: existingByName.id } });
      await db.products.delete({ where: { id: existingByName.id } });
    }

    // Upsert product and replace its prices snapshot
    await db.products.upsert({
      where: { id: fullProduct.id },
      create: {
        id: fullProduct.id,
        name: fullProduct.name,
        type,
        prices: { create: priceCreates },
      },
      update: {
        name: fullProduct.name,
        type,
        prices: {
          deleteMany: {},
          create: priceCreates,
        },
      },
    });
  };

  if (!stripeProduct.data[0]) {
    // Create and seed the product on Stripe first
    const newProduct = await stripe.products.create(product);

    // Special-case: create additional message pricing tiers
    if (newProduct.name === "Cleo AI Additional Messages") {
      console.log("Creating additional message pricing tiers");
      const smallBundle = await stripe.prices.create({
        product: newProduct.id,
        currency: "GBP",
        transform_quantity: {
          divide_by: 100,
          round: "up",
        },
        unit_amount: 500,
        nickname: "Small message bundle",
      });

      const mediumBundle = await stripe.prices.create({
        product: newProduct.id,
        currency: "GBP",
        transform_quantity: {
          divide_by: 250,
          round: "up",
        },
        unit_amount: 1000,
        nickname: "Medium message bundle",
      });

      const largeBundle = await stripe.prices.create({
        product: newProduct.id,
        currency: "GBP",
        transform_quantity: {
          divide_by: 500,
          round: "up",
        },
        unit_amount: 1500,
        nickname: "Large message bundle",
      });

      const mesgaBundle = await stripe.prices.create({
        product: newProduct.id,
        currency: "GBP",
        transform_quantity: {
          divide_by: 1000,
          round: "up",
        },
        unit_amount: 3000,
        nickname: "Mega message bundle",
      });

      // Set a sensible default
      await stripe.products.update(newProduct.id, {
        default_price: smallBundle.id,
      });
    }

    // Now sync the created product and all prices into the DB
    await syncProductIntoDb(newProduct.id);
  } else {
    // Product exists on Stripe already; just sync it fully into the DB
    await syncProductIntoDb(stripeProduct.data[0].id);
  }
};

const seeder = async () => {
  console.log("Seeding stripe products.");
  // seed one time purchases serially
  for (const product of oneTimePurchaseProducts) {
    await seedProduct(product, "onetime");
  }

  // seed subscription purchases serially
  for (const product of subscriptions) {
    await seedProduct(product, "subscription");
  }
  console.log("Stripe products seeded.");
};

seeder();
