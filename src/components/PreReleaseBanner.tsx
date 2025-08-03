import { Rocket, Terminal } from "lucide-react";

export const PreReleaseBanner = () => {
	const message =
		process.env.NODE_ENV === "development"
			? "Development Mode"
			: "Pre-Release Build";
	const Icon =
		process.env.NODE_ENV === "development" ? (
			<Terminal className="h-4 w-4 opacity-75" />
		) : (
			<Rocket className="h-4 w-4 opacity-75" />
		);
	return (
		<div className="fixed top-0 left-0 z-50 overflow-visible pointer-events-none">
			<div className="relative flex items-center space-x-1 h-7 pl-2 pr-4 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 bg-opacity-60 backdrop-blur-md border border-white/30 rounded-br-full text-white text-xs font-mono font-bold shadow-lg">
				{Icon}
				<span>{message}</span>
			</div>
		</div>
	);
};
