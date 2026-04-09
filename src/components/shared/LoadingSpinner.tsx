import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="h-6 w-6 border-2 border-alabaster/20 border-t-alabaster animate-spin" />
    </div>
  );
}
