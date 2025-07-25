import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./button";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2 ", className)}
      {...props}
    >
      <span className="flex items-center ">
        {loading && <Loader2 className="size-5 animate-spin" />}
        <span className={cn("inline-flex", loading && "[&_svg]:hidden")}>
          {props.children}
        </span>
      </span>
    </Button>
  );
}
