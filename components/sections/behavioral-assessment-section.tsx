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

interface BehavioralAssessmentSectionProps {
  form: UseFormReturn<BSCFormData>;
}

export function BehavioralAssessmentSection({
  form,
}: BehavioralAssessmentSectionProps) {
  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({
    control: form.control,
    name: "coreValues.values",
  });

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control: form.control,
    name: "behavioralAttributes",
  });

  const [newValue, setNewValue] = useState("");
  const [newAttribute, setNewAttribute] = useState({
    attribute: "",
    percentage: 0,
    description: "",
    score: 0,
    commentsJustification: "",
  });

  const addValue = () => {
    if (newValue.trim()) {
      appendValue(newValue.trim());
      setNewValue("");
    }
  };

  const addAttribute = () => {
    if (newAttribute.attribute && newAttribute.description) {
      appendAttribute(newAttribute);
      setNewAttribute({
        attribute: "",
        percentage: 0,
        description: "",
        score: 0,
        commentsJustification: "",
      });
    }
  };

  const getTotalBehavioralPercentage = () => {
    return attributeFields.reduce((sum, _, index) => {
      return (
        sum + (form.watch(`behavioralAttributes.${index}.percentage`) || 0)
      );
    }, 0);
  };

  const totalPercentage = getTotalBehavioralPercentage();
  const isPercentageValid = Math.abs(totalPercentage - 20) < 0.01;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Core Values</CardTitle>
          <CardDescription>
            Define organizational core values and their acronym
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter core value"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addValue())
              }
            />
            <Button type="button" onClick={addValue} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {valueFields.map((field, index) => (
              <Badge
                key={field.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {form.watch(`coreValues.values.${index}`)}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeValue(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          <div>
            <Label htmlFor="coreValues.acronym">Acronym</Label>
            <Input
              id="coreValues.acronym"
              {...form.register("coreValues.acronym")}
              placeholder="Enter acronym for core values"
            />
            {form.formState.errors.coreValues?.acronym && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.coreValues.acronym.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Behavioral Attributes Assessment</CardTitle>
          <CardDescription>
            Total allocation must equal 20%
            <Badge
              variant={isPercentageValid ? "default" : "destructive"}
              className="ml-2"
            >
              Current: {totalPercentage.toFixed(1)}% / 20%
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Behavioral Attribute</Label>
                <Input
                  value={newAttribute.attribute}
                  onChange={(e) =>
                    setNewAttribute((prev) => ({
                      ...prev,
                      attribute: e.target.value,
                    }))
                  }
                  placeholder="Enter behavioral attribute"
                />
              </div>

              <div>
                <Label>Percentage</Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={newAttribute.percentage}
                  onChange={(e) =>
                    setNewAttribute((prev) => ({
                      ...prev,
                      percentage: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="Enter percentage"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={newAttribute.description}
                onChange={(e) =>
                  setNewAttribute((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the behavioral attribute"
                rows={2}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Score (0-100)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newAttribute.score}
                  onChange={(e) =>
                    setNewAttribute((prev) => ({
                      ...prev,
                      score: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="Enter score"
                />
              </div>

              <div>
                <Label>Comments & Justification</Label>
                <Textarea
                  value={newAttribute.commentsJustification}
                  onChange={(e) =>
                    setNewAttribute((prev) => ({
                      ...prev,
                      commentsJustification: e.target.value,
                    }))
                  }
                  placeholder="Provide comments and justification"
                  rows={2}
                />
              </div>
            </div>

            <Button type="button" onClick={addAttribute} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Behavioral Attribute
            </Button>
          </div>
        </CardContent>
      </Card>

      {attributeFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Behavioral Attributes Summary</CardTitle>
            <CardDescription>
              Review and manage all behavioral attributes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attribute</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>%</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attributeFields.map((field, index) => {
                    const attribute = form.watch(
                      `behavioralAttributes.${index}.attribute`,
                    );
                    const description = form.watch(
                      `behavioralAttributes.${index}.description`,
                    );
                    const percentage = form.watch(
                      `behavioralAttributes.${index}.percentage`,
                    );
                    const score = form.watch(
                      `behavioralAttributes.${index}.score`,
                    );

                    return (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">
                          {attribute}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {description}
                        </TableCell>
                        <TableCell>{percentage}%</TableCell>
                        <TableCell>{score}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttribute(index)}
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

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  Total Behavioral Percentage:
                </span>
                <Badge variant={isPercentageValid ? "default" : "destructive"}>
                  {totalPercentage.toFixed(1)}% / 20%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
