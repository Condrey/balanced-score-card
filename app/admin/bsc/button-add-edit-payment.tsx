"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { PaymentData } from "@/lib/types";
import { useState } from "react";
import FormAddEditPaymentForm from "./form-add-edit-payments";

interface ButtonAddEditPaymentProps extends ButtonProps {
	payment?: PaymentData;
	bSCId?: string;
	userId: string;
}

export default function ButtonAddEditPayment({ payment, bSCId, userId, ...props }: ButtonAddEditPaymentProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setOpen(true)} {...props} />
			<FormAddEditPaymentForm open={open} setOpen={setOpen} payment={payment} bSCId={bSCId} userId={userId} />
		</>
	);
}
