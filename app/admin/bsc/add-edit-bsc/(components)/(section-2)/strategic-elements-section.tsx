"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import kyInstance from "@/lib/ky";
import type { BSCFormData } from "@/lib/validations/bsc";
import { OrganizationContextPropsSchema } from "@/lib/validations/others";
import { useQuery } from "@tanstack/react-query";
import { StarsIcon } from "lucide-react";
import { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import FormNdps from "./form-ndps";
import FormStrategicObjectives from "./form-strategic-objectives";

interface StrategicElementsSectionProps {
	form: UseFormReturn<BSCFormData>;
	positionId: string;
}

export function StrategicElementsSection({ form, positionId }: StrategicElementsSectionProps) {
	const organizationId = form.watch("organizationId")!;
	const financialYear = form.watch("year");
	const position = form.watch("supervisee.jobTitle");
	const superviseeId = form.watch("supervisee.id");

	const query = useQuery({
		queryKey: ["departmentalMandate", superviseeId],
		refetchOnWindowFocus: false,
		staleTime: Infinity,
		queryFn: async () =>
			kyInstance
				.post("/api/form/departmental-mandate", {
					json: {
						financialYear,
						organizationId,
						position
					} satisfies OrganizationContextPropsSchema
				})
				.json<string>()
	});

	const { data, isError, isPending, isFetching, isSuccess, error } = query;
	useEffect(() => {
		if (isSuccess && !!data) {
			form.setValue("strategicElements.departmentalMandate", data);
		}
	}, [isSuccess, data, form]);

	if (isError) {
		console.error(error);
	}
	async function getAiDepartmentalMandate() {
		await query.refetch();
	}
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="mb-2 bg-secondary">
					<CardTitle>Organizational Context</CardTitle>
					<CardDescription>Define the strategic foundation of your organization</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormField
						control={form.control}
						name="strategicElements.mandate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Your Mandate</FormLabel>
								<FormControl>
									<Textarea placeholder="Enter your mandate" rows={3} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="strategicElements.vision"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Organization Vision</FormLabel>
								<FormControl>
									<Textarea placeholder="Enter vision statement" rows={3} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="strategicElements.mission"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Organization Mission</FormLabel>
								<FormControl>
									<Textarea placeholder="Enter mission statement" rows={3} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="strategicElements.goal"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Organization Goal</FormLabel>
								<FormControl>
									<Textarea placeholder="Enter primary organizational goal" rows={3} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="strategicElements.departmentalMandate"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center justify-between gap-2">
									<span>Your Departmental Mandate</span>
									<LoadingButton
										loading={isFetching}
										type="button"
										title="Use Ai to search your departmental mandate"
										onClick={getAiDepartmentalMandate}
										variant={"ghost"}
										size={"icon"}
									>
										<StarsIcon />
										<span className="sr-only">Use Ai to search your departmental mandate</span>
									</LoadingButton>
								</FormLabel>
								<FormControl>
									<Textarea placeholder="Enter your departmental mandate" rows={3} {...field} />
								</FormControl>
								{isFetching && (
									<FormDescription>Ai is fetching the perfect departmental mandate for you...</FormDescription>
								)}
								<FormMessage>
									{isError &&
										!form.watch("strategicElements.departmentalMandate").length &&
										"Ai encountered an error while getting departmental mandate."}
								</FormMessage>
							</FormItem>
						)}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="mb-2 bg-secondary">
					<CardTitle>National Development Plan (NDP) Programmes</CardTitle>
					<CardDescription>Add NDP programmes from your organization that applies to your position</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormNdps form={form} positionId={positionId} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="mb-2 bg-secondary">
					<CardTitle>Strategic Objectives</CardTitle>
					<CardDescription>Define key strategic objectives to be achieved</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormStrategicObjectives form={form} />
				</CardContent>
			</Card>
		</div>
	);
}
