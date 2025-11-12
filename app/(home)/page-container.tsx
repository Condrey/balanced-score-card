import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";

interface PageContainerProps {
	heading: NavItem[];
	className?: string;
	children: React.ReactNode;
}
export default function PageContainer({ heading, className, children }: PageContainerProps) {
	return (
		<main className="w-full">
			<header className="flex h-16 shrink-0 items-center  gap-2 ">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" >
						<MenuIcon/>
					</SidebarTrigger>
					<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							{heading.map((navItem, index, array) => (
								<div key={index} className="flex items-center">
									<BreadcrumbItem className={cn(index + 1 < array.length && "hidden md:block")}>
										{index + 1 === array.length ? (
											<BreadcrumbPage className="text-primary font-bold">{navItem.label}</BreadcrumbPage>
										) : (
											<BreadcrumbLink href={navItem.url} className="">
												{navItem.label}
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
									<BreadcrumbSeparator
										className={cn(
											index + 1 < array.length && "hidden md:block",
											index + 1 === array.length && "hidden"
										)}
									/>
								</div>
							))}
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<div className={cn("px-4 w-full ", className)}>{children}</div>
		</main>
	);
}
