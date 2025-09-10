import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReasonForBsc() {
	const reasons: { reason: string }[] = [
		{
			reason:
				"Strengthening the alignment if deliverables to government priorities with clearly defined financial, non-financial measures and documented standards"
		},
		{ reason: "Strengthening accountability for results at all levels" },
		{
			reason: `Guiding the implementations of MDAs/LG's strategies to improve performance.`
		},
		{
			reason:
				"Improving the effectiveness of MDA/LG reporting and communications based on tangible outcomes and statistical data."
		}
	];
	return (
		<div className="space-y-4">
			<h1 className="text-xl text-center uppercase tracking-tight">Reasons for a BSC</h1>
			<div className="flex gap-3 flex-wrap *:flex-1">
				{reasons.map((r, index) => (
					<Card key={index} className="min-w-60 md:min-w-0">
						<CardHeader>
							<CardTitle>{index + 1}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-balance">{r.reason}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
