import EmptyContainer from "@/components/query-containers/empty-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CoreValueData, OrganizationContextData } from "@/lib/types";
import { Edit3Icon, Trash2Icon } from "lucide-react";
import ListOfBehavioralAttributes from "./(behavioral-attribute)/list-of-behavioral-attributes";
import ButtonAddEditCoreValue from "./button-add-edit-core-value";
import ButtonDeleteCoreValue from "./button-delete-core-value";

interface CoreValuesContainerProps {
  coreValue: CoreValueData;
  organizationContext: OrganizationContextData;
}

export default function CoreValuesContainer({
  coreValue,
  organizationContext,
}: CoreValuesContainerProps) {
  return (
    <Card>
      <CardHeader className="flex gap-2 justify-between flex-row items-center">
        <div>
          <CardTitle>Core values</CardTitle>
          <CardDescription>{`List of the organization's core values and developed acronym`}</CardDescription>
        </div>
        <div className="flex gap-2">
          <ButtonAddEditCoreValue
            size={"icon"}
            coreValue={coreValue}
            context={organizationContext}
          >
            <Edit3Icon />
          </ButtonAddEditCoreValue>
          <ButtonDeleteCoreValue
            variant={"destructive"}
            size={"icon"}
            coreValue={coreValue}
          >
            <Trash2Icon />
          </ButtonDeleteCoreValue>
        </div>
      </CardHeader>
      <CardContent>
        <p className="*:inline max-w-3xl">
          Our value system for FY{organizationContext.financialYear} that will
          shape our culture is{" "}
          <q className="uppercase">
            <strong>{coreValue.acronym}</strong>
          </q>{" "}
          for{" "}
          {coreValue.values.map((v) => `${v.value} (${v.score}%)`).join(", ")}.
        </p>
      </CardContent>
      <CardFooter className="font-bold">
        Total: {coreValue.values.reduce((curr, acc) => curr + acc.score, 0)} %
      </CardFooter>
      <CardHeader>
        <CardTitle>Behavioral Assessment</CardTitle>
        <CardDescription>
          Assessments curved from the the core values of the organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!organizationContext.behavioralAttributes.length ? (
          <EmptyContainer
            message={
              "It is high time you updated the Behavioral attributes since you have the core values."
            }
            className="border border-destructive min-h-fit p-2"
          >
            <ButtonAddEditCoreValue
              variant={"secondary"}
              context={organizationContext}
              coreValue={organizationContext.coreValue!}
            >
              Edit core values
            </ButtonAddEditCoreValue>
          </EmptyContainer>
        ) : (
          <ListOfBehavioralAttributes
            behavioralAttributes={organizationContext.behavioralAttributes}
            organizationContextId={organizationContext.id}
          />
        )}
      </CardContent>
    </Card>
  );
}
