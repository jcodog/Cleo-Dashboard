import "@/styles/globals.css";
import type { Metadata } from "next";
import { JStackProvider } from "@/components/providers/jstack";
import { ThemeProvider } from "@/components/providers/theme";
import { Toaster } from "@/components/ui/sonner";
import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { CookieBanner } from "@/components/CookieBanner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PreReleaseBanner } from "../../components/PreReleaseBanner";
// Temp: Remove databuddy until can figure out and fix the weird error about package sub dependencies
import { Databuddy } from "@databuddy/sdk/react";

export const metadata: Metadata = {
  title: { default: "Cleo", template: "%s | Cleo" },
  description: "The official Cleo dashboard",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://cleoai.cloud"
  ),
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  appleWebApp: { capable: true, title: "Cleo", statusBarStyle: "default" },
  openGraph: {
    title: "Cleo Dashboard",
    description: "The official Cleo dashboard",
    url: "https://cleoai.cloud",
    siteName: "Cleo",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "https://cleoai.cloud/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Cleo Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleo Dashboard",
    description: "The official Cleo dashboard",
    creator: "@Cleo",
    images: ["https://cleoai.cloud/android-chrome-512x512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-dvh w-full flex flex-col overflow-hidden antialiased">
        <PreReleaseBanner />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <JStackProvider>
            {children}
            <Databuddy
              clientId="kYvU4Eddh8RzHScTlZ3Pj"
              trackPerformance={true}
              trackWebVitals={true}
              trackErrors={true}
              trackOutgoingLinks={true}
              trackScrollDepth={true}
              enableBatching={true}
              trackAttributes={true}
              trackHashChanges={true}
              trackInteractions={true}
            />
            <Toaster
              richColors
              position="top-right"
              visibleToasts={3}
              duration={5000}
              closeButton
              icons={{
                info: <Info />,
                success: <CircleCheck />,
                error: <CircleAlert />,
              }}
            />
            <CookieBanner />
          </JStackProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
