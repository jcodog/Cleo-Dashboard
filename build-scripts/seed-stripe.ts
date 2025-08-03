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

	if (!stripeProduct.data[0]) {
		// Create and seed the product information into the db
		const newProduct = await stripe.products.create(product);

		const dbProduct = await db.products.findFirst({
			where: {
				OR: [{ id: newProduct.id }, { name: newProduct.name }],
			},
		});

		if (!dbProduct) {
			// create new db entry
			const defaultPrice = newProduct.default_price as Stripe.Price;
			console.log(defaultPrice);

			await db.products.create({
				data: {
					id: newProduct.id,
					name: newProduct.name,
					type,
					prices: {
						create: {
							id: defaultPrice.id,
							amount: getPriceAmount(defaultPrice),
							default: true,
						},
					},
				},
			});
		} else {
			// update db entry
			const defaultPrice = newProduct.default_price as Stripe.Price;
			console.log(defaultPrice);

			await db.products.update({
				where: { id: dbProduct.id },
				data: {
					id: newProduct.id,
					name: newProduct.name,
					type,
					prices: {
						deleteMany: {},
						create: {
							id: defaultPrice.id,
							amount: getPriceAmount(defaultPrice),
							default: true,
						},
					},
				},
			});
		}
	} else {
		// Seed the product information into the db
		const dbProduct = await db.products.findFirst({
			where: {
				OR: [
					{ id: stripeProduct.data[0].id },
					{ name: stripeProduct.data[0].name },
				],
			},
		});

		if (!dbProduct) {
			// create new db entry
			const defaultPrice = stripeProduct.data[0]
				.default_price as Stripe.Price;
			console.log(defaultPrice);

			await db.products.create({
				data: {
					id: stripeProduct.data[0].id,
					name: stripeProduct.data[0].name,
					type,
					prices: {
						create: {
							id: defaultPrice.id,
							amount: getPriceAmount(defaultPrice),
							default: true,
						},
					},
				},
			});
		} else {
			// update db entry
			const defaultPrice = stripeProduct.data[0]
				.default_price as Stripe.Price;
			console.log(defaultPrice);

			await db.products.update({
				where: { id: dbProduct.id },
				data: {
					id: stripeProduct.data[0].id,
					name: stripeProduct.data[0].name,
					type,
					prices: {
						deleteMany: {},
						create: {
							id: defaultPrice.id,
							amount: getPriceAmount(defaultPrice),
							default: true,
						},
					},
				},
			});
		}
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
