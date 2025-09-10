import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { AppSidebar } from "./app-sidebar";

export const metadata: Metadata = {
	title: {
		template: "%s | Balanced Score Card",
		default: "Balanced Score Card"
	}
};
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex min-h-dvh w-full flex-1 flex-col p-4">
				<SidebarTrigger />
				{children}
			</main>
		</SidebarProvider>
	);
}
