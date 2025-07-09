import { Heading } from "@/components/Heading";
import Link from "next/link";

const TermsOfServicePage = () => {
	return (
		<section className="flex flex-1 flex-col items-start justify-start gap-4 p-6 max-w-3xl mx-auto">
			<Heading>Terms of Service</Heading>
			<p>Last updated: July 6, 2025</p>
			<div className="flex flex-col gap-4">
				<div>
					<h2 className="text-2xl font-semibold">
						1. Acceptance of Terms
					</h2>
					<p>
						By accessing and using the Cleo Dashboard ("Service"),
						you acknowledge and agree to be bound by these Terms of
						Service.
					</p>
				</div>
				<div>
					<h2 className="text-2xl font-semibold">
						2. User Responsibilities
					</h2>
					<p>
						You agree to provide accurate information and comply
						with all applicable laws when using the Service.
					</p>
				</div>
				<div>
					<h2 className="text-2xl font-semibold">
						3. Modifications to Service
					</h2>
					<p>
						Cleo reserves the right to modify or discontinue the
						Service at any time without notice.
					</p>
				</div>
				<div>
					<h2 className="text-2xl font-semibold">4. Governing Law</h2>
					<p>
						These terms shall be governed by the laws of the
						jurisdiction in which Cleo operates.
					</p>
				</div>
			</div>
			<Link href="/policies" className="text-primary underline">
				&larr; Back to Policies
			</Link>
		</section>
	);
};

export default TermsOfServicePage;
