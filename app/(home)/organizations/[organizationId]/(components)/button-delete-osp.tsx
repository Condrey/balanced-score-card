"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button, ButtonProps } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { OspData } from "@/lib/types";
import { useState } from "react";
import { deleteOspMutation } from "../mutation";

interface ButtonDeleteOspProps extends ButtonProps {
  osp: OspData;
}

export default function ButtonDeleteOsp({
  osp,
  ...props
}: ButtonDeleteOspProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        title={osp ? "Edit Osp" : "Add Osp"}
        onClick={() => setOpen(true)}
        {...props}
      />
      <DialogDeleteOsp
        open={open}
        setOpen={setOpen}
        osp={osp}
      />
    </>
  );
}

interface DialogDeleteOspProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  osp: OspData;
}
export function DialogDeleteOsp({
  open,
  setOpen,
  osp,
  
}: DialogDeleteOspProps) {
  const { isPending, mutate } = deleteOspMutation();
  const deleteItem = () => mutate(osp.id, { onSuccess: () => setOpen(false) });

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`Delete OSP`}
      description="Please know that this action can not be undone, proceed with caution. This will delete the OSP and all its strategies and programmes."
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
