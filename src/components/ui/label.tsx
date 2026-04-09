import { cn } from "@/lib/utils";
import type { LabelHTMLAttributes } from "react";

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-xs uppercase tracking-[0.15em] text-white/50 mb-1",
        className,
      )}
      {...props}
    />
  );
}
