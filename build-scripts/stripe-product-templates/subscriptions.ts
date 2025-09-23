import type Stripe from "stripe";

const serverPro: Stripe.ProductCreateParams = {
  name: "Cleo Server Premium",
  description: "Upgrade the experience for your server with Server Pro",
  statement_descriptor: "Cleo Server Premium",
  default_price_data: {
    currency: "GBP",
    recurring: {
      interval: "month",
    },
    unit_amount: 999,
  },
  expand: ["default_price", "marketing_features"],
  marketing_features: [
    { name: "Ai welcome messages" },
    { name: "Enhanced server statistics" },
    { name: "Ai server insights" },
    { name: "Server layout templates" },
  ],
  images: [
    "https://cdn.cleoai.cloud/product-images/server-premium/product-icon-one.png",
  ],
};

export const subscriptions = [serverPro];
