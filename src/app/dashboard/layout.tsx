import type { Metadata } from "next";
import { AmbientBackground } from "@/components/AmbientBackground";

export const metadata: Metadata = {
  title: "Dashboard",
};
const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      {/* navbar */}
      {/* sidebar? */}
      <main className="relative flex flex-1 flex-col p-4 sm:p-6">
        {/* Ambient background component for unified visuals with landing */}
        <AmbientBackground variant="app" />
        {children}
      </main>
    </>
  );
};

export default DashboardLayout;
