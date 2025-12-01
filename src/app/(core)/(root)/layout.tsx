const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  // Remove default padding for full-bleed landing background
  return (
    <main className="flex flex-1 flex-col no-scrollbar min-h-0 overflow-hidden">
      {children}
    </main>
  );
};

export default Layout;
