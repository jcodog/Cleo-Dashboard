"use client";

import { Button } from "@/components/ui/button";

export const HeroButton = () => {
	return (
		<Button
			size="lg"
			variant="outline"
			className="mt-24 px-8 py-4 border-pink-400 text-pink-400 hover:bg-pink-500 hover:text-white transition-all duration-500"
			onClick={() => {
				const features = document.getElementById("features");
				if (features) {
					features.scrollIntoView({ behavior: "smooth" });
				}
			}}
		>
			Learn More
		</Button>
	);
};
