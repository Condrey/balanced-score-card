"use client";

import FormSupervisorSupervisee from "@/app/(home)/add-bsc/form-supervisor-supervisee";
import { Button, ButtonProps } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PositionData } from "@/lib/types";
import { BatchIndividualBSCSchema, individualBSCSchema, IndividualBSCSchema } from "@/lib/validations/bsc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface ButtonAddEditMoreStaffsProps extends ButtonProps {
	index?: number;
	data?: IndividualBSCSchema;
	positions: PositionData[];
	thisForm: UseFormReturn<BatchIndividualBSCSchema>;
}

export default function ButtonAddEditMoreStaffs({
	index,
	data,
	positions,
	thisForm: form,
	...props
}: ButtonAddEditMoreStaffsProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button
				type="button"
				title={data ? "Edit this staff" : "Add Position more staffs"}
				onClick={() => setOpen(true)}
				{...props}
			/>
			<AddMoreStaffForm form={form} open={open} setOpen={setOpen} positions={positions} index={index} data={data} />
		</>
	);
}

interface AddMoreStaffFormProps {
	index?: number;
	data?: IndividualBSCSchema;
	form: UseFormReturn<BatchIndividualBSCSchema>;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	positions: PositionData[];
}
function AddMoreStaffForm({ data, index, open, setOpen, form, positions }: AddMoreStaffFormProps) {
	const { append, fields, update } = useFieldArray({ control: form.control, name: "individuals" });
	const form2 = useForm<IndividualBSCSchema>({
		resolver: zodResolver(individualBSCSchema),
		values: data
	});

	function addStaff(input: IndividualBSCSchema) {
		try {
			if (!data) {
				append(input);
			} else {
				update(index!, input);
			}
			setOpen(false);
		} catch (error) {
			toast.error("error", { description: `${error}` });
		}
	}
	return (
		<Sheet open={open} onOpenChange={setOpen} modal={false}>
			<SheetContent className="pb-12 h-svh overflow-y-auto scroll-smooth" side="top">
				<div>
					<div className="max-w-7xl flex flex-col pb-12 w-full mx-auto space-y-4">
						<SheetHeader>
							<SheetTitle>Add another staff</SheetTitle>
						</SheetHeader>
						<pre>{JSON.stringify(fields, null, 2)}</pre>
						<div className="flex items-end  gap-4">
							<FormField
								control={form2.control}
								name="year"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Financial Year </FormLabel>
										<FormControl>
											<Input placeholder="Please enter year of planning and review" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form2.control}
								name="supervisee.location"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Location/ Facility</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g OPD, Surgery Room for Health assistants, Central Registry, e.t.c."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormSupervisorSupervisee form={form2} positions={positions} />
						<div className="flex items-center justify-end gap-3">
							<SheetClose type="button" className="" asChild>
								<Button type="button" variant={"secondary"}>
									Close
								</Button>
							</SheetClose>
							<Button type="button" className="" onClick={() => form2.handleSubmit(addStaff)()}>
								{data ? "Update" : "Submit"}
							</Button>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
