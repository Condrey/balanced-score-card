"use client";
import {
  HomeIcon,
  LetterTextIcon,
  Loader2Icon,
  LucideIcon,
  StoreIcon,
  VoteIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useTransition } from "react";

// Menu items.
const items = [
  {
    title: "Positions",
    url: "/admin/positions",
    icon: VoteIcon,
  },
  {
    title: "Organizations",
    url: "/admin/organizations",
    icon: StoreIcon,
  },
  {
    title: "Balance Score Cards",
    url: "/admin/bsc",
    icon: LetterTextIcon,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isHomeActive = pathname === "/admin";
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <Loader2Icon className="size-6 animate-spin" />
        </div>
      }
    >
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <ListItem
                  item={{ title: "Home", url: "/admin", icon: HomeIcon }}
                  isActive={isHomeActive}
                />
                {/* Map through items to create list items */}
                {items.map((item) => {
                  const isActive =
                    pathname.startsWith(item.url) && pathname !== "/admin";
                  return (
                    <ListItem
                      key={item.title}
                      item={item}
                      isActive={isActive}
                    />
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Suspense>
  );
}

const ListItem = ({
  item,
  isActive,
}: {
  item: { title: string; url: string; icon: LucideIcon };
  isActive: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const newUrl = getNavigationLinkWithPathnameWithoutUpdate(item.url);
  const Icon = item.icon;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={() => startTransition(() => {})}
        asChild
      >
        <Link href={newUrl}>
          {!isPending ? (
            <Icon className="size-4" />
          ) : (
            <Loader2Icon className="size-4 animate-spin" />
          )}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
