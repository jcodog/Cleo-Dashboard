"use client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client";
import UserButton from "@/components/UserButton";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const KickDashboardPage = () => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["kick-dashboard-status"],
    queryFn: async () => {
      const res = await client.accounts.linkedProviders.$get();
      if (!res.ok) {
        throw new Error("Failed to load Kick account status");
      }
      return res.json() as Promise<{
        providers: { kick: { linked: boolean } };
      }>;
    },
    staleTime: 15_000,
  });

  if (isLoading) {
    return (
      <section className="container mx-auto flex flex-1 items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </section>
    );
  }

  if (isError || !data?.providers.kick.linked) {
    return (
      <section className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="w-full flex justify-end">
          <UserButton namePosition="right" showName />
        </div>
        <Heading className="text-2xl">Kick link required</Heading>
        <p className="max-w-md text-sm text-muted-foreground">
          Link your Kick creator account to access the Kick dashboard. You can
          do this from the main dashboard page.
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="glass-muted"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
          <Button variant="glass" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto flex flex-1 flex-col gap-6 p-6">
      <Header onBack={() => router.push("/dashboard")} />
      <Placeholder />
    </section>
  );
};

const Header = ({ onBack }: { onBack: () => void }) => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="space-y-2">
      <Heading className="text-3xl sm:text-4xl">Kick Dashboard</Heading>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Kick-specific controls are coming soon. Stay tuned while we finish
        building the dashboards for stream automations, moderation, and
        analytics.
      </p>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="glass"
        size="sm"
        onClick={onBack}
        className="inline-flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Main Dashboard</span>
        <span className="sm:hidden">Back</span>
      </Button>
      <UserButton namePosition="right" showName />
    </div>
  </header>
);

const Placeholder = () => (
  <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center text-sm text-muted-foreground">
    We&apos;re currently building Kick management tools. Once ready, you&apos;ll
    be able to configure alerts, chat automations, and advanced analytics for
    your Kick channel right here.
  </div>
);

export default KickDashboardPage;
