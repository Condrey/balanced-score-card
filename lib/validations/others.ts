import { OrganizationStructure } from '@prisma/client'
import z from 'zod'
export const dutySchema = z.object({
    id: z.string().optional(),
    duty: z.string()
  })
  export type  DutySchema = z.infer<typeof dutySchema>

export const positionSchema = z.object({
       id: z.string().optional(),
 jobTitle: z.string().min(1, "Job title is required"),
    departmentalMandate: z.string().min(10, "Departmental mandate must be at least 10 characters"),
    reportsToId : z.string().optional(),
    salaryScale: z.string().min(1, "Salary scale is required"),
  duties: z.array(dutySchema),
})
export type PositionSchema = z.infer<typeof positionSchema>

export const organizationSchema = z.object({
       id: z.string().optional(),
 name: z.string().min(1, "Please enter organization name"),
    voteName: z.string().min(1, "Please include vote name"),
    structure : z.nativeEnum(OrganizationStructure),
   
})
export type OrganizationSchema = z.infer<typeof organizationSchema>