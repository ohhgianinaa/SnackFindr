import { cn } from "@/lib/utils";
import { Text, View, ViewProps } from "react-native";

interface BadgeProps extends ViewProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error";
}

export function Badge({ label, variant = "default", className, ...props }: BadgeProps) {
  return (
    <View
      {...props}
      className={cn(
        "flex-row items-center px-3 py-1 rounded-full border-2 border-black",
        variant === "default" && "bg-surface",
        variant === "success" && "bg-success",
        variant === "warning" && "bg-warning",
        variant === "error"   && "bg-error",
        className
      )}
    >
      <Text
        className={cn(
          "font-sans-bold text-xs uppercase tracking-widest",
          variant === "error" ? "text-white" : "text-black"
        )}
      >
        {label}
      </Text>
    </View>
  );
}
