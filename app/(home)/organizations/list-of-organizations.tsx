"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { OrganizationData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getAllOrganizations } from "./actions";
import ButtonAddEditOrganization from "./button-add-edit-organization";

interface ListOfOrganizationsProps {
  organizations: OrganizationData[];
}
export default function ListOfOrganizations({
  organizations,
}: ListOfOrganizationsProps) {
  const query = useQuery({
    queryKey: ["organizations"],
    queryFn: getAllOrganizations,
    initialData: organizations,
  });
  const { data, status } = query;
  return (
    <div>
      {status === "error" ? (
        <ErrorContainer
          errorMessage="Failed to fetch organizations"
          query={query}
        />
      ) : status === "success" && !data.length ? (
        <EmptyContainer
          message={
            "There are no organizations added in the database yet. Please add"
          }
        >
            <ButtonAddEditOrganization variant={'secondary'}>
                Create a new organization
            </ButtonAddEditOrganization>
        </EmptyContainer>
      ) : (
        <div>Organizations found</div>
      )}
    </div>
  );
}
