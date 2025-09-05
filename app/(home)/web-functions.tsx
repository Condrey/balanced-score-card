import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function WebFunctions() {
  return (
    <Card className="flex items-center gap-4">
      <Image
      height={300}
      width={400}
      alt="bsc-sample-image"
        className="mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-left ..."
        src="/bsc.png"
      />
      <div className="font-medium">
        <p className="font-mono text-xs uppercase text-blue-500 dark:text-blue-400">
          Speed
        </p>
        <p className="mt-2 text-base text-gray-700 dark:text-gray-300">
          Built for power users
        </p>
        <p className="mt-1 text-balance text-sm leading-relaxed text-gray-500">
          Work faster than ever with customizable keyboard shortcuts
        </p>
      </div>
    </Card>
  );
}
