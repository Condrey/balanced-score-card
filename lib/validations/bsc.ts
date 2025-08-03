import { z } from "zod";
import { stringArraySchema } from "./others";

// Employee validation schema
export const employeeSchema = z.object({
    id: z.string().optional(),
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
     id: z.string().optional(),
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
export const performanceObjectiveSchema = z.object({
    id: z.string().optional(),
  perspective: z
    .enum([
      "STAKEHOLDERS_CLIENTS",
      "FINANCIAL_STEWARDSHIP",
      "INTERNAL_PROCESSES",
      "MDA_LG_CAPACITY",
    ])
    .describe("Performance perspective category"),
  objective: z
    .string()
    .min(5, "Objective must be at least 5 characters")
    .describe("Specific performance objective to be achieved"),
  percentage: z
    .number()
    .min(0)
    .max(100)
    .describe("Weight/percentage allocation for this objective"),
  actions: z
    .array(stringArraySchema)
    .min(1, "At least one action is required")
    .describe("Specific actions or activities to achieve the objective"),
  expectedResults: z
    .array(stringArraySchema)
    .min(1, "At least one expected result is required")
    .describe("Expected outcomes or results from the actions"),
  kpis: z
    .array(stringArraySchema)
    .min(1, "At least one KPI is required")
    .describe("Key Performance Indicators to measure success"),
  score: z
    .number()
    .min(0)
    .max(100)
    .describe("Actual performance score achieved"),
  comments: z
    .string()
    .optional()
    .describe("Comments on actual performance and achievements"),
});

// Core values validation schema
export const coreValuesSchema = z.object({
      id: z.string().optional(),

  values: z
    .array(stringArraySchema)
    .min(1, "At least one core value is required")
    .describe("List of organizational core values"),
  acronym: z
    .string()
    .min(1, "Acronym is required")
    .describe("Acronym representing the core values"),
});

// Behavioral attribute validation schema
export const behavioralAttributeSchema = z.object({    id: z.string().optional(),

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
export const bscSchema = z
  .object({
    id: z.string().optional(),
    year: z
      .string()
      .min(1)
      .describe("Year of planning and review for this BSC"),

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
  })
  .refine(
    (data) => {
      // Validate that performance objectives percentages add up correctly for each perspective
      const perspectivePercentages = {
        STAKEHOLDERS_CLIENTS: 25,
        FINANCIAL_STEWARDSHIP: 15,
        INTERNAL_PROCESSES: 20,
        MDA_LG_CAPACITY: 20,
      };

      const groupedObjectives = data.performanceObjectives.reduce(
        (acc, obj) => {
          if (!acc[obj.perspective]) acc[obj.perspective] = 0;
          acc[obj.perspective] += obj.percentage;
          return acc;
        },
        {} as Record<string, number>,
      );

      for (const [perspective, expectedPercentage] of Object.entries(
        perspectivePercentages,
      )) {
        const actualPercentage = groupedObjectives[perspective] || 0;
        if (Math.abs(actualPercentage - expectedPercentage) > 0.01) {
          return false;
        }
      }

      // Validate that behavioral attributes percentages add up to 20%
      const totalBehavioralPercentage = data.behavioralAttributes.reduce(
        (sum, attr) => sum + attr.percentage,
        0,
      );
      return Math.abs(totalBehavioralPercentage - 20) < 0.01;
    },
    {
      message:
        "Percentage allocations must match required distributions: Stakeholders/Clients (25%), Financial Stewardship (15%), Internal Processes (20%), MDA/LG Capacity (20%), and Behavioral Attributes (20%)",
    },
  );

// Type exports for use in components
export type BSCFormData = z.infer<typeof bscSchema>;
export type EmployeeData = z.infer<typeof employeeSchema>;
export type PerformanceObjectiveSchema = z.infer<
  typeof performanceObjectiveSchema
>;
export type BehavioralAttributeData = z.infer<typeof behavioralAttributeSchema>;
