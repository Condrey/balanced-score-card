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
import { NdpData, OspData } from "@/lib/types";
import { ospSchema, OspSchema } from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { upsertOspMutation } from "../mutation";
import FormOspProgrammes from "./form-osp-programmes";
import FormOspStrategies from "./form-osp-strategies";

interface FormAddEditOspProps {
  osp?: OspData;
  open: boolean;
  setOpen: (open: boolean) => void;
  ndp: NdpData;
}

export default function FormAddEditOsp({
  osp,
  open,
  setOpen,
  ndp,
}: FormAddEditOspProps) {
  const form = useForm<OspSchema>({
    resolver: zodResolver(ospSchema),
    values: {
      id: osp?.id || "",
      ndpId: osp?.ndpId || ndp.id || "",
      strategicObjective: osp?.strategicObjective || "",
      programmes: osp?.programmes.map((p) => ({ value: p })) || [],
      strategies: osp?.strategies.map((p) => ({ value: p })) || [],
    },
  });
  const { mutate, isPending } = upsertOspMutation(ndp.id!);
  const onSubmit = (input: OspSchema) =>
    mutate(input, { onSuccess: () => setOpen(false) });

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={osp ? `Update this OSP` : "Add a new OSP"}
      className="max-w-4xl"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 *:flex-1 w-full md:divide-x md:flex-row"
        >
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="strategicObjective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strategic Objective</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter the strategic objective"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormOspProgrammes form={form} />
          </div>
          <div className="flex flex-col gap-4 md:ps-4">
            <FormOspStrategies form={form} />
            <LoadingButton loading={isPending} type="submit" className="w-full">
              {osp ? "Update" : "Create"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
