"use client"

import { useState } from "react"
import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, X } from "lucide-react"
import type { BSCFormData } from "@/lib/validations/bsc"
import { PERSPECTIVE_ALLOCATIONS } from "@/lib/bsc-calculations"

interface PerformancePlanSectionProps {
  form: UseFormReturn<BSCFormData>
}

export function PerformancePlanSection({ form }: PerformancePlanSectionProps) {
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "performanceObjectives",
  })

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newObjective, setNewObjective] = useState({
    perspective: "",
    objective: "",
    percentage: 0,
    actions: [""],
    expectedResults: [""],
    kpis: [""],
    score: 0,
    comments: "",
  })

  const addObjective = () => {
    if (newObjective.perspective && newObjective.objective) {
      append({
        ...newObjective,
        perspective: newObjective.perspective as any,
        actions: newObjective.actions.filter((a) => a.trim()),
        expectedResults: newObjective.expectedResults.filter((r) => r.trim()),
        kpis: newObjective.kpis.filter((k) => k.trim()),
      })
      setNewObjective({
        perspective: "",
        objective: "",
        percentage: 0,
        actions: [""],
        expectedResults: [""],
        kpis: [""],
        score: 0,
        comments: "",
      })
    }
  }

  const updateArrayField = (field: "actions" | "expectedResults" | "kpis", index: number, value: string) => {
    const newArray = [...newObjective[field]]
    newArray[index] = value
    setNewObjective((prev) => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: "actions" | "expectedResults" | "kpis") => {
    setNewObjective((prev) => ({ ...prev, [field]: [...prev[field], ""] }))
  }

  const removeArrayItem = (field: "actions" | "expectedResults" | "kpis", index: number) => {
    const newArray = newObjective[field].filter((_, i) => i !== index)
    setNewObjective((prev) => ({ ...prev, [field]: newArray }))
  }

  const getPerspectiveUsage = () => {
    const usage: Record<string, number> = {}
    fields.forEach((field, index) => {
      const perspective = form.watch(`performanceObjectives.${index}.perspective`)
      const percentage = form.watch(`performanceObjectives.${index}.percentage`) || 0
      usage[perspective] = (usage[perspective] || 0) + percentage
    })
    return usage
  }

  const perspectiveUsage = getPerspectiveUsage()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Objectives Overview</CardTitle>
          <CardDescription>Track percentage allocation across perspectives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(PERSPECTIVE_ALLOCATIONS).map(([key, { label, percentage }]) => {
              const used = perspectiveUsage[key] || 0
              const isComplete = Math.abs(used - percentage) < 0.01
              const isOver = used > percentage

              return (
                <div key={key} className="text-center p-3 border rounded-lg">
                  <div className="text-sm font-medium">{label}</div>
                  <div
                    className={`text-lg font-bold ${
                      isComplete ? "text-green-600" : isOver ? "text-red-600" : "text-orange-600"
                    }`}
                  >
                    {used.toFixed(1)}% / {percentage}%
                  </div>
                  <Badge variant={isComplete ? "default" : isOver ? "destructive" : "secondary"} className="text-xs">
                    {isComplete ? "Complete" : isOver ? "Over" : "Incomplete"}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Performance Objective</CardTitle>
          <CardDescription>Define objectives, actions, and KPIs for each perspective</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Perspective</Label>
              <Select
                value={newObjective.perspective}
                onValueChange={(value) => setNewObjective((prev) => ({ ...prev, perspective: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select perspective" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PERSPECTIVE_ALLOCATIONS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Percentage</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={newObjective.percentage}
                onChange={(e) =>
                  setNewObjective((prev) => ({ ...prev, percentage: Number.parseFloat(e.target.value) || 0 }))
                }
                placeholder="Enter percentage"
              />
            </div>
          </div>

          <div>
            <Label>Objective</Label>
            <Textarea
              value={newObjective.objective}
              onChange={(e) => setNewObjective((prev) => ({ ...prev, objective: e.target.value }))}
              placeholder="Enter performance objective"
              rows={2}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Actions/Activities</Label>
              {newObjective.actions.map((action, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={action}
                    onChange={(e) => updateArrayField("actions", index, e.target.value)}
                    placeholder="Enter action"
                  />
                  {newObjective.actions.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("actions", index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("actions")}>
                <Plus className="h-4 w-4 mr-1" /> Add Action
              </Button>
            </div>

            <div>
              <Label>Expected Results</Label>
              {newObjective.expectedResults.map((result, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={result}
                    onChange={(e) => updateArrayField("expectedResults", index, e.target.value)}
                    placeholder="Enter expected result"
                  />
                  {newObjective.expectedResults.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("expectedResults", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("expectedResults")}>
                <Plus className="h-4 w-4 mr-1" /> Add Result
              </Button>
            </div>

            <div>
              <Label>Key Performance Indicators</Label>
              {newObjective.kpis.map((kpi, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={kpi}
                    onChange={(e) => updateArrayField("kpis", index, e.target.value)}
                    placeholder="Enter KPI"
                  />
                  {newObjective.kpis.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("kpis", index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("kpis")}>
                <Plus className="h-4 w-4 mr-1" /> Add KPI
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Score (0-100)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={newObjective.score}
                onChange={(e) =>
                  setNewObjective((prev) => ({ ...prev, score: Number.parseFloat(e.target.value) || 0 }))
                }
                placeholder="Enter score"
              />
            </div>

            <div>
              <Label>Comments</Label>
              <Textarea
                value={newObjective.comments}
                onChange={(e) => setNewObjective((prev) => ({ ...prev, comments: e.target.value }))}
                placeholder="Comments on actual performance"
                rows={2}
              />
            </div>
          </div>

          <Button type="button" onClick={addObjective} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Performance Objective
          </Button>
        </CardContent>
      </Card>

      {fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Objectives Summary</CardTitle>
            <CardDescription>Review and manage all performance objectives</CardDescription>
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
                    const perspective = form.watch(`performanceObjectives.${index}.perspective`)
                    const objective = form.watch(`performanceObjectives.${index}.objective`)
                    const percentage = form.watch(`performanceObjectives.${index}.percentage`)
                    const score = form.watch(`performanceObjectives.${index}.score`)

                    return (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Badge variant="outline">
                            {PERSPECTIVE_ALLOCATIONS[perspective as keyof typeof PERSPECTIVE_ALLOCATIONS]?.label ||
                              perspective}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{objective}</TableCell>
                        <TableCell>{percentage}%</TableCell>
                        <TableCell>{score}</TableCell>
                        <TableCell>
                          <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
