"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PERSPECTIVE_ALLOCATIONS } from "@/lib/bsc-calculations";
import type { BSCFormData } from "@/lib/validations/bsc";

interface BSCPreviewProps {
  data: Partial<BSCFormData>;
}

export function BSCPreview({ data }: BSCPreviewProps) {
  if (!data.supervisee?.name && !data.supervisor?.name) {
    return (
      <Card>
        <CardHeader className="bg-secondary mb-2">
          <CardTitle className="text-lg">BSC Preview</CardTitle>
          <CardDescription>Complete the form to see a preview</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Start filling out the form to see a preview of your BSC.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">BSC Preview</CardTitle>
        <CardDescription>Current form data summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.supervisee?.name && (
          <div>
            <h4 className="font-medium text-sm mb-2">Supervisee</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {data.supervisee.name}
              </p>
              <p>
                <span className="font-medium">Job Title:</span>{" "}
                {data.supervisee.jobTitle}
              </p>
              <p>
                <span className="font-medium">Employee #:</span>{" "}
                {data.supervisee.employeeNumber}
              </p>
            </div>
          </div>
        )}

        {data.supervisor?.name && (
          <div>
            <h4 className="font-medium text-sm mb-2">Supervisor</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {data.supervisor.name}
              </p>
              <p>
                <span className="font-medium">Job Title:</span>{" "}
                {data.supervisor.jobTitle}
              </p>
            </div>
          </div>
        )}

        {data.year && (
          <div>
            <h4 className="font-medium text-sm mb-2">Review Year</h4>
            <Badge variant="outline">{data.year}</Badge>
          </div>
        )}

        <Separator />

        {data.strategicElements?.mandate && (
          <div>
            <h4 className="font-medium text-sm mb-2">Strategic Elements</h4>
            <div className="text-xs space-y-2">
              <p>
                <span className="font-medium">Vision:</span>{" "}
                {data.strategicElements.vision?.substring(0, 100)}...
              </p>
              <p>
                <span className="font-medium">Mission:</span>{" "}
                {data.strategicElements.mission?.substring(0, 100)}...
              </p>
            </div>
          </div>
        )}

        {data.performanceObjectives &&
          data.performanceObjectives.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">
                Performance Objectives
              </h4>
              <div className="space-y-2">
                {data.performanceObjectives.map((obj, index) => (
                  <div key={index} className="text-xs p-2 bg-muted rounded">
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant="outline" className="text-xs">
                        {
                          PERSPECTIVE_ALLOCATIONS[
                            obj.perspective as keyof typeof PERSPECTIVE_ALLOCATIONS
                          ]?.label
                        }
                      </Badge>
                      <span className="font-medium">{obj.percentage}%</span>
                    </div>
                    <p className="truncate">{obj.objective}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        {data.behavioralAttributes && data.behavioralAttributes.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Behavioral Attributes</h4>
            <div className="space-y-1">
              {data.behavioralAttributes.map((attr, index) => (
                <div key={index} className="text-xs flex justify-between">
                  <span className="truncate">{attr.attribute}</span>
                  <span className="font-medium">{attr.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
