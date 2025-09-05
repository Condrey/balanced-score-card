import { OrganizationContextData } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteNdp,
  deleteOrganizationContext,
  deleteOsp,
  upsertNdp,
  upsertOrganizationContext,
  upsertOsp,
} from "./action";

export function upsertOrganizationContextMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertOrganizationContext,
    async onSuccess(data, variables, context) {
      const queryKey: QueryKey = ["organization", variables.organizationId];
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast.success(
        `Successfully ${!variables.id ? "created" : "updated"}  the ${
          variables.financialYear
        } context`,
      );
    },
    onError: (error, variables, context) => {
      console.error(error);
      toast.error("Failed to save context. Please try again.");
    },
  });
}

export function deleteOrganizationContextMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrganizationContext,
    async onSuccess(data, variables, context) {
      const queryKey: QueryKey = ["organization", data.organizationId];

      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<OrganizationContextData[]>(
        queryKey,
        (oldData) => {
          if (!oldData) return;
          toast.success(
            `${data.financialYear} was successfully removed from the database.`,
          );
          return oldData.filter((d) => d.id !== data.id);
        },
      );
    },
    onError: (error, variables, context) => {
      console.error(error);
      toast.error("Failed to remove context. Please try again.");
    },
  });
}

export function upsertNdpMutation(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertNdp,
    async onSuccess(data, variables, context) {
      const queryKey: QueryKey = ["organization", organizationId];
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast.success(
        `Successfully ${!variables.input.id ? "created" : "updated"}  the NDP ${
          variables.input.version
        } version`,
      );
    },
    onError: (error, variables, context) => {
      console.error(error);
      toast.error("Failed to save NDP version. Please try again.");
    },
  });
}

export function deleteNdpMutation(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNdp,
    async onSuccess(data, variables, context) {
      const queryKey: QueryKey = ["organization", organizationId];

      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<OrganizationContextData[]>(
        queryKey,
        (oldData) => {
          if (!oldData) return;
          toast.success(
            `NDP ${data.version} version was successfully removed from the database.`,
          );
          return oldData.filter((d) => d.id !== data.id);
        },
      );
    },
    onError: (error, variables, context) => {
      console.error(error);
      toast.error("Failed to remove NDP version. Please try again.");
    },
  });
}

export function upsertOspMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertOsp,
    async onSuccess(data, variables, context) {
      const queryKey: QueryKey = ["organization"];
      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
      toast.success(
        `Successfully ${!variables.id ? "created" : "updated"}  the OSP `,
      );
    },
    onError: (error, variables, context) => {
      console.error(error);
      toast.error("Failed to save OSP. Please try again.");
    },
  });
}

export function deleteOspMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOsp,
    async onSuccess(data, variables, context) {
      const queryKey: QueryKey = ["organization"];

      await queryClient.cancelQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error, variables, context) => {
      console.error(error);
      toast.error("Failed to remove OSP. Please try again.");
    },
  });
}
