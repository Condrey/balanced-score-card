"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { BSCFormData } from "@/lib/validations/bsc";
import { X } from "lucide-react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import Assessments from "./assessments";
import FormCoreValues from "./form-core-values";

interface BehavioralAssessmentSectionProps {
	form: UseFormReturn<BSCFormData>;
}

export function BehavioralAssessmentSection({ form }: BehavioralAssessmentSectionProps) {
	const { fields: attributeFields, remove: removeAttribute } = useFieldArray({
		control: form.control,
		name: "behavioralAttributes"
	});

	const getTotalBehavioralPercentage = () => {
		return attributeFields.reduce((sum, _, index) => {
			return sum + (form.watch(`behavioralAttributes.${index}.percentage`) || 0);
		}, 0);
	};

	const totalPercentage = getTotalBehavioralPercentage();
	const isPercentageValid = Math.abs(totalPercentage - 20) < 0.01;

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="mb-2 bg-secondary">
					<CardTitle>Core Values</CardTitle>
					<CardDescription>Define organizational core values and their acronym</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* core values  */}
					<FormCoreValues form={form} />
					<FormField
						control={form.control}
						name="coreValues.acronym"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Acronym</FormLabel>
								<FormControl>
									<Input placeholder="Enter acronym for core values" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</CardContent>
			</Card>

			{/* assessments  */}
			<Card>
				<CardHeader className="mb-2 bg-secondary">
					<CardTitle>Behavioral Attributes Assessment</CardTitle>
					<CardDescription>
						Total allocation must equal 20%
						<Badge variant={isPercentageValid ? "default" : "destructive"} className="ml-2">
							Current: {totalPercentage.toFixed(1)}% / 20%
						</Badge>
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Assessments form={form} />
				</CardContent>
			</Card>
		</div>
	);
}
