"use client";

import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Target, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { BSCFormData, bscSchema } from "@/lib/validations/bsc";

import { Form } from "@/components/ui/form";
import { BSCData, OrganizationContextData, PositionData } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ParticularsSection } from "./(section-1)/particulars-section";
import { StrategicElementsSection } from "./(section-2)/strategic-elements-section";
import { PerformancePlanSection } from "./(section-3)/performance-plan-section";
import { BehavioralAssessmentSection } from "./(section-4)/behavioral-assessment-section";
import BscFooter from "./bsc-footer";
import BscProgressBar from "./bsc-progress-bar";
import BscSideBar from "./bsc-side-bar";
import BscSteps from "./bsc-steps";
import { upsertBSCMutation } from "./mutation";

interface BSCFormProps {
	bSC: BSCData | undefined | null;
	organizationContext: OrganizationContextData | null;
	position: PositionData | null;
	year: string;
}

export function BSCForm({ bSC, organizationContext, position, year }: BSCFormProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [completedSteps, setCompletedSteps] = useState<number[]>([]);
	const { isPending, mutate } = upsertBSCMutation();
	const form = useForm<BSCFormData>({
		resolver: zodResolver(bscSchema),
		defaultValues: {
			id: "",
			organizationId: organizationContext?.organizationId || "",
			year: year,
			supervisee: bSC?.supervisee || {
				id: position?.id || "",
				employeeNumber: "",
				jobTitle: position?.jobTitle || "",
				salaryScale: position?.salaryScale || "",
				name: ""
			},
			supervisor: bSC?.supervisor || {
				id: position?.reportsTo?.id || "",
				employeeNumber: "",
				jobTitle: position?.reportsTo?.jobTitle || "",
				salaryScale: position?.reportsTo?.salaryScale || "",
				name: ""
			},
			strategicElements: {
				id: "",
				mandate: bSC?.mandate || position?.departmentalMandate || "",
				vision: bSC?.vision || organizationContext?.vision || "",
				mission: bSC?.mission || organizationContext?.mission || "",
				goal: bSC?.goal || organizationContext?.goal || "",
				ndpProgrammes: bSC ? bSC.ndpProgrammes.map((n) => ({ value: n })) : [],
				departmentalMandate: bSC?.departmentalMandate || "",
				strategicObjectives: bSC ? bSC.strategicObjectives.map((s) => ({ value: s })) : []
			},
			performanceObjectives: bSC
				? bSC.performanceObjectives.map((p) => ({
						...p,
						score: p.score,
						actions: p.actions.map((a) => ({ value: a })),
						expectedResults: p.expectedResults.map((a) => ({ value: a })),
						kpis: p.kpis.map((a) => ({ value: a })),
						comments: p.comments || ""
					}))
				: [],
			coreValues: bSC
				? {
						id: bSC.coreValues.id || "",
						acronym: bSC.coreValues.acronym,
						values: bSC.coreValues.values
					}
				: organizationContext?.coreValue
					? {
							id: organizationContext.coreValue.id || "",
							acronym: organizationContext.coreValue.acronym,
							values: organizationContext.coreValue.values
						}
					: {
							id: "",
							acronym: "",
							values: []
						},
			behavioralAttributes: bSC
				? bSC.behavioralAttributes.map((b) => ({
						...b,
						commentsJustification: b.commentsJustification!,
						score: b.score,
						description: b.description || ""
					}))
				: organizationContext
					? organizationContext.behavioralAttributes?.map((bA) => ({
							...bA,
							description: bA.description || "",
							commentsJustification: bA.commentsJustification!
						}))
					: []
		}
	});

	const onSubmit = async (data: BSCFormData) => {
		toast("submitted", {
			description: <pre className="max-h-40 overflow-y-auto">{JSON.stringify(data, null, 2)}</pre>
		});
		mutate(data, {
			// onSuccess: () => router.push("/bsc"),
		});
	};

	return (
		<Form {...form}>
			<div className="container mx-auto px-4 pb-8">
				<div className="mx-auto max-w-6xl space-y-6">
					<div className="space-y-4">
						{process.env.NODE_ENV === "development" && (
							<button
								onClick={() => {
									toast.success("Copied successfully.");
									navigator.clipboard.writeText(JSON.stringify(form.watch(), null, 2));
								}}
							>
								Copy data
							</button>
						)}
						{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
						{/* Progress bar  */}
						<BscProgressBar currentStep={currentStep} steps={steps.length} />
						{/* steps  */}
						<BscSteps
							currentStep={currentStep}
							setCurrentStep={setCurrentStep}
							completedSteps={completedSteps}
							steps={steps}
						/>
					</div>

					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						<div className="lg:col-span-2">
							<Card className="">
								<CardHeader className="mb-2 bg-secondary">
									<CardTitle className="flex items-center gap-2">
										{/* special way to create item from iterable  */}
										{React.createElement(steps[currentStep].icon, {
											className: "h-5 w-5"
										})}
										{steps[currentStep].title}{" "}
										<span className="place-items-baseline text-sm text-muted-foreground">
											(section {currentStep + 1} of {steps.length})
										</span>
									</CardTitle>
									<CardDescription>{steps[currentStep].description}</CardDescription>
								</CardHeader>
								<CardContent>
									<form onSubmit={form.handleSubmit(onSubmit)}>
										{currentStep === 0 && <ParticularsSection form={form} />}
										{currentStep === 1 && <StrategicElementsSection form={form} positionId={position?.id!} />}
										{currentStep === 2 && <PerformancePlanSection form={form} />}
										{currentStep === 3 && <BehavioralAssessmentSection form={form} />}

										{/* Bsc Footer  */}
										<BscFooter
											form={form}
											currentStep={currentStep}
											isPending={isPending}
											setCompletedSteps={setCompletedSteps}
											setCurrentStep={setCurrentStep}
											steps={steps}
										/>
									</form>
								</CardContent>
							</Card>
						</div>

						{/* BSC side bar  */}
						<BscSideBar form={form} />
					</div>
				</div>
			</div>
		</Form>
	);
}

const steps = [
	{
		id: "particulars",
		title: "Particulars",
		icon: Users,
		description: "Supervisee and Supervisor details"
	},
	{
		id: "strategic",
		title: "Strategic Elements",
		icon: Target,
		description: "Mandate, Vision, Mission & Objectives"
	},
	{
		id: "performance",
		title: "Performance Plan",
		icon: BarChart3,
		description: "Objectives, KPIs & Scoring"
	},
	{
		id: "behavioral",
		title: "Behavioral Assessment",
		icon: FileText,
		description: "Core Values & Attributes"
	}
];
