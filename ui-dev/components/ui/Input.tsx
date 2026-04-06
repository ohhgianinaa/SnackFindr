import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({ leftIcon, rightIcon, className, style, ...props }: InputProps) {
  return (
    <View
      className="flex-row items-center bg-white border-2 border-black rounded-full h-12"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
      }}
    >
      {leftIcon && (
        <View className="pl-4 pr-2">{leftIcon}</View>
      )}
      <TextInput
        {...props}
        className={cn(
          "flex-1 text-sm text-black font-sans",
          leftIcon  ? "pl-0 pr-4" : "px-4",
          rightIcon ? "pr-0"      : "",
          className
        )}
        placeholderTextColor="#717171"
        style={style}
      />
      {rightIcon && (
        <View className="pr-4 pl-2">{rightIcon}</View>
      )}
    </View>
  );
}
