"use client";

import { DataTable } from "@/components/data-table/data-table";
import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { PositionData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { getAllPositions } from "./action";
import ButtonAddEditPosition from "./button-add-edit-position";
import { usePositionColumns } from "./columns";

interface ListOfPositionsProps {
	positions: PositionData[];
}

export default function ListOfPositions({ positions }: ListOfPositionsProps) {
	const query = useQuery({
		queryKey: ["positions"],
		queryFn: getAllPositions,
		initialData: positions,
		refetchOnWindowFocus: false
	});
	const { data, status } = query;
	return (
		<div className="space-y-4">
			{status === "error" ? (
				<ErrorContainer errorMessage="Failed to load positions" query={query} />
			) : status === "success" && !data.length ? (
				<EmptyContainer message={"There are no positions added yet."}>
					<ButtonAddEditPosition variant={"secondary"}>Create a new one</ButtonAddEditPosition>
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
