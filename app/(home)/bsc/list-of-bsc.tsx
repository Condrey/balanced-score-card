"use client";

import { BSCData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getAllBSCs } from "./action";
import ErrorContainer from "@/components/query-containers/error-container";
import EmptyContainer from "@/components/query-containers/empty-container";
import { DataTable } from "@/components/data-table/data-table";
import ButtonAddEditBSC from "./button-add-edit-bsc";
import { useBSCColumns } from "./columns";
import { PlusIcon } from "lucide-react";

interface ListOfBSCsProps {
  bSCs: BSCData[];
}

export default function ListOfBSCs({ bSCs }: ListOfBSCsProps) {
  const query = useQuery({
    queryKey: ["bSCs"],
    queryFn: getAllBSCs,
    initialData: bSCs,
  });
  const { data, status } = query;
  return (
    <div className="space-y-4  ">
      {status === "error" ? (
        <ErrorContainer errorMessage="Failed to load bSCs" query={query} />
      ) : status === "success" && !data.length ? (
        <EmptyContainer message={"There are no bSCs added yet."}>
          <ButtonAddEditBSC variant={"secondary"}>
            Create a new one
          </ButtonAddEditBSC>
        </EmptyContainer>
      ) : (
        <DataTable
          query={query}
          data={data}
          columns={useBSCColumns}
          filterColumn={{ id: "jobTitle", label: "Job title" }}
        >
          <ButtonAddEditBSC size={"icon"}>
            <PlusIcon />
          </ButtonAddEditBSC>
        </DataTable>
      )}
    </div>
  );
}
