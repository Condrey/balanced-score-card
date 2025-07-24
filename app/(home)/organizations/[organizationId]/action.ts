'use server'

import prisma from "@/lib/prisma"
import { organizationDataInclude } from "@/lib/types"
import { cache } from "react"

async function organizationById (id:string){
    return await prisma.organization.findUnique({
        where:{id},
        include: organizationDataInclude
    })
}
export const getOrganizationById = cache(organizationById)