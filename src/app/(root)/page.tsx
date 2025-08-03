import { Heading } from "@/components/Heading";
import { HeroButton } from "@/components/HeroButton";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  BarChart2,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-black text-white">
      {/* Ambient background: gradient grid + aurora + noise */}
      <div
        id="background-animations"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* deep radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_50%_-10%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(900px_600px_at_90%_20%,rgba(236,72,153,0.18),transparent_60%),radial-gradient(800px_500px_at_10%_50%,rgba(16,185,129,0.14),transparent_60%)]" />
        {/* subtle grid lines */}
        <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        {/* animated aurora blobs */}
        <div className="absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-fuchsia-500/40 via-purple-400/40 to-indigo-400/40 animate-[spin_60s_linear_infinite]" />
        <div className="absolute -bottom-56 -right-44 h-[44rem] w-[44rem] rounded-full blur-3xl opacity-25 bg-gradient-to-br from-cyan-400/40 via-sky-400/30 to-emerald-400/30 animate-[spin_90s_linear_infinite]" />
        {/* drifting pill highlights */}
        <div className="absolute left-1/2 top-1/3 h-64 w-[42rem] -translate-x-1/2 -rotate-12 rounded-full bg-gradient-to-r from-transparent via-white/8 to-transparent blur-2xl" />
        <div className="absolute left-1/3 top-2/3 h-56 w-[36rem] -translate-x-1/2 rotate-12 rounded-full bg-gradient-to-r from-transparent via-white/6 to-transparent blur-2xl" />
        {/* film grain */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-soft-light [background-image:url('data:image/svg+xml;utf8,\
          <svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 300\'>\
          <filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter>\
          <rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.6\'/></svg>')]"
        />
      </div>

      {/* Hero Section */}
      <div
        id="hero"
        className="relative z-10 flex h-dvh w-full max-w-6xl flex-col items-center justify-center px-6 py-16 text-center md:py-24"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70 backdrop-blur-md">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Live for Discord
        </div>
        <Heading className="!inline-block bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent md:text-8xl lg:text-[9rem]">
          Cleo
        </Heading>
        <p className="mt-3 text-sm text-white/60">
          Cleo is a powerful AI-driven Discord bot.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-white/80 md:text-lg">
          Unleash AI-driven moderation, interactive commands, and real-time
          analytics. Cleo makes server management effortless and fun. 😺
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <SignedOut>
            <div className="flex gap-3">
              <SignUpButton>
                <Button
                  size="lg"
                  className="group relative overflow-hidden rounded-full px-8 py-4 text-white shadow-xl transition-all duration-500 [--shine:linear-gradient(120deg,transparent,rgba(255,255,255,0.6),transparent)] bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                >
                  <span className="absolute inset-0 -translate-x-full bg-[image:var(--shine)] bg-[length:250%_250%] bg-no-repeat group-hover:translate-x-0 transition-transform duration-700" />
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-cyan-400/70 px-8 py-4 text-cyan-300 hover:bg-cyan-500 hover:text-white"
                >
                  Sign In
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <Button
              asChild
              size="lg"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] bg-left px-8 py-4 text-white shadow-2xl transition-[background-position,transform] duration-1000 hover:-translate-y-0.5 hover:bg-right"
            >
              <Link
                href="/dashboard"
                className="relative z-10 inline-flex items-center justify-center gap-2"
              >
                <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                Launch App <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </SignedIn>
        </div>

        <div className="mt-10">
          <HeroButton />
        </div>

        {/* soft divider now placed after hero, above features */}
      </div>

      {/* Soft divider between sections */}
      <div className="relative z-10 w-full px-6">
        <div className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* Features Section */}
      <div
        id="features"
        className="relative z-10 w-full max-w-6xl px-6 pt-16 pb-28 md:pt-24"
      >
        <Heading className="mb-10 justify-center text-center text-4xl font-semibold md:text-5xl">
          Features
        </Heading>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* card 1 */}
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
            <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-tr from-cyan-400/20 via-fuchsia-400/10 to-indigo-400/20" />
            <ShieldCheck className="relative z-10 mb-4 h-12 w-12 text-cyan-300" />
            <h3 className="relative z-10 mb-2 text-xl font-medium text-white">
              Robust Moderation
            </h3>
            <p className="relative z-10 text-white/70">
              Automated tools filter spam, bad language, and keep your server
              safe.
            </p>
          </div>
          {/* card 2 */}
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
            <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-tr from-cyan-400/20 via-fuchsia-400/10 to-indigo-400/20" />
            <MessageCircle className="relative z-10 mb-4 h-12 w-12 text-cyan-300" />
            <h3 className="relative z-10 mb-2 text-xl font-medium text-white">
              Interactive Commands
            </h3>
            <p className="relative z-10 text-white/70">
              Fun commands to boost engagement and entertain your community.
            </p>
          </div>
          {/* card 3 */}
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
            <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-tr from-cyan-400/20 via-fuchsia-400/10 to-indigo-400/20" />
            <BarChart2 className="relative z-10 mb-4 h-12 w-12 text-cyan-300" />
            <h3 className="relative z-10 mb-2 text-xl font-medium text-white">
              Insightful Analytics
            </h3>
            <p className="relative z-10 text-white/70">
              Real-time analytics to track server activity and user engagement.
            </p>
          </div>
        </div>
      </div>

      {/* footer fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
