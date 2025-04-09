const DashboardLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<>
			{/* navbar */}
			{/* sidebar? */}
			<main className="flex flex-1 flex-col">{children}</main>
		</>
	);
};

export default DashboardLayout;
