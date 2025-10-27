import BscSteps from "@/app/admin/bsc/add-edit-bsc/(components)/bsc-steps";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import kyInstance from "@/lib/ky";
import { OrganizationContextData, PositionData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BSCFormData, bscSchema, IndividualBSCSchema, PerformanceObjectiveArraySchema } from "@/lib/validations/bsc";
import {
	OrganizationContextPropsSchema,
	ScheduleOfDutySchema,
	SdRequestSchema,
	stringArraySchema
} from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarChart3, FileText, StarsIcon, Target, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { upsertBSCMutation } from "./mutattion";

interface AiGenerationComponentProps {
	previousForm: UseFormReturn<IndividualBSCSchema>;
	organizationId: string;
	position: PositionData;
	setIsGenerating: (isGenerating: boolean) => void;
	currentStep: number;
	setCurrentStep: Dispatch<SetStateAction<number>>;
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
	const [completedStepsMessages, setCompletedStepsMessages] = useState<string[]>([
		"Created supervisee and supervisor details"
	]);
	const [msg, setMsg] = useState<{ message: string; isError: boolean } | undefined>(undefined);
	const router = useRouter();
	const { isPending, mutate } = upsertBSCMutation();
	const form = useForm<BSCFormData>({
		resolver: zodResolver(bscSchema),
		defaultValues: {
			organizationId,
			year,
			supervisee,
			supervisor,
			strategicElements: undefined,
			performanceObjectives: [],
			coreValues: undefined,
			behavioralAttributes: [],
			scheduleOfDuty: undefined,
			clients: []
		}
	});

	useEffect(() => {
		const run = async () => {
			toast(`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep].title}`, {
				description: `Creating ${steps[currentStep].description}`
			});
			switch (currentStep) {
				case 0:
					if (!form.getValues("supervisee").id || !form.getValues("supervisor").id) {
						setMsg({
							isError: true,
							message:
								"Both supervisee and supervisor must have positions assigned. Please go back and select positions for both."
						});
						return;
					} else {
						setCurrentStep(1);
						// await handleNext();
					}

					break;
				case 1:
					// ndp programmes
					try {
						setMsg({ message: "Getting your NDPs", isError: false });
						const res = await kyInstance.post("/api/form/strategic-elements", {
							json: {
								organizationId,
								financialYear: year,
								position: position.id
							} satisfies OrganizationContextPropsSchema
						});
						const data = await res.json<
							| {
									ndps: OutputSchema;
									organizationContext: OrganizationContextData;
									userObjectives: OutputSchema;
									clients: string[];
									mandate: string;
							  }
							| string
						>();
						console.log("Parsed response:", data);
						if (typeof data === "string") {
							setMsg({ message: data, isError: true });
						} else {
							const { mission, vision, goal, behavioralAttributes, coreValue } = data.organizationContext;
							form.setValue("strategicElements.ndpProgrammes", data.ndps);
							form.setValue("strategicElements.strategicObjectives", data.userObjectives);
							form.setValue(
								"clients",
								data.clients.map((c) => ({ id: "", value: c }))
							);
							form.setValue("strategicElements.mission", mission);
							form.setValue("strategicElements.vision", vision);
							form.setValue("strategicElements.mandate", data.mandate);
							form.setValue("strategicElements.goal", goal);
							form.setValue("strategicElements.departmentalMandate", "This is to be got from PBS");
							form.setValue(
								"behavioralAttributes",
								behavioralAttributes.map((bA) => ({
									...bA,
									commentsJustification: bA.commentsJustification || "",
									description: bA.description || ""
								}))
							);
							form.setValue("coreValues", coreValue!);
							setMsg({
								message:
									"NDPs retrieved successfully, Strategic objectives generated, mandate, vision, mission, e.t.c.",
								isError: false
							});
							setCompletedStepsMessages((msgs) => [...msgs, "Generated strategic elements"]);
							setCurrentStep(2);
						}
					} catch (error) {
						console.error("API error:", error);
						setMsg({ message: "Failed to get NDPs" + JSON.stringify(error), isError: true });
					}
					break;

				case 2:
					try {
						setMsg({ message: "Getting your performance plan", isError: false });
						const res = await kyInstance.post("/api/form/performance-plan", {
							json: {
								organizationId,
								financialYear: year,
								position: supervisee.id!,
								behavioralAttributes: form.watch("behavioralAttributes")
							} satisfies OrganizationContextPropsSchema
						});
						const data = await res.json<PerformanceObjectiveArraySchema | string>();
						if (typeof data === "string") {
							setMsg({ message: data, isError: true });
						} else {
							form.setValue("performanceObjectives", data.performanceObjectives);

							setMsg({ message: "Performance plan retrieved successfully", isError: false });
							setCompletedStepsMessages((msgs) => [...msgs, "Finished Creating performance plan"]);
							setCurrentStep(3);
						}
					} catch (error) {
						console.error("API error:", error);
						setMsg({ message: "Failed to get performance plan" + JSON.stringify(error), isError: true });
					}
					break;
				case 3:
					setMsg({ message: "Behavioral assessment done, BSC generation complete", isError: false });
					setCompletedStepsMessages((msgs) => [...msgs, "Behavioral assessment done"]);
					try {
						setMsg({ message: "Making for you the schedule of duties", isError: false });
						const res = await kyInstance.post("/api/form/schedule-of-duty", {
							json: {
								positionId: position.id,
								location: form.watch("supervisee.location") || ""
							} satisfies SdRequestSchema
						});
						const data = await res.json<ScheduleOfDutySchema | string>();
						if (typeof data === "string") {
							setMsg({ message: data, isError: true });
						} else {
							form.setValue("scheduleOfDuty", data);

							setMsg({ message: "SD has been created.", isError: false });
							setCompletedStepsMessages((msgs) => [...msgs, "Your schedule of duly was successfully created"]);
						}
					} catch (error) {
						console.error("API error:", error);
						setMsg({ message: "Failed to Create your schedule of duty " + JSON.stringify(error), isError: true });
					}
					setMsg(undefined);
					mutate(form.watch(), { onSuccess: () => router.push("/") });
					break;
				default:
					break;
			}
		};
		run();
	}, [currentStep]);

