"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { client } from "@/lib/client";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Info, Lock, PlusCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const MessagePurchaseDrawer = () => {
  const router = useRouter();
  // Access Clerk token helper at the top level (Rules of Hooks compliant)
  const { getToken } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["get-message-bundles"],
    queryFn: async () => {
      const res = await client.payment.additionalMessageBundles.$get(
        undefined,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      const { product, message } = await res.json();
      if (!product) {
        console.error(message);
      } else {
        console.log(message);
      }

      return product;
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["purchase-topup"],
    mutationFn: async (priceId: string) => {
      const res = await client.payment.checkout.$post(
        {
          price: priceId,
          type: "payment",
          domain: process.env.NEXT_PUBLIC_APP_URL!,
          path: "dashboard/account/usage",
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      const { url, message } = await res.json();
      if (!url) {
        return toast.error(message);
      }

      return router.push(url);
    },
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount / 100);

  // Heuristic: infer message quantity for a given price.
  // NOTE: Ideally, the API should return a concrete quantity per price.
  // For now, map the common seeded tiers by sorted index as a sensible default.
  const inferMessages = (idx: number, amount: number): number | null => {
    // If three tiers exist (seeded: ~£5, £10, £15), map to 100/250/500 messages
    if (idx === 0 && amount <= 600) return 100;
    if (idx === 1 && amount <= 1100) return 250;
    if (idx === 2 && amount <= 1600) return 500;
    if (idx === 3 && amount <= 3100) return 1000;
    // Fallback: approximate 20 messages per £1
    const approx = Math.round((amount / 100) * 20);
    return approx > 0 ? approx : null;
  };

  const PriceCard = ({
    priceId,
    amount,
    messages,
    featured,
    onClick,
  }: {
    priceId: string;
    amount: number; // pence
    messages: number | null;
    featured?: boolean;
    onClick?: (priceId: string) => void;
  }) => (
    <button
      type="button"
      onClick={() =>
        onClick ? onClick(priceId) : console.log("select price", priceId)
      }
      className={cn(
        "relative w-full text-left rounded-lg border p-4 transition focus:outline-none focus:ring-2 focus:ring-primary",
        featured
          ? "border-primary/50 bg-primary/5 hover:bg-primary/10 ring-1 ring-primary/30"
          : "border-border hover:bg-muted/40"
      )}
    >
      {featured && (
        <span className="pointer-events-none absolute -top-2 -left-2 rounded-full border border-primary/30 bg-background px-2 py-0.5 text-[10px] font-medium text-primary shadow-sm">
          Recommended
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium">
            {messages
              ? `${messages.toLocaleString()} messages`
              : "Message bundle"}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            One-time top up.
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-semibold">
            {formatCurrency(amount)}
          </div>
        </div>
      </div>
    </button>
  );

  const featured: "default" | number = "default";

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="size-4" /> Get More
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex items-center justify-center">
        <div className="flex flex-col px-4 py-8 gap-2 items-center max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>Purchase additional message bundles</DrawerTitle>
            <DrawerDescription>
              Purchase a bundle of additional messages to use when your daily
              limits run out, instead of upgrading your plan.
            </DrawerDescription>
          </DrawerHeader>

          {/* Additional message bundles displayed here */}
          {/* Clicking on one will call onSelect(priceId) when provided */}
          <div className="w-full max-w-xl">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-20 rounded-lg bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : !data || !data.prices || data.prices.length === 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-pretty text-sm">
                  Currently there are no additional message bundles for
                  purchase. We aim to introduce some very soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[...data.prices]
                  .sort((a, b) => a.amount - b.amount)
                  .map((price, idx, arr) => (
                    <PriceCard
                      key={price.id}
                      priceId={price.id}
                      amount={price.amount}
                      messages={inferMessages(idx, price.amount)}
                      featured={
                        featured === "default"
                          ? price.default
                          : idx === featured
                      }
                    />
                  ))}
              </div>
            )}
          </div>

          <DrawerFooter className="mt-6">
            <div className="w-full max-w-xl text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-500" />
                <p>
                  Payments are processed by{" "}
                  <a
                    href="https://stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    Stripe
                  </a>
                  , a PCI‑DSS compliant provider.
                </p>
              </div>
              <div className="mt-1 flex items-start gap-2">
                <Lock className="mt-0.5 h-4 w-4 text-blue-500" />
                <p>
                  We never store your card details—Stripe handles them
                  end‑to‑end.
                </p>
              </div>
              <div className="flex mt-1 items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 text-yellow-500" />
                <p>Bundles are one‑time purchases and don’t expire.</p>
              </div>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
