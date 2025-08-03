"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { BSCFormData } from "@/lib/validations/bsc";
import { type UseFormReturn } from "react-hook-form";
import FormNdps from "./form-ndps";
import FormStrategicObjectives from "./form-strategic-objectives";

interface StrategicElementsSectionProps {
  form: UseFormReturn<BSCFormData>;
}

export function StrategicElementsSection({
  form,
}: StrategicElementsSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organizational Context</CardTitle>
          <CardDescription>
            Define the strategic foundation of your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="strategicElements.mandate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mandate</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter organizational mandate"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="strategicElements.vision"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vision</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter vision statement"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="strategicElements.mission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mission</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter mission statement"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="strategicElements.goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter primary organizational goal"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="strategicElements.departmentalMandate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departmental Mandate</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter departmental mandate"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>National Development Plan (NDP) Programmes</CardTitle>
          <CardDescription>
            Add programmes that your organization contributes to
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormNdps form={form} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strategic Objectives</CardTitle>
          <CardDescription>
            Define key strategic objectives to be achieved
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormStrategicObjectives form={form} />
        </CardContent>
      </Card>
    </div>
  );
}
