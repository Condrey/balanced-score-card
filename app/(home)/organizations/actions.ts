'use server'

import prisma from "@/lib/prisma"
import { organizationDataInclude } from "@/lib/types"
import { cache } from "react"

async function allOrganizations(){
    return await prisma.organization.findMany({
        include: organizationDataInclude
    })
}
export const getAllOrganizations = cache(allOrganizations)