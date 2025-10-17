import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BSCData } from "@/lib/types";
import ButtonEditScheduleOfDuty from "./button-edit-schedule-of-duty";

interface ScheduleOfDutyProps {
	bsc: BSCData;
}

export default function ScheduleOfDuty({ bsc }: ScheduleOfDutyProps) {
	const { scheduleOfDuty: sd, supervisee } = bsc;
	const data: { title: string; content: string }[] = [
		{ title: "Name of Officer", content: supervisee.name },
		{ title: "Title and Salary Scale", content: `${supervisee.jobTitle}\n${supervisee.salaryScale}` },
		{ title: "Names and titles of supervisees", content: "" },
		{ title: "Job summary/ purpose ", content: sd?.jobSummary! },
		{
			title: "Key Results Areas/ Duties/ Responsibilities ",
			content: sd?.resultAreas.map((r) => `- ${r}`).join("\n")!
		},
		{ title: "Outputs", content: sd?.outputActivities.map((d) => `- ${d.output}`).join("\n")! },
		{
			title: "Activities",
			content: sd?.outputActivities
				.flatMap((d) => d.activities)
				.map((d) => `- ${d}`)
				.join("\n")!
		},
		{
			title: "Clients/ People the Officer relates with in execution of his/her duties",
			content: sd?.clients.map((c) => `- ${c}`).join("\n")!
		},
		{ title: "Reporting arrangements", content: sd?.reportingArrangements.map((c) => `- ${c}`).join("\n")! },
		{
			title: "Guiding documents in execution of duties",
			content: sd?.guidingDocuments.map((c) => `- ${c}`).join("\n")!
		}
	];
	return (
		<Card className="max-w-4xl space-y-1.5">
			<CardHeader className="flex gap-2 flex-wrap justify-between items-center flex-row">
				<CardTitle className="uppercase">ANNEX V: SCHEDULE OF DUTIES</CardTitle>
				<ButtonEditScheduleOfDuty
					variant={"outline"}
					bscId={bsc.id}
					location={bsc.scheduleOfDuty?.location!}
					positionId={bsc.superviseeId}
					className="ml-auto"
				>
					Re-submit
				</ButtonEditScheduleOfDuty>
			</CardHeader>
			<CardContent className="flex flex-col  gap-2 ">
				{data.map((d) => (
					<div key={d.title} className="flex flex-col md:flex-row gap-2 border-b">
						<div className="md:w-1/4 font-bold bg-secondary p-2">{d.title}</div>
						<div className="md:w-3/4 whitespace-pre-line p-2">{d.content}</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
