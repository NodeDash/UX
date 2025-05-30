import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  // Add any specific props for variants or colors later if needed
  variant?: "default" | "secondary" | "destructive" | "outline"; // Example variants
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  children,
  ...props
}) => {
  // Define base styles and variant styles using Tailwind CSS
  // Styles adapted from shadcn/ui Badge component for consistency
  const baseStyles =
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variantStyles = {
    default:
      "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
    outline: "text-foreground",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
