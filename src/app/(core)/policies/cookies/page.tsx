import { Heading } from "@/components/Heading";
import Link from "next/link";

const CookiesPolicyPage = () => {
	return (
		<section className="flex flex-1 flex-col items-start justify-start gap-4 p-6 max-w-3xl mx-auto">
			<Heading>Cookies Policy</Heading>
			<p>Last updated: July 6, 2025</p>
			<div className="flex flex-col gap-4">
				<div>
					<h2 className="text-2xl font-semibold">
						1. Essential Cookies
					</h2>
					<p>
						We use essential cookies necessary for authentication
						and maintaining your session to ensure the security and
						functionality of the Service.
					</p>
				</div>
				<div>
					<h2 className="text-2xl font-semibold">
						2. Analytics Cookies
					</h2>
					<p>
						We use cookies for site analytics provided by the
						hosting platform to understand usage patterns and
						improve our Service. These cookies do not contain
						personally identifiable information.
					</p>
				</div>
				<div>
					<h2 className="text-2xl font-semibold">
						3. Cookie Management
					</h2>
					<p>
						You may control cookie preferences in your browser
						settings. Disabling essential cookies may impact
						functionality, while disabling analytics cookies will
						only affect usage tracking.
					</p>
				</div>
			</div>
			<Link href="/policies" className="text-primary underline">
				&larr; Back to Policies
			</Link>
		</section>
	);
};

export default CookiesPolicyPage;
