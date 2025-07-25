"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PositionData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Edit3Icon } from "lucide-react";
import ButtonAddEditPosition from "../button-add-edit-position";
import { getPositionById } from "./action";

interface PositionContainerProps {
  initialData: PositionData;
}

export default function PositionContainer({
  initialData,
}: PositionContainerProps) {
  const query = useQuery({
    queryKey: ["position", initialData.id],
    queryFn: async () => getPositionById(initialData.id),
    initialData,
  });
  const { data: position, status } = query;
  return (
    <div className="flex flex-col w-full gap-4">
      {status === "error" ? (
        <ErrorContainer
          errorMessage="Failed to fetch position details"
          query={query}
        />
      ) : status === "success" && !position ? (
        <EmptyContainer message="No position details found. Please check the ID or try again later." />
      ) : (
        <div className="flex gap-3 flex-wrap max-w-7xl w-full mx-auto">
          <Card className="max-w-lg">
            <CardHeader className="flex flex-row gap-2 justify-between">
              <div>
                <CardTitle>
                  {" "}
                  <span className="text-muted-foreground">
                    JOB TITLE :
                  </span>{" "}
                  {position?.jobTitle}
                </CardTitle>
                <CardTitle>
                  <span className="text-muted-foreground">SALARY SCALE :</span>{" "}
                  {position?.salaryScale}
                </CardTitle>
              </div>
              <ButtonAddEditPosition
                variant="secondary"
                size="icon"
                position={position || initialData}
                className=" flex-none shrink-0"
              >
                <Edit3Icon />
              </ButtonAddEditPosition>{" "}
            </CardHeader>
            <CardHeader>
              {" "}
              <CardTitle className=" ">
                Job Purpose/ Departmental Mandate
              </CardTitle>
              <CardDescription className="text-justify hyphens-auto">
                {position?.departmentalMandate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CardTitle className="underline">Duties and activities</CardTitle>
              <ol className="list-[lower-roman] list-inside mt-2 space-y-2 ">
                {position?.duties.map((duty, index) => (
                  <li key={index} className=" text-justify hyphens-auto  ">
                    {duty}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card className="max-w-lg bg-green-500 dark:bg-green-300/20 text:green-50  ">
              <CardHeader>
                <CardTitle className=" text-muted-foreground uppercase">
                  Reports to
                </CardTitle>
              </CardHeader>
              <CardContent>
                {position?.reportsTo ? (
                  <>
                    {" "}
                    <CardTitle>{position?.reportsTo?.jobTitle}</CardTitle>
                    <CardDescription>
                      {position?.reportsTo?.salaryScale}
                    </CardDescription>
                  </>
                ) : (
                  <Badge variant={"destructive"}>Supervisor Missing</Badge>
                )}
              </CardContent>
            </Card>
            <Card className="max-w-lg bg-red-500 dark:bg-red-300/20 text:red-50  ">
              <CardHeader>
                <CardTitle className=" text-muted-foreground uppercase">
                  Responsible for
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!!position?.responsibleFor ? (
                  <div className="flex flex-col gap-4">
                    {position?.responsibleFor.map((rf) => (
                      <div key={rf.id}>
                        <CardTitle>{rf.jobTitle}</CardTitle>
                        <CardDescription>{rf.salaryScale}</CardDescription>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Badge variant={"destructive"}>They supervise no one.</Badge>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
