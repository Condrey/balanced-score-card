'use client'

import ResponsiveDrawer from "@/components/responsive-drawer";
import { Form, FormField } from "@/components/ui/form";
import { OrganizationData } from "@/lib/types"
import { useForm } from "react-hook-form";

interface FormAddEditOrganizationProps{
    organization?: OrganizationData;
    open: boolean;
    setOpen: (open: boolean)=> void
}

export default function FormAddEditOrganization({organization,open,setOpen}:FormAddEditOrganizationProps){
const form = useForm()

    return <ResponsiveDrawer
    open={open} setOpen={setOpen} 
    title={organization?    `Update ${organization.name}`:'Add a new organization'}>
<Form {...form}>
    <form className="space-y-4">
    </form>
    </Form>
    </ResponsiveDrawer>
}