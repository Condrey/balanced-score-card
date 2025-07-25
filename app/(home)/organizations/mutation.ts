import { OrganizationData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteOrganization, upsertOrganization } from "./actions";

const queryKey: QueryKey = ["organizations"];
export function upsertOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertOrganization,
    async onSuccess(data, variables, context) {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<OrganizationData[]>(queryKey, (oldData) => {
        if (!oldData) return [data];
        if (variables.id) {
          toast.success("Organization updated successfully");
          return oldData.map((p) => (p.id === data.id ? data : p));
        }
        toast.success("Organization created successfully");
        return [data, ...oldData];
      });
    },
    onError: (error, variables, context) => {
      console.error(error);
      toast.error("Failed to save organization. Please try again.");
    },
  });
}

export function deleteOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrganization,
    async onSuccess(data, variables, context) {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<OrganizationData[]>(queryKey, (oldData) => {
        if (!oldData) return;
        toast.success(
          `${data.name} was successfully removed from the database.`,
        );
        return oldData.filter((d) => d.id !== data.id);
      });
    },
    onError: (error, variables, context) => {
      console.error(error);
      toast.error("Failed to remove organization. Please try again.");
    },
  });
}
