import {
  CardDescription,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { OrganizationContextData } from "@/lib/types";
import ButtonAddEditOrganizationContext from "./button-add-edit-organization-context";
import { Edit3Icon, PlusIcon, Trash2Icon } from "lucide-react";
import ButtonDeleteOrganizationContext from "./button-delete-organization-context";
import ListOfNDPs from "./list-of-ndps";
import EmptyContainer from "@/components/query-containers/empty-container";
import ButtonAddEditNdp from "./button-add-edit-ndp";

interface OrganizationContextsProps {
  contexts: OrganizationContextData[];
}
export default function OrganizationContexts({
  contexts,
}: OrganizationContextsProps) {
  return (
    <Tabs defaultValue={contexts[0].financialYear}>
      <TabsList className="w-full flex justify-start gap-2  my-4">
        <ButtonAddEditOrganizationContext
          size="sm"
          organizationId={contexts[0].organizationId!}
        >
          <PlusIcon className="size-4 " />
          FY
        </ButtonAddEditOrganizationContext>
        {contexts.map((ctx) => (
          <TabsTrigger key={ctx.id} value={ctx.financialYear}>
            {ctx.financialYear}
          </TabsTrigger>
        ))}
      </TabsList>
      {contexts.map((ctx) => {
        const {
          mandate,
          financialYear,
          vision,
          mission,
          goal,
          ndp,
          id,
          organizationId,
        } = ctx;
        const ctxValues = [
          { label: "Financial Year", value: financialYear },
          { label: "Mandate", value: mandate },
          { label: "Vision", value: vision },
          { label: "Mission", value: mission },
          { label: "goal", value: goal },
        ];
        return (
          <TabsContent
            key={id}
            value={financialYear}
            className="space-y-4 *:w-full *:max-w-5xl *:mx-auto"
          >
            <Card className="">
              <CardHeader className="w-full flex flex-row items-center justify-between gap-3">
                <div>
                  <CardTitle>BSC STRATEGIC ELEMENTS</CardTitle>
                  <CardDescription>
                    Mandate, vision, mission, goal, e.t.c
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <ButtonAddEditOrganizationContext
                    organizationId={organizationId!}
                    context={ctx}
                    size="icon"
                    variant={"secondary"}
                  >
                    <Edit3Icon />
                  </ButtonAddEditOrganizationContext>
                  <ButtonDeleteOrganizationContext
                    organizationContext={ctx}
                    size="icon"
                    variant={"destructive"}
                  >
                    <Trash2Icon />
                  </ButtonDeleteOrganizationContext>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {ctxValues.map(({ label, value }) => (
                  <p
                    key={label}
                    className="line-clamp-4 md:line-clamp-2 text-ellipsis text-justify hyphens-auto"
                  >
                    <span className="text-muted-foreground uppercase">
                      {label}:{" "}
                    </span>{" "}
                    {value}
                  </p>
                ))}
              </CardContent>
            </Card>
            {!ndp ? (
              <EmptyContainer
                message={
                  "Please note that you have not added any NDP strategy and objectives. Please add"
                }
                className="border p-3 border-destructive text-destructive"
              >
                <ButtonAddEditNdp context={ctx} variant="secondary">
                  Create the NDP
                </ButtonAddEditNdp>
              </EmptyContainer>
            ) : (
              <ListOfNDPs ndp={ndp} context={ctx} />
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
