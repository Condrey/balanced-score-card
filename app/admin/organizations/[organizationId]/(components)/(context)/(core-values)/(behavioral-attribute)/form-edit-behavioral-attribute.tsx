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
import { BehavioralAttributeData } from "@/lib/types";
import {
  behavioralAttributeSchema,
  type BehavioralAttributeSchema,
} from "@/lib/validations/bsc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { upsertBehavioralAttributeMutation } from "./mutation";

interface FormAddEditBehavioralAttributeProps {
  organizationContextId: string;
  behavioralAttribute?: BehavioralAttributeData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function FormAddEditBehavioralAttribute({
  behavioralAttribute,
  organizationContextId,
  open,
  setOpen,
}: FormAddEditBehavioralAttributeProps) {
  const form = useForm<BehavioralAttributeSchema>({
    resolver: zodResolver(behavioralAttributeSchema),
    values: {
      id: behavioralAttribute?.id || "",
      percentage: behavioralAttribute?.percentage || 0,
      attribute: behavioralAttribute?.attribute || "",
      commentsJustification: behavioralAttribute?.commentsJustification || "",
      description: behavioralAttribute?.description || "",
      score: behavioralAttribute?.score || 0,
    },
  });
  const { mutate, isPending } = upsertBehavioralAttributeMutation();
  function submitForm(input: BehavioralAttributeSchema) {
    mutate(
      { input, organizationContextId },
      {
        onSuccess: () => setOpen(false),
      },
    );
  }

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`${
        behavioralAttribute
          ? `Edit "${behavioralAttribute.attribute}"`
          : "Create"
      } behavioral attribute`}
      description={
        behavioralAttribute
          ? `Make changes to behavioral attribute ${behavioralAttribute.attribute}`
          : `Create the organization's behavioral attribute from the core values`
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
          {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
          <FormField
            control={form.control}
            name="attribute"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attribute</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter behavioral attribute"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Score</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`Enter score for the ${form.watch(
                      "attribute",
                    )} behavioral attribute`}
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={`Enter description for ${form.watch(
                      "attribute",
                    )} behavioral attribute`}
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton loading={isPending} type="submit" className="w-full">
            {!behavioralAttribute ? "Create" : "Update"}
          </LoadingButton>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
