"use client";

import { AiUsage } from "@/components/AccountTabs/AiUsage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { UserProfile, SignOutButton } from "@clerk/nextjs";
import { Gauge, Home, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const AccountPage = () => {
  const router = useRouter();

  return (
    <section className="flex flex-1 flex-col items-center p-4">
      {/* Top navigation bar */}
      <nav className="w-full flex justify-between items-center mb-4 border-b pb-2 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer"
        >
          <Home className="size-6" />
          Home
        </Button>
        <div className="flex gap-2">
          <SignOutButton>
            <Button
              variant="ghost"
              className="text-rose-500 hover:text-rose-300 cursor-pointer"
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </SignOutButton>
          <ThemeToggle />
        </div>
      </nav>
      <div className="flex flex-1 items-center justify-center">
        <UserProfile path="/dashboard/account">
          <UserProfile.Page label="account" />
          <UserProfile.Page
            label="AI Usage"
            labelIcon={<Gauge className="size-4" />}
            url="usage"
          >
            <AiUsage />
          </UserProfile.Page>
          <UserProfile.Page label="security" />
        </UserProfile>
      </div>
    </section>
  );
};

export default AccountPage;
