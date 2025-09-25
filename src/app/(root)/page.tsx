import { Heading } from "@/components/Heading";
import { AmbientBackground } from "@/components/AmbientBackground";
import { HeroButton } from "@/components/HeroButton";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  BarChart2,
} from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isAuthed = !!session;
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Ambient background shared with app */}
      <AmbientBackground variant="landing" />

      <ScrollArea className="w-full h-full overflow-x-hidden">
        <div className="flex flex-col items-center justify-center w-full">
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
              {isAuthed ? (
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
              ) : (
                <div className="flex gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="group relative overflow-hidden rounded-full px-8 py-4 text-white shadow-xl transition-all duration-500 [--shine:linear-gradient(120deg,transparent,rgba(255,255,255,0.6),transparent)] bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                  >
                    <Link href="/sign-up">
                      <span className="absolute inset-0 -translate-x-full bg-[image:var(--shine)] bg-[length:250%_250%] bg-no-repeat group-hover:translate-x-0 transition-transform duration-700" />
                      Get Started
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-cyan-400/70 px-8 py-4 text-cyan-300 hover:bg-cyan-500 hover:text-white"
                  >
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </div>
              )}
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
                  Automated tools filter spam, bad language, and keep your
                  server safe.
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
                  Real-time analytics to track server activity and user
                  engagement.
                </p>
              </div>
            </div>
          </div>
          {/* TODO: add something to add spacing at bottom of features section so that the last item is not touching the bottom of the screen on mobiles */}
        </div>
      </ScrollArea>

      {/* footer fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
