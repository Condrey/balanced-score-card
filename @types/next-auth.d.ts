import { PositionData } from "@/lib/types";
import { Role } from "@prisma/client";
import "next-auth";
import { DefaultSession } from "next-auth";
import "types";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			position?: PositionData;
			organizationId?: string;
			role: Role;
		} & DefaultSession["user"];
	}
	interface User extends DefaultUser {
		id: string;
		position?: PositionData;
		organizationId?: string;
		role: Role;
	}
}
