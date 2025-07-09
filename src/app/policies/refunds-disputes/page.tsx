import { Heading } from "@/components/Heading";
import Link from "next/link";

const RefundsDisputesPolicyPage = () => {
	return (
		<section className="flex flex-1 flex-col items-start justify-start gap-4 p-6 max-w-3xl mx-auto">
			<Heading>Refunds & Disputes Policy</Heading>
			<p>Last updated: July 6, 2025</p>
			<div className="flex flex-col gap-4">
				<div>
					<h2 className="text-2xl font-semibold">
						1. Refund Eligibility
					</h2>
					<p>
						Refunds may be issued for subscription services within
						24 hours of purchase.
					</p>
				</div>
				<div>
					<h2 className="text-2xl font-semibold">
						2. Dispute Resolution
					</h2>
					<p>
						If you have a dispute, please contact support at
						support@cleoai.cloud.
					</p>
				</div>
				<div>
					<h2 className="text-2xl font-semibold">3. Chargebacks</h2>
					<p>
						Chargebacks without prior communication may result in
						service suspension.
					</p>
				</div>
			</div>
			<Link href="/policies" className="text-primary underline">
				&larr; Back to Policies
			</Link>
		</section>
	);
};

export default RefundsDisputesPolicyPage;
