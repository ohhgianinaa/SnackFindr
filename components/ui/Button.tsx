import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "icon";
  size?: "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "lg", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base
          "inline-flex items-center justify-center font-bold font-sans border-2 border-black transition-transform select-none cursor-pointer",
          // Neubrutalist hard shadow + press effect
          "shadow-[2px_2px_0px_#000000]",
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
          "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000000]",
          // Variants
          variant === "primary" && "bg-black text-white",
          variant === "secondary" && "bg-white text-black",
          variant === "icon" && "bg-white text-black w-12 h-12 p-0 rounded-2xl",
          // Sizes
          size === "lg" && variant !== "icon" && "h-14 px-6 text-base rounded-2xl",
          size === "md" && variant !== "icon" && "h-12 px-5 text-sm rounded-2xl",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
