"use client";
import { CoinsIcon, FileSpreadsheetIcon, HomeIcon, Loader2Icon, LucideIcon } from "lucide-react";

import SignOut from "@/components/sign-out";
import { CardTitle } from "@/components/ui/card";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail
} from "@/components/ui/sidebar";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useTransition } from "react";

// Menu items.
const items = [
	{
		title: "Payment History",
		url: "/payment-history",
		icon: CoinsIcon
	},
	{
		title: "Balance Score Cards",
		url: "/balanced-score-cards",
		icon: FileSpreadsheetIcon
	}
];

export function AppSidebar({ session, ...props }: { session: Session } & React.ComponentProps<typeof Sidebar>) {
	const user = session.user;
	const pathname = usePathname();
	const isHomeActive = pathname === "/";
	return (
		<Suspense
			fallback={
				<div className="flex h-full items-center justify-center">
					<Loader2Icon className="size-6 animate-spin" />
				</div>
			}
		>
			<Sidebar {...props} variant="inset">
				<SidebarHeader className="border-b bg-gradient-to-br dark:from-primary/20 from-primary/50 rounded-md">
					<CardTitle className="text-center text-primary-foreground">Balanced Score Card Generator</CardTitle>
					<div className="size-full mx-auto overflow-clip rounded-full w-full max-w-[120px] max-h-[120px] ">
						<Image src={user.image} height={200} width={200} alt="profile-image" className="" />
					</div>
					<div className="flex flex-col items-center">
						<span className="text-sm line-clamp-1 text-ellipsis">{user.name}</span>
						<p className="text-xs text-muted-foreground line-clamp-1 text-ellipsis">{user.email}</p>
					</div>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel className="text-primary">Navigation</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<ListItem item={{ title: "Home", url: "/", icon: HomeIcon }} isActive={isHomeActive} />
								{/* Map through items to create list items */}
								{items.map((item) => {
									const isActive = pathname.startsWith(item.url) && pathname !== "/";
									return <ListItem key={item.title} item={item} isActive={isActive} />;
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<SignOut variant={"secondary"}>Logout</SignOut>
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
		</Suspense>
	);
}

const ListItem = ({
	item,
	isActive
}: {
	item: { title: string; url: string; icon: LucideIcon };
	isActive: boolean;
}) => {
	const [isPending, startTransition] = useTransition();
	const { getNavigationLinkWithPathnameWithoutUpdate } = useCustomSearchParams();
	const newUrl = getNavigationLinkWithPathnameWithoutUpdate(item.url);
	const Icon = item.icon;
	return (
		<SidebarMenuItem>
			<SidebarMenuButton isActive={isActive} onClick={() => startTransition(() => {})} asChild>
				<Link href={newUrl}>
					{!isPending ? <Icon className="size-4" /> : <Loader2Icon className="size-4 animate-spin" />}
					<span>{item.title}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};
