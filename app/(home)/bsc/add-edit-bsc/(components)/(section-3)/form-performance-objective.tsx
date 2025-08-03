import { NumberInput } from "@/components/number-input/number-input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PERSPECTIVE_ALLOCATIONS } from "@/lib/bsc-calculations";
import {
  BSCFormData,
  performanceObjectiveSchema,
  PerformanceObjectiveSchema,
} from "@/lib/validations/bsc";
import { zodResolver } from "@hookform/resolvers/zod";
import { PerspectiveType } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import FormActionsPerformanceObjectives from "./form-actions-performance-objectives";
import FormExpectedResultsPerformanceObjectives from "./form-expected-results-performance-objectives";
import FormKpisPerformanceObjectives from "./form-kpis-performance-objectives";

interface FormPerformanceObjectivesProps {
  form: UseFormReturn<BSCFormData>;
}

export default function FormPerformanceObjectives({
  form,
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

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "performanceObjectives",
  });
  const watchedValues = form.watch("performanceObjectives");

  const addValue = (input: PerformanceObjectiveSchema) => {
    append(input);
    form2.reset();
  };
  return (
    <>
      <FormField
        control={form.control}
        name="performanceObjectives"
        render={() => (
          <FormItem>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
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
                            )
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

              <div className="grid md:grid-cols-3 *:flex-1 gap-4 ">
                <FormActionsPerformanceObjectives form={form2} />
                <FormExpectedResultsPerformanceObjectives form={form2} />
                <FormKpisPerformanceObjectives form={form2} />
              </div>

              <div className="grid md:grid-cols-2 *:flex-1 gap-4">
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
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                onClick={() => form2.handleSubmit(addValue)()}
                className="w-full"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Performance Objective
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
