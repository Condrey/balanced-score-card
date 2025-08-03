import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BscProgressBarProps {
  currentStep: number;
  steps: number;
}

export default function BscProgressBar({
  currentStep,
  steps,
}: BscProgressBarProps) {
  const progress = ((currentStep + 1) / steps) * 100;

  return (
    <Card>
      <CardHeader className="px-3 py-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-1.5 " />
      </CardHeader>
    </Card>
  );
}
