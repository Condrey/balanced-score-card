import { z } from "zod";
import { stringArraySchema } from "./others";

// Employee validation schema
export const employeeSchema = z.object({
  id: z.string().optional().describe("this should be a random uuid() number"),
  employeeNumber: z
    .string()
    .min(1, "Employee number is required")
    .describe("Unique identifier for the employee"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .describe("Full name of the employee"),
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .describe("Current position/job title of the employee"),
  salaryScale: z
    .string()
    .min(1, "Salary scale is required")
    .describe("Employee's salary scale or grade level"),
});

// Strategic elements validation schema
export const strategicElementsSchema = z.object({
  id: z.string().optional().describe("this should be a random uuid() number"),
  mandate: z
    .string()
    .min(10, "Mandate must be at least 10 characters")
    .describe("Organizational mandate or purpose"),
  vision: z
    .string()
    .min(10, "Vision must be at least 10 characters")
    .describe("Vision statement of the organization"),
  mission: z
    .string()
    .min(10, "Mission must be at least 10 characters")
    .describe("Mission statement of the organization"),
  goal: z
    .string()
    .min(10, "Goal must be at least 10 characters")
    .describe("Primary organizational goal"),
  ndpProgrammes: z
    .array(stringArraySchema)
    .min(1, "At least one NDP programme is required")
    .describe(
      "National Development Plan programmes the organization contributes to ",
    ),
  departmentalMandate: z
    .string()
    .min(10, "Departmental mandate must be at least 10 characters")
    .describe("Specific mandate of the department"),
  strategicObjectives: z
    .array(stringArraySchema)
    .min(1, "At least one strategic objective is required")
    .describe("Key strategic objectives to be achieved"),
});

// Performance objective validation schema
export const performanceObjectiveSchema = z
  .object({
    id: z.string().optional().describe("this should be a random uuid() number"),
    perspective: z.enum([
      "STAKEHOLDERS_CLIENTS",
      "FINANCIAL_STEWARDSHIP",
      "INTERNAL_PROCESSES",
      "MDA_LG_CAPACITY",
    ]).describe(`Performance perspective category.
      1. STAKEHOLDERS_CLIENTS: focuses on how the MDA/LGs provide value to their clients and stakeholders and determines the level of satisfaction with the services, score of 25%
      2. FINANCIAL_STEWARDSHIP: Focuses on plans and strategies that help increase revenue and manage financial risks, score of 15%
      3. INTERNAL_PROCESSES: Focuses on how MDA/LGs executes its core business processes, operations and systems, score of 20%
      4. MDA_LG_CAPACITY: Focuses on the potential and the ability of the MDA/LG to deliver on its mandate, score or 20%`),
    objective: z
      .string()
      .min(5, "Objective must be at least 5 characters")
      .describe(
        `S.M.A.R.T Specific performance objective to be achieved for the perspective
        The objective must have a score in brackets e.g., Improve service delivery (7%)`,
      ),
    percentage: z
      .number()
      .min(0)
      .max(100)
      .describe(
        `Weight/percentage allocation for this objective's perspective.
        This is the score alloted to this particular objective. e.g., 7`,
      ),
    actions: z
      .array(stringArraySchema)
      .min(1, "At least one action is required")
      .describe(
        `Specific actions or activities to achieve the objective implemented in routine basis to support the achievements of the desired KPIs and outcomes. 
        It is in present continuous tense.
        e.g., Improving attendance to duty.`,
      ),
    expectedResults: z
      .array(stringArraySchema)
      .min(1, "At least one expected result is required")
      .describe(
        `This refers to defined outcomes arising from the achievement of performance objectives and shall be stated in past tense.
        e.g., Customer satisfaction, Increased purchasing power in the community.
        You can seldomly include a percentage measure.
        `,
      ),
    kpis: z.array(stringArraySchema).min(1, "At least one KPI is required")
      .describe(`
      -shall consist of qualitative and quantitative measures, and shall have a target embedded.
      -Generation shall be guided by the Metadata structure
            e.g.,  % of poverty level,Customer satisfaction index, Budget absorption rate.
            NB: Do not give the value of the percentage.
      `),
    score: z
      .number()
      .min(0)
      .max(100)
      .describe("Actual performance score achieved"),
    comments: z
      .string()
      .optional()
      .describe("Comments on actual performance and achievements"),
  })
  .describe("This is the performance objective object.");
export const performanceObjectiveArraySchema = z.object({
  performanceObjectives: z
    .array(performanceObjectiveSchema)
    .describe(
      "Create at least 2 performance objectives for a perspective, there should not be more than three performance objectives for each perspective. The total weight of each objective shall be distributed to performance objectives developed under each perspective.",
    ),
});

// Core values validation schema
export const stringScoreSchema = stringArraySchema.extend({
  score: z.number().min(1, "Please enter a number greater than 1"),
});
export type StringScoreSchema = z.infer<typeof stringScoreSchema>;
export const coreValuesSchema = z.object({
  id: z.string().optional().describe("this should be a random uuid() number"),
  values: z
    .array(stringScoreSchema)
    .min(1, "At least one core value is required")
    .describe("List of organizational core values"),
  acronym: z
    .string()
    .min(1, "Acronym is required")
    .describe("Acronym representing the core values"),
});

// Behavioral attribute validation schema
export const behavioralAttributeSchema = z.object({
  id: z.string().optional().describe("this should be a random uuid() number"),
  attribute: z
    .string()
    .min(2, "Attribute must be at least 2 characters")
    .describe("Specific behavioral attribute being assessed"),
  percentage: z
    .number()
    .min(0)
    .max(100)
    .describe("Weight/percentage allocation for this behavioral attribute"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .describe("Detailed description of the behavioral attribute"),
  score: z
    .number()
    .min(0)
    .max(100)
    .describe("Score achieved for this behavioral attribute"),
  commentsJustification: z
    .string()
    .optional()
    .describe("Comments and justification for the score given"),
});

// Complete BSC validation schema
export const bscSchema = z.object({
  id: z.string().optional().describe("this should be a random uuid() number"),
  organizationId: z
    .string()
    .optional()
    .describe("this should be a random uuid() number"),
  year: z
    .string()
    .min(1)
    .describe("Financial Year of planning and review for this BSC"),

  // Supervisee and Supervisor
  supervisee: employeeSchema.describe(
    "Details of the employee being appraised",
  ),
  supervisor: employeeSchema.describe(
    "Details of the supervising officer conducting the appraisal",
  ),

  // Strategic Elements
  strategicElements: strategicElementsSchema.describe(
    "Strategic elements and organizational context",
  ),

  // Performance Objectives
  performanceObjectives: z
    .array(performanceObjectiveSchema)
    .min(1, "At least one performance objective is required")
    .describe("List of performance objectives across different perspectives"),

  // Behavioral Assessment
  coreValues: coreValuesSchema.describe(
    "Organizational core values and their acronym",
  ),
  behavioralAttributes: z
    .array(behavioralAttributeSchema)
    .min(1, "At least one behavioral attribute is required")
    .describe("List of behavioral attributes for assessment"),
});

// Type exports for use in components
export type BSCFormData = z.infer<typeof bscSchema>;
export type EmployeeData = z.infer<typeof employeeSchema>;
export type PerformanceObjectiveSchema = z.infer<
  typeof performanceObjectiveSchema
>;
export type PerformanceObjectiveArraySchema = z.infer<
  typeof performanceObjectiveArraySchema
>;
export type CoreValuesSchema = z.infer<typeof coreValuesSchema>;
export type BehavioralAttributeSchema = z.infer<
  typeof behavioralAttributeSchema
>;
