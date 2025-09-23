import { loadStripe } from "@/lib/stripe";
import Link from "next/link";

const stripe = loadStripe({ secretKey: process.env.STRIPE_SECRET_KEY ?? "" });

const PurchasePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const sessionId = (await searchParams).session_id as string | undefined;

  // Missing or invalid session id
  if (!sessionId || typeof sessionId !== "string") {
    return (
      <main className="mx-auto max-w-xl px-6 py-14 rounded-xl border border-border/60 bg-card/70 backdrop-blur">
        <h1 className="text-2xl font-semibold">Purchase status</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn’t find your checkout session. If you completed a payment,
          your account will be updated automatically once our servers confirm
          it.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Return to dashboard
          </Link>
        </div>
      </main>
    );
  }

  // Try to retrieve the session from Stripe
  let session:
    | Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>
    | undefined;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    return (
      <main className="mx-auto max-w-xl px-6 py-14 rounded-xl border border-border/60 bg-card/70 backdrop-blur">
        <h1 className="text-2xl font-semibold">Purchase status</h1>
        <p className="mt-3 text-destructive">
          We couldn’t verify your checkout session right now. This may be
          temporary.
        </p>
        <p className="mt-2 text-muted-foreground">
          You can refresh this page in a few seconds or head back to your
          dashboard.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href={`/dashboard/purchase?session_id=${encodeURIComponent(
              sessionId
            )}`}
            className="inline-flex items-center rounded-md border px-4 py-2"
          >
            Refresh
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Go to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const handled = session?.metadata?.["handled"] === "true";
  const paymentStatus = session?.payment_status; // 'paid' | 'unpaid' | 'no_payment_required'
  const status = session?.status; // 'open' | 'complete' | 'expired' | null

  // Success: backend has handled the session
  if (handled) {
    return (
      <main className="mx-auto max-w-xl px-6 py-14 rounded-xl border border-border/60 bg-card/70 backdrop-blur">
        <h1 className="text-2xl font-semibold">All set!</h1>
        <p className="mt-3 text-muted-foreground">
          Your purchase has been applied to your account. Thanks for supporting
          Cleo.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Continue to dashboard
          </Link>
        </div>
      </main>
    );
  }

  // Payment completed but backend not finished yet
  if (paymentStatus === "paid" && status === "complete") {
    return (
      <main className="mx-auto max-w-xl px-6 py-14 rounded-xl border border-border/60 bg-card/70 backdrop-blur">
        <h1 className="text-2xl font-semibold">Processing your purchase…</h1>
        <p className="mt-3 text-muted-foreground">
          We’ve received your payment and are finalizing your upgrade. This
          usually takes a few seconds.
        </p>
        <p className="mt-2 text-muted-foreground">
          You can refresh this page to check again.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href={`/dashboard/purchase?session_id=${encodeURIComponent(
              sessionId
            )}`}
            className="inline-flex items-center rounded-md border px-4 py-2"
          >
            Refresh
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Go to dashboard
          </Link>
        </div>
      </main>
    );
  }

  // Open or unpaid session
  if (status === "open" || paymentStatus !== "paid") {
    return (
      <main className="mx-auto max-w-xl px-6 py-14 rounded-xl border border-border/60 bg-card/70 backdrop-blur">
        <h1 className="text-2xl font-semibold">Checkout not completed</h1>
        <p className="mt-3 text-muted-foreground">
          It looks like your checkout wasn’t completed. If you already paid,
          please refresh in a moment.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href={`/dashboard/purchase?session_id=${encodeURIComponent(
              sessionId
            )}`}
            className="inline-flex items-center rounded-md border px-4 py-2"
          >
            Refresh
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Return to dashboard
          </Link>
        </div>
      </main>
    );
  }

  // Fallback (expired or unknown state)
  return (
    <main className="mx-auto max-w-xl px-6 py-14 rounded-xl border border-border/60 bg-card/70 backdrop-blur">
      <h1 className="text-2xl font-semibold">Purchase status</h1>
      <p className="mt-3 text-muted-foreground">
        We’re waiting for confirmation from our servers. You can refresh this
        page or come back later.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href={`/dashboard/purchase?session_id=${encodeURIComponent(
            sessionId
          )}`}
          className="inline-flex items-center rounded-md border px-4 py-2"
        >
          Refresh
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
};

export default PurchasePage;
