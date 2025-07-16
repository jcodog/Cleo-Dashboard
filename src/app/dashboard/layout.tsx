import type { Metadata } from "next";

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
			<main className="flex flex-1 flex-col p-2">{children}</main>
		</>
	);
};

export default DashboardLayout;
