"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessagePurchaseDrawer } from "@/components/AccountTabs/ui/MessagePurchaseDrawer";

export const AiUsage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["ai-usage"],
    queryFn: async () => {
      const res = await client.dash.aiUsage.$get();
      const json = await res.json();
      if (!json.usage) throw new Error("No usage data");
      return json.usage;
    },
    // keep data a bit to prevent flicker and avoid refetch on focus for smoother UX
    staleTime: 15_000,
    gcTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const { remaining, ratio, widthPercent, barColor } = useMemo(() => {
    const limit = data?.limit ?? 0;
    const used = data?.used ?? 0;
    const remainingCalc = Math.max(limit - used, 0);
    const ratioCalc = limit > 0 ? remainingCalc / limit : 1; // treat 0 limit as unlimited -> full green
    const width = Math.min(Math.max(ratioCalc * 100, 0), 100);
    const hue = Math.round(ratioCalc * 120);
    const color = `hsla(${hue}, 70%, 50%, 0.65)`;
    return {
      remaining: remainingCalc,
      ratio: ratioCalc,
      widthPercent: width,
      barColor: color,
    };
  }, [data]);

  // countdown timer until next UTC day reset based on API usageDate
  const [timeToReset, setTimeToReset] = useState<string>("--:--:--");
  const invalidatedOnResetRef = useRef(false);
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
        if (!invalidatedOnResetRef.current) {
          invalidatedOnResetRef.current = true;
          queryClient.invalidateQueries({ queryKey: ["ai-usage"] });
          toast.info(
            `Daily AI messages have reset. You have ${
              data?.limit ?? "your"
            } messages today.`
          );
        }
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

  const isNearLimit = useMemo(() => ratio < 0.2, [ratio]);

  return (
    <div className="p-4 border border-border/60 bg-muted/20 rounded-lg space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-none">AI Usage</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Your daily message allowance resets at 00:00 UTC.
          </p>
        </div>
        <span
          className="relative inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase text-muted-foreground/90
          border border-border/70 bg-background/30 backdrop-blur-md
          shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_4px_12px_-3px_rgba(0,0,0,0.4),0_2px_4px_-1px_rgba(0,0,0,0.35)]
          ring-1 ring-inset ring-border/40
          before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none
          before:bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.25),transparent_70%)] before:opacity-60
          after:absolute after:-inset-px after:rounded-[inherit] after:pointer-events-none after:bg-[linear-gradient(140deg,rgba(255,255,255,0.25),rgba(255,255,255,0)_40%)] after:opacity-30"
        >
          <span className="relative z-10">Resets in {timeToReset}</span>
        </span>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-4 w-full bg-muted rounded overflow-hidden">
            <div className="h-full w-1/2 bg-muted-foreground/20 animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
            <div className="h-8 w-28 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-destructive">Failed to load usage.</p>
          <Button size="sm" variant="glass" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium">{data?.used ?? 0}</span>
            <span className="text-muted-foreground">of</span>
            <span className="font-medium">{data?.limit ?? "—"}</span>
            <span className="text-muted-foreground">messages used today</span>
            <span className="ml-auto inline-flex items-center rounded-full bg-background border border-border/60 px-2 py-0.5 text-xs">
              Tier: {data?.tier}
            </span>
          </div>
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div
                  className="relative w-full h-3.5 rounded-full bg-muted overflow-hidden"
                  role="progressbar"
                  aria-valuenow={data?.used ?? 0}
                  aria-valuemin={0}
                  aria-valuemax={data?.limit ?? 100}
                  aria-label="AI usage remaining"
                >
                  {/* background subtle stripes for depth */}
                  <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, var(--muted-foreground), var(--muted-foreground) 2px, transparent 2px, transparent 6px)",
                    }}
                  />
                  {/* remaining bar (animated) */}
                  <div
                    className="absolute top-0 bottom-0 left-0 transition-all duration-500 ease-out rounded-full"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <div className="text-xs">
                  {remaining} remaining • {Math.round(ratio * 100)}%
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex flex-col gap-3 rounded-md border border-border/50 bg-background/40 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Additional
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {data!.additionalMessages}
              </span>
              <span className="text-xs text-muted-foreground">messages</span>
              {isNearLimit && (
                <span className="ml-auto text-[11px] font-medium text-amber-600 dark:text-amber-500">
                  Low balance
                </span>
              )}
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              These are bonus messages you purchased. They are consumed only
              after today’s daily allowance reaches zero and they never expire.
            </p>
            <div className="flex items-center justify-end">
              <MessagePurchaseDrawer />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
