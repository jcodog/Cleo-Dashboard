import type { Metadata } from "next";
import { JStackProvider } from "@/components/providers/jstack";

import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme";
import { Toaster } from "@/components/ui/sonner";
import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { ClerkProvider } from "@/components/providers/clerk";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata: Metadata = {
	title: "Cleo",
	description: "The official Cleo dashboard",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="overflow-hidden" suppressHydrationWarning>
			<body className="min-w-full min-h-screen flex flex-col h-full w-full p-2 antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ClerkProvider>
						<JStackProvider>
							{children}
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
			</body>
		</html>
	);
}
