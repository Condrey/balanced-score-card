import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, LucideIcon } from "lucide-react";

interface BscStepsProps {
  steps: {
    id: string;
    title: string;
    icon: LucideIcon;
    description: string;
  }[];
  completedSteps: number[];
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
}

export default function BscSteps({
  steps,
  completedSteps,
  currentStep,
  setCurrentStep,
}: BscStepsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = completedSteps.includes(index);
        const isCurrent = currentStep === index;

        return (
          <Card
            key={step.id}
            className={`cursor-pointer transition-all ${
              isCurrent
                ? "ring-2 ring-primary bg-muted "
                : "text-muted-foreground opacity-80 "
            } ${
              isCompleted ? "bg-green-50 border-green-200 text-green-950" : ""
            }`}
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
                      className={`h-5 w-5 ${
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-1 text-ellipsis">
                    {step.title}
                  </h3>
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
  );
}
