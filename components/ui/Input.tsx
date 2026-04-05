import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-4 text-text-secondary pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "h-12 w-full bg-white border-2 border-black rounded-full font-sans text-sm text-black placeholder:text-text-secondary",
            "shadow-[2px_2px_0px_#000000]",
            "outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_#000000]",
            "transition-transform",
            leftIcon  ? "pl-11 pr-4" : "px-4",
            rightIcon ? "pr-11"      : "",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-4 text-text-secondary">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
