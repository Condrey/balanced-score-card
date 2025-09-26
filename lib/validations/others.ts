import { OrganizationStructure } from "@prisma/client";
import z from "zod";

export const stringArraySchema = z.object({
	id: z.string().optional().describe("this should be a random uuid() number"),
	value: z.string()
});
export type StringArraySchema = z.infer<typeof stringArraySchema>;

export const dutySchema = z.object({
	id: z.string().optional(),
	duty: z.string()
});
export type DutySchema = z.infer<typeof dutySchema>;

export const positionSchema = z.object({
	id: z.string().optional(),
	jobTitle: z.string().min(1, "Job title is required"),
	departmentalMandate: z.string().min(10, "Departmental mandate must be at least 10 characters"),
	reportsToId: z.string().optional(),
	salaryScale: z.string().min(1, "Salary scale is required"),
	duties: z.array(stringArraySchema)
});
export type PositionSchema = z.infer<typeof positionSchema>;

export const organizationSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, "Please enter organization name"),
	voteName: z.string().min(1, "Please include vote name"),
	structure: z.nativeEnum(OrganizationStructure)
});
export type OrganizationSchema = z.infer<typeof organizationSchema>;

export const organizationContextSchema = z.object({
	id: z.string().optional(),
	financialYear: z.string().min(1, "FY is a must"),
	mandate: z.string().min(1, "Please provide a mandate"),
	vision: z.string().min(1, "Please provide a vision"),
	mission: z.string().min(1, "Please provide a mission"),
	goal: z.string().min(1, "Please provide a goal"),
	organizationId: z.string().min(1, "Context must belong to an organization")
});
export type OrganizationContextSchema = z.infer<typeof organizationContextSchema>;

export const ospSchema = z.object({
	id: z.string().optional(),
	strategicObjective: z.string().min(1, "This field is required."),
	strategies: z
		.array(stringArraySchema)
		.min(1, "Please enter at least one strategy.")
		.min(1, "Please provide at least one strategy."),
	programmes: z
		.array(stringArraySchema)
		.min(1, "Please enter at least one programme.")
		.min(1, "Please provide at least one programme."),
	ndpId: z.string().min(1, "It should belong to a NDP.")
});
export type OspSchema = z.infer<typeof ospSchema>;

export const ndpSchema = z.object({
	id: z.string().optional(),
	version: z.string().min(1, "Specify the NDP version"),
	programmes: z
		.array(stringArraySchema)
		.min(1, "Please enter at least one programme.")
		.min(1, "Please provide at least one programmes")
	// osps: z.array(ospSchema).min(1, "Please provide at least one osp"),
});
export type NdpSchema = z.infer<typeof ndpSchema>;

// Miscellaneous
// Behavioral attribute validation schema
export const behavioralAttributeSchema = z.object({
	id: z.string().optional().describe("this should be a random uuid() number"),
	attribute: z
		.string()
		.min(2, "Attribute must be at least 2 characters")
		.describe("Specific behavioral attribute being assessed"),
	percentage: z.number().min(0).max(100).describe("Weight/percentage allocation for this behavioral attribute"),
	description: z
		.string()
		.min(5, "Description must be at least 5 characters")
		.describe("Detailed description of the behavioral attribute"),
	score: z.number().min(0).max(100).describe("Score achieved for this behavioral attribute"),
	commentsJustification: z.string().optional().describe("Comments and justification for the score given")
});
export const organizationContextPropsSchema = z.object({
	organizationId: z.string().min(1, "The organization id is missing"),
	financialYear: z.string().min(1, "Financial year is required."),
	position: z.string().min(1, "Please provide a position."),
	ndpProgrammes: z.array(stringArraySchema).optional(),
	behavioralAttributes: z.array(behavioralAttributeSchema).optional()
});
export type OrganizationContextPropsSchema = z.infer<typeof organizationContextPropsSchema>;

export const scheduleOfDutySchema = z
	.object({
		id: z.string().optional().describe("this should be a random uuid() number"),
		positionId: z.string().min(1, "Position  is required").describe("The unique identifier for the job position"),
		jobTitle: z.string().describe("The job title of the position whose schedule of duty is being generated"),
		location: z.string().describe(`This is the location or facility where the job is being performed, 
		e.g Enrolled Nurse (OPD) and Enrolled Nurse (MALE WARD), Office Attendant (Central Registry) and Office Attendant (Engineering and Works Department or even Service Commission)`),
		jobSummary: z.string().describe(`
		Presents usually, in one sentence, the key outputs of the job or why the job exists as  distinct from other jobs in the cadre. 
		e.g DHO -  managing health service delivery in the district. ( Planning, budgeting, coordination, supervision, advocacy, partnership
`),
		resultAreas: z.array(stringArraySchema).describe("Key Results Areas/ Duties/ Responsibilities of the job title"),
		outputActivities: z
			.array(
				z.object({
					output: z.string().describe(`
		An area where a job holder must produce results e.g. Outputs for an Hospital Director include:
			i. 	Planning 
			ii. Budgeting 
			iii.Coordination 
			iv. Supervision
		Outputs for OPD nurse may include:
			i.	Patient Triage
			ii.	Vital Signs Monitoring
			iii.Patient Education
			iv.	Medication Administration
			v.	Wound Care
			vi. Patients for Surgery prepared

`),
					activities: z.array(stringArraySchema).describe(`
				Activities performed to realize the output e.g. Activities for Planning include:
				i.i.	Prepare annual work plans
				i.ii.	Prepare quarterly work plans
				Activities for OPD nurse may include:
				vi.i. Reassuring the patients and relatives
				vi.ii. Monitoring patients
				vi.iii. Sterilizing the theater
				vi.iv. Taking patients to theater
				vi.v. Preparing Post Surgical Bed
				vi.vi. Taking patient to recovery room
				NB: Activities are derived from the outputs with which the job holder is expected to deliver
`)
				})
			)
			.describe("Key activities are derived from the outputs with which the job holder is expected to deliver. Maintain the roman numeral numbering."),
		clients: z
			.array(stringArraySchema)
			.describe("Clients/ People the Officer relates with in execution of his/her duties"),
		reportingArrangements: z.array(stringArraySchema).describe("Reporting arrangements in the organization"),
		guidingDocuments: z
			.array(stringArraySchema)
			.describe(
				"Guiding documents in execution of duties e.g NDP programmes, 5 year development plan, relevant gov't regulatory bodies, standing order, CSOs, MDA bodies, regulatory bodies, e.t.c."
			)
	})
	.describe("Schema for validating schedule of duty data");
export type ScheduleOfDutySchema = z.infer<typeof scheduleOfDutySchema>;
export const sdRequestSchema = z.object({
	positionId: z.string().min(1, "Position  is required").describe("The unique identifier for the job position"),
	location: z.string().describe(`This is the location or facility where the job is being performed, 
        e.g Enrolled Nurse (OPD) and Enrolled Nurse (MALE WARD), Office Attendant (Central Registry) and Office Attendant (Engineering and Works Department or even Service Commission)`)
});
export type SdRequestSchema = z.infer<typeof sdRequestSchema>;
