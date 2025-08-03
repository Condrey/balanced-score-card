import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PerformanceObjectiveSchema } from "@/lib/validations/bsc";
import { stringArraySchema, StringArraySchema } from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

interface FormActionsPerformanceObjectivesProps {
  form: UseFormReturn<PerformanceObjectiveSchema>;
}

export default function FormActionsPerformanceObjectives({
  form,
}: FormActionsPerformanceObjectivesProps) {
  const form2 = useForm<StringArraySchema>({
    resolver: zodResolver(stringArraySchema),
    defaultValues: {
      value: "",
    },
  });

  const { append, fields, remove, update } = useFieldArray({
    control: form.control,
    name: "actions",
  });
  const watchedValues = form.watch("actions");
  const addValue = (input: StringArraySchema) => {
    append(input);
    form2.reset();
  };
  return (
    <div>
      <FormField
        control={form.control}
        name="actions"
        render={() => (
          <FormItem>
            <FormLabel>
              Actions/Activities{" "}
              <span className="text-xs text-muted-foreground">
                ({watchedValues?.length})
              </span>
            </FormLabel>
            <FormField
              control={form2.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center  gap-0.5">
                      <Input
                        placeholder="Enter action"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), form2.handleSubmit(addValue)())
                        }
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

      <ol className="flex flex-col gap-2">
        {fields.map((_, index) => (
          <FormField
            control={form.control}
            name={`actions.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="gap-1 w-fit max-w-sm ">
                    <Input
                      placeholder={`Action for action ${index + 1}`}
                      value={field.value.value}
                      onChange={(e) => update(index, { value: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 flex-inline p-0 hover:bg-destructive hover:text-destructive-foreground"
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
      </ol>
    </div>
  );
}
