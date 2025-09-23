"use client";
import { authClient } from "@/lib/authClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import DiscordAuthButton from "@/components/auth/DiscordAuthButton";

export default function SignInPage() {
  const { useSession } = authClient;
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
  const [loading, setLoading] = useState(false);

  // Removed debug logs

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
    if (loading) return;
    setLoading(true);
    let safetyTimer: any;
    try {
      safetyTimer = setTimeout(() => {
        setLoading(false);
        toast.error("Taking longer than expected. Please try again.");
      }, 6000);
      await authClient.signIn.social({ provider: "discord" });
      setTimeout(() => {
        if (loading) {
          router.push(redirectParam || "/dashboard");
        }
      }, 4000);
    } catch (e: any) {
      setLoading(false);
      toast.error(e?.message || "Failed to start Discord sign-in");
    } finally {
      clearTimeout(safetyTimer);
    }
  }, [loading, redirectParam, router]);

  return (
    <section className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm flex flex-col gap-5">
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
          <DiscordAuthButton
            onClick={handleDiscord}
            loading={loading}
            disabled={isPending}
          />
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
          By continuing you agree to our Terms and acknowledge our Privacy
          Policy.
        </p>
      </div>
    </section>
  );
}
