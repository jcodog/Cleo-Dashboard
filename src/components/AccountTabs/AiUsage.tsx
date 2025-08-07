"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const AiUsage = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["ai-usage"],
    queryFn: async () => {
      const token = await getToken();
      const res = await client.dash.aiUsage.$get(undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.usage) throw new Error("No usage data");
      return json.usage;
    },
  });

  const remaining = data ? Math.max(data.limit - data.used, 0) : 0;
  const ratio = data ? remaining / data.limit : 0;
  const widthPercent = ratio * 100;
  // Map ratio [0,1] to hue [0 (red) to 120 (green)]
  const hue = Math.round(ratio * 120);
  const barColor = `hsla(${hue}, 70%, 50%, 0.6)`;

  // countdown timer until next UTC day reset based on API usageDate
  const [timeToReset, setTimeToReset] = useState<string>("--:--:--");
  useEffect(() => {
    if (!data?.usageDate) return;
    // compute next UTC reset from the usageDate returned by the API
    const usageDate = new Date(data.usageDate);
    const utcYear = usageDate.getUTCFullYear();
    const utcMonth = usageDate.getUTCMonth();
    const utcDay = usageDate.getUTCDate();
    const nextReset = new Date(
      Date.UTC(utcYear, utcMonth, utcDay + 1, 0, 0, 0)
    );
    function updateTimer() {
      const now = new Date();
      const diff = nextReset.getTime() - now.getTime();
      if (diff <= 0) {
        // time to reset: invalidate and refetch usage
        setTimeToReset("00:00:00");
        queryClient.invalidateQueries({
          queryKey: ["ai-usage"],
        });
      } else {
        const hrs = String(Math.floor(diff / 3600000)).padStart(2, "0");
        const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(
          2,
          "0"
        );
        const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
        setTimeToReset(`${hrs}:${mins}:${secs}`);
      }
    }
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [data, queryClient]);

  return (
    <div className="p-4 border border-muted-foreground rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Usage</h3>
        <span className="text-sm text-muted-foreground">
          Resets in {timeToReset} (UTC)
        </span>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading usage...</p>
      ) : error ? (
        <p className="text-destructive">Failed to load usage</p>
      ) : (
        <>
          <div className="flex justify-between text-sm font-medium">
            <span>
              Used: {data?.used}/{data?.limit}
            </span>
            <span>Tier: {data?.tier}</span>
          </div>
          <div className="relative w-full h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute top-0 bottom-0 left-0 transition-all duration-300 ease-out rounded-full"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: barColor,
              }}
            />
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex flex-col">
              <p className="text-sm">
                Additional Messages: {data!.additionalMessages}
              </p>
              <p className="text-xs text-muted-foreground">
                These are messages you can use outside of your plan's daily
                message limit that you purchase.
              </p>
            </div>
            <Button variant="outline">
              <PlusCircle className="size-4" />
              Get more
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
