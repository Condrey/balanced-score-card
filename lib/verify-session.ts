import "server-only";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cache } from "react";

export const verifySession = cache(async () => {
	const session = await auth();
	console.log({ session: "session been called" });
	if (!session) {
		redirect("/welcome");
	}

	return { session };
});
