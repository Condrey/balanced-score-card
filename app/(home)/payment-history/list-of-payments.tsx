"use client";

import ButtonAddEditPayment from "@/app/admin/bsc/button-add-edit-payment";
import { DataTable } from "@/components/data-table/data-table";
import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { PaymentData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getMyPayments } from "./action";
import { usePaymentColumns } from "./column";

export default function ListOfPayments({ initialData, userId }: { initialData: PaymentData[]; userId: string }) {
	const query = useQuery({
		queryKey: ["my-payments", userId],
		queryFn: getMyPayments,
		initialData
	});

	const { status, data } = query;
	if (status === "error") {
		return <ErrorContainer errorMessage="Failed to fetch payments" query={query} />;
	}
	if (status === "success" && !data.length) {
		return (
			<EmptyContainer message="You do not have any payments made yet.">
				<ButtonAddEditPayment userId={userId}>Add payment</ButtonAddEditPayment>
			</EmptyContainer>
		);
	}

	return (
		<DataTable
			query={query}
			data={data}
			columns={usePaymentColumns}
			filterColumn={{ id: "bsc_year", label: "financial year" }}
			className="w-full max-w-5xl"
		></DataTable>
	);
}
