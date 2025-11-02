import { LinkedAccountsSection } from "@/app/dashboard/_components/LinkedAccountsSection";
import { Heading } from "@/components/Heading";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DashboardIndexPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const rawName = session?.user?.name ?? session?.user?.email ?? "there";
  const firstName =
    typeof rawName === "string" ? rawName.split(" ")[0] : "there";

  return (
    <section className="container mx-auto flex flex-1 min-h-0 flex-col items-center gap-8 p-6">
      <header className="w-full max-w-5xl space-y-2 text-left">
        <Heading className="text-3xl sm:text-4xl">
          Welcome back, {firstName}
        </Heading>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Choose the platform you want to manage. Link your Discord or Kick
          account to unlock their dashboards and manage bot settings.
        </p>
      </header>
      <LinkedAccountsSection />
    </section>
  );
};

export default DashboardIndexPage;
