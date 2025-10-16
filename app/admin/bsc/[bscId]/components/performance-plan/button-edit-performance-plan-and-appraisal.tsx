"use client";

import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import kyInstance from "@/lib/ky";
import { PerformanceObjectiveArraySchema } from "@/lib/validations/bsc";
import { OrganizationContextPropsSchema } from "@/lib/validations/others";
import { BehavioralAttribute } from "@prisma/client";
import { useTransition } from "react";
import { toast } from "sonner";
import { useUpdatePerformancePlanMutation } from "./mutation";

interface ButtonEditPerformancePlanAndAppraisalProps extends ButtonProps {
	bscId: string;
	organizationId: string;
	year: string;
	position: string;
	behavioralAttributes: BehavioralAttribute[];
}
export default function ButtonEditPerformancePlanAndAppraisal({
	bscId,
	organizationId,
	year,
	position,
	behavioralAttributes,
	...props
}: ButtonEditPerformancePlanAndAppraisalProps) {
	const [isPending, startTransition] = useTransition();
	const { isPending: submitting, mutate } = useUpdatePerformancePlanMutation();

	function handleClickListener() {
		startTransition(async () => {
			try {
				const res = await kyInstance.post("/api/form/performance-plan", {
					json: {
						organizationId,
						financialYear: year,
						position,
						behavioralAttributes: behavioralAttributes.map((b) => ({
							...b,
							description: b.description!,
							commentsJustification: b.commentsJustification!
						}))
					} satisfies OrganizationContextPropsSchema
				});
				const data = await res.json<PerformanceObjectiveArraySchema | string>();
				if (typeof data === "string") {
					toast.error("Failed", { description: data });
				} else {
					// successfully retrieved the update
					mutate({ bscId, input: data });
				}
			} catch (error) {
				console.error("API error:", error);
				toast.error("Failed", { description: "Failed to get performance plan" + JSON.stringify(error) });
			}
		});
	}
	return <LoadingButton loading={isPending || submitting} onClick={handleClickListener} {...props} />;
}
