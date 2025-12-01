import type { Metadata } from "next";
import { AmbientBackground } from "@/components/AmbientBackground";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};
const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    const target = encodeURIComponent("/dashboard");
    redirect(`/sign-in?redirect=${target}`);
  }

  return (
    <>
      {/* navbar */}
      {/* sidebar? */}
      <main className="relative flex flex-1 min-h-0 flex-col p-4 sm:p-6 overflow-hidden">
        {/* Ambient background component for unified visuals with landing */}
        <AmbientBackground variant="app" />
        {children}
      </main>
    </>
  );
};

export default DashboardLayout;
