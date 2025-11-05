"use client";

import { QueryClient, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertBSCPayment } from "./action";

export function usePaymentMutation() {
	const queryKey: QueryKey = ["bSCs"];
	const queryClient: QueryClient = useQueryClient();
	return useMutation({
		mutationFn: upsertBSCPayment,
		onSuccess: async () => {
			await queryClient.cancelQueries();
			queryClient.invalidateQueries({ queryKey });
			toast.success("Payments updated");
		},
		onError(error, variables, context) {
			console.error(error);
			toast.error("An error occurred while adding payments, retry!");
		}
	});
}
