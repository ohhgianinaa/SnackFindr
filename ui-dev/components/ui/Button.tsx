import { cn } from "@/lib/utils";
import { Pressable, Text, PressableProps, View } from "react-native";

interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "icon" | "accent";
  size?: "md" | "lg";
  label?: string;
  children?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "lg",
  label,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      {...props}
      className={cn(
        "items-center justify-center border-2 border-black active:translate-x-[2px] active:translate-y-[2px]",
        variant === "primary"   && "bg-black rounded-2xl",
        variant === "secondary" && "bg-white rounded-2xl",
        variant === "accent"    && "bg-accent rounded-2xl",
        variant === "icon"      && "bg-white rounded-2xl w-12 h-12",
        size === "lg" && variant !== "icon" && "h-14 px-6",
        size === "md" && variant !== "icon" && "h-12 px-5",
        className
      )}
      style={({ pressed }) => ({
        shadowColor: "#000",
        shadowOffset: { width: pressed ? 0 : 2, height: pressed ? 0 : 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: pressed ? 0 : 2,
        transform: [{ translateX: pressed ? 2 : 0 }, { translateY: pressed ? 2 : 0 }],
      })}
    >
      {children ?? (
        <Text
          className={cn(
            "font-sans-bold text-base",
            variant === "primary"   && "text-white",
            variant === "secondary" && "text-black",
            size === "md"           && "text-sm",
          )}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
