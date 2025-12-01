import { Heading } from "@/components/Heading";
import Link from "next/link";

const PrivacyPolicyPage = () => {
	return (
		<section className="flex flex-1 flex-col items-start justify-start gap-4 p-6 max-w-3xl mx-auto">
			<Heading>Privacy Policy</Heading>
			<p>Last updated: July 6, 2025</p>
			<div className="flex flex-col gap-4">
				<div>
					<h2 className="text-2xl font-semibold">
						1. Information Collection
					</h2>
					<p>
						We collect personal information you provide when you
						sign up for or use the Service.
					</p>
				</div>
				<div>
					<h2 className="text-2xl font-semibold">
						2. Use of Information
					</h2>
					<p>
						Information is used to provide, maintain, and improve
						the Service.
					</p>
				</div>
				<div>
					<h2 className="text-2xl font-semibold">3. Data Sharing</h2>
					<p>
						We do not sell your personal data. We may share data
						with third parties only as described in this policy.
					</p>
				</div>
				<div>
					<h2 className="text-2xl font-semibold">4. Security</h2>
					<p>
						We implement reasonable security measures to protect
						your information.
					</p>
				</div>
			</div>
			<Link href="/policies" className="text-primary underline">
				&larr; Back to Policies
			</Link>
		</section>
	);
};

export default PrivacyPolicyPage;
