"use client";
import DiscordAuthButton from "@/components/auth/DiscordAuthButton";
import KickAuthButton from "@/components/auth/KickAuthButton";
import { AiUsage } from "@/components/AccountTabs/AiUsage";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  PROVIDER_DESCRIPTION,
  PROVIDER_LABEL,
  PROVIDER_PATH,
  useLinkedAccounts,
} from "@/hooks/useLinkedAccounts";
import type { LinkedProvider } from "@/hooks/useLinkedAccounts";
import { client } from "@/lib/client";
import { authClient } from "@/lib/authClient";
import {
  ArrowLeft,
  CheckCircle2,
  CircleOff,
  ExternalLink,
  Loader2,
  LogOut,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Buttons now use shadcn <Button>; styles preserved via className overrides per button

export default function DashboardAccountPage() {
  const router = useRouter();
  const { useSession } = authClient;
  const { data: session, isPending, error, refetch } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  const {
    query: linkedAccountsQuery,
    handleLink: beginLink,
    linkingProvider,
    handleUnlink,
    unlinkingProvider,
    linkedCount,
  } = useLinkedAccounts();

  const linkedProvidersData = linkedAccountsQuery.data;
  const providerOrder: LinkedProvider[] = ["discord", "kick"];

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
    <section className="flex flex-1 flex-col min-h-0">
      <div className="mx-auto w-full max-w-7xl px-1 pt-1 sm:px-2 lg:px-0">
        <header className="flex flex-col gap-2 pb-6">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="glass"
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
                variant="glass"
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
      </div>

      <div className="flex flex-1 min-h-0 justify-center">
        <div className="w-full max-w-7xl flex-1 min-h-0 px-1 pb-16 sm:px-2 lg:px-0">
          <div className="grid h-full min-h-0 grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            <div className="md:col-span-2 min-h-0">
              <ScrollArea className="h-full min-h-0 overflow-x-hidden md:pr-4">
                <div className="space-y-6">
                  <div className="rounded-lg border bg-card p-5 shadow-sm flex flex-col gap-5">
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
                            const res = await client.dash.updateProfile.$post(
                              changed
                            );
                            const json = await res.json();
                            if (json.success) {
                              toast.success("Profile updated");
                              setInitial({
                                name: json.profile.name,
                                email: json.profile.email,
                              });
                              // Optimistically update cached profile
                              queryClient.setQueryData(
                                ["profile"],
                                json.profile
                              );
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
                          <Button
                            size="sm"
                            variant="glass"
                            type="submit"
                            disabled={saving}
                          >
                            {saving ? "Saving..." : "Save Changes"}
                          </Button>
                          {initial &&
                            (name !== initial.name ||
                              email !== initial.email) && (
                              <Button
                                type="button"
                                size="sm"
                                variant="glass"
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
                      <Button
                        type="button"
                        onClick={handleSignOut}
                        disabled={signingOut}
                        variant="glass-destructive"
                        size="sm"
                        className="text-xs"
                      >
                        <LogOut className="h-4 w-4" />
                        {signingOut ? "Signing out..." : "Sign out"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => refetch()}
                        variant="glass"
                        size="sm"
                        className="text-xs"
                      >
                        <RefreshCw className="h-4 w-4" /> Refresh Session
                      </Button>
                      <Button
                        type="button"
                        onClick={async () => {
                          if (deleting) return;
                          const confirmed = window.confirm(
                            "This will permanently delete your account. This cannot be undone. Continue?"
                          );
                          if (!confirmed) return;
                          setDeleting(true);
                          try {
                            const res = await client.dash.deleteAccount.$post();
                            const json = await res.json();
                            if (json.success) {
                              toast.success("Your account has been deleted");
                              try {
                                await authClient.signOut();
                              } catch {}
                              window.location.href = "/";
                            } else {
                              toast.error(
                                json.error || "Failed to delete account"
                              );
                            }
                          } catch (e: unknown) {
                            const message =
                              typeof e === "object" && e && "message" in e
                                ? String((e as { message?: unknown }).message)
                                : "Failed to delete account";
                            toast.error(message);
                          } finally {
                            setDeleting(false);
                          }
                        }}
                        disabled={deleting}
                        variant="glass-destructive"
                        size="sm"
                        className="text-xs"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deleting ? "Deleting..." : "Delete account"}
                      </Button>
                    </div>

                    <div className="rounded-md border bg-muted/30 p-4 text-xs leading-relaxed space-y-2">
                      <div className="font-medium text-muted-foreground uppercase tracking-wide text-[10px]">
                        Session
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <span className="text-muted-foreground">
                          Session ID
                        </span>
                        <span className="font-mono text-[11px] break-all">
                          {session.session.id}
                        </span>
                        <span className="text-muted-foreground">
                          Discord ID
                        </span>
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

                  <section className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
                        Linked Accounts
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Control which providers are connected to your Cleo
                        account.
                      </p>
                    </div>
                    {linkedAccountsQuery.isLoading ? (
                      <div className="space-y-3">
                        {Array.from({ length: 2 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-28 rounded-xl border border-border/50 bg-card/60 backdrop-blur animate-pulse"
                          />
                        ))}
                      </div>
                    ) : linkedAccountsQuery.isError ? (
                      <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
                        We couldn&apos;t load your linked accounts. Please
                        refresh and try again.
                      </div>
                    ) : linkedProvidersData ? (
                      <div className="space-y-4">
                        {providerOrder.map((provider) => {
                          const status =
                            linkedProvidersData.providers[provider];
                          const label = PROVIDER_LABEL[provider];
                          const description = PROVIDER_DESCRIPTION[provider];
                          const isLinked = status.linked;
                          const isLinking = linkingProvider === provider;
                          const isUnlinking = unlinkingProvider === provider;
                          const accountId = status.accountId;
                          const accountUsername = status.username;
                          const displayName = status.displayName;
                          const normalizedUsername =
                            accountUsername?.toLowerCase() ?? null;
                          const normalizedDisplay =
                            displayName?.toLowerCase() ?? null;
                          const normalizedAccountId =
                            accountId?.toLowerCase() ?? null;
                          const shouldShowUsername = Boolean(
                            accountUsername &&
                              normalizedDisplay !== normalizedUsername
                          );
                          const shouldShowAccountId = Boolean(
                            accountId &&
                              (!normalizedUsername ||
                                normalizedAccountId !== normalizedUsername)
                          );
                          const displayLabel =
                            displayName ?? accountUsername ?? accountId ?? "—";
                          const unlinkDisabled =
                            linkedCount <= 1 ||
                            isUnlinking ||
                            linkedAccountsQuery.isFetching;

                          return (
                            <div
                              key={provider}
                              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/70 p-4 backdrop-blur"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="min-w-0 space-y-1">
                                  <p className="text-sm font-semibold leading-tight">
                                    {label}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {description}
                                  </p>
                                </div>
                                <Badge
                                  variant={isLinked ? "glass" : "glass-muted"}
                                  className="gap-1"
                                >
                                  {isUnlinking ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : linkedAccountsQuery.isFetching &&
                                    (linkingProvider === provider ||
                                      unlinkingProvider === provider) ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : isLinked ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <CircleOff className="h-3 w-3" />
                                  )}
                                  {isLinked ? "Linked" : "Not linked"}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                {isLinked ? (
                                  <>
                                    <p>
                                      Connected as{" "}
                                      <span className="font-medium text-foreground">
                                        {displayLabel}
                                      </span>
                                    </p>
                                    {shouldShowUsername ? (
                                      <p className="font-mono text-muted-foreground/90">
                                        @{accountUsername}
                                      </p>
                                    ) : null}
                                    {shouldShowAccountId ? (
                                      <p className="font-mono text-muted-foreground/70">
                                        ID: {accountId}
                                      </p>
                                    ) : null}
                                  </>
                                ) : (
                                  <p>
                                    Link your account to unlock this dashboard.
                                  </p>
                                )}
                              </div>
                              <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                                {isLinked ? (
                                  <>
                                    <Button
                                      asChild
                                      variant="glass"
                                      className="w-full sm:w-auto"
                                    >
                                      <Link
                                        href={PROVIDER_PATH[provider]}
                                        className="inline-flex items-center gap-2"
                                      >
                                        Manage
                                        <ExternalLink className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                    <Button
                                      variant="glass-muted"
                                      className="w-full sm:w-auto"
                                      onClick={() => beginLink(provider)}
                                      disabled={isLinking}
                                    >
                                      {isLinking ? "Relinking..." : "Relink"}
                                    </Button>
                                    <Button
                                      variant="glass-destructive"
                                      className="w-full sm:w-auto"
                                      onClick={() => handleUnlink(provider)}
                                      disabled={unlinkDisabled}
                                      title={
                                        linkedCount <= 1
                                          ? "Link another account before unlinking."
                                          : undefined
                                      }
                                    >
                                      {isUnlinking ? "Removing..." : "Unlink"}
                                    </Button>
                                  </>
                                ) : (
                                  <div className="w-full">
                                    {provider === "discord" ? (
                                      <DiscordAuthButton
                                        onClick={() => beginLink("discord")}
                                        loading={linkingProvider === "discord"}
                                        disabled={
                                          linkedAccountsQuery.isFetching
                                        }
                                        className="w-full"
                                        size="default"
                                        variant="glass"
                                      >
                                        {linkingProvider === "discord"
                                          ? "Linking..."
                                          : "Link Discord"}
                                      </DiscordAuthButton>
                                    ) : (
                                      <KickAuthButton
                                        onClick={() => beginLink("kick")}
                                        loading={linkingProvider === "kick"}
                                        disabled={
                                          linkedAccountsQuery.isFetching
                                        }
                                        className="w-full"
                                      >
                                        {linkingProvider === "kick"
                                          ? "Linking..."
                                          : "Link Kick"}
                                      </KickAuthButton>
                                    )}
                                  </div>
                                )}
                              </div>
                              {linkedCount <= 1 && isLinked ? (
                                <p className="text-[11px] text-amber-300/80">
                                  Link another account before unlinking this
                                  one.
                                </p>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </section>
                  <div className="space-y-4 md:hidden">
                    <AiUsage />
                  </div>
                </div>
              </ScrollArea>
            </div>

            <div className="hidden md:col-span-1 md:flex md:flex-col md:space-y-4">
              <AiUsage />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
