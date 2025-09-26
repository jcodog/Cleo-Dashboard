import { cn } from "@/lib/utils";

interface AmbientBackgroundProps {
  variant?: "landing" | "app";
  className?: string;
  position?: "fixed" | "absolute";
}

// Reusable ambient background used across landing and app dashboards
// Layered gradients, animated aurora blobs, drifting highlights, and soft grain
export function AmbientBackground({
  variant = "app",
  className,
  position,
}: AmbientBackgroundProps) {
  // Intensity presets
  const isLanding = variant === "landing";
  const containerPosition = position || (isLanding ? "fixed" : "absolute");

  return (
    <div
      className={cn(
        "pointer-events-none inset-0 overflow-hidden z-0",
        containerPosition === "fixed" ? "fixed" : "absolute",
        className
      )}
    >
      {/* Deep radial vignettes / color washes */}
      <div
        className={cn(
          "absolute inset-0",
          isLanding
            ? "bg-[radial-gradient(1400px_900px_at_50%_-10%,rgba(99,102,241,0.30),transparent_62%),radial-gradient(1100px_700px_at_90%_20%,rgba(236,72,153,0.24),transparent_62%),radial-gradient(900px_560px_at_10%_55%,rgba(16,185,129,0.20),transparent_62%)]"
            : "bg-[radial-gradient(1800px_1000px_at_60%_-20%,rgba(99,102,241,0.16),transparent_62%),radial-gradient(1400px_840px_at_110%_20%,rgba(56,189,248,0.14),transparent_72%),radial-gradient(1400px_840px_at_-10%_100%,rgba(244,114,182,0.12),transparent_72%)] dark:bg-[radial-gradient(1800px_1000px_at_60%_-20%,rgba(24,24,27,0.85),transparent_60%),radial-gradient(1400px_840px_at_110%_20%,rgba(125,211,252,0.16),transparent_70%),radial-gradient(1400px_840px_at_-10%_100%,rgba(165,180,252,0.14),transparent_70%)]"
        )}
      />

      {/* Subtle grid lines with radial mask */}
      <div className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Animated aurora blobs (spin + gentle float) */}
      <div
        className={cn(
          "absolute rounded-full blur-3xl opacity-25 will-change-[transform]",
          isLanding
            ? "-top-40 -left-32 h-[38rem] w-[38rem] bg-gradient-to-tr from-fuchsia-500/40 via-purple-400/40 to-indigo-400/40"
            : "-top-60 -right-40 h-[42rem] w-[42rem] bg-gradient-to-tr from-fuchsia-500/30 via-purple-400/30 to-indigo-400/30"
        )}
        style={{
          animation:
            "slowspin 100s linear infinite, floaty 22s ease-in-out infinite",
        }}
      />
      <div
        className={cn(
          "absolute rounded-full blur-3xl opacity-25 will-change-[transform]",
          isLanding
            ? "-bottom-56 -right-44 h-[44rem] w-[44rem] bg-gradient-to-br from-cyan-400/40 via-sky-400/30 to-emerald-400/30"
            : "-bottom-40 -left-44 h-[46rem] w-[46rem] bg-gradient-to-br from-cyan-400/30 via-sky-400/25 to-emerald-400/25"
        )}
        style={{
          animation:
            "slowspin 140s linear infinite reverse, floaty 28s ease-in-out infinite",
        }}
      />

      {/* Drifting pill highlights */}
      <div className="absolute left-1/2 top-1/3 h-64 w-[42rem] -translate-x-1/2 -rotate-12 rounded-full bg-gradient-to-r from-transparent via-white/8 to-transparent blur-2xl" />
      <div className="absolute left-1/3 top-2/3 h-56 w-[36rem] -translate-x-1/2 rotate-12 rounded-full bg-gradient-to-r from-transparent via-white/6 to-transparent blur-2xl" />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.07] mix-blend-soft-light [background-image:url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 300\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.6\'/></svg>')]" />
    </div>
  );
}
