import { Heading } from "@/components/Heading";
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
		<section className="relative flex flex-col items-center justify-center bg-black text-white min-h-screen">
			{/* Layered Animated Background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 opacity-30"></div>
				<div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-purple-600 to-pink-500 opacity-20 rounded-full filter blur-3xl animate-[spin_45s_linear_infinite]"></div>
				<div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-green-400 to-blue-300 opacity-15 rounded-full filter blur-4xl animate-[spin_60s_linear_infinite] rotate-45"></div>
				<div className="absolute top-1/3 right-[-20%] w-80 h-80 bg-gradient-to-l from-yellow-400 to-red-500 opacity-10 rounded-full filter blur-2xl animate-[spin_80s_linear_infinite] rotate-90"></div>
			</div>

			{/* Hero Section */}
			<div className="relative flex flex-col flex-1 z-10 w-full px-6 py-16 items-center justify-center text-center">
				<Heading className="!inline-block text-7xl md:text-[8rem] lg:text-[10rem] font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 mb-4">
					Cleo
				</Heading>
				<p className="mb-2 text-sm text-gray-400">
					Cleo is a powerful AI-driven Discord bot.
				</p>
				<p className="mb-10 max-w-2xl mx-auto text-base text-gray-200 md:text-lg">
					Unleash AI-driven moderation, interactive commands, and
					real-time analytics. Cleo makes server management effortless
					and fun. 😺
				</p>
				<div className="flex flex-wrap justify-center gap-6">
					<SignedOut>
						<div className="flex gap-4">
							<SignUpButton>
								<Button
									size="lg"
									className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 transition-all duration-500 shadow-lg"
								>
									Get Started
								</Button>
							</SignUpButton>
							<SignInButton>
								<Button
									size="lg"
									variant="outline"
									className="px-8 py-4 border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all duration-500"
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
							className="group relative inline-flex items-center justify-center overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] bg-left hover:bg-right transition-all duration-1000"
						>
							<Link
								href="/dashboard"
								className="relative z-10 inline-flex items-center justify-center gap-2 text-white drop-shadow-md"
							>
								{/* Dark overlay for hover contrast */}
								<span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-500"></span>
								Launch App <ArrowRight className="w-5 h-5" />
							</Link>
						</Button>
					</SignedIn>
				</div>
			</div>

			{/* Features Section */}
			<div className="relative flex flex-col z-10 w-full max-w-6xl px-6 py-20">
				<Heading className="mb-12 text-4xl md:text-5xl font-semibold justify-center text-center">
					Features
				</Heading>
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					<div className="flex flex-col items-center rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-md hover:bg-white/20 transition-all duration-300">
						<ShieldCheck className="mb-4 h-12 w-12 text-cyan-300" />
						<h3 className="mb-2 text-xl font-medium text-white">
							Robust Moderation
						</h3>
						<p className="text-gray-300">
							Automated tools filter spam, bad language, and keep
							your server safe.
						</p>
					</div>
					<div className="flex flex-col items-center rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-md hover:bg-white/20 transition-all duration-300">
						<MessageCircle className="mb-4 h-12 w-12 text-cyan-300" />
						<h3 className="mb-2 text-xl font-medium text-white">
							Interactive Commands
						</h3>
						<p className="text-gray-300">
							Fun commands to boost engagement and entertain your
							community.
						</p>
					</div>
					<div className="flex flex-col items-center rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-md hover:bg-white/20 transition-all duration-300">
						<BarChart2 className="mb-4 h-12 w-12 text-cyan-300" />
						<h3 className="mb-2 text-xl font-medium text-white">
							Insightful Analytics
						</h3>
						<p className="text-gray-300">
							Real-time analytics to track server activity and
							user engagement.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
