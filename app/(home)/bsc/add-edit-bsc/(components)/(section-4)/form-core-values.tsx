import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  BSCFormData,
  stringScoreSchema,
  StringScoreSchema,
} from "@/lib/validations/bsc";
import { zodResolver } from "@hookform/resolvers/zod";
import cuid from "cuid";
import { PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

interface FormCoreValuesProps {
  form: UseFormReturn<BSCFormData>;
}

export default function FormCoreValues({ form }: FormCoreValuesProps) {
  const form2 = useForm<StringScoreSchema>({
    resolver: zodResolver(stringScoreSchema),
    defaultValues: {
      id: "",
      score: undefined,
      value: "",
    },
  });

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "coreValues.values",
  });
  const watchedValues = form.watch("coreValues.values");
  const addValue = (input: StringScoreSchema) => {
    append({ ...input, id: cuid() });
    form2.reset();
  };
  return (
    <>
      <FormField
        control={form.control}
        name="coreValues.values"
        render={() => (
          <FormItem>
            <FormLabel>
              Core Values{" "}
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
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enter core value"
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

      <div className="flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <span
            key={field.id}
            className={cn(
              "w-fit max-w-sm gap-1",
              badgeVariants({ variant: "secondary" }),
            )}
          >
            <span className="line-clamp-1 text-ellipsis">
              {form.watch(`coreValues.values.${index}.value`)}
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
