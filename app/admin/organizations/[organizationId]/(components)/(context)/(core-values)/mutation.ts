"use client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCoreValues, upsertCoreValues } from "./action";

export function upsertCoreValuesMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: upsertCoreValues,
		async onSuccess(data, variables, context) {
			const queryKey: QueryKey = ["organization"];
			await queryClient.cancelQueries({ queryKey });
			queryClient.invalidateQueries({ queryKey });
			toast.success(`Successfully ${!variables.input.id ? "created" : "updated"}  the core values `);
		},
		onError: (error, variables, context) => {
			console.error(error);
			toast.error("Failed to save core values. Please try again.");
		}
	});
}

export function deleteCoreValuesMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteCoreValues,
		async onSuccess(data, variables, context) {
			const queryKey: QueryKey = ["organization"];

			await queryClient.cancelQueries({ queryKey });
			queryClient.invalidateQueries({ queryKey });
		},
		onError: (error, variables, context) => {
			console.error(error);
			toast.error("Failed to remove core values. Please try again.");
		}
	});
}
