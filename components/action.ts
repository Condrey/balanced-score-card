"use server";

import { signIn, signOut } from "@/auth";

export async function signOutUser() {
	return await signOut({ redirectTo: "/welcome", redirect: true });
}

export async function signInUser() {
	return await signIn("google", { redirectTo: "/" });
}
