import type Stripe from "stripe";

const additionalMessagesProduct: Stripe.ProductCreateParams = {
  name: "Cleo AI Additional Messages",
  description:
    "One time purchase of a bundle of messages to use when you run out of your daily limit messages on your plan. These additional messages let you keep chatting, without having to upgrade your plan.",
  statement_descriptor: "Cleo AI Messages",
  expand: ["default_price"],
  images: [
    "https://cdn.cleoai.cloud/product-images/message-topup/product-icon-one.png",
  ],
};

export const oneTimePurchaseProducts = [additionalMessagesProduct];
