import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "./lib/prisma";
import { positionDataInclude } from "./lib/types";
import { sendWelcomeRemarksEmail } from "./app/api/core/email";
import { truncateSync } from "node:fs";

export const { handlers, signIn, signOut, auth } = NextAuth({
	theme: { colorScheme: "auto", brandColor: "--primary", logo: "/bsc.png" },
	adapter: PrismaAdapter(prisma),
	providers: [Google],
	callbacks: {
		async session({ session, user }) {
			const { id } = user;
			let roleUser;
			try {
				roleUser = await prisma.user.findUnique({
					where: { id },
					include: { position: { include: positionDataInclude } }
				});
				if (!roleUser) {
					// Handle the case where the user is not found
					console.error(`User with id ${id} not found in the database.`);
					throw new Error("User not found");
				}

				// Update session with user data
				session.user = {
					...session.user,
					id: id,
					role: roleUser.role || "USER",
					organizationId: roleUser.organizationId!,
					position: roleUser.position!
				};
				// Send welcome email
				if (!roleUser.emailVerified) {
					await sendWelcomeRemarksEmail({ email: roleUser.email, name: roleUser.name || roleUser.email });
					await prisma.user.update({
						where: { id },
						data: {
							emailVerified: new Date()
						}
					});
				}
			} catch (error) {
				console.error("Severe Auth error: ", error);
			}

			// send email

			return session;
		}
	}
});
