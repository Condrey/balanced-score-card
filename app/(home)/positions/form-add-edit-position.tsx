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
import { PositionData } from "@/lib/types";
import { positionSchema, PositionSchema } from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import cuid from "cuid";
import { useForm } from "react-hook-form";
import FormDuties from "./form-duties";
import FormSupervisor from "./form-supervisor";
import { upsertPositionMutation } from "./mutation";

interface FormAddEditPositionProps {
  position?: PositionData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormAddEditPosition({
  position,
  open,
  setOpen,
}: FormAddEditPositionProps) {
  const form = useForm<PositionSchema>({
    resolver: zodResolver(positionSchema),
    values: {
      id: position?.id || "",
      jobTitle: position?.jobTitle || "",
      departmentalMandate: position?.departmentalMandate || "",
      reportsToId: position?.reportsToId || "",
      salaryScale: position?.salaryScale || "",
      duties: position?.duties.map((p) => ({ id: cuid(), duty: p })) || [],
    },
  });
  const { mutate, isPending } = upsertPositionMutation();
  const onSubmit = (input: PositionSchema) =>
    mutate(input, { onSuccess: () => setOpen(false) });
  
  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={position ? "Edit this position" : "Add a new position"}
      description={
        position
          ? "Make changes to this position"
          : "Create a new position in the database."
      }
      className="max-w-4xl"
    >
      <Form {...form}>
        <form className="flex gap-2 *:flex-1 border-t flex-col md:flex-row md:divide-x " onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col  gap-4">
            <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Job Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> <FormField
            control={form.control}
            name="salaryScale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Scale</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., U7 " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />  <FormSupervisor form={form} />
          <FormField
            control={form.control}
            name="departmentalMandate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job purpose/ Departmental Mandate</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="job purpose from Job description "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
       
          </div>
         <div className="flex flex-col md:ps-2   gap-4"> 
          <FormDuties form={form} />
          <LoadingButton loading={isPending} type="submit" className="w-full">
            {position ? "Update" : "Create"}
          </LoadingButton></div>
        </form>
      </Form>
    </ResponsiveDrawer>
  );
}
