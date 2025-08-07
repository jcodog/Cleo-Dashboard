"use client";

import { AiUsage } from "@/components/AccountTabs/AiUsage";
import { UserProfile } from "@clerk/nextjs";
import { Gauge } from "lucide-react";

const AccountPage = () => {
  return (
    <section className="flex flex-1 flex-col items-center justify-center p-4">
      <UserProfile path="/dashboard/account">
        <UserProfile.Page label="AI Usage" labelIcon={<Gauge className="size-4" />} url="usage">
          <AiUsage />
        </UserProfile.Page>
      </UserProfile>
    </section>
  );
};

export default AccountPage;
