import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-base text-alabaster placeholder:text-white/30 focus:border-alabaster focus:outline-none transition-colors",
        "text-[16px]", // prevents iOS zoom
        className,
      )}
      {...props}
    />
  );
}
