import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Link from 'next/link';
import { AppSidebar } from "./app-sidebar";
import { Metadata } from "next";

export const metadata: Metadata ={
  title:{
    template:'%s | Balanced Score Card',
    default:'Balanced Score Card',
    
  }
}
export default function Layout({children}:{children: React.ReactNode}) {
  return (
     <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col p-4 w-full min-h-dvh ">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>

  )
}