"use client";

import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import kyInstance from "@/lib/ky";
import { ScheduleOfDutySchema, SdRequestSchema } from "@/lib/validations/others";
import { useTransition } from "react";
import { toast } from "sonner";
import { useUpdateScheduleOfDutyMutation } from "./mutation";

interface ButtonEditScheduleOfDutyProps extends ButtonProps {
	positionId: string;
	location: string;
	bscId: string;
}
export default function ButtonEditScheduleOfDuty({
	positionId,
	location,
	bscId,
	...props
}: ButtonEditScheduleOfDutyProps) {
	const [isPending, startTransition] = useTransition();
	const { isPending: submitting, mutate } = useUpdateScheduleOfDutyMutation();

	function handleClickListener() {
		startTransition(async () => {
			try {
				const res = await kyInstance.post("/api/form/schedule-of-duty", {
					json: {
						positionId,
						location
					} satisfies SdRequestSchema
				});
				const data = await res.json<ScheduleOfDutySchema | string>();
				if (typeof data === "string") {
					toast.error("Failed", { description: data });
				} else {
					// successfully retrieved the update
					mutate({ bscId, input: data });
				}
			} catch (error) {
				console.error("API error:", error);
				toast.error("Failed", { description: "Failed to Create your schedule of duty " + JSON.stringify(error) });
			}
		});
	}
	return <LoadingButton loading={isPending || submitting} onClick={handleClickListener} {...props} />;
}
