import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeData } from "@/lib/validations/bsc";
import { DotIcon } from "lucide-react";

interface SuperviseeSupervisorParticularsProps {
	supervisee: EmployeeData;
	supervisor: EmployeeData;
}

export default function SuperviseeSupervisorParticulars({
	supervisee,
	supervisor
}: SuperviseeSupervisorParticularsProps) {
	return (
		<Card className="max-w-4xl space-y-1.5">
			<CardHeader>
				<CardTitle className="uppercase">Section 1: Supervisee and Supervisor particulars</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-wrap gap-3 divide-y *:flex-1 md:divide-x md:divide-y-0">
				<div>
					<CardTitle>{supervisee.name}</CardTitle>
					<CardDescription className="flex flex-row">
						<span>Supervisee</span>
						<DotIcon />
						<span>{supervisee.jobTitle}</span>
					</CardDescription>
					<p>Employee No.: {supervisee.employeeNumber}</p>
					<p>Salary Scale: {supervisee.salaryScale}</p>
				</div>
				<div className="pt-3 md:px-3 md:pt-0">
					<CardTitle>{supervisor.name}</CardTitle>
					<CardDescription className="flex flex-row">
						<span>Supervisor</span>
						<DotIcon />
						<span>{supervisor.jobTitle}</span>
					</CardDescription>
					<p>Employee No.: {supervisor.employeeNumber}</p>
					<p>Salary Scale: {supervisor.salaryScale}</p>
				</div>
			</CardContent>
		</Card>
	);
}
