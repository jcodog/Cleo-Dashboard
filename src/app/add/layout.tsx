const AddLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<>
			{/* navbar */}
			{/* sidebar? */}
			<main className="flex flex-1 flex-col items-center justify-center p-2">
				{children}
			</main>
		</>
	);
};

export default AddLayout;
