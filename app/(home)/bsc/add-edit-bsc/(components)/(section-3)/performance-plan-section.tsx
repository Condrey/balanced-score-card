"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingButton from "@/components/ui/loading-button";
import { PERSPECTIVE_ALLOCATIONS } from "@/lib/bsc-calculations";
import kyInstance from "@/lib/ky";
import type {
  BSCFormData,
  PerformanceObjectiveArraySchema,
} from "@/lib/validations/bsc";
import { OrganizationContextPropsSchema } from "@/lib/validations/others";
import { useQuery } from "@tanstack/react-query";
import { StarsIcon } from "lucide-react";
import { useEffect } from "react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import FormPerformanceObjectives from "./form-performance-objective";

interface PerformancePlanSectionProps {
  form: UseFormReturn<BSCFormData>;
}

export function PerformancePlanSection({ form }: PerformancePlanSectionProps) {
  const organizationId = form.watch("organizationId")!;
  const financialYear = form.watch("year");
  const position = form.watch("supervisee.id")!;
  const superviseeId = form.watch("supervisee.id");

  const query = useQuery({
    queryKey: ["performanceObjectives", superviseeId],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    queryFn: async () =>
      kyInstance
        .post("/api/form/user-performance-objectives", {
          json: {
            financialYear,
            organizationId,
            position,
          } satisfies OrganizationContextPropsSchema,
        })
        .json<PerformanceObjectiveArraySchema>(),
  });
  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "performanceObjectives",
  });

  const getPerspectiveUsage = () => {
    const usage: Record<string, number> = {};
    fields.forEach((field, index) => {
      const perspective = form.watch(
        `performanceObjectives.${index}.perspective`,
      );
      const percentage =
        form.watch(`performanceObjectives.${index}.percentage`) || 0;
      usage[perspective] = (usage[perspective] || 0) + percentage;
    });
    return usage;
  };

  const perspectiveUsage = getPerspectiveUsage();
  const watchedValues = form.watch("performanceObjectives");

  const { data, isError, isPending, isFetching, isSuccess, error } = query;
  useEffect(() => {
    if (isSuccess && data) {
      form.setValue("performanceObjectives", data.performanceObjectives);
    }
  }, [isSuccess, data, form]);
  if (isError) {
    console.error(error);
  }
  async function getAiPerformanceObjectives() {
    await query.refetch();
  }
  return (
    <div className="space-y-6">
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Performance Objectives Overview</CardTitle>
          <CardDescription>
            Track percentage allocation across perspectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
            {Object.entries(PERSPECTIVE_ALLOCATIONS).map(
              ([key, { label, percentage }]) => {
                const used = perspectiveUsage[key] || 0;
                const isComplete = Math.abs(used - percentage) < 0.01;
                const isOver = used > percentage;

                return (
                  <div
                    key={key}
                    className="flex flex-col justify-between rounded-lg border border-dashed bg-card p-3 text-center"
                  >
                    <div className="line-clamp-2 text-ellipsis text-sm font-medium">
                      {label}
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        isComplete
                          ? "text-green-600"
                          : isOver
                            ? "text-red-600"
                            : "text-orange-600"
                      }`}
                    >
                      {used.toFixed(1)}% / {percentage}%
                    </div>
                    <Badge
                      variant={
                        isComplete
                          ? "default"
                          : isOver
                            ? "destructive"
                            : "secondary"
                      }
                      className="items-center place-self-center text-xs"
                    >
                      {isComplete ? "Complete" : isOver ? "Over" : "Incomplete"}
                    </Badge>
                  </div>
                );
              },
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="mb-2 flex flex-row items-center justify-between gap-2 bg-secondary">
          <div>
            <CardTitle>Add Performance Objective</CardTitle>
            <CardDescription>
              Define objectives, actions, and KPIs for each perspective
            </CardDescription>
          </div>
          <LoadingButton
            loading={isFetching}
            type="button"
            title="Use Ai to create your performance objectives"
            onClick={getAiPerformanceObjectives}
            variant={"outline"}
            size={"icon"}
          >
            <StarsIcon className="" />
            <span className="sr-only">
              Use Ai to create your performance objectives
            </span>
          </LoadingButton>
        </CardHeader>
        <CardContent>
          <FormPerformanceObjectives
            form={form}
            isError={isError}
            isPending={isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
