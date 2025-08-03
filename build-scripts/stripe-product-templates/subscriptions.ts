import type Stripe from "stripe";

const serverPro: Stripe.ProductCreateParams = {
	name: "Cleo Server Pro",
	description: "Upgrade the experience for your server with Server Pro",
	statement_descriptor: "Cleo Server Pro",
	default_price_data: {
		currency: "GBP",
		recurring: {
			interval: "month",
		},
		unit_amount: 499,
	},
	expand: ["default_price", "marketing_features"],
	marketing_features: [
		{ name: "Ai welcome messages" },
		{ name: "Enhanced server statistics" },
		{ name: "Ai server insights" },
		{ name: "Server layout templates" },
	],
};

export const subscriptions = [serverPro];
