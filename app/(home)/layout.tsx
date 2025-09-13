import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { verifySession } from "@/lib/verify-session";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { AppSidebar } from "./app-sidebar";
import BSCFormInitialData from "./bsc-form-initial-data";

export const metadata: Metadata = {
	title: { absolute: "BSC Generator", template: `%s | BSC Generator`, default: "BSC Generator" }
};
export default async function Layout({ children }: { children: React.ReactNode }) {
	const { session } = await verifySession();
	const user = session.user;
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar session={session!} />
			<SidebarInset>
				<>{!user.organizationId || !user.position ? <BSCFormInitialData /> : <>{children}</>}</>
			</SidebarInset>
		</SidebarProvider>
	);
}
