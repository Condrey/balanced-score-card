"use client";

import { useTransition } from "react";
import { signOutUser } from "./action";
import { ButtonProps } from "./ui/button";
import LoadingButton from "./ui/loading-button";

interface SignOutPops extends ButtonProps {}

export default function SignOut({ ...props }: SignOutPops) {
	const [isPending, startTransition] = useTransition();
	async function handleButtonClick() {
		startTransition(async () => {
			await signOutUser();
		});
	}
	return (
		<LoadingButton loading={isPending} title="Sign out of the application" onClick={handleButtonClick} {...props} />
	);
}
