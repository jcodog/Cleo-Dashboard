const Layout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return <main className="flex flex-1 flex-col p-2">{children}</main>;
};

export default Layout;
