"use client";
import { authClient } from "@/lib/authClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";
import DiscordAuthButton from "@/components/auth/DiscordAuthButton";
import KickAuthButton from "@/components/auth/KickAuthButton";

function SignInInner() {
  // const { useSession, getLastUsedLoginMethod } = authClient;
  const { useSession, getLastUsedLoginMethod } = authClient;
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  const redirectParam = (() => {
    if (!rawRedirect) return null;
    // Disallow internal auth endpoints and auth pages to prevent loops
    if (
      rawRedirect.startsWith("/api/auth") ||
      rawRedirect.startsWith("/sign-in") ||
      rawRedirect.startsWith("/sign-up")
    ) {
      return null;
    }
    // Only allow absolute-path redirects
    if (rawRedirect.startsWith("/")) return rawRedirect;
    return null;
  })();
  const [activeProvider, setActiveProvider] = useState<
    "discord" | "kick" | null
  >(null);

  const lastUsed = getLastUsedLoginMethod();

  // If already authenticated, redirect immediately (respect redirect param)
  useEffect(() => {
    if (session) {
      const target = redirectParam || "/dashboard";
      if (window.location.pathname + window.location.search !== target) {
        router.replace(target);
      }
    }
  }, [session, redirectParam, router]);

  const handleDiscord = useCallback(async () => {
    if (activeProvider) return;
    setActiveProvider("discord");
    let safetyTimer: ReturnType<typeof setTimeout> | undefined;
    try {
      safetyTimer = setTimeout(() => {
        setActiveProvider(null);
        toast.error("Taking longer than expected. Please try again.");
      }, 6000);
      await authClient.signIn.social({ provider: "discord" });
    } catch (e: unknown) {
      setActiveProvider(null);
      const message =
        typeof e === "object" && e && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Failed to start Discord sign-in";
      toast.error(message || "Failed to start Discord sign-in");
    } finally {
      if (safetyTimer) clearTimeout(safetyTimer);
    }
  }, [activeProvider, redirectParam, router]);

  const handleKick = useCallback(async () => {
    if (activeProvider) return;
    setActiveProvider("kick");
    let safetyTimer: ReturnType<typeof setTimeout> | undefined;
    try {
      safetyTimer = setTimeout(() => {
        setActiveProvider(null);
        toast.error("Taking longer than expected. Please try again.");
      }, 6000);
      await authClient.signIn.social({ provider: "kick" });
    } catch (e: unknown) {
      setActiveProvider(null);
      const message =
        typeof e === "object" && e && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Failed to start Kick sign-in";
      toast.error(message || "Failed to start Kick sign-in");
    } finally {
      if (safetyTimer) clearTimeout(safetyTimer);
    }
  }, [activeProvider, redirectParam, router]);

  return (
    <section className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-white/15 bg-white/10 p-6 shadow-lg backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 flex flex-col gap-5 relative overflow-hidden">
        <div className="pointer-events-none absolute -inset-px rounded-[inherit] mask-[radial-gradient(70%_50%_at_10%_0%,black,transparent)]">
          <div className="absolute inset-px rounded-[inherit] bg-linear-to-br from-white/20 via-white/5 to-transparent" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-center">Sign in</h1>
          <p className="text-xs text-muted-foreground text-center">
            Access your Cleo dashboard and manage your servers.
          </p>
        </div>
        {session ? (
          <p className="text-xs text-muted-foreground text-center">
            Redirecting...
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <DiscordAuthButton
                onClick={handleDiscord}
                loading={activeProvider === "discord"}
                disabled={isPending || activeProvider === "kick"}
                lastUsed={lastUsed ?? undefined}
              />
              <KickAuthButton
                onClick={handleKick}
                loading={activeProvider === "kick"}
                disabled={isPending || activeProvider === "discord"}
              />
            </div>
          </>
        )}
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <span>Need an account?</span>
          <Link
            className="text-primary hover:underline"
            href={
              redirectParam
                ? `/sign-up?redirect=${encodeURIComponent(redirectParam)}`
                : "/sign-up"
            }
          >
            Create one
          </Link>
        </div>
        <p className="text-[10px] leading-relaxed text-muted-foreground text-center">
          By continuing you agree to our{" "}
          <Link
            className="text-primary hover:underline"
            href="/policies/terms-of-service"
          >
            Terms of Service
          </Link>{" "}
          and our{" "}
          <Link
            className="text-primary hover:underline"
            href="/policies/privacy"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export default function SignInPage() {
  // Wrap inner component that uses useSearchParams in Suspense per Next.js 15 requirement
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-8 text-xs text-muted-foreground">
          Loading...
        </div>
      }
    >
      <SignInInner />
    </Suspense>
  );
}
