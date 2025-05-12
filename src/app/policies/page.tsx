import { Heading } from "@/components/Heading";

const PoliciesPage = () => {
	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-4">
			<div className="p-2 flex gap-2 items-center justify-center">
				<Heading>Policies</Heading>
				<p>
					Our policies are designed to protect your privacy and ensure
					compliance with regulations. As well as outlining our
					commitment to transparency and accountability.
				</p>
			</div>
		</section>
	);
};

export default PoliciesPage;
