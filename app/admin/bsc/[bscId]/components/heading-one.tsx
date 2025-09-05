import { cn } from "@/lib/utils";

export default function HeadingOne({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "text-xl font-bold uppercase tracking-tighter sm:text-2xl",
        className,
      )}
    >
      {title}
    </h1>
  );
}
