"use client";

import { useState } from "react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, X } from "lucide-react";
import type { BSCFormData } from "@/lib/validations/bsc";
import { PERSPECTIVE_ALLOCATIONS } from "@/lib/bsc-calculations";
import { FormField } from "@/components/ui/form";
import FormPerformanceObjectives from "./form-performance-objective";

interface PerformancePlanSectionProps {
  form: UseFormReturn<BSCFormData>;
}

export function PerformancePlanSection({ form }: PerformancePlanSectionProps) {
  const { fields, append, remove, update } = useFieldArray({
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Objectives Overview</CardTitle>
          <CardDescription>
            Track percentage allocation across perspectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(PERSPECTIVE_ALLOCATIONS).map(
              ([key, { label, percentage }]) => {
                const used = perspectiveUsage[key] || 0;
                const isComplete = Math.abs(used - percentage) < 0.01;
                const isOver = used > percentage;

                return (
                  <div key={key} className="text-center p-3 border rounded-lg">
                    <div className="text-sm font-medium">{label}</div>
                    <div
                      className={`text-lg font-bold ${
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
                      className="text-xs"
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
        <CardHeader>
          <CardTitle>Add Performance Objective</CardTitle>
          <CardDescription>
            Define objectives, actions, and KPIs for each perspective
          </CardDescription>
        </CardHeader>
        <CardContent >
          <FormPerformanceObjectives form={form}/>
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
