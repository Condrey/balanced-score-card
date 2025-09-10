import { BSCData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteBSC, upsertBSC } from "./action";

const queryKey: QueryKey = ["bSCs"];

export function upsertBSCMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: upsertBSC,
		async onSuccess(data, variables, context) {
			await queryClient.cancelQueries({ queryKey });
			queryClient.setQueryData<BSCData[]>(queryKey, (oldData) => {
				if (!oldData) return [data];
				if (variables.id) {
					toast.success("BSC updated successfully");
					return oldData.map((p) => (p.id === data.id ? data : p));
				}
				toast.success(`BSC for ${variables.supervisee.name} created successfully`);
				return [data, ...oldData];
			});
			queryClient.invalidateQueries({ queryKey });
		},
		onError: (error, variables, context) => {
			console.error(error);
			toast.error("Failed to save bSC. Please try again.");
		}
	});
}

export function deleteBSCMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteBSC,
		async onSuccess(data, variables, context) {
			await queryClient.cancelQueries({ queryKey });
			queryClient.setQueryData<BSCData[]>(queryKey, (oldData) => {
				if (!oldData) return;
				toast.success(`BSC was successfully removed from the database.`);
				return oldData.filter((d) => d.id !== data.id);
			});
			queryClient.invalidateQueries({ queryKey });
		},
		onError: (error, variables, context) => {
			console.error(error);
			toast.error("Failed to remove bSC. Please try again.");
		}
	});
}
