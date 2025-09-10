import { cn } from "@/lib/utils";

interface EmptyContainerProps {
	message: String;
	children?: React.ReactNode;
	className?: string;
}
export default function EmptyContainer({ message, children, className }: EmptyContainerProps) {
	return (
		<div className={cn("flex min-h-[20rem] flex-col items-center justify-center gap-4", className)}>
			<p className="max-w-sm text-center text-muted-foreground">{message}</p>
			{children}
		</div>
	);
}
