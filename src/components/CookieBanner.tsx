"use client";

import { startTransition, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Cookie } from "lucide-react";

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("essential-cookies-accepted");
    if (!accepted) {
      startTransition(() => {
        setVisible(true);
      });
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("essential-cookies-accepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-xl rounded-2xl border p-4 shadow-lg transition-all",
        "bg-background text-foreground border-border"
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <Cookie className="size-6" />
          <p className="text-sm">
            This site uses only essential cookies required for security and
            authentication.{" "}
            <Link
              href="/policies/cookies"
              className="underline underline-offset-4 hover:opacity-80"
            >
              Learn more
            </Link>
          </p>
        </div>

        <Button
          onClick={acceptCookies}
          className="mt-2 md:mt-0 w-fit cursor-pointer"
        >
          OK
        </Button>
      </div>
    </div>
  );
};
