"use client";

import { PositionData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getAllPositions } from "./action";
import ErrorContainer from "@/components/query-containers/error-container";
import EmptyContainer from "@/components/query-containers/empty-container";
import { DataTable } from "@/components/data-table/data-table";
import ButtonAddEditPosition from "./button-add-edit-position";
import { usePositionColumns } from "./columns";
import { PlusIcon } from "lucide-react";

interface ListOfPositionsProps {
  positions: PositionData[];
}

export default function ListOfPositions({ positions }: ListOfPositionsProps) {
  const query = useQuery({
    queryKey: ["positions"],
    queryFn: getAllPositions,
    initialData: positions,
  });
  const { data, status } = query;
  return (
    <div className="space-y-4">
      {status === "error" ? (
        <ErrorContainer errorMessage="Failed to load positions" query={query} />
      ) : status === "success" && !data.length ? (
        <EmptyContainer message={"There are no positions added yet."}>
          <ButtonAddEditPosition variant={"secondary"}>
            Create a new one
          </ButtonAddEditPosition>
        </EmptyContainer>
      ) : (
        <DataTable
          query={query}
          data={data}
          columns={usePositionColumns}
          filterColumn={{ id: "jobTitle", label: "Job title" }}
        >
          <ButtonAddEditPosition size={"icon"}>
            <PlusIcon />
          </ButtonAddEditPosition>
        </DataTable>
      )}
    </div>
  );
}
