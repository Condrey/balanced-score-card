"use client"

import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BSCFormData } from "@/lib/validations/bsc"

interface ParticularsSectionProps {
  form: UseFormReturn<BSCFormData>
}

export function ParticularsSection({ form }: ParticularsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="year">Year of Planning and Review</Label>
          <Input id="year" type="number" min="2020" max="2050" {...form.register("year", { valueAsNumber: true })} />
          {form.formState.errors.year && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.year.message}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supervisee Particulars</CardTitle>
            <CardDescription>Details of the employee being appraised</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="supervisee.employeeNumber">Employee Number</Label>
              <Input
                id="supervisee.employeeNumber"
                {...form.register("supervisee.employeeNumber")}
                placeholder="Enter employee number"
              />
              {form.formState.errors.supervisee?.employeeNumber && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.supervisee.employeeNumber.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="supervisee.name">Full Name</Label>
              <Input id="supervisee.name" {...form.register("supervisee.name")} placeholder="Enter full name" />
              {form.formState.errors.supervisee?.name && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.supervisee.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="supervisee.jobTitle">Job Title</Label>
              <Input id="supervisee.jobTitle" {...form.register("supervisee.jobTitle")} placeholder="Enter job title" />
              {form.formState.errors.supervisee?.jobTitle && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.supervisee.jobTitle.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="supervisee.salaryScale">Salary Scale</Label>
              <Input
                id="supervisee.salaryScale"
                {...form.register("supervisee.salaryScale")}
                placeholder="Enter salary scale"
              />
              {form.formState.errors.supervisee?.salaryScale && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.supervisee.salaryScale.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supervisor Particulars</CardTitle>
            <CardDescription>Details of the supervising officer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="supervisor.employeeNumber">Employee Number</Label>
              <Input
                id="supervisor.employeeNumber"
                {...form.register("supervisor.employeeNumber")}
                placeholder="Enter employee number"
              />
              {form.formState.errors.supervisor?.employeeNumber && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.supervisor.employeeNumber.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="supervisor.name">Full Name</Label>
              <Input id="supervisor.name" {...form.register("supervisor.name")} placeholder="Enter full name" />
              {form.formState.errors.supervisor?.name && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.supervisor.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="supervisor.jobTitle">Job Title</Label>
              <Input id="supervisor.jobTitle" {...form.register("supervisor.jobTitle")} placeholder="Enter job title" />
              {form.formState.errors.supervisor?.jobTitle && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.supervisor.jobTitle.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="supervisor.salaryScale">Salary Scale</Label>
              <Input
                id="supervisor.salaryScale"
                {...form.register("supervisor.salaryScale")}
                placeholder="Enter salary scale"
              />
              {form.formState.errors.supervisor?.salaryScale && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.supervisor.salaryScale.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
