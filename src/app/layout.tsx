import "@/styles/globals.css";
import type { Metadata } from "next";
import { JStackProvider } from "@/components/providers/jstack";
import { ThemeProvider } from "@/components/providers/theme";
import { Toaster } from "@/components/ui/sonner";
import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { ClerkProvider } from "@/components/providers/clerk";
import { CookieBanner } from "@/components/CookieBanner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PreReleaseBanner } from "../components/PreReleaseBanner";
import { AvatarSyncProvider } from "@/components/providers/avatar-sync";
import { Databuddy } from "@databuddy/sdk";

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
      <body className="min-w-full min-h-screen flex flex-col h-full w-full antialiased">
        <PreReleaseBanner />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <JStackProvider>
              {children}
              <Databuddy
                clientId="kYvU4Eddh8RzHScTlZ3Pj"
                trackHashChanges={true}
                trackAttributes={true}
                trackOutgoingLinks={true}
                trackInteractions={true}
                trackEngagement={true}
                trackScrollDepth={true}
                trackExitIntent={true}
                trackBounceRate={true}
                trackWebVitals={true}
                trackErrors={true}
                enableBatching={true}
              />
              <AvatarSyncProvider />
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
          </ClerkProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
