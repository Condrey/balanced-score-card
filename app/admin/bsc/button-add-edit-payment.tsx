"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { myPrivileges } from "@/lib/enums";
import { PaymentData } from "@/lib/types";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import FormAddEditPaymentForm from "./form-add-edit-payments";

interface ButtonAddEditPaymentProps extends ButtonProps {
	payment?: PaymentData;
	bSCId?: string;
	userId: string;
}

export default function ButtonAddEditPayment({ payment, bSCId, userId, ...props }: ButtonAddEditPaymentProps) {
	const [open, setOpen] = useState(false);
	const { data: session } = useSession();
	const role = session?.user.role || Role.USER;
	const isAdmin = myPrivileges[role].includes(Role.ADMIN);
	return (
		<>
			{isAdmin && <Button onClick={() => setOpen(true)} {...props} />}
			<FormAddEditPaymentForm open={open} setOpen={setOpen} payment={payment} bSCId={bSCId} userId={userId} />
		</>
	);
}
