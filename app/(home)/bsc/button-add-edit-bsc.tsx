"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

interface ButtonAddEditBSCProps extends ButtonProps {}

export default function ButtonAddEditBSC({
  children,
  ...props
}: ButtonAddEditBSCProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} {...props} asChild />
      <Link href={"/bsc/add-edit-bsc"} className="flex gap-2 items-center">
        {children}
      </Link>
    </>
  );
}
