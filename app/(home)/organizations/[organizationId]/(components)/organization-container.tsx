"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { organizationStructures } from "@/lib/enums";
import { OrganizationData } from "@/lib/types";
import { OrganizationStructure } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Edit3Icon } from "lucide-react";
import ButtonAddEditOrganization from "../../button-add-edit-organization";
import { getOrganizationById } from "../action";
import ButtonAddEditOrganizationContext from "./button-add-edit-organization-context";
import OrganizationContexts from "./organization-contexts";

interface OrganizationContainerProps {
  initialData: OrganizationData;
}

export default function OrganizationContainer({
  initialData,
}: OrganizationContainerProps) {
  const query = useQuery({
    queryKey: ["organization", initialData.id],
    queryFn: async () => getOrganizationById(initialData.id),
    initialData,
  });

  const { data: organization, status } = query;
  if (status === "error")
    <ErrorContainer
      errorMessage="Failed to retrieve this organization"
      query={query}
    />;
  if (status === "success" && !organization)
    <EmptyContainer message="Organization not found" />;
  const { icon, label } =
    organizationStructures[
      organization?.structure || OrganizationStructure.DISTRICT
    ];
  const Icon = icon;
  const organizationContexts = organization?.organizationContexts;
  return (
    <div>
      <Card className="max-w-lg ">
        <CardHeader className="flex flex-row gap-2 justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Icon className="inline-block mr-2" />
              {organization?.voteName} - {organization?.name}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              {label}
            </CardDescription>
          </div>
          <ButtonAddEditOrganization
            organization={organization || initialData}
            size="icon"
            variant="secondary"
          >
            <Edit3Icon />
          </ButtonAddEditOrganization>
        </CardHeader>
      </Card>

      {/* organization contexts */}
      <div>
        {!organizationContexts?.length ? (
          <EmptyContainer
            message={
              "There are no organization contexts for this vote in the system. Please add"
            }
          >
            <ButtonAddEditOrganizationContext
              organizationId={organization?.id || initialData.id}
              variant={"secondary"}
            >
              Add a new context
            </ButtonAddEditOrganizationContext>
          </EmptyContainer>
        ) : (
          <OrganizationContexts contexts={organizationContexts} />
        )}
      </div>
    </div>
  );
}
