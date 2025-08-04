"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button, ButtonProps } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { BehavioralAttributeData } from "@/lib/types";
import { useState } from "react";
import { deleteBehavioralAttributeMutation } from "./mutation";

interface ButtonDeleteBehavioralAttributeProps extends ButtonProps {
  behavioralAttribute: BehavioralAttributeData;
}

export default function ButtonDeleteBehavioralAttribute({
  behavioralAttribute,
  ...props
}: ButtonDeleteBehavioralAttributeProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        title={
          behavioralAttribute
            ? "Edit BehavioralAttribute"
            : "Add BehavioralAttribute"
        }
        onClick={() => setOpen(true)}
        {...props}
      />
      <DialogDeleteBehavioralAttribute
        open={open}
        setOpen={setOpen}
        behavioralAttribute={behavioralAttribute}
      />
    </>
  );
}

interface DialogDeleteBehavioralAttributeProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  behavioralAttribute: BehavioralAttributeData;
}
export function DialogDeleteBehavioralAttribute({
  open,
  setOpen,
  behavioralAttribute,
}: DialogDeleteBehavioralAttributeProps) {
  const { isPending, mutate } = deleteBehavioralAttributeMutation();
  const deleteItem = () =>
    mutate(behavioralAttribute.id, { onSuccess: () => setOpen(false) });

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`Delete Behavioral Attribute of "${behavioralAttribute.attribute}"`}
      description="Please know that this action can not be undone, proceed with caution."
    >
      <DialogFooter>
        <Button variant={"outline"} onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <LoadingButton
          loading={isPending}
          variant={"destructive"}
          onClick={deleteItem}
        >
          Delete
        </LoadingButton>
      </DialogFooter>
    </ResponsiveDrawer>
  );
}
