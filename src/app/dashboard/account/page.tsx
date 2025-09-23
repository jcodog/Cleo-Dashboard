"use client";
import { authClient } from "@/lib/authClient";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AiUsage } from "@/components/AccountTabs/AiUsage";
import { LogOut, RefreshCw, Copy } from "lucide-react";

const btn = (base: string, extra?: string) =>
  `inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${base} ${
    extra || ""
  }`;

export default function DashboardAccountPage() {
  const { useSession } = authClient;
  const { data: session, isPending, error, refetch } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const isLoading = isPending;

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await authClient.signOut();
      window.location.href = "/";
    } finally {
      setSigningOut(false);
    }
  };

  const copy = (label: string, value?: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopyToast(`${label} copied`);
      setTimeout(() => setCopyToast(null), 1500);
    });
  };

  const user = session?.user;
  const initials = useMemo(
    () =>
      user
        ? (user.name || user.email || "?")
            .split(/\s+/)
            .slice(0, 2)
            .map((p) => p[0])
            .join("")
            .toUpperCase()
        : "?",
    [user]
  );

  if (isLoading)
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-col gap-4 w-full max-w-md">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-muted rounded animate-pulse" />
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="h-32 w-full rounded-md bg-muted animate-pulse" />
        </div>
      </div>
    );

  if (error || !session) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-col gap-4 items-center">
          <p className="text-sm text-destructive">
            {error
              ? error.message || "Unable to load session"
              : "Not signed in"}
          </p>
          <Link
            href="/sign-in?redirect=%2Fdashboard%2Faccount"
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-medium hover:bg-accent"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-1 justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
          <p className="text-sm text-muted-foreground">
            Manage your Cleo identity, usage and session.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-lg border bg-card p-5 shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-5">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full border object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full border flex items-center justify-center text-lg font-semibold bg-muted">
                  {initials}
                </div>
              )}
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-medium truncate">
                  {user?.name || user?.email || "Unnamed User"}
                </span>
                {user?.email && (
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                )}
                <div className="flex flex-wrap gap-2 mt-1">
                  <button
                    onClick={() => copy("User ID", user?.id)}
                    className={btn(
                      "border-border/60 bg-background hover:bg-accent/50 text-muted-foreground"
                    )}
                    title="Copy user id"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[120px]">{user?.id}</span>
                  </button>
                  {user?.email && (
                    <button
                      onClick={() => copy("Email", user.email!)}
                      className={btn(
                        "border-border/60 bg-background hover:bg-accent/50 text-muted-foreground"
                      )}
                      title="Copy email"
                    >
                      <Copy className="h-3.5 w-3.5" /> Email
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className={btn(
                  "border-destructive/50 bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-60"
                )}
              >
                <LogOut className="h-4 w-4" />
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
              <button
                onClick={() => refetch()}
                className={btn(
                  "border-border/60 bg-background hover:bg-accent/50 text-muted-foreground"
                )}
              >
                <RefreshCw className="h-4 w-4" /> Refresh Session
              </button>
              {copyToast && (
                <span className="text-xs text-muted-foreground self-center animate-in fade-in">
                  {copyToast}
                </span>
              )}
            </div>

            <div className="rounded-md border bg-muted/30 p-4 text-xs leading-relaxed space-y-2">
              <div className="font-medium text-muted-foreground uppercase tracking-wide text-[10px]">
                Session
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span className="text-muted-foreground">Session ID</span>
                <span className="font-mono text-[11px] break-all">
                  {session.session.id}
                </span>
                <span className="text-muted-foreground">Expires</span>
                <span className="font-mono text-[11px]">
                  {new Date(session.session.expiresAt).toLocaleString()}
                </span>
                <span className="text-muted-foreground">Issued</span>
                <span className="font-mono text-[11px]">
                  {new Date(session.session.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <AiUsage />
          </div>
        </div>
      </div>
    </section>
  );
}
