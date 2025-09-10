"use client";

import { DataTable } from "@/components/data-table/data-table";
import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { BSCData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { getAllBSCs } from "./action";
import ButtonAddEditBSC from "./button-add-edit-bsc";
import { useBSCColumns } from "./columns";

interface ListOfBSCsProps {
	bSCs: BSCData[];
}

export default function ListOfBSCs({ bSCs }: ListOfBSCsProps) {
	const query = useQuery({
		queryKey: ["bSCs"],
		queryFn: getAllBSCs,
		initialData: bSCs
	});
	const { data, status } = query;
	return (
		<div className="space-y-4">
			{status === "error" ? (
				<ErrorContainer errorMessage="Failed to load bSCs" query={query} />
			) : status === "success" && !data.length ? (
				<EmptyContainer message={"There are no bSCs added yet."}>
					<ButtonAddEditBSC variant={"secondary"}>Create a new one</ButtonAddEditBSC>
				</EmptyContainer>
			) : (
				<DataTable
					query={query}
					data={data}
					columns={useBSCColumns}
					filterColumn={{ id: "supervisee_name", label: "supervisee" }}
				>
					<ButtonAddEditBSC size={"icon"}>
						<PlusIcon />
					</ButtonAddEditBSC>
				</DataTable>
			)}
		</div>
	);
}
