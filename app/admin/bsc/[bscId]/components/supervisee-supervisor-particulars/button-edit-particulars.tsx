"use client";

import FormSupervisorSupervisee from "@/app/(home)/add-bsc/form-supervisor-supervisee";
import { Button, ButtonProps } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PositionData } from "@/lib/types";
import { EmployeeData, IndividualBSCSchema, individualBSCSchema } from "@/lib/validations/bsc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateParticularsMutation } from "./mutation";

interface ButtonEditParticularsProps extends ButtonProps {
	bscId: string;
	supervisee: EmployeeData;
	supervisor: EmployeeData;
	year: string;
	positions: PositionData[];
}
export default function ButtonEditParticulars({
	supervisee,
	supervisor,
	year,
	positions,
	bscId,
	...props
}: ButtonEditParticularsProps) {
	const [open, setOpen] = useState(false);
	const form = useForm<IndividualBSCSchema>({
		resolver: zodResolver(individualBSCSchema),
		defaultValues: {
			supervisee: supervisee,
			supervisor: supervisor,
			year: year
		}
	});
	const { isPending, mutate } = useUpdateParticularsMutation();
	function onsubmit(input: IndividualBSCSchema) {
		mutate(
			{ bscId, input },
			{
				onSuccess: () => setOpen(false)
			}
		);
	}

	return (
		<>
			<Button onClick={() => setOpen(true)} {...props} />
			<Sheet open={open} onOpenChange={setOpen} modal={false}>
				<SheetContent side="top" className="w-full h-svh overflow-y-auto scroll-smooth  p-4">
					<SheetHeader>
						<SheetTitle>Edit Particulars</SheetTitle>
					</SheetHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onsubmit)} className="max-w-5xl space-y-4 w-full mx-auto ">
							<LoadingButton loading={isPending} className="ml-auto">
								Submit update
							</LoadingButton>
							<FormSupervisorSupervisee form={form} positions={positions} />
						</form>
					</Form>
				</SheetContent>
			</Sheet>
		</>
	);
}
