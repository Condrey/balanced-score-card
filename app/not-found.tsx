import LoadingButton from "@/components/ui/loading-button";
import { MonitorOffIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex justify-center items-center min-h-dvh flex-col">
			<div className="max-w-sm w-full flex flex-col rounded-md border bg-secondary/50 justify-center items-center p-4">
				<MonitorOffIcon className="fill-secondary size-24 text-secondary" />
				<h2 className="text-2xl  font-bold">404 | Resource Not Found</h2>
				<p className="text-muted-foreground">Could not find requested resource</p>
				<LoadingButton loading={false} variant={"link"} asChild>
					<Link href="/" className="underline text-primary">
						Return Home
					</Link>
				</LoadingButton>
			</div>
		</div>
	);
}
