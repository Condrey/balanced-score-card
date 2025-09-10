import EmptyContainer from "@/components/query-containers/empty-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { perspectives } from "@/lib/constants";
import { groupByPerspective } from "@/lib/utils";
import { PerformanceObjective, PerspectiveType } from "@prisma/client";

interface PerformancePlanAndAppraisalProps {
	performanceObjectives: PerformanceObjective[];
	clients: string[];
}

export default function PerformancePlanAndAppraisal({
	performanceObjectives,
	clients
}: PerformancePlanAndAppraisalProps) {
	const groupedPerspectives = groupByPerspective(performanceObjectives);
	const totalScore = performanceObjectives.reduce((acc, obj) => acc + obj.score, 0);
	return (
		<Card className="max-w-7xl">
			<CardHeader>
				<CardTitle className="uppercase">Section 3: Performance Plan and Performance Appraisal</CardTitle>
				<CardDescription>CLIENTS: {clients.join(", ")}.</CardDescription>
				<CardDescription>TOTAL SCORE OUT OF 80%: {totalScore}</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>PERSPECTIVES</TableHead>
							<TableHead>Performance Objectives</TableHead>
							<TableHead>Actions/Activities</TableHead>
							<TableHead>Expected Results</TableHead>
							<TableHead>Key Performance Indicator</TableHead>
							<TableHead>Score</TableHead>
							<TableHead>Comments on actual performance</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!groupedPerspectives.length ? (
							<EmptyContainer message={"There are no performance objectives defined."} />
						) : (
							<>
								{groupedPerspectives.map((p) =>
									p.objectives.map((obj, index) => (
										<TableRow key={obj.objective} className="*:align-top">
											{/* Render perspective cell only on first row */}
											{index === 0 && (
												<TableCell rowSpan={p.objectives.length} className="break-all">
													<span className="font-bold">
														{p.perspective} … {p.percentage}%
													</span>
													{p.perspective === perspectives[PerspectiveType.STAKEHOLDERS_CLIENTS] && (
														<p>({clients.join(", ")})</p>
													)}
												</TableCell>
											)}
											<TableCell>{obj.objective}</TableCell>
											<TableCell className="whitespace-pre-line">
												{obj.actions.map((a) => `- ${a.action}`).join("\n")}
											</TableCell>
											<TableCell>{obj.expectedResults.map((e) => `- ${e.result}`).join("\n")}</TableCell>
											<TableCell>{obj.kpis.map((k) => `- ${k.kpi}`).join("\n")}</TableCell>
											<TableCell>{obj.score}</TableCell>
											<TableCell>{obj.comments}</TableCell>
										</TableRow>
									))
								)}
							</>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
