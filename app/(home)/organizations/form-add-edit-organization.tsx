"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allOrganizationStructures, organizationStructures } from "@/lib/enums";
import { OrganizationData } from "@/lib/types";
import {
  organizationSchema,
  OrganizationSchema,
} from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationStructure } from "@prisma/client";
import { useForm } from "react-hook-form";
import { upsertOrganizationMutation } from "./mutation";

interface FormAddEditOrganizationProps {
  organization?: OrganizationData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditOrganization({
  organization,
  open,
  setOpen,
}: FormAddEditOrganizationProps) {
  const form = useForm<OrganizationSchema>({
    resolver: zodResolver(organizationSchema),
    values: {
      id: organization?.id || "",
      name: organization?.name || "",
      voteName: organization?.voteName || "",
      structure: organization?.structure || OrganizationStructure.DISTRICT,
    },
  });
  const { mutate, isPending } = upsertOrganizationMutation();
  const onSubmit = (input: OrganizationSchema) =>
    mutate(input, { onSuccess: () => {form.reset();setOpen(false)} });

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={
        organization ? `Update ${organization.name}` : "Add a new organization"
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Lira City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="voteName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vote/ Site code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 606" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="structure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization structure</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select structure" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Structures</SelectLabel>
                      {allOrganizationStructures.map((structure) => {
                        const { icon, label } =
                          organizationStructures[structure];
                        const Icon = icon;
                        return (
                          <SelectItem key={structure} value={structure}>
                            <div className="flex flex-row items-center w-full">
                              <Icon className="size-4 mr-2" /> {label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton loading={isPending} type="submit" className="w-full">
            {organization ? "Update" : "Create"}
          </LoadingButton>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
