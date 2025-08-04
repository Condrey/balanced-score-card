"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingButton from "@/components/ui/loading-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PERSPECTIVE_ALLOCATIONS } from "@/lib/bsc-calculations";
import kyInstance from "@/lib/ky";
import type {
  BSCFormData,
  PerformanceObjectiveSchema,
} from "@/lib/validations/bsc";
import { useQuery } from "@tanstack/react-query";
import { StarsIcon, X } from "lucide-react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import FormPerformanceObjectives from "./form-performance-objective";

interface PerformancePlanSectionProps {
  form: UseFormReturn<BSCFormData>;
}

export function PerformancePlanSection({ form }: PerformancePlanSectionProps) {
  const query = useQuery({
    queryKey: ["performanceObjectives", form.getValues("supervisee.id")],
    refetchOnWindowFocus: false,
    queryFn: async () =>
      kyInstance
        .get("/api/form/user-performance-objectives", {
          json: form.watch(),
        })
        .json<PerformanceObjectiveSchema[]>(),
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
  const { data, isError, isPending, isSuccess, error } = query;
  if (isSuccess) {
    form.setValue("performanceObjectives", data);
  }
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 ">
            {Object.entries(PERSPECTIVE_ALLOCATIONS).map(
              ([key, { label, percentage }]) => {
                const used = perspectiveUsage[key] || 0;
                const isComplete = Math.abs(used - percentage) < 0.01;
                const isOver = used > percentage;

                return (
                  <div
                    key={key}
                    className="text-center p-3 border border-dashed bg-card flex flex-col justify-between rounded-lg"
                  >
                    <div className="text-sm font-medium line-clamp-2 text-ellipsis">
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
                      className="text-xs place-self-center items-center"
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
        <CardHeader className="bg-secondary mb-2 flex justify-between flex-row items-center gap-2 ">
          <div>
            <CardTitle>Add Performance Objective</CardTitle>
            <CardDescription>
              Define objectives, actions, and KPIs for each perspective
            </CardDescription>
          </div>
          <LoadingButton
            loading={isPending}
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

      {fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Objectives Summary</CardTitle>
            <CardDescription>
              Review and manage all performance objectives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Perspective</TableHead>
                    <TableHead>Objective</TableHead>
                    <TableHead>%</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    const perspective = form.watch(
                      `performanceObjectives.${index}.perspective`,
                    );
                    const objective = form.watch(
                      `performanceObjectives.${index}.objective`,
                    );
                    const percentage = form.watch(
                      `performanceObjectives.${index}.percentage`,
                    );
                    const score = form.watch(
                      `performanceObjectives.${index}.score`,
                    );

                    return (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Badge variant="outline">
                            {PERSPECTIVE_ALLOCATIONS[
                              perspective as keyof typeof PERSPECTIVE_ALLOCATIONS
                            ]?.label || perspective}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {objective}
                        </TableCell>
                        <TableCell>{percentage}%</TableCell>
                        <TableCell>{score}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
