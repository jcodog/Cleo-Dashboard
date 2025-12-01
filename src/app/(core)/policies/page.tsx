import Link from "next/link";
import { Heading } from "@/components/Heading";

const PoliciesPage = () => {
	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-4">
			<div className="p-2 flex flex-col gap-2 items-center justify-center">
				<Heading>Policies</Heading>
				<p>
					Our policies are designed to protect your privacy and ensure
					compliance with regulations. As well as outlining our
					commitment to transparency and accountability.
				</p>
			</div>
			<ul className="flex flex-col gap-2">
				<li>
					<Link
						href="/policies/terms-of-service"
						className="text-primary underline"
					>
						Terms of Service
					</Link>
				</li>
				<li>
					<Link
						href="/policies/privacy"
						className="text-primary underline"
					>
						Privacy Policy
					</Link>
				</li>
				<li>
					<Link
						href="/policies/refunds-disputes"
						className="text-primary underline"
					>
						Refunds & Disputes Policy
					</Link>
				</li>
				<li>
					<Link
						href="/policies/cookies"
						className="text-primary underline"
					>
						Cookies Policy
					</Link>
				</li>
			</ul>
		</section>
	);
};

export default PoliciesPage;
