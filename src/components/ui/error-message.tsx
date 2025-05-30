import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-950/30 p-3 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/50",
        className
      )}
    >
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
