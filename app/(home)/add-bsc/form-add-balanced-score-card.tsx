"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { PositionData } from "@/lib/types";
import { getCurrentFinancialYear } from "@/lib/utils";
import { individualBSCSchema, IndividualBSCSchema } from "@/lib/validations/bsc";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import AiGenerationComponent from "./(ai-generation)/ai-generation-component";
import FormSupervisorSupervisee from "./form-supervisor-supervisee";

interface FormAddBalancedScoreCardProps {
	user: User | undefined;
	positions: PositionData[];
}

export default function FormAddBalancedScoreCard({ user, positions }: FormAddBalancedScoreCardProps) {
	const [isPending, _] = useTransition();
	const [isGenerating, setIsGenerating] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);

	const year = getCurrentFinancialYear();
	const form = useForm<IndividualBSCSchema>({
		resolver: zodResolver(individualBSCSchema),
		values: {
			year,
			supervisee: {
				id: user?.position?.id || "",
				employeeNumber: "",
				jobTitle: user?.position?.jobTitle || "",
				salaryScale: user?.position?.salaryScale || "",
				name: user?.name || ""
			},
			supervisor: {
				id: user?.position?.reportsTo?.id || "",
				employeeNumber: "",
				jobTitle: user?.position?.reportsTo?.jobTitle || "",
				salaryScale: user?.position?.reportsTo?.salaryScale || "",
				name: ""
			}
		}
	});
	function submitForm() {
		setCurrentStep(0);
		setIsGenerating(true);
	}
	return (
		<>
			{isGenerating ? (
				<AiGenerationComponent
					previousForm={form}
					organizationId={user?.organizationId!}
					setIsGenerating={setIsGenerating}
					currentStep={currentStep}
					setCurrentStep={setCurrentStep}
					position={user?.position!}
				/>
			) : (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submitForm)}>
						<div className="space-y-6">
							<div className="flex items-end  gap-4">
								<FormField
									control={form.control}
									name="year"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Financial Year of Planning and Review</FormLabel>
											<FormControl>
												<Input placeholder="Please enter year of planning and review" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="supervisee.location"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Location/ Facility</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g OPD, Surgery Room for Health assistants, Central Registry, e.t.c."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<LoadingButton loading={isPending} size={"lg"} className="hidden md:flex">
									Create BSC
								</LoadingButton>
							</div>

							<FormSupervisorSupervisee form={form} positions={positions} />
							<LoadingButton loading={isPending} className="md:hidden  w-full">
								Create BSC
							</LoadingButton>
						</div>
					</form>
				</Form>
			)}
		</>
	);
}
