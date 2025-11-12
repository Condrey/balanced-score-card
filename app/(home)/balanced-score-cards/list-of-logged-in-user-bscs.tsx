"use client";

import ButtonAddEditBSC from "@/app/admin/bsc/button-add-edit-bsc";
import { DataTable } from "@/components/data-table/data-table";
import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { BSCData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { getAllLoggedInUserBSCs } from "./action";
import { useBSCColumns } from "./columns";

interface ListOfLoggedInUserBSCsProps {
	bSCs: BSCData[];
	userId: string | undefined;
}

export default function ListOfLoggedInUserBSCs({ bSCs, userId }: ListOfLoggedInUserBSCsProps) {
	const query = useQuery({
		queryKey: ["bSCs", userId],
		queryFn: getAllLoggedInUserBSCs,
		initialData: bSCs
	});
	const { data, status } = query;
	return (
		<div className="space-y-4">
			{status === "error" ? (
				<ErrorContainer errorMessage="Failed to load bSCs" query={query} />
			) : status === "success" && !data.length ? (
				<EmptyContainer message={"There are no bSCs added yet."}>
					<ButtonAddEditBSC variant={"secondary"} url="/add-bsc">
						Create a new one
					</ButtonAddEditBSC>
				</EmptyContainer>
			) : (
				<DataTable
					query={query}
					data={data}
					columns={useBSCColumns}
					filterColumn={{ id: "year", label: "financial year" }}
				>
					<ButtonAddEditBSC size={"icon"} url="/add-bsc">
						<PlusIcon />
					</ButtonAddEditBSC>
				</DataTable>
			)}
		</div>
	);
}
