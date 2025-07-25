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
import { NdpData, OrganizationContextData } from "@/lib/types";
import { ndpSchema, NdpSchema, OspSchema } from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { upsertNdpMutation } from "../mutation";
import FormProgrammes from "./form-programmes";

interface FormAddEditNdpProps {
  ndp?: NdpData;
  open: boolean;
  setOpen: (open: boolean) => void;
  context: OrganizationContextData;
}

export default function FormAddEditNdp({
  ndp,
  open,
  setOpen,
  context,
}: FormAddEditNdpProps) {
  const form = useForm<NdpSchema>({
    resolver: zodResolver(ndpSchema),
    values: {
      id: ndp?.id || "",
      version: ndp?.version || "",
      programmes: ndp?.programmes.map(p=>({value:p})) || [],
      //   osps: ndp?.osps as OspSchema[]|| [],
    },
  });
  const { mutate, isPending } = upsertNdpMutation(context.organizationId!);
  const onSubmit = (input: NdpSchema) =>
    mutate(
      { organizationContextId: context.id, input },
      { onSuccess: () => setOpen(false) },
    );

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={ndp ? `Update NDP ${ndp.version} version` : "Add a new NDP"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NDP Version</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., IV" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
<FormProgrammes form={form}/>
         <LoadingButton loading={isPending} type="submit" className="w-full">
                     {ndp ? "Update" : "Create"}
                   </LoadingButton>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
