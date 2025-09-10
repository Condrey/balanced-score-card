import { Card } from "@/components/ui/card";
import { Clock10Icon, DownloadIcon } from "lucide-react";
import Image from "next/image";

export default function WebFunctions() {
	return (
		<div className="space-y-4">
			<h1 className="text-xl text-center uppercase tracking-tight">What is offered</h1>
			<Card className="flex flex-col sm:flex-row items-center max-w-4xl  gap-4">
				<Image
					height={300}
					width={400}
					alt="bsc-sample-image"
					className="mask-radial-[100%_100%] mask-radial-from-75% sm:mask-radial-at-left mask-radial-at-top"
					src="/bsc.png"
				/>
				<div className="font-medium ps-4 sm:ps-0">
					<p className="font-mono text-xl  tracking-tighter uppercase text-primary">
						QUICK FILL AND DOWNLOAD AT LEISURE
					</p>
					<p className="mt-2  text-base text-muted-foreground">
						<Clock10Icon className="inline size-4" /> <DownloadIcon className="inline size-4 mr-4" /> Two-minute-delay
						only
					</p>
					<p className="mt-1 max-w-md text-sm leading-relaxed ">
						In 2 minutes get your BSC wholesomely generated. Download at will and edit at your pase.
					</p>
				</div>
			</Card>
		</div>
	);
}
