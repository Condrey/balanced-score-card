import { Loader2Icon } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex flex-col h-full min-h-dvh w-full items-center justify-center">
			<p className="text-muted-foreground">Loading...</p>
			<Loader2Icon className="animate-spin" />
		</div>
	);
}
