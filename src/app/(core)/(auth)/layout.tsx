import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth",
};

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <main className="flex flex-1 flex-col p-2">{children}</main>;
};

export default AuthLayout;
