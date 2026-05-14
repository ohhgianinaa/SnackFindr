import { type } from "@/lib/typography";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LOGO = require("@/assets/logo.png");

const FLOATING_EMOJIS = [
  { emoji: "🍟", top: "6.6%",  right: "32.1%", rotate: "12deg",  opacity: 0.08 },
  { emoji: "🍘", top: "16.1%", left: "11.5%",  rotate: "-15deg", opacity: 0.08 },
  { emoji: "🍡", top: "25.7%", right: "9.5%",  rotate: "12deg",  opacity: 0.08 },
  { emoji: "🥨", top: "26.8%", right: "60.5%", rotate: "168deg", scaleY: -1, opacity: 0.08 },
  { emoji: "🍭", top: "69.7%", right: "32.1%", rotate: "12deg",  opacity: 0.08 },
  { emoji: "🍙", bottom: "28.0%", left: "14.6%", rotate: "8deg", opacity: 0.08 },
  { emoji: "🍔", top: "86.6%", right: "60.5%", rotate: "12deg",  opacity: 0.08 },
  { emoji: "🧋", bottom: "18.6%", right: "11.5%", rotate: "-20deg", opacity: 0.08 },
];

export function SplashScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2EFE7" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>

        {/* Floating background emojis */}
        {FLOATING_EMOJIS.map((item, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              top: item.top as any,
              bottom: item.bottom as any,
              left: item.left as any,
              right: item.right as any,
              transform: item.scaleY != null
                ? [{ rotate: item.rotate }, { scaleY: item.scaleY }]
                : [{ rotate: item.rotate }],
              opacity: item.opacity,
            }}
          >
            <Text style={{ fontSize: 56 }}>{item.emoji}</Text>
          </View>
        ))}

        {/* Logo */}
        <Image
          source={LOGO}
          style={{ width: 340, height: 228 }}
          resizeMode="contain"
        />

        {/* Tagline */}
        <Text style={[type.body, { color: "#8e8e93", textAlign: "center", marginTop: 8, letterSpacing: -0.17 }]}>
          Find your next munch
        </Text>

      </View>
    </SafeAreaView>
  );
}
