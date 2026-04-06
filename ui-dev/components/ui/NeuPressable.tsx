import { useRef } from "react";
import { Animated, Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface NeuPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  shadowColor?: string;
  shadowOffset?: number;
  fullWidth?: boolean;
}

export function NeuPressable({
  children,
  style,
  shadowColor = "#1a1a1a",
  shadowOffset = 2,
  fullWidth = false,
  onPress,
  ...props
}: NeuPressableProps) {
  const anim = useRef(new Animated.Value(0)).current;

  const onPressIn = () =>
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }).start();

  const onPressOut = () =>
    Animated.spring(anim, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 }).start();

  const translate = anim.interpolate({ inputRange: [0, 1], outputRange: [0, shadowOffset] });
  const shadowOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  const flatStyle = StyleSheet.flatten(style) ?? {};
  const borderRadius = (flatStyle as any).borderRadius ?? 14;

  return (
    // Outer container sized to button + shadow offset
    <Animated.View style={{ paddingBottom: shadowOffset, paddingRight: shadowOffset, alignSelf: fullWidth ? "stretch" : "flex-start" }}>
      {/* Shadow — sits behind, offset by shadowOffset */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 0, right: 0,
          left: shadowOffset, top: shadowOffset,
          borderRadius,
          backgroundColor: shadowColor,
          opacity: shadowOpacity,
        }}
      />
      {/* Button face */}
      <Animated.View style={{ transform: [{ translateX: translate }, { translateY: translate }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={style}
          {...props}
        >
          {children}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
