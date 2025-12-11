import EmptyContainer from "@/components/query-containers/empty-container";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PositionData } from "@/lib/types";
import { BatchIndividualBSCSchema, IndividualBSCSchema } from "@/lib/validations/bsc";
import { ChevronRight, PencilIcon, StarsIcon, Trash2Icon } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import ButtonAddEditMoreStaffs from "./button-add-edit-more-staffs";

interface TableOfInputsProps {
	form: UseFormReturn<BatchIndividualBSCSchema>;
	positions: PositionData[];
}

export default function TableOfInputs({ form, positions }: TableOfInputsProps) {
	const { remove } = useFieldArray({ control: form.control, name: "individuals" });

	const employees = form.watch("individuals");
	return (
		<Table className="table border caption-bottom">
			<TableCaption>
				<TableCell>Table showing staffs to generate for BSCs</TableCell>
			</TableCaption>
			<TableHeader>
				<TableRow className="bg-secondary">
					<TableHead>s/n</TableHead>
					<TableHead>Staff</TableHead>
					<TableHead>Employee Number</TableHead>
					<TableHead>Full name</TableHead>
					<TableHead>Job Title</TableHead>
					<TableHead>Salary Scale</TableHead>
					<TableHead>Financial Year</TableHead>
					<TableHead>Location/ Facility</TableHead>
					<TableHead>Action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{!employees.length && (
					<TableRow>
						<TableCell colSpan={10}>
							<EmptyContainer
								className=""
								message={"There are no staffs added for submissions yet, please add staffs to the table"}
							>
								<ButtonAddEditMoreStaffs thisForm={form} positions={positions}>
									Add a staff
								</ButtonAddEditMoreStaffs>
							</EmptyContainer>
						</TableCell>
					</TableRow>
				)}
				{employees.map((employee, index) => (
					<StaffRow key={index} employee={employee} index={index} form={form} positions={positions} />
				))}
			</TableBody>
		</Table>
	);
}

interface StaffRowProps {
	index: number;
	employee: IndividualBSCSchema;
	form: UseFormReturn<BatchIndividualBSCSchema>;
	positions: PositionData[];
}
function StaffRow({ index, employee, form, positions }: StaffRowProps) {
	const { supervisee, supervisor, year } = employee;
	const { remove } = useFieldArray({ control: form.control, name: "individuals" });
	const message = form.getFieldState(`individuals.${index}`).error?.message;
	return (
		<TableRow className="even:bg-muted">
			<TableCell>{index + 1}</TableCell>
			{!message ? (
				<>
					<TableCell>
						<div className="flex items-center text-primary font-semibold">
							Supervisee <ChevronRight className="size-4 fill-primary" />
						</div>
						<div className="text-muted-foreground">Supervisor</div>
					</TableCell>
					<TableCell>
						<div className="font-semibold">{supervisee.employeeNumber}</div>
						<div className="text-muted-foreground">{supervisor.employeeNumber}</div>
					</TableCell>
					<TableCell>
						<div className="font-semibold">{supervisee.name}</div>
						<div className="text-muted-foreground">{supervisor.name}</div>
					</TableCell>
					<TableCell>
						<div className="font-semibold">{supervisee.jobTitle}</div>
						<div className="text-muted-foreground">{supervisor.jobTitle}</div>
					</TableCell>
					<TableCell>
						<div className="font-semibold">{supervisee.salaryScale}</div>
						<div className="text-muted-foreground">{supervisor.salaryScale}</div>
					</TableCell>

					<TableCell className="font-semibold">{year}</TableCell>
					<TableCell className="font-semibold">{supervisee.location}</TableCell>
					<TableCell>
						<div className="flex">
							<ButtonAddEditMoreStaffs
								positions={positions}
								index={index}
								data={{ supervisee, supervisor, year }}
								thisForm={form}
								size={"icon"}
								variant={"ghost"}
								title="Edit"
							>
								<PencilIcon />
								<span className="sr-only">Edit</span>
							</ButtonAddEditMoreStaffs>
							<Button size={"icon"} variant={"ghost"} title="Delete" onClick={() => remove(index)}>
								<Trash2Icon />
								<span className="sr-only">Delete</span>
							</Button>
						</div>
					</TableCell>
				</>
			) : (
				<>
					<TableCell>
						<div className="font-semibold">{supervisee.name}</div>
						<div className="text-muted-foreground">... AI Generating Info</div>
					</TableCell>
					<TableCell colSpan={6}>
						<StarsIcon className="animate-spin inline-flex mr-2 " />
						{message}
					</TableCell>
				</>
			)}
		</TableRow>
	);
}
