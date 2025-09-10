import { NumberInput } from "@/components/number-input/number-input";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CoreValuesSchema, stringScoreSchema, StringScoreSchema } from "@/lib/validations/bsc";
import { zodResolver } from "@hookform/resolvers/zod";
import cuid from "cuid";
import { PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

interface FormCoreValuesProps {
	form: UseFormReturn<CoreValuesSchema>;
}

export default function FormCoreValues({ form }: FormCoreValuesProps) {
	const form2 = useForm<StringScoreSchema>({
		resolver: zodResolver(stringScoreSchema),
		defaultValues: {
			id: "",
			value: "",
			score: undefined
		}
	});

	const { append, fields, remove } = useFieldArray({
		control: form.control,
		name: "values"
	});
	const watchedValues = form.watch("values");
	const addValue = (input: StringScoreSchema) => {
		append({ ...input, id: cuid() });
		form2.reset();
	};
	return (
		<>
			<FormField
				control={form.control}
				name="values"
				render={() => (
					<FormItem>
						<FormLabel>
							Core Values <span className="text-xs text-muted-foreground">({watchedValues?.length})</span>
						</FormLabel>
						<Form {...form2}>
							{/* <pre>{JSON.stringify(form2.formState.errors, null, 2)}</pre> */}
							<div className="flex items-center gap-2">
								<FormField
									control={form2.control}
									name="value"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input placeholder="Enter core value" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form2.control}
									name="score"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<NumberInput
													max={20}
													placeholder="Enter score"
													onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), form2.handleSubmit(addValue)())}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="button" onClick={() => form2.handleSubmit(addValue)()} size="icon" variant={"outline"}>
									<PlusIcon className="h-4 w-4" />
								</Button>
							</div>
						</Form>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="flex flex-wrap gap-2">
				{fields.map((field, index) => (
					<span key={field.id} className={cn("w-fit max-w-sm gap-1", badgeVariants({ variant: "secondary" }))}>
						<span className="line-clamp-1 text-ellipsis">
							{form.watch(`values.${index}.value`)} ({form.watch(`values.${index}.score`)}%)
						</span>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="flex-inline h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
							onClick={() => remove(index)}
						>
							<XIcon className="h-3 w-3" />
						</Button>
					</span>
				))}
			</div>
		</>
	);
}
