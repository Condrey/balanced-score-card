import kyInstance from "@/lib/ky";
import { OrganizationContextData } from "@/lib/types";
import { BSCFormData, IndividualBSCSchema, PerformanceObjectiveArraySchema } from "@/lib/validations/bsc";
import {
	OrganizationContextPropsSchema,
	ScheduleOfDutySchema,
	SdRequestSchema,
	stringArraySchema
} from "@/lib/validations/others";
import z from "zod";
import { createBSC } from "./action";

interface AiGenerationComponentProps {
	index: number;
	staff: IndividualBSCSchema;
	organizationId: string;
	positionId: string;
	setMsg: (index: number, message: string | undefined) => void;
}

export async function useGenerateAiDataForBSC({
	setMsg,
	index,
	organizationId,
	staff,
	positionId
}: AiGenerationComponentProps) {
	const outputSchema = z.array(stringArraySchema);
	type OutputSchema = z.infer<typeof outputSchema>;

	setMsg(index, `Created supervisee and supervisor details`);
	try {
		setMsg(index, `Getting your NDPs`);
		// Step 1

		const res = await kyInstance.post("/api/form/strategic-elements", {
			json: {
				organizationId,
				financialYear: staff.year,
				position: positionId
			} satisfies OrganizationContextPropsSchema
		});
		const data = await res.json<
			| {
					ndps: OutputSchema;
					organizationContext: OrganizationContextData;
					userObjectives: OutputSchema;
					clients: string[];
					mandate: string;
			  }
			| string
		>();
		console.log("Parsed response:", data);
		if (typeof data === "string") {
			setMsg(index, data);
		} else {
			const { mission, vision, goal, behavioralAttributes, coreValue } = data.organizationContext;
			const bsc = buildBscData({
				strategicElements: {
					ndpProgrammes: data.ndps,
					strategicObjectives: data.userObjectives,
					departmentalMandate: "This is to be got from PBS",
					goal,
					mandate: data.mandate,
					mission,
					vision
				},
				clients: data.clients.map((c) => ({ id: "", value: c })),
				behavioralAttributes: behavioralAttributes.map((bA) => ({
					...bA,
					commentsJustification: bA.commentsJustification || "",
					description: bA.description || ""
				})),
				coreValues: coreValue!,
				performanceObjectives: [],
				supervisee: staff.supervisee,
				supervisor: staff.supervisor,
				year: staff.year,
				organizationId
			} satisfies BSCFormData);

			setMsg(index, "NDPs retrieved successfully, Strategic objectives generated, mandate, vision, mission, e.t.c.");

			// Step 2
			setMsg(index, "Getting your performance plan");
			const res2 = await kyInstance.post("/api/form/performance-plan", {
				json: {
					organizationId,
					financialYear: staff.year,
					position: staff.supervisee.id!,
					behavioralAttributes: bsc.behavioralAttributes
				} satisfies OrganizationContextPropsSchema
			});
			const data2 = await res2.json<PerformanceObjectiveArraySchema | string>();
			if (typeof data2 === "string") {
				setMsg(index, data2);
			} else {
				bsc.performanceObjectives = data2.performanceObjectives;
				setMsg(index, "Performance plan retrieved successfully");
				// step 3
				setMsg(index, "Making for you the schedule of duties");
				const res3 = await kyInstance.post("/api/form/schedule-of-duty", {
					json: {
						positionId: positionId,
						location: bsc.supervisee.location || ""
					} satisfies SdRequestSchema
				});
				const data3 = await res3.json<ScheduleOfDutySchema | string>();
				if (typeof data3 === "string") {
					setMsg(index, data3);
				} else {
					bsc.scheduleOfDuty = data3;
					setMsg(index, "SD has been created.");

					// bsc creation is now done
					const hasCreatedBsc = await createBSC(bsc);
					setMsg(
						index,
						hasCreatedBsc
							? `Successfully created BSC for ${staff.supervisee.name}`
							: `Failed to create BSC for ${staff.supervisee.name}`
					);
				}
			}
		}
	} catch (error) {
		console.error("API error:", error);
		setMsg(index, "Failed with error:" + JSON.stringify(error));
	}
}

const buildBscData = (apiResponse: any): BSCFormData => {
	return {
		behavioralAttributes: apiResponse.behavioralAttributes,
		performanceObjectives: apiResponse.performanceObjectives,
		strategicElements: apiResponse.strategicElements,
		scheduleOfDuty: apiResponse.scheduleOfDuty,
		organizationId: apiResponse.organizationId,
		coreValues: apiResponse.coreValues,
		supervisee: apiResponse.supervisee,
		supervisor: apiResponse.supervisor,
		year: apiResponse.year,
		clients: apiResponse.clients,
		id: apiResponse.id
	};
};
