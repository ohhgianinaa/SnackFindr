import { cn } from "@/lib/utils";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  shadow?: boolean;
}

export function Card({ shadow = true, className, children, ...props }: CardProps) {
  return (
    <View
      {...props}
      className={cn("bg-surface rounded-xl border-2 border-black", className)}
      style={[
        shadow && {
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 2,
        },
        props.style,
      ]}
    >
      {children}
    </View>
  );
}
