import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { verifySession } from "@/lib/verify-session";
import { cookies } from "next/headers";
import { AppSidebar } from "./app-sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: { absolute: "BSC Generator", template: `%s | BSC Generator`, default: "BSC Generator" }
};
export default async function Layout({ children }: { children: React.ReactNode }) {
	const { session } = await verifySession();
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar session={session!} />
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
