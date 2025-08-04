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
import { Textarea } from "@/components/ui/textarea";
import { OrganizationContextData } from "@/lib/types";
import {
  organizationContextSchema,
  OrganizationContextSchema,
} from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { upsertOrganizationContextMutation } from "../../mutation";

interface FormAddEditOrganizationContextProps {
  organizationContext?: OrganizationContextData;
  open: boolean;
  setOpen: (open: boolean) => void;
  organizationId: string;
}

export default function FormAddEditOrganizationContext({
  organizationContext,
  open,
  setOpen,
  organizationId,
}: FormAddEditOrganizationContextProps) {
  const form = useForm<OrganizationContextSchema>({
    resolver: zodResolver(organizationContextSchema),
    values: {
      id: organizationContext?.id || "",
      financialYear: organizationContext?.financialYear || "",
      goal: organizationContext?.goal || "",
      mandate: organizationContext?.mandate || "",
      mission: organizationContext?.mission || "",
      vision: organizationContext?.vision || "",
      organizationId:
        organizationContext?.organizationId || organizationId || "",
    },
  });
  const { mutate, isPending } = upsertOrganizationContextMutation();
  const onSubmit = (input: OrganizationContextSchema) =>
    mutate(input, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={
        organizationContext
          ? `Update ${organizationContext.financialYear} context`
          : "Add a new organizationContext"
      }
      className="max-w-4xl"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-4 *:flex-1 border-t flex flex-col md:flex-row md:divide-x"
        >
          <div className="flex flex-col gap-4  ">
            <FormField
              control={form.control}
              name="financialYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Year</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2025/2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mandate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mandate</FormLabel>
                  <FormControl>
                    <Textarea placeholder="enter the mandate here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vision</FormLabel>
                  <FormControl>
                    <Textarea placeholder="enter the vision here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" flex flex-col md:ps-4 gap-4 ">
            <FormField
              control={form.control}
              name="mission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mission</FormLabel>
                  <FormControl>
                    <Textarea placeholder="enter the mission here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal</FormLabel>
                  <FormControl>
                    <Textarea placeholder="enter the goal here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton loading={isPending} type="submit" className="w-full">
              {organizationContext ? "Update" : "Create"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