	function handleSubmit() {}
	return (
		<div className="space-y-4">
			<BscSteps
				completedSteps={completedSteps}
				currentStep={currentStep}
				setCurrentStep={setCurrentStep}
				steps={steps}
			/>

			{/* <pre className="overflow-y-clip">{JSON.stringify(form.watch(), null, 2)}</pre> */}
			{/* <pre className="overflow-y-clip">{JSON.stringify(form.formState.errors, null, 2)}</pre> */}

			<ul className="list-inside list-disc space-y-1 max-w-3xl mx-auto bg-secondary p-3 rounded-md">
				{completedStepsMessages.map((message, index) => (
					<li key={index} className="text-sm  flex items-center text-green-900 whitespace-pre-line gap-2">
						<StarsIcon className=" size-4 inline fill-green-900  " /> {message}
					</li>
				))}
				{!!msg && (
					<p className={cn("text-sm line-clamp-2 text-ellipsis  animate-pulse ", msg.isError && "text-destructive")}>
						<StarsIcon
							className={cn(
								" size-4  mr-2  inline-flex  place-items-start place-self-start",
								msg.isError ? "text-destructive fill-destructive" : "text-primary animate-spin"
							)}
						/>
						{msg.message}
					</p>
				)}
			</ul>

			<div className="flex justify-center">
				<Button
					type="button"
					variant={"destructive"}
					onClick={() => setIsGenerating(false)}
					className="max-w-fit mx-auto"
				>
					Go Back
				</Button>
				{isPending && (
					<LoadingButton loading={isPending} onClick={() => handleSubmit()} className="max-w-fit mx-auto">
						Submit BSC{" "}
					</LoadingButton>
				)}
			</div>
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
