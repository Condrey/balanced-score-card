import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  calculateBehavioralScore,
  calculateOverallScore,
  calculatePerformanceScore,
  getPerformanceLevel,
  getPerformanceLevelDescription,
} from "@/lib/bsc-calculations";
import { BSCFormData } from "@/lib/validations/bsc";
import { UseFormReturn } from "react-hook-form";
import { BSCPreview } from "./bsc-preview";

interface BscSideBarProps {
  form: UseFormReturn<BSCFormData>;
}

export default function BscSideBar({ form }: BscSideBarProps) {
  const watchedData = form.watch();
  const performanceScore = calculatePerformanceScore(
    watchedData.performanceObjectives || [],
  );
  const behavioralScore = calculateBehavioralScore(
    watchedData.behavioralAttributes || [],
  );
  const overallScore = calculateOverallScore(performanceScore, behavioralScore);
  const performanceLevel = getPerformanceLevel(overallScore);

  return (
    <div className="space-y-6">
      <BSCPreview data={watchedData} />
      <Card>
        <CardHeader className="bg-secondary mb-2">
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
              <span className="font-medium">{behavioralScore.toFixed(1)}%</span>
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
    </div>
  );
}
