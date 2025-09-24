"use client";
import { authClient } from "@/lib/authClient";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AiUsage } from "@/components/AccountTabs/AiUsage";
import { LogOut, RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { client } from "@/lib/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const btn = (base: string, extra?: string) =>
  `inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${base} ${
    extra || ""
  }`;

export default function DashboardAccountPage() {
  const router = useRouter();
  const { useSession } = authClient;
  const { data: session, isPending, error, refetch } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  // removed copy functionality (no longer needed)
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

  // no copy actions retained

  const user = session?.user;
  // profile state (Better Auth user data)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [initial, setInitial] = useState<{
    name: string;
    email: string;
  } | null>(null);
  // discordId now derived from profile

  // Profile query via TanStack to avoid manual effect loops / accidental refetch storms
  const queryClient = useQueryClient();
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await client.dash.getProfile.$get();
      const json = await res.json();
      if (!json.profile) throw new Error("No profile returned");
      return json.profile;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  // Initialize local editable state once profile arrives
  useEffect(() => {
    if (profile && !initial) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setInitial({ name: profile.name || "", email: profile.email || "" });
    }
  }, [profile, initial]);

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

  // Handle profile loading/error (session is valid but profile fetch pending)
  const profileSectionSkeleton = (
    <div className="flex items-center gap-5 animate-in fade-in">
      <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        <div className="h-4 w-40 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );

  return (
    <section className="flex flex-1 justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Go back"
              onClick={() => {
                try {
                  if (
                    typeof document !== "undefined" &&
                    document.referrer &&
                    new URL(document.referrer).origin === window.location.origin
                  ) {
                    router.back();
                    return;
                  }
                } catch {
                  // ignore and fallback
                }
                router.push("/dashboard");
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
            <div className="ml-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your Cleo identity, usage and session.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-lg border bg-card p-5 shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-5">
              {profileLoading && !profile ? (
                profileSectionSkeleton
              ) : profileError ? (
                <div className="text-xs text-destructive">
                  Failed to load profile
                </div>
              ) : (
                <>
                  <Avatar className="h-16 w-16 border border-border/60">
                    {user?.image && (
                      <AvatarImage
                        src={user.image}
                        alt={user?.name || "Avatar"}
                      />
                    )}
                    <AvatarFallback className="text-lg font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex gap-2">
                      <span className="flex font-medium text-xl truncate">
                        {name ||
                          user?.name ||
                          user?.email ||
                          profile?.username ||
                          "—"}
                      </span>
                      <span className="flex items-end font-medium text-xs text-muted-foreground truncate">
                        {profile?.username || "—"}
                      </span>
                    </div>

                    {profile?.email && (
                      <span className="text-xs text-muted-foreground truncate mt-2">
                        {profile.email}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            <Separator />
            <div className="space-y-4">
              <h2 className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
                Profile
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!initial) return;
                  const changed: { name?: string; email?: string } = {};
                  if (name.trim() && name.trim() !== initial.name)
                    changed.name = name.trim();
                  if (email.trim() && email.trim() !== initial.email)
                    changed.email = email.trim();
                  if (!changed.name && !changed.email) {
                    toast.info("No changes to save");
                    return;
                  }
                  setSaving(true);
                  try {
                    const res = await client.dash.updateProfile.$post(changed);
                    const json = await res.json();
                    if (json.success) {
                      toast.success("Profile updated");
                      setInitial({
                        name: json.profile.name,
                        email: json.profile.email,
                      });
                      // Optimistically update cached profile
                      queryClient.setQueryData(["profile"], json.profile);
                      // Refetch session so navigation/user button reflects changes
                      refetch();
                    } else {
                      toast.error(json.error || "Failed to update");
                    }
                  } catch (err: unknown) {
                    const message =
                      typeof err === "object" && err && "message" in err
                        ? String((err as { message?: unknown }).message)
                        : "Update failed";
                    toast.error(message);
                  } finally {
                    setSaving(false);
                  }
                }}
                className="space-y-3"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Display Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    maxLength={80}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Shown in dashboard instead of Discord username.
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    maxLength={120}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Used for receipts & billing notices.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button size="sm" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  {initial &&
                    (name !== initial.name || email !== initial.email) && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setName(initial.name);
                          setEmail(initial.email);
                        }}
                      >
                        Reset
                      </Button>
                    )}
                </div>
              </form>
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
                <span className="text-muted-foreground">Discord ID</span>
                <span className="font-mono text-[11px] break-all">
                  {profile?.discordId || "—"}
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
