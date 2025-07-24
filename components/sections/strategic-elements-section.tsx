"use client"

import { useState } from "react"
import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import type { BSCFormData } from "@/lib/validations/bsc"

interface StrategicElementsSectionProps {
  form: UseFormReturn<BSCFormData>
}

export function StrategicElementsSection({ form }: StrategicElementsSectionProps) {
  const [newNdpProgramme, setNewNdpProgramme] = useState("")
  const [newObjective, setNewObjective] = useState("")

  const {
    fields: ndpFields,
    append: appendNdp,
    remove: removeNdp,
  } = useFieldArray({
    control: form.control,
    name: "strategicElements.ndpProgrammes",
  })

  const {
    fields: objectiveFields,
    append: appendObjective,
    remove: removeObjective,
  } = useFieldArray({
    control: form.control,
    name: "strategicElements.strategicObjectives",
  })

  const addNdpProgramme = () => {
    if (newNdpProgramme.trim()) {
      appendNdp(newNdpProgramme.trim())
      setNewNdpProgramme("")
    }
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      appendObjective(newObjective.trim())
      setNewObjective("")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organizational Context</CardTitle>
          <CardDescription>Define the strategic foundation of your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mandate">Mandate</Label>
            <Textarea
              id="mandate"
              {...form.register("strategicElements.mandate")}
              placeholder="Enter organizational mandate"
              rows={3}
            />
            {form.formState.errors.strategicElements?.mandate && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.strategicElements.mandate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="vision">Vision</Label>
            <Textarea
              id="vision"
              {...form.register("strategicElements.vision")}
              placeholder="Enter vision statement"
              rows={3}
            />
            {form.formState.errors.strategicElements?.vision && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.strategicElements.vision.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="mission">Mission</Label>
            <Textarea
              id="mission"
              {...form.register("strategicElements.mission")}
              placeholder="Enter mission statement"
              rows={3}
            />
            {form.formState.errors.strategicElements?.mission && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.strategicElements.mission.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="goal">Goal</Label>
            <Textarea
              id="goal"
              {...form.register("strategicElements.goal")}
              placeholder="Enter primary organizational goal"
              rows={2}
            />
            {form.formState.errors.strategicElements?.goal && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.strategicElements.goal.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="departmentalMandate">Departmental Mandate</Label>
            <Textarea
              id="departmentalMandate"
              {...form.register("strategicElements.departmentalMandate")}
              placeholder="Enter departmental mandate"
              rows={3}
            />
            {form.formState.errors.strategicElements?.departmentalMandate && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.strategicElements.departmentalMandate.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>National Development Plan (NDP) Programmes</CardTitle>
          <CardDescription>Add programmes that your organization contributes to</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newNdpProgramme}
              onChange={(e) => setNewNdpProgramme(e.target.value)}
              placeholder="Enter NDP programme"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addNdpProgramme())}
            />
            <Button type="button" onClick={addNdpProgramme} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ndpFields.map((field, index) => (
              <Badge key={field.id} variant="secondary" className="flex items-center gap-1">
                {form.watch(`strategicElements.ndpProgrammes.${index}`)}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeNdp(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          {form.formState.errors.strategicElements?.ndpProgrammes && (
            <p className="text-sm text-destructive">{form.formState.errors.strategicElements.ndpProgrammes.message}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strategic Objectives</CardTitle>
          <CardDescription>Define key strategic objectives to be achieved</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="Enter strategic objective"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
            />
            <Button type="button" onClick={addObjective} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {objectiveFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 p-3 border rounded-lg">
                <span className="flex-1">{form.watch(`strategicElements.strategicObjectives.${index}`)}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeObjective(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {form.formState.errors.strategicElements?.strategicObjectives && (
            <p className="text-sm text-destructive">
              {form.formState.errors.strategicElements.strategicObjectives.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
