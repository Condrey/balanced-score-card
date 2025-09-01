import { NumberInput } from "@/components/number-input/number-input";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  behavioralAttributeSchema,
  BehavioralAttributeSchema,
  BSCFormData,
} from "@/lib/validations/bsc";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronsUpDown, PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

interface AssessmentsProps {
  form: UseFormReturn<BSCFormData>;
}
export default function Assessments({ form }: AssessmentsProps) {
  const form2 = useForm<BehavioralAttributeSchema>({
    resolver: zodResolver(behavioralAttributeSchema),
    defaultValues: {
      id: "",
      attribute: "",
      score: undefined,
      percentage: undefined,
      description: "",
      commentsJustification: "",
    },
  });
  const { append, remove } = useFieldArray({
    control: form.control,
    name: "behavioralAttributes",
  });
  const coreValuesList = form.watch("coreValues.values");
  const watchedValues = form.watch("behavioralAttributes");
  const addValue = (input: BehavioralAttributeSchema) => {
    append(input);
    form2.reset();
  };
  return (
    <Form {...form2}>
      <FormField
        control={form.control}
        name="behavioralAttributes"
        render={({ field }) => (
          <FormItem>
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form2.control}
                  name="attribute"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel>Behavioral Attribute</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              type="button"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? coreValuesList.find(
                                    (d) => d.value === field.value,
                                  )?.value
                                : "Select a behavioral attribute"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search attribute..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty className="flex max-w-[200px] flex-row justify-center text-center text-xs text-muted-foreground">
                                No attribute found. Please add core values to
                                populate!
                              </CommandEmpty>
                              <CommandGroup>
                                {coreValuesList.map((d) => (
                                  <CommandItem
                                    value={d.value}
                                    key={d.value}
                                    onSelect={() => {
                                      form2.setValue("attribute", d.value);
                                    }}
                                  >
                                    {d.value}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto",
                                        d.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form2.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="">Percentage</FormLabel>
                      <FormControl>
                        <NumberInput
                          min="0"
                          max="20"
                          step="0.1"
                          placeholder="Enter percentage"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form2.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the behavioral attribute"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form2.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score (0-100)</FormLabel>
                      <FormControl>
                        <NumberInput
                          min="0"
                          max="100"
                          placeholder="Enter score"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form2.control}
                  name="commentsJustification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments & Justification</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide comments and justification"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                onClick={() => form2.handleSubmit(addValue)()}
                className="w-full"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Behavioral Attribute
              </Button>
              <Card className="bg-sidebar">
                <CardHeader>
                  <CardDescription>
                    {watchedValues.length} attribute(s) available
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  {watchedValues.map((wv, index) => (
                    <div
                      key={index}
                      className={cn(
                        badgeVariants({
                          variant: "secondary",
                          className: "space-x-2",
                        }),
                      )}
                    >
                      {wv.attribute}{" "}
                      <Button
                        type="button"
                        variant={"destructive"}
                        size={"icon"}
                        className="size-4 p-0"
                        title="Delete this attribute"
                        onClick={() => remove(index)}
                      >
                        <XIcon />
                        <span className="sr-only">Delete this attribute</span>
                      </Button>
                    </div>
                  ))}
                </CardFooter>
              </Card>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}
