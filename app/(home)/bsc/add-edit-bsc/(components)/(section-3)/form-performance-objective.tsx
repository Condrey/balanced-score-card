import { NumberInput } from "@/components/number-input/number-input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PERSPECTIVE_ALLOCATIONS } from "@/lib/bsc-calculations";
import { cn } from "@/lib/utils";
import {
  BSCFormData,
  performanceObjectiveSchema,
  PerformanceObjectiveSchema,
} from "@/lib/validations/bsc";
import { zodResolver } from "@hookform/resolvers/zod";
import { PerspectiveType } from "@prisma/client";
import cuid from "cuid";
import { PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import FormActionsPerformanceObjectives from "./form-actions-performance-objectives";
import FormExpectedResultsPerformanceObjectives from "./form-expected-results-performance-objectives";
import FormKpisPerformanceObjectives from "./form-kpis-performance-objectives";

interface FormPerformanceObjectivesProps {
  form: UseFormReturn<BSCFormData>;
  isPending: boolean;
  isError: boolean;
}

export default function FormPerformanceObjectives({
  form,
  isPending,
  isError,
}: FormPerformanceObjectivesProps) {
  const form2 = useForm<PerformanceObjectiveSchema>({
    resolver: zodResolver(performanceObjectiveSchema),
    defaultValues: {
      actions: [],
      comments: "",
      expectedResults: [],
      perspective: PerspectiveType.STAKEHOLDERS_CLIENTS,
      id: "",
      kpis: [],
      objective: "",
      percentage: undefined,
      score: undefined,
    },
  });

  const { append, fields, remove, update } = useFieldArray({
    control: form.control,
    name: "performanceObjectives",
  });
  const watchedValues = form.watch("performanceObjectives");

  const addValue = (input: PerformanceObjectiveSchema) => {
    append({ ...input, id: cuid() });
    form2.reset();
  };
  return (
    <Form {...form2}>
      <FormField
        control={form.control}
        name="performanceObjectives"
        render={() => (
          <FormItem>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form2.control}
                  name="perspective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perspective</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select perspective" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(PERSPECTIVE_ALLOCATIONS).map(
                            ([key, { label }]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form2.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentage</FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="enter percentage"
                          min="0"
                          max="100"
                          step="0.1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form2.control}
                name="objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objective</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        placeholder="enter performance objective"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 *:flex-1 md:grid-cols-3">
                <FormActionsPerformanceObjectives form={form2} />
                <FormExpectedResultsPerformanceObjectives form={form2} />
                <FormKpisPerformanceObjectives form={form2} />
              </div>

              <div className="grid gap-4 *:flex-1 md:grid-cols-2">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form2.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Comments on actual performance"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                Add Performance Objective
              </Button>
              <Card className="bg-sidebar">
                <CardHeader>
                  <CardDescription>
                    {watchedValues.length} objective(s) available
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-wrap gap-2">
                  {watchedValues.map((wv, index) => (
                    <HoverCard key={index}>
                      <HoverCardTrigger
                        className={cn(
                          "text-sm",
                          buttonVariants({ size: "sm", variant: "secondary" }),
                        )}
                      >
                        {index + 1}. {wv.perspective}
                      </HoverCardTrigger>
                      <HoverCardContent>
                        {/* header */}
                        <div className="flex w-full justify-end">
                          <Button
                            type="button"
                            variant={"destructive"}
                            size={"icon"}
                            className="size-4 p-0"
                            title="Delete this objective"
                            onClick={() => remove(index)}
                          >
                            <XIcon />
                            <span className="sr-only">
                              Delete this objective
                            </span>
                          </Button>
                        </div>
                        {[
                          {
                            title: "Performance Objective",
                            content: wv.objective,
                          },
                          {
                            title: "Actions/ Activities",
                            content: wv.actions
                              .map((a) => `- ${a.value}`)
                              .join(",\n"),
                          },
                          {
                            title: "Expected results",
                            content: wv.expectedResults
                              .map((a) => `- ${a.value}`)
                              .join(",\n"),
                          },
                          {
                            title: "Key Performance Indicators",
                            content: wv.kpis
                              .map((a) => `- ${a.value}`)
                              .join(",\n"),
                          },
                        ].map((obj, index) => (
                          <div key={index}>
                            <span className="text-sm font-semibold">
                              {obj.title}
                            </span>
                            <p className="whitespace-pre-line text-xs text-muted-foreground">
                              {obj.content}
                            </p>
                          </div>
                        ))}
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </CardFooter>
              </Card>
            </div>
            {isPending && (
              <FormDescription>
                Ai is helping with your performance objectives...
              </FormDescription>
            )}
            <FormMessage>
              {isError &&
                !form.watch("performanceObjectives").length &&
                "Ai could not help with your performance objectives."}
            </FormMessage>{" "}
          </FormItem>
        )}
      />
    </Form>
  );
}
