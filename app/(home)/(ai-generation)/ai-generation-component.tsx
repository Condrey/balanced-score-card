import BscSteps from "@/app/admin/bsc/add-edit-bsc/(components)/bsc-steps";
import EmptyContainer from "@/components/query-containers/empty-container";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { PositionData } from "@/lib/types";
import { BSCFormData, bscSchema, IndividualBSCSchema } from "@/lib/validations/bsc";
import { OrganizationContextPropsSchema, stringArraySchema } from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarChart3, FileText, Loader2Icon, StarsIcon, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface AiGenerationComponentProps {
	previousForm: UseFormReturn<IndividualBSCSchema>;
	organizationId: string;
	position: PositionData;
	setIsGenerating: (isGenerating: boolean) => void;
	currentStep: number;
	setCurrentStep: (currentStep: number) => void;
}

export default function AiGenerationComponent({
	previousForm,
	organizationId,
	position,
	setIsGenerating,
	currentStep,
	setCurrentStep
}: AiGenerationComponentProps) {
	const outputSchema = z.array(stringArraySchema);
	type OutputSchema = z.infer<typeof outputSchema>;
	const year = previousForm.watch("year");
	const supervisee = previousForm.watch("supervisee");
	const supervisor = previousForm.watch("supervisor");
	const [completedSteps, setCompletedSteps] = useState<number[]>([0]);
	const [msg, setMsg] = useState("");

	const form = useForm<BSCFormData>({
		resolver: zodResolver(bscSchema),
		defaultValues: {
			id: "",
			organizationId,
			year,
			supervisee,
			supervisor,
			strategicElements: undefined,
			performanceObjectives: [],
			coreValues: undefined,
			behavioralAttributes: []
		}
	});
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
	useEffect(() => {
		const run = async () => {
			toast(`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep].title}`, {
				description: `Creating ${steps[currentStep].description}`
			});
			switch (currentStep) {
				case 0:
					// setCurrentStep(1);
					// await handleNext();
					break;
				case 1:
					// ndp programmes
					try {
						setMsg("Getting your NDPs");
						const response = kyInstance
							.post("/api/form/user-ndps", {
								json: {
									organizationId,
									financialYear: year,
									position: position.id
								} satisfies OrganizationContextPropsSchema
							})
							.json<OutputSchema | string>();
						console.log({ response });
					} catch (error) {
						console.error(error);
						setMsg("Failed to get Ndps");
					}
					break;
				case 2:
					break;
				case 3:
					break;
				default:
					break;
			}
		};
		run();
	}, [currentStep]);
	return (
		<div>
			<BscSteps
				completedSteps={completedSteps}
				currentStep={currentStep}
				setCurrentStep={setCurrentStep}
				steps={steps}
			/>
			{!!msg && (
				<p className="text-xs line-clamp-2 text-ellipsis">
					<StarsIcon className="text-primary size-4 animate-spin inline" />
					{msg}
				</p>
			)}
			<EmptyContainer
				message={`Generating balanced score card for ${supervisee.name}- ${supervisee.jobTitle}. Please be patient while loading.!`}
			>
				<Loader2Icon className="animate-spin" />
				<Button type="button" variant={"destructive"} onClick={() => setIsGenerating(false)}>
					Go Back
				</Button>
			</EmptyContainer>
		</div>
	);
}

const steps = [
	{
		id: 0,
		title: "Particulars",
		icon: Users,
		description: "Supervisee and Supervisor details"
	},
	{
		id: 1,
		title: "Strategic Elements",
		icon: Target,
		description: "Mandate, Vision, Mission & Objectives"
	},
	{
		id: 2,
		title: "Performance Plan",
		icon: BarChart3,
		description: "Objectives, KPIs & Scoring"
	},
	{
		id: 3,
		title: "Behavioral Assessment",
		icon: FileText,
		description: "Core Values & Attributes"
	}
];
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
