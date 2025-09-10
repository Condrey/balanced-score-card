"use client";

import { useTransition } from "react";
import { signInUser } from "./action";
import { ButtonProps } from "./ui/button";
import LoadingButton from "./ui/loading-button";

interface SignInPops extends ButtonProps {}

export default function SignIn({ ...props }: SignInPops) {
	const [isPending, startTransition] = useTransition();
	async function handleButtonClick() {
		startTransition(async () => {
			await signInUser();
		});
	}
	return (
		<LoadingButton
			loading={isPending}
			title="Sign in with Google"
			onClick={handleButtonClick}
			className="items-center justify-center place-items-center justify-items-center"
			{...props}
		/>
	);
}
