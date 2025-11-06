import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";

export default function WebPackages() {
	const planPackages: string[] = [
		"AI Balance card generation with filled up fields according to your job description",
		"Auto fill features like Supervisee/ Supervisor info, mandates, vision, mission, behavioral attributes, e.t.c.",
		"Smart Editing capability",
		"Convenient Sharing capability",
		"Unlimited Word document format (.docx) downloads",
		"Available 99.9% system uptime",
		"Simple and intuitive interface for all age groups",
		"Screen readers for visually impaired"
	];
	return (
		<div className="max-w-5xl space-y-4">
			<h1 className="text-xl text-center uppercase tracking-tight">know about BSC Making price</h1>
			<div>
				<Card className="flex flex-col sm:flex-row gap-4 pt-4 bg-gradient-to-tr from-primary/10">
					<CardFooter className="flex flex-col items-end justify-center">
						<CardTitle className="flex-none tabular-nums oldstyle-nums font-sans block break-keep">
							50,000 - 100, 000 Ugx
						</CardTitle>
						<CardDescription>Only</CardDescription>
					</CardFooter>
					<CardContent>
						<h2 className="font-semibold text-primary tracking-tighter">This annual one-time payment covers for;</h2>
						<ol>
							{planPackages.map((planPackage, index) => (
								<li key={index} className="max-w-prose text-base">
									<CheckIcon className="text-green-500 inline" />
									{planPackage}
								</li>
							))}
						</ol>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
