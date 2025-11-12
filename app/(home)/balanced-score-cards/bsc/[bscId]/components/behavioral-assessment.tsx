import EmptyContainer from "@/components/query-containers/empty-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BehavioralAttributeData, CoreValueData } from "@/lib/types";

interface BehavioralAssessmentProps {
	behavioralAttributes: BehavioralAttributeData[];
	coreValues: CoreValueData;
}

export function BehavioralAssessment({ behavioralAttributes, coreValues }: BehavioralAssessmentProps) {
	return (
		<Card className="max-w-4xl">
			<CardHeader>
				<CardTitle className="uppercase">Section 4: Performance Appraisal - Behavioral Assessment</CardTitle>
				<CardDescription>
					Acronym: <strong>{coreValues.acronym}</strong>
				</CardDescription>
				<CardDescription className="text-sm">
					<strong>Core values:</strong> {coreValues.values.map((v) => `${v.value} (${v.score}%)`).join(", ")}.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead colSpan={2}>General behavioral attributes</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Score</TableHead>
							<TableHead>Comments with justification</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{behavioralAttributes.length === 0 ? (
							<EmptyContainer message="No behavioral attributes found." />
						) : (
							behavioralAttributes.map((attr, index) => (
								<TableRow key={attr.id}>
									<TableCell className="font-bold">{index + 1}</TableCell>
									<TableCell className="font-bold">
										{attr.attribute} ({attr.percentage}%)
									</TableCell>
									<TableCell>{attr.description}</TableCell>
									<TableCell>{attr.score}</TableCell>
									<TableCell>{attr.commentsJustification}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
