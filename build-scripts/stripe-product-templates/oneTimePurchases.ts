import type Stripe from "stripe";

const tippingProduct: Stripe.ProductCreateParams = {
	name: "Cleo Tip",
	description:
		"Give a tip to the team behind Cleo continually updating her and providing her live free services.",
	statement_descriptor: "Cleo Tip",
	default_price_data: {
		currency: "GBP",
		custom_unit_amount: {
			enabled: true,
			minimum: 100,
			maximum: 2000,
			preset: 500,
		},
	},
	expand: ["default_price"],
};

export const oneTimePurchaseProducts = [tippingProduct];
