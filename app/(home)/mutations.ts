'use client'

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"
import updateUserPositionAndOrganization from "./action"
import { toast } from "sonner"

export function usePositionOrganizationMutation(){
    const queryClient= useQueryClient()
    return useMutation({
        mutationFn:  updateUserPositionAndOrganization,
       async onSuccess(data, variables, context) {
        const queryKey:QueryKey = ["organizationContext",variables.organizationId]
            await queryClient.cancelQueries()
            queryClient.invalidateQueries({queryKey,})
            toast.success('Updated user organization and position')
        },
        onError(error, variables, context) {
            console.error(error)
            toast.error( 'Failed to update organization and position information.')
        },
    })
}