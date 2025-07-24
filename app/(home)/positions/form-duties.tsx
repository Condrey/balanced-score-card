import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DutySchema, PositionSchema } from "@/lib/validations/others";
import cuid from "cuid";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

interface FormDutiesProps {
  form: UseFormReturn<PositionSchema>;
}

export default function FormDuties({ form }: FormDutiesProps) {
  const {
    append: appendValue,
    fields: valueFields,
    remove: removeValue,
  } = useFieldArray({ control: form.control, name: "duties" });
  const [newValue, setNewValue] = useState<DutySchema>({id:'',duty:''});
  const addValue = () => {
    if (newValue.duty.trim()) {
      appendValue(newValue);
      setNewValue({id:cuid(),duty:''});
    }
  };
  return (
    <>
      <FormField
        control={form.control}
        name="duties"
        render={({ field }) => (
          <FormItem >
            <FormLabel>Duties</FormLabel>
            <div className="flex items-center  gap-2">  
   <Input
              value={newValue.duty}
              onChange={(e) => setNewValue({id: cuid(), duty:e.target.value})}
              placeholder="Enter a duty from job description"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addValue())
              }
            />
            <Button type="button" onClick={addValue} size="icon" variant={'outline'}>
              <PlusIcon className="h-4 w-4" />
            </Button>
            </div>
         <FormMessage/>
          </FormItem>
        )}
      />

      <div className="flex flex-col gap-2">
        {valueFields.map((field, index) => (
          <Badge
            key={field.id}
            variant="secondary"
            className="flex items-center gap-1 w-fit max-w-sm"
          >
            <span className='text-ellipsis line-clamp-1'>{form.watch(`duties.${index}.duty`)}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => removeValue(index)}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </>
  );
}
