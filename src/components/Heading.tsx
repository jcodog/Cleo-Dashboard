import { cn } from "@/lib/utils";

interface HeadingProps {
	className?: string;
	children: React.ReactNode;
}

export const Heading = ({ className, children }: HeadingProps) => {
	return (
		<h1
			className={cn(
				"flex items-center text-pretty tracking-tight text-3xl font-semibold",
				className
			)}
		>
			{children}
		</h1>
	);
};
