"use client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteBehavioralAttribute, upsertBehavioralAttribute } from "./action";

export function upsertBehavioralAttributeMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: upsertBehavioralAttribute,
		async onSuccess(data, variables, context) {
			const queryKey: QueryKey = ["organization"];
			await queryClient.cancelQueries({ queryKey });
			queryClient.invalidateQueries({ queryKey });
			toast.success(`Successfully ${!variables.input.id ? "created" : "updated"}  the behavioral attribute. `);
		},
		onError: (error, variables, context) => {
			console.error(error);
			toast.error("Failed to save behavioral attribute. Please try again.");
		}
	});
}

export function deleteBehavioralAttributeMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteBehavioralAttribute,
		async onSuccess(data, variables, context) {
			const queryKey: QueryKey = ["organization"];

			await queryClient.cancelQueries({ queryKey });
			queryClient.invalidateQueries({ queryKey });
		},
		onError: (error, variables, context) => {
			console.error(error);
			toast.error("Failed to remove behavioral attribute. Please try again.");
		}
	});
}
