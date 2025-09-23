import { loadStripe } from "@/lib/stripe";
import Link from "next/link";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Hourglass,
  XCircle,
  AlertTriangle,
  ShoppingCart,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const stripe = loadStripe({ secretKey: process.env.STRIPE_SECRET_KEY ?? "" });

// Simple amount formatter
const formatAmount = (amount: number | null | undefined, currency?: string) => {
  if (amount == null || !currency) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
};

// Reusable refresh link
const RefreshButton = ({ sessionId }: { sessionId: string }) => (
  <Button
    asChild
    variant="outline"
    className="group"
    aria-label="Refresh purchase status"
  >
    <Link
      href={`/dashboard/purchase?session_id=${encodeURIComponent(sessionId)}`}
    >
      <RefreshCw className="size-4 transition-transform group-hover:rotate-90" />
      Refresh
    </Link>
  </Button>
);

const PurchasePage = async ({
  searchParams,
}: {
  // Keep compatibility with current usage (Promise) but allow object
  searchParams:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}) => {
  const params = await searchParams; // works if plain object too
  const sessionId = params?.session_id as string | undefined;

  if (!process.env.STRIPE_SECRET_KEY) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-14">
        <EmptyState
          heading="Stripe not configured"
          description="Missing STRIPE_SECRET_KEY – cannot verify your purchase right now."
          variant="danger"
          action={
            <Button asChild>
              <Link href="/dashboard">Return to dashboard</Link>
            </Button>
          }
          icon={<AlertTriangle />}
        />
      </main>
    );
  }

  // Missing or invalid session id
  if (!sessionId) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-14">
        <EmptyState
          heading="No checkout session"
          description="We couldn't find your checkout session. If you finished a payment, your account will update shortly."
          variant="info"
          icon={<ShoppingCart />}
          action={
            <Button asChild>
              <Link href="/dashboard">Return to dashboard</Link>
            </Button>
          }
        />
      </main>
    );
  }

  // Retrieve the session (expand to show details)
  let session: Awaited<
    ReturnType<typeof stripe.checkout.sessions.retrieve>
  > | null = null;
  let error: string | null = null;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        "line_items.data.price.product",
        "subscription",
        "payment_intent.payment_method",
        "invoice",
      ],
    } as any);
  } catch (e) {
    error =
      "We couldn't verify the checkout session just now. Please try again.";
  }

  const handled = session?.metadata?.["handled"] === "true";
  const paymentStatus = session?.payment_status; // paid | unpaid | no_payment_required
  const status = session?.status; // open | complete | expired | null
  const lineItems: any[] = (session as any)?.line_items?.data ?? [];
  const subscription = session?.subscription as any | null;
  const invoice = session?.invoice as any | null;
  const pm = (session as any)?.payment_intent?.payment_method as any | null;

  const isProcessing =
    !handled && paymentStatus === "paid" && status === "complete";
  const isIncomplete = status === "open" || paymentStatus !== "paid";
  const isExpired = status === "expired";

  const primaryAction = (
    <Button asChild>
      <Link href="/dashboard">Go to dashboard</Link>
    </Button>
  );

  const secondaryActions = (
    <div className="flex flex-wrap gap-2">
      <RefreshButton sessionId={sessionId} />
      {invoice?.hosted_invoice_url ? (
        <Button asChild variant="ghost">
          <a
            href={invoice.hosted_invoice_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Invoice <ExternalLink className="size-4" />
          </a>
        </Button>
      ) : null}
      {subscription?.id ? (
        <Button asChild variant="ghost">
          <Link href="/dashboard/account?tab=billing">Manage billing</Link>
        </Button>
      ) : null}
      {isIncomplete && (
        <Button asChild variant="ghost">
          <Link href="/dashboard/add">Start new checkout</Link>
        </Button>
      )}
    </div>
  );

  const renderDetails = () => {
    if (!session) return null;
    return (
      <Panel className="mt-8">
        <PanelHeader
          title="Purchase details"
          description="Summary of the items and payment information."
        />
        <div className="space-y-6">
          {lineItems.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Items</h4>
              <ul className="divide-y divide-border/60 rounded-md border border-border/60 overflow-hidden">
                {lineItems.map((li, i) => {
                  const prod = li.price?.product as any;
                  const recurring = li.price?.recurring;
                  return (
                    <li
                      key={li.id || i}
                      className="flex items-start justify-between gap-4 p-4 bg-card/40 backdrop-blur-sm"
                    >
                      <div className="space-y-1">
                        <p className="font-medium leading-none">
                          {prod?.name || li.description || "Item"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {recurring
                            ? `Subscription • every ${
                                recurring.interval_count || 1
                              } ${recurring.interval}`
                            : "One-time"}
                          {li.quantity && li.quantity > 1
                            ? ` • Qty ${li.quantity}`
                            : ""}
                        </p>
                      </div>
                      <div className="text-sm font-medium tabular-nums">
                        {formatAmount(
                          li.amount_total,
                          li.currency || session?.currency
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="text-sm space-y-1">
              <span className="text-muted-foreground block">Total paid</span>
              <span className="font-medium">
                {formatAmount(
                  session.amount_total,
                  session.currency || undefined
                )}
              </span>
            </div>
            {pm && (
              <div className="text-sm space-y-1">
                <span className="text-muted-foreground block">
                  Payment method
                </span>
                <span className="font-medium capitalize">
                  {pm.card ? <>Card •••• {pm.card.last4}</> : pm.type || "—"}
                </span>
              </div>
            )}
            {subscription?.id && (
              <div className="text-sm space-y-1">
                <span className="text-muted-foreground block">
                  Subscription
                </span>
                <span className="font-medium">{subscription.id}</span>
              </div>
            )}
            {invoice?.number && (
              <div className="text-sm space-y-1">
                <span className="text-muted-foreground block">Invoice #</span>
                <span className="font-medium">{invoice.number}</span>
              </div>
            )}
          </div>
        </div>
      </Panel>
    );
  };

  // Choose state UI
  let hero: React.ReactNode;
  if (error) {
    hero = (
      <EmptyState
        heading="Verification issue"
        description={error}
        variant="danger"
        icon={<XCircle />}
        action={
          <>
            {primaryAction}
            <RefreshButton sessionId={sessionId} />
          </>
        }
      />
    );
  } else if (handled) {
    hero = (
      <EmptyState
        heading="Purchase successful"
        description="Your purchase has been applied to your account. Thank you for supporting Cleo."
        variant="success"
        icon={<CheckCircle2 />}
        action={
          <>
            {primaryAction}
            {secondaryActions}
          </>
        }
      />
    );
  } else if (isProcessing) {
    hero = (
      <EmptyState
        heading="Finalizing your upgrade"
        description="We've received your payment and are finishing setup. This usually takes just a few seconds."
        variant="info"
        icon={<Hourglass />}
        action={<>{secondaryActions}</>}
      />
    );
  } else if (isIncomplete) {
    hero = (
      <EmptyState
        heading={isExpired ? "Checkout expired" : "Checkout not completed"}
        description={
          isExpired
            ? "The checkout session expired before payment was completed. You can start a new one."
            : "It looks like the checkout wasn't completed. If you already paid, refresh in a moment."
        }
        variant={isExpired ? "danger" : "default"}
        icon={isExpired ? <XCircle /> : <AlertTriangle />}
        action={
          <>
            {primaryAction}
            {secondaryActions}
          </>
        }
      />
    );
  } else {
    hero = (
      <EmptyState
        heading="Awaiting confirmation"
        description="We're waiting for the final confirmation from our servers. You can refresh or return later."
        variant="subtle"
        icon={<Hourglass />}
        action={<>{secondaryActions}</>}
      />
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      {hero}
      {renderDetails()}
    </main>
  );
};

export default PurchasePage;
