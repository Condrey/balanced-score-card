import { Badge, badgeVariants } from "@/components/ui/badge";
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
  NdpSchema,
  stringArraySchema,
  StringArraySchema,
} from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

interface FormProgrammesProps {
  form: UseFormReturn<NdpSchema>;
}

export default function FormProgrammes({ form }: FormProgrammesProps) {
  const form2 = useForm<StringArraySchema>({
    resolver: zodResolver(stringArraySchema),
    defaultValues: {
      value: "",
    },
  });

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "programmes",
  });
  const addValue = (input: StringArraySchema) => {
    append(input);
    form2.reset();
  };
  return (
    <>
      <FormField
        control={form.control}
        name="programmes"
        render={() => (
          <FormItem>
            <FormLabel>
              Programmes{" "}
              <span className="text-xs text-muted-foreground">
                ({form.watch("programmes")?.length})
              </span>
            </FormLabel>
            <FormField
              control={form2.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center  gap-2">
                      <Input
                        placeholder="Enter a programme from the NDP"
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
                  </FormControl>            <FormMessage />

                </FormItem>
              )}
            />

            <FormMessage />
          </FormItem>
        )}
      />

      <ol className="flex flex-col gap-2 list-decimal list-inside">
        {fields.map((field, index) => (
          <li
            key={field.id}
            className={cn(
              "gap-1 w-fit max-w-sm ",
              badgeVariants({ variant: "secondary" }),
            )}
          >
            <span className="text-ellipsis line-clamp-1">
              {form.watch(`programmes.${index}.value`)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 flex-inline p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => remove(index)}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </li>
        ))}
      </ol>
    </>
  );
}
