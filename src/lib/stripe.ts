import Stripe from "stripe";

// Cache Stripe clients by their secret key on the global object
declare global {
  var stripeClients: Record<string, Stripe> | undefined;
}

export const loadStripe = ({ secretKey }: { secretKey: string }) => {
  if (!globalThis.stripeClients) {
    globalThis.stripeClients = {};
  }
  if (!globalThis.stripeClients[secretKey]) {
    globalThis.stripeClients[secretKey] = new Stripe(secretKey, {
      apiVersion: "2025-10-29.clover",
      typescript: true,
    });
  }
  return globalThis.stripeClients[secretKey]!;
};
