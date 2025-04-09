const Layout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return <main className="flex flex-1 flex-col">{children}</main>;
};

export default Layout;
