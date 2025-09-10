import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PerformanceObjectiveSchema } from "@/lib/validations/bsc";
import { stringArraySchema, StringArraySchema } from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

interface FormKpisPerformanceObjectivesProps {
	form: UseFormReturn<PerformanceObjectiveSchema>;
}

export default function FormKpisPerformanceObjectives({ form }: FormKpisPerformanceObjectivesProps) {
	const form2 = useForm<StringArraySchema>({
		resolver: zodResolver(stringArraySchema),
		defaultValues: {
			value: ""
		}
	});

	const { append, fields, remove, update } = useFieldArray({
		control: form.control,
		name: "kpis"
	});
	const watchedValues = form.watch("kpis");
	const addValue = (input: StringArraySchema) => {
		append(input);
		form2.reset();
	};
	return (
		<div className={cn(!!watchedValues.length && "border")}>
			<FormField
				control={form.control}
				name="kpis"
				render={() => (
					<FormItem className={cn(!!watchedValues.length && "bg-muted p-1")}>
						<FormLabel>
							Key Performance Indicators{" "}
							<span className="text-xs text-muted-foreground">({watchedValues?.length})</span>
						</FormLabel>
						<FormField
							control={form2.control}
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="flex items-center gap-0.5">
											<Input
												placeholder="Enter KPI"
												onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), form2.handleSubmit(addValue)())}
												{...field}
											/>
											<Button
												type="button"
												onClick={() => form2.handleSubmit(addValue)()}
												size="icon"
												variant={"outline"}
											>
												<PlusIcon className="h-4 w-4" />
											</Button>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="flex flex-col gap-2 p-1">
				{fields.map((_, index) => (
					<FormField
						key={index}
						control={form.control}
						name={`kpis.${index}`}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex w-fit max-w-sm items-center gap-1.5">
										<Input
											placeholder={`KPI for number ${index + 1}`}
											value={field.value.value}
											onChange={(e) =>
												form.setValue(`kpis.${index}`, {
													value: e.target.value
												})
											}
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="flex-inline h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
											onClick={() => remove(index)}
										>
											<XIcon className="h-3 w-3" />
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				))}
			</div>
		</div>
	);
}
