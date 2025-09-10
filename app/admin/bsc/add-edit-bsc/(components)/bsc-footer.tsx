import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { BSCFormData } from "@/lib/validations/bsc";
import { LucideIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface BscFooterProps {
	form: UseFormReturn<BSCFormData>;
	isPending: boolean;
	currentStep: number;
	setCurrentStep: (currentStep: number) => void;
	setCompletedSteps: React.Dispatch<React.SetStateAction<number[]>>;
	steps: {
		id: string;
		title: string;
		icon: LucideIcon;
		description: string;
	}[];
}

export default function BscFooter({
	form,
	isPending,
	currentStep,
	setCurrentStep,
	setCompletedSteps,
	steps
}: BscFooterProps) {
	const handleNext = async () => {
		const stepFields = getStepFields(currentStep);
		const isValid = await form.trigger(stepFields);

		if (isValid) {
			setCompletedSteps((prev: number[]) => [...new Set([...prev, currentStep])]);
			if (currentStep < steps.length - 1) {
				setCurrentStep(currentStep + 1);
			}
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};
	return (
		<div className="mt-8 flex justify-between">
			<Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
				Previous
			</Button>

			{currentStep === steps.length - 1 ? (
				<LoadingButton loading={isPending} type="submit">
					Create BSC
				</LoadingButton>
			) : (
				<Button type="button" onClick={handleNext}>
					Next
				</Button>
			)}
		</div>
	);
}

function getStepFields(step: number): (keyof BSCFormData)[] {
	switch (step) {
		case 0:
			return ["supervisee", "supervisor", "year"];
		case 1:
			return ["strategicElements"];
		case 2:
			return ["performanceObjectives"];
		case 3:
			return ["coreValues", "behavioralAttributes"];
		default:
			return [];
	}
}
