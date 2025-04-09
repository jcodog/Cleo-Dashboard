"use client";

import { ClerkProvider as ImportedProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

interface ClerkProviderProps {
	children: React.ReactNode;
}

export const ClerkProvider = ({ children }: ClerkProviderProps) => {
	const { resolvedTheme } = useTheme();

	return (
		<ImportedProvider
			appearance={{
				baseTheme: resolvedTheme === "dark" ? dark : undefined,
			}}
		>
			{children}
		</ImportedProvider>
	);
};
