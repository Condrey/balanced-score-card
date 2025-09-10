"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { CoreValueData } from "@/lib/types";
import { coreValuesSchema, type CoreValuesSchema } from "@/lib/validations/bsc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormCoreValues from "./form-core-values";
import { upsertCoreValuesMutation } from "./mutation";

interface FormAddEditCoreValueProps {
	organizationContextId: string;
	coreValue?: CoreValueData;
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function FormAddEditCoreValue({ coreValue, organizationContextId, open, setOpen }: FormAddEditCoreValueProps) {
	const form = useForm<CoreValuesSchema>({
		resolver: zodResolver(coreValuesSchema),
		defaultValues: {
			id: coreValue?.id || "",
			acronym: coreValue?.acronym || "",
			values: coreValue ? coreValue.values : []
		}
	});
	const { mutate, isPending } = upsertCoreValuesMutation();
	const submitForm = (input: CoreValuesSchema) => {
		mutate(
			{ input, organizationContextId },
			{
				onSuccess: () => setOpen(false)
			}
		);
	};

	return (
		<ResponsiveDrawer
			open={open}
			setOpen={setOpen}
			title={`${coreValue ? "Edit" : "Create"} core values`}
			description={
				coreValue
					? `Make changes to core values with acronym of "${coreValue.acronym}"`
					: `Create the organization's core values together with its acronym`
			}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
					<FormCoreValues form={form} />
					<FormField
						control={form.control}
						name="acronym"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Acronym</FormLabel>
								<FormControl>
									<Input placeholder="Enter acronym for the core values" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<LoadingButton loading={isPending} className="w-full">
						{!coreValue ? "Create" : "Update"}
					</LoadingButton>
				</form>
			</Form>
		</ResponsiveDrawer>
	);
}
