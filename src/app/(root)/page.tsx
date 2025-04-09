import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-4">
			<Heading className="text-6xl">Cleo</Heading>
			<p className="tracking-tight text-pretty text-md text-center">
				Welcome to the dashboard you have all been waiting for.
				<br />
				How about we start your journey using Cleo the best way
				possible?
			</p>
			<div className="flex gap-2">
				<SignedOut>
					<SignUpButton>
						<Button>Sign Up</Button>
					</SignUpButton>
					<SignInButton>
						<Button variant="ghost">Sign In</Button>
					</SignInButton>
				</SignedOut>
				<SignedIn>
					<Button asChild>
						<Link href="/dashboard">
							Go to the dashboard{" "}
							<ArrowRight className="size-4" />
						</Link>
					</Button>
				</SignedIn>
			</div>
		</section>
	);
}
