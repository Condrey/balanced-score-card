"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateScheduleOfDuty } from "./action";

const queryKey: QueryKey = ["bsc"];

export function useUpdateScheduleOfDutyMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateScheduleOfDuty,
		async onSuccess(data, variables, context) {
			await queryClient.cancelQueries({ queryKey });
			queryClient.invalidateQueries({ queryKey });
			toast.success("Update was successful.");
		},
		onError: (error, variables, context) => {
			console.error(error);
			toast.error("Failed to update bSC. Please try again.");
		}
	});
}
