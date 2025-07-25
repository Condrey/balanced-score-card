import { OrganizationStructure } from "@prisma/client";
import z from "zod";

export const stringArraySchema = z.object({
  value: z.string(),
});
export type StringArraySchema = z.infer<typeof stringArraySchema>;

export const dutySchema = z.object({
  id: z.string().optional(),
  duty: z.string(),
});
export type DutySchema = z.infer<typeof dutySchema>;

export const positionSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(1, "Job title is required"),
  departmentalMandate: z
    .string()
    .min(10, "Departmental mandate must be at least 10 characters"),
  reportsToId: z.string().optional(),
  salaryScale: z.string().min(1, "Salary scale is required"),
  duties: z.array(stringArraySchema),
});
export type PositionSchema = z.infer<typeof positionSchema>;

export const organizationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Please enter organization name"),
  voteName: z.string().min(1, "Please include vote name"),
  structure: z.nativeEnum(OrganizationStructure),
});
export type OrganizationSchema = z.infer<typeof organizationContextSchema>;

export const organizationContextSchema = z.object({
  id: z.string().optional(),
  financialYear: z.string().min(1, "FY is a must"),
  mandate: z.string().min(1, "Please provide a mandate"),
  vision: z.string().min(1, "Please provide a vision"),
  mission: z.string().min(1, "Please provide a mission"),
  goal: z.string().min(1, "Please provide a goal"),
  organizationId: z.string().min(1, "Context must belong to an organization"),
});
export type OrganizationContextSchema = z.infer<
  typeof organizationContextSchema
>;

export const ospSchema = z.object({
  id: z.string().optional(),
  strategicObjective: z.string().min(1, "This field is required."),
  strategies: z
    .array(z.string())
    .min(1, "Please provide at least one strategy"),
  programmes: z
    .array(z.string())
    .min(1, "Please provide at least one programme"),
  ndpId: z.string().min(1, "It should belong to a NDP"),
});
export type OspSchema = z.infer<typeof ospSchema>;

export const ndpSchema = z.object({
  id: z.string().optional(),
  version: z.string().min(1, "Specify the NDP version"),
  programmes: z
    .array(stringArraySchema)
    .min(1, "Please provide at least one programmes"),
  // osps: z.array(ospSchema).min(1, "Please provide at least one osp"),
});
export type NdpSchema = z.infer<typeof ndpSchema>;
