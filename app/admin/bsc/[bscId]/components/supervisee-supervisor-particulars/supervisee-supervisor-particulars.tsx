import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingButton from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeData } from "@/lib/validations/bsc";
import { useQuery } from "@tanstack/react-query";
import { DotIcon } from "lucide-react";
import { getPositions } from "./action";
import ButtonEditParticulars from "./button-edit-particluars";

interface SuperviseeSupervisorParticularsProps {
	supervisee: EmployeeData;
	supervisor: EmployeeData;
	year: string;
	bscId: string;
	username: string;
}

export default function SuperviseeSupervisorParticulars({
	supervisee,
	supervisor,
	year,
	bscId,
	username
}: SuperviseeSupervisorParticularsProps) {
	const { data, status, isFetching, refetch } = useQuery({
		queryKey: ["positions"],
		queryFn: getPositions
	});

	return (
		<Card className="max-w-4xl space-y-1.5">
			<CardHeader className="flex-row flex gap-2 flex-wrap justify-between items-center">
				<div>
					<CardTitle className="uppercase">Section 1: Supervisee and Supervisor particulars</CardTitle>
					<CardDescription>Created by: {username}</CardDescription>
				</div>
				<>
					{status === "error" ? (
						<LoadingButton loading={isFetching} onClick={() => refetch()} className="ml-auto">
							Reload
						</LoadingButton>
					) : status === "pending" ? (
						<Skeleton className="h-9 w-32 bg-background border ml-auto" />
					) : (
						<ButtonEditParticulars
							bscId={bscId}
							positions={data}
							supervisee={supervisee}
							supervisor={supervisor}
							year={year}
							variant={"outline"}
							className="ml-auto"
						>
							Update info
						</ButtonEditParticulars>
					)}
				</>
			</CardHeader>
			<CardContent className="flex flex-wrap gap-3 divide-y *:flex-1 md:divide-x md:divide-y-0">
				<div>
					<CardTitle>{supervisee.name}</CardTitle>
					<CardDescription className="flex ">
						<span>Supervisee</span>
						<DotIcon />
						<span>{supervisee.jobTitle}</span>
					</CardDescription>
					<p>Employee No.: {supervisee.employeeNumber}</p>
					<p>Salary Scale: {supervisee.salaryScale}</p>
				</div>
				<div className="pt-3 md:px-3 md:pt-0">
					<CardTitle>{supervisor.name}</CardTitle>
					<CardDescription className="inline-flex">
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
