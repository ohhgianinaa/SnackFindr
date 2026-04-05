import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error";
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full border-2 border-black text-xs font-bold uppercase tracking-wide",
        variant === "default" && "bg-surface text-black",
        variant === "success" && "bg-[#00E676] text-black",
        variant === "warning" && "bg-[#FFD600] text-black",
        variant === "error"   && "bg-[#FF1744] text-white",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
