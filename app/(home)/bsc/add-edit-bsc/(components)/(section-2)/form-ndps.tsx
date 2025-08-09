import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import kyInstance from "@/lib/ky";
import { cn } from "@/lib/utils";
import { BSCFormData } from "@/lib/validations/bsc";
import { OrganizationContextPropsSchema, organizationContextPropsSchema, stringArraySchema, StringArraySchema } from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, StarsIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import z from "zod";

interface FormNdpsProps {
  form: UseFormReturn<BSCFormData>;
}

export default function FormNdps({ form }: FormNdpsProps) {
  const organizationId = form.watch("organizationId")!;
  const financialYear = form.watch("year");
  const position = form.watch("supervisee.jobTitle");
  const outputSchema = z.array(stringArraySchema);
  type OutputSchema = z.infer<typeof outputSchema>;
  const superviseeId = form.watch("supervisee.id");

  const query = useQuery({
    queryKey: ["userNdps", superviseeId],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    queryFn: async () =>
      kyInstance
        .post("/api/form/user-ndps", {
          json: { organizationId, financialYear, position }  satisfies OrganizationContextPropsSchema,
        })
        .json<OutputSchema>(),
  });
  const form2 = useForm<StringArraySchema>({
    resolver: zodResolver(stringArraySchema),
    values: {
      id: "",
      value: "",
    },
  });

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "strategicElements.ndpProgrammes",
  });
  const watchedValues = form.watch("strategicElements.ndpProgrammes");
  const addValue = (input: StringArraySchema) => {
    append(input);
    form2.reset();
  };
  const { data, isError, isFetching, isSuccess, error, isPending } = query;
  useEffect(() => {
    if (isSuccess && data) {
      form.setValue("strategicElements.ndpProgrammes", data);
    }
  }, [isSuccess, data, form]);
  if (isError) {
    console.error(error);
  }
  async function getAiUserNdps() {
    await query.refetch();
  }
  return (
    <>
      <FormField
        control={form.control}
        name="strategicElements.ndpProgrammes"
        render={() => (
          <FormItem>
            <FormLabel className="flex gap-2 items-center justify-between">
              <span>
                NDP programmes{" "}
                <span className="text-xs text-muted-foreground">
                  ({watchedValues?.length})
                </span>
              </span>
              <LoadingButton
                loading={isFetching}
                type="button"
                title="Let Ai get Ndp Programmes for you"
                onClick={getAiUserNdps}
                variant={"ghost"}
                size={"icon"}
              >
                <StarsIcon />
                <span className="sr-only">
                  Let Ai get Ndp Programmes for you
                </span>
              </LoadingButton>
            </FormLabel>
            <Form {...form2}>
              <FormField
                control={form2.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center  gap-2">
                        <Input
                          placeholder="Enter NDP programme"
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
                    {isPending && (
                      <FormDescription>
                        Ai is getting your NDP programmes...
                      </FormDescription>
                    )}
                    <FormMessage>
                      {isError &&
                        !form.watch("strategicElements.ndpProgrammes").length &&
                        "Ai encountered an error while abstracting your strategic objectives."}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </Form>
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
              badgeVariants({ variant: "secondary" })
            )}
          >
            <span className="text-ellipsis line-clamp-1">
              {form.watch(`strategicElements.ndpProgrammes.${index}.value`)}
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
