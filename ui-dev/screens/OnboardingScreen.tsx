import { NeuPressable } from "@/components/ui/NeuPressable";
import { type } from "@/lib/typography";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Text, TextStyle, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SnackRating = "love" | "not" | "havent";

type OnboardingSnack = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  emoji?: string;
};

// ─── Mock data — 5 snacks to match the 5 progress dots ────────────────────────

const MOCK_SNACKS: OnboardingSnack[] = [
  {
    id: "strawberry-kitkat",
    name: "Strawberry Kitkat",
    description: "Crispy wafer fingers coated in smooth strawberry chocolate.",
    imageUrl: "https://www.figma.com/api/mcp/asset/d0bd3deb-093e-4c33-8e5a-cdfc557e8d13",
  },
  {
    id: "jagarico",
    name: "Jagarico",
    description: "Crunchy potato sticks in a signature cup — the perfect konbini snack.",
    imageUrl: "https://www.figma.com/api/mcp/asset/28152af1-c36a-4541-8364-fd296df398e7",
  },
  {
    id: "matcha-pocky",
    name: "Matcha Pocky",
    description: "Crunchy biscuit sticks dipped in rich, earthy matcha chocolate.",
    emoji: "🍡",
  },
  {
    id: "hi-chew-grape",
    name: "Hi-Chew Grape",
    description: "Intensely fruity, chewy candy with a burst of grape flavor.",
    emoji: "🍇",
  },
  {
    id: "pretz-tomato",
    name: "Pretz Tomato",
    description: "Savory pretzel sticks with a tangy tomato seasoning.",
    emoji: "🥨",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  snacks?: OnboardingSnack[];
  onComplete?: (ratings: Record<string, SnackRating>) => void;
  onBack?: () => void;
}

const BUTTONS: { label: string; rating: SnackRating }[] = [
  { label: "Love It",       rating: "love"   },
  { label: "Not It",        rating: "not"    },
  { label: "Haven't Tried", rating: "havent" },
];

export function OnboardingScreen({
  snacks = MOCK_SNACKS,
  onComplete,
  onBack,
}: Props) {
  const [step, setStep]       = useState(0);
  const [ratings, setRatings] = useState<Record<string, SnackRating>>({});
  const [imgError, setImgError] = useState(false);

  const snack = snacks[step];
  const total = snacks.length;

  const handleRate = (rating: SnackRating) => {
    const next = { ...ratings, [snack.id]: rating };
    setRatings(next);

    if (step < total - 1) {
      setStep(step + 1);
      setImgError(false);
    } else {
      onComplete?.(next);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setImgError(false);
    } else {
      onBack?.();
    }
  };

  const showImage = !imgError && !!snack.imageUrl;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2EFE7" }} edges={["top"]}>
      <View style={{ flex: 1, justifyContent: "space-between", paddingBottom: 32 }}>

        {/* ── Top content ─────────────────────────────────── */}
        <View style={{ gap: 24 }}>

          {/* Nav row */}
          <View style={{
            flexDirection: "row", alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16, paddingTop: 8,
          }}>
            <NeuPressable
              onPress={handleBack}
              style={{
                width: 48, height: 48, borderRadius: 14,
                backgroundColor: "#fff",
                borderWidth: 2, borderColor: "#1a1a1a",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="chevron-back" size={24} color="#000000" />
            </NeuPressable>

            {/* Progress dots */}
            <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
              {snacks.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 16, height: 3, borderRadius: 2,
                    backgroundColor: i <= step
                      ? "#1a1a1a"
                      : "rgba(26,26,26,0.1)",
                  }}
                />
              ))}
            </View>
          </View>

          {/* Title */}
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={type.h1}>{"What Snacks\nDo You Like?"}</Text>
          </View>

          {/* Card + meta */}
          <View style={{ paddingHorizontal: 16, gap: 20 }}>

            {/* Snack image card */}
            <View style={{
              height: 280,
              borderRadius: 12, borderWidth: 2, borderColor: "#1a1a1a",
              overflow: "hidden",
              backgroundColor: "#F2EFE7",
              alignItems: "center", justifyContent: "center",
            }}>
              {showImage ? (
                <Image
                  source={{ uri: snack.imageUrl }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Text style={{ fontSize: 80 }}>{snack.emoji ?? "🍬"}</Text>
              )}
            </View>

            {/* Name + description */}
            <View style={{ gap: 8 }}>
              <Text style={type.h1}>{snack.name}</Text>
              <Text style={[type.body, { color: "#686870" }]}>{snack.description}</Text>
            </View>

          </View>
        </View>

        {/* ── Action buttons ───────────────────────────────── */}
        <View style={{ paddingHorizontal: 16, gap: 8 }}>
          {BUTTONS.map(({ label, rating }) => (
            <NeuPressable
              key={label}
              fullWidth
              shadowOffset={3}
              onPress={() => handleRate(rating)}
              style={{
                height: 52, borderRadius: 14,
                borderWidth: 2, borderColor: "#1a1a16",
                backgroundColor: "#fff",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Text style={btnLabel}>{label}</Text>
            </NeuPressable>
          ))}
        </View>

      </View>
    </SafeAreaView>
  );
}

const btnLabel: TextStyle = { ...type.h2, color: "#1a1a16" };
