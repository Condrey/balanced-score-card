"use client";

import React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Users, Target, BarChart3 } from "lucide-react";

import {  bscSchema, type BSCFormData } from "@/lib/validations/bsc";
import {
  calculateOverallScore,
  calculatePerformanceScore,
  calculateBehavioralScore,
  getPerformanceLevel,
  getPerformanceLevelDescription,
} from "@/lib/bsc-calculations";

import { ParticularsSection } from "./particulars-section";
import { StrategicElementsSection } from "./strategic-elements-section";
import { PerformancePlanSection } from "./performance-plan-section";
import { BehavioralAssessmentSection } from "./behavioral-assessment-section";
import { BSCPreview } from "./bsc-preview";
import { BSCData, OrganizationContextData, OrganizationData, PositionData } from "@/lib/types";
import { Organization } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const steps = [
  {
    id: "particulars",
    title: "Particulars",
    icon: Users,
    description: "Supervisee and Supervisor details",
  },
  {
    id: "strategic",
    title: "Strategic Elements",
    icon: Target,
    description: "Mandate, Vision, Mission & Objectives",
  },
  {
    id: "performance",
    title: "Performance Plan",
    icon: BarChart3,
    description: "Objectives, KPIs & Scoring",
  },
  {
    id: "behavioral",
    title: "Behavioral Assessment",
    icon: FileText,
    description: "Core Values & Attributes",
  },
];

interface BSCFormProps {
  bSC: BSCData | undefined | null;
  organizationContext: OrganizationContextData|null;
  position:PositionData|null;
}
export function BSCForm({ bSC,organizationContext,position }: BSCFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const form = useForm<z.infer<typeof bscSchema>>({
    resolver:zodResolver(bscSchema),

     defaultValues: {
      year: new Date().getFullYear(),
      supervisee: bSC?.supervisee||{
        employeeNumber:'',
        jobTitle: position?.jobTitle||'',
        salaryScale: position?.reportsTo?.salaryScale||'',
        name:''
      },
      supervisor: bSC?.supervisor||{
         employeeNumber:'',
        jobTitle: position?.reportsTo?.jobTitle||'',
        salaryScale: position?.reportsTo?.salaryScale||'',
        name:'',
      },
      strategicElements:  {
        mandate: bSC?.mandate||position?.departmentalMandate ||'',
        vision: bSC?.vision|| organizationContext?.vision||"",
        mission:bSC?.mission||organizationContext?.mission|| "",
        goal: bSC?.goal|| organizationContext?.goal||"",
        ndpProgrammes: bSC?bSC.ndpProgrammes.map(n=>({value:n})): [],
        departmentalMandate: bSC?.departmentalMandate|| "",
        strategicObjectives: bSC?bSC.strategicObjectives.map(s=>({value:s})): [],
      },
      performanceObjectives: bSC?bSC.performanceObjectives.map(p=>({
        ...p,
        score:p.score||0,
        actions:p.actions.map(a=>({value:a})),
        expectedResults:p.expectedResults.map(a=>({value:a})),
        kpis:p.kpis.map(a=>({value:a})),
        comments:p.comments||'',
      })):[],
      coreValues:bSC? {acronym:bSC.coreValues.acronym,values:bSC.coreValues.values.map(v=>({value:v}))}:{
        acronym:'',values:[]
      },
      behavioralAttributes: bSC?bSC.behavioralAttributes.map(b=>({
        ...b,commentsJustification:b.commentsJustification!,
        score:b.score||0
      })): [],
    },
   
  });

  const watchedData = form.watch();
  const performanceScore = calculatePerformanceScore(
    watchedData.performanceObjectives || [],
  );
  const behavioralScore = calculateBehavioralScore(
    watchedData.behavioralAttributes || [],
  );
  const overallScore = calculateOverallScore(performanceScore, behavioralScore);
  const performanceLevel = getPerformanceLevel(overallScore);

  const handleNext = async () => {
    const stepFields = getStepFields(currentStep);
    const isValid = await form.trigger(stepFields);

    if (isValid) {
      setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: BSCFormData) => {
    try {
      console.log("BSC Data:", data);
      // Here you would typically save to database
      alert("BSC created successfully!");
    } catch (error) {
      console.error("Error creating BSC:", error);
      alert("Error creating BSC. Please try again.");
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            Staff Balance Score Card (BSC)
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Performance Appraisal System
          </p>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(index);
              const isCurrent = currentStep === index;

              return (
                <Card
                  key={step.id}
                  className={`cursor-pointer transition-all ${
                    isCurrent ? "ring-2 ring-primary" : ""
                  } ${isCompleted ? "bg-green-50 border-green-200" : ""}`}
                  onClick={() => setCurrentStep(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          isCompleted
                            ? "bg-green-100"
                            : isCurrent
                              ? "bg-primary/10"
                              : "bg-muted"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Icon
                            className={`h-5 w-5 ${isCurrent ? "text-primary" : "text-muted-foreground"}`}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{step.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(steps[currentStep].icon, {
                    className: "h-5 w-5",
                  })}
                  {steps[currentStep].title}
                </CardTitle>
                <CardDescription>
                  {steps[currentStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {currentStep === 0 && <ParticularsSection form={form} />}
                  {currentStep === 1 && (
                    <StrategicElementsSection form={form} />
                  )}
                  {currentStep === 2 && <PerformancePlanSection form={form} />}
                  {currentStep === 3 && (
                    <BehavioralAssessmentSection form={form} />
                  )}

                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>

                    {currentStep === steps.length - 1 ? (
                      <Button type="submit">Create BSC</Button>
                    ) : (
                      <Button type="button" onClick={handleNext}>
                        Next
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Score Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Performance Score</span>
                    <span className="font-medium">
                      {performanceScore.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={performanceScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">Out of 80%</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Behavioral Score</span>
                    <span className="font-medium">
                      {behavioralScore.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={behavioralScore * 5} className="h-2" />
                  <p className="text-xs text-muted-foreground">Out of 20%</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Overall Score</span>
                    <span className="text-xl font-bold">
                      {overallScore.toFixed(1)}%
                    </span>
                  </div>
                  <Badge
                    variant={
                      overallScore >= 80
                        ? "default"
                        : overallScore >= 60
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {getPerformanceLevelDescription(performanceLevel)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <BSCPreview data={watchedData} />
          </div>
        </div>
      </div>
    </div>
  );
}

function getStepFields(step: number): (keyof BSCFormData)[] {
  switch (step) {
    case 0:
      return ["supervisee", "supervisor", "year"];
    case 1:
      return ["strategicElements"];
    case 2:
      return ["performanceObjectives"];
    case 3:
      return ["coreValues", "behavioralAttributes"];
    default:
      return [];
  }
}
