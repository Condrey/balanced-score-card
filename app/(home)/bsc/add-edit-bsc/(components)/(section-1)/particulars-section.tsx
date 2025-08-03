"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { BSCFormData } from "@/lib/validations/bsc";
import type { UseFormReturn } from "react-hook-form";
import FormSupervisorSupervisee from "./form-supervisor-supervisee";

interface ParticularsSectionProps {
  form: UseFormReturn<BSCFormData>;
}

export function ParticularsSection({ form }: ParticularsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year of Planning and Review</FormLabel>
              <FormControl>
                <Input
                  placeholder="Please enter year of planning and review"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormSupervisorSupervisee form={form} />
    </div>
  );
}
