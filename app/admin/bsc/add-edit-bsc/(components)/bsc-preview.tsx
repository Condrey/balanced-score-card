"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PERSPECTIVE_ALLOCATIONS } from "@/lib/bsc-calculations";
import type { BSCFormData } from "@/lib/validations/bsc";

interface BSCPreviewProps {
	data: Partial<BSCFormData>;
}

export function BSCPreview({ data }: BSCPreviewProps) {
	if (!data.supervisee?.name && !data.supervisor?.name) {
		return (
			<Card>
				<CardHeader className="mb-2 bg-secondary">
					<CardTitle className="text-lg">BSC Preview</CardTitle>
					<CardDescription>Complete the form to see a preview</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">Start filling out the form to see a preview of your BSC.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">BSC Preview</CardTitle>
				<CardDescription>Current form data summary</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{data.supervisee?.name && (
					<div>
						<h4 className="mb-2 text-sm font-medium">Supervisee</h4>
						<div className="space-y-1 text-sm">
							<p>
								<span className="font-medium">Name:</span> {data.supervisee.name}
							</p>
							<p>
								<span className="font-medium">Job Title:</span> {data.supervisee.jobTitle}
							</p>
							<p>
								<span className="font-medium">Employee #:</span> {data.supervisee.employeeNumber}
							</p>
						</div>
					</div>
				)}

				{data.supervisor?.name && (
					<div>
						<h4 className="mb-2 text-sm font-medium">Supervisor</h4>
						<div className="space-y-1 text-sm">
							<p>
								<span className="font-medium">Name:</span> {data.supervisor.name}
							</p>
							<p>
								<span className="font-medium">Job Title:</span> {data.supervisor.jobTitle}
							</p>
						</div>
					</div>
				)}

				{data.year && (
					<div>
						<h4 className="mb-2 text-sm font-medium">Review Year</h4>
						<Badge variant="outline">{data.year}</Badge>
					</div>
				)}

				<Separator />

				{data.strategicElements?.mandate && (
					<div>
						<h4 className="mb-2 text-sm font-medium">Strategic Elements</h4>
						<div className="space-y-2 text-xs">
							<p>
								<span className="font-medium">Vision:</span> {data.strategicElements.vision?.substring(0, 100)}...
							</p>
							<p>
								<span className="font-medium">Mission:</span> {data.strategicElements.mission?.substring(0, 100)}...
							</p>
						</div>
					</div>
				)}

				{data.performanceObjectives && data.performanceObjectives.length > 0 && (
					<div>
						<h4 className="mb-2 text-sm font-medium">Performance Objectives</h4>
						<div className="space-y-2">
							{data.performanceObjectives.map((obj, index) => (
								<div key={index} className="rounded bg-muted p-2 text-xs">
									<div className="mb-1 flex items-start justify-between">
										<Badge variant="outline" className="text-xs">
											{PERSPECTIVE_ALLOCATIONS[obj.perspective as keyof typeof PERSPECTIVE_ALLOCATIONS]?.label}
										</Badge>
										<span className="font-medium">{obj.percentage}%</span>
									</div>
									<p className="truncate">{obj.objective}</p>
								</div>
							))}
						</div>
					</div>
				)}

				{data.behavioralAttributes && data.behavioralAttributes.length > 0 && (
					<div>
						<h4 className="mb-2 text-sm font-medium">Behavioral Attributes</h4>
						<div className="space-y-1">
							{data.behavioralAttributes.map((attr, index) => (
								<div key={index} className="flex justify-between text-xs">
									<span className="truncate">{attr.attribute}</span>
									<span className="font-medium">{attr.percentage}%</span>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
