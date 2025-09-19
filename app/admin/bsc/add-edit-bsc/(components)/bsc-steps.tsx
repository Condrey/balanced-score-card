import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, LucideIcon } from "lucide-react";

interface BscStepsProps {
	steps: {
		id: number;
		title: string;
		icon: LucideIcon;
		description: string;
	}[];
	completedSteps: number[];
	currentStep: number;
	setCurrentStep: (currentStep: number) => void;
}

export default function BscSteps({ steps, completedSteps, currentStep, setCurrentStep }: BscStepsProps) {
	return (
		<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
			{steps.map((step, index) => {
				const Icon = step.icon;
				// const isCompleted = completedSteps.includes(index);
				const isCompleted = currentStep > index;
				const isCurrent = currentStep === index;

				return (
					<Card
						key={step.id}
						className={cn(
							"cursor-pointer transition-all",
							isCurrent ? "bg-muted ring-2 ring-primary" : "text-muted-foreground opacity-80",
							isCompleted ? "border-green-200 bg-green-50 text-green-950" : ""
						)}
						onClick={() => setCurrentStep(index)}
					>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div
									className={`rounded-full p-2 ${
										isCompleted ? "bg-green-100" : isCurrent ? "bg-primary/10" : "bg-muted"
									}`}
								>
									{isCompleted ? (
										<CheckCircle className="h-5 w-5 text-green-600" />
									) : (
										<Icon className={`h-5 w-5 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
									)}
								</div>
								<div className="min-w-0 flex-1">
									<h3 className="line-clamp-1 text-ellipsis text-sm font-medium">{step.title}</h3>
									<p className="truncate text-xs text-muted-foreground">{step.description}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
