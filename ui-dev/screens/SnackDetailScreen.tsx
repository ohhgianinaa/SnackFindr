import { NeuPressable } from "@/components/ui/NeuPressable";
import { getTagColor } from "@/lib/tagColors";
import { type } from "@/lib/typography";
import { SnackDetail } from "@/types/snack";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Image, Pressable, ScrollView, Text, TextStyle, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Mock data — replace with real API/navigation props ──────────────────────
const MOCK: SnackDetail = {
  id: "jagarico-salad",
  name: "Jagarico",
  brand: "Calbee",
  category: "Chips",
  imageUrl: "https://www.figma.com/api/mcp/asset/28152af1-c36a-4541-8364-fd296df398e7",
  description:
    "Crunchy potato sticks in a signature cup — the perfect konbini snack. Crispy, salty, and dangerously addictive. A Japan staple since 1995.",
  cravingTags: ["salty", "crunchy"],
  vibeTags: ["nostalgic", "cozy"],
  tags: ["CREAMY", "REGIONAL", "BITTER SWEET", "COLLECTIBLE"],
  score: null,
  why: "Crunchy potato sticks in a signature cup — the perfect konbini snack.",
  stores: [
    { id: "kp-market", name: "KP Market", distanceMi: 0.9, placeId: "ChIJ_placeholder_1" },
    { id: "ralphs",    name: "Ralphs",    distanceMi: 2.3, placeId: "ChIJ_placeholder_2" },
  ],
};

interface Props {
  snack?: SnackDetail;
  onBack?: () => void;
  onSave?: (snack: SnackDetail) => void;
}

export function SnackDetailScreen({ snack = MOCK, onBack, onSave }: Props) {
  const [imgError, setImgError] = useState(false);
  const pressAnim = useRef(new Animated.Value(0)).current;

  const onPressIn = () => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const onPressOut = () => Animated.spring(pressAnim, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 }).start();
  const btnTranslate = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 2] });
  const shadowOpacity = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  const displayScore = snack.score != null ? snack.score.toFixed(1) : "—";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2EFE7" }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Nav */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <NeuPressable
            onPress={onBack}
            style={{
              width: 48, height: 48, borderRadius: 14,
              backgroundColor: "#fff",
              borderWidth: 2, borderColor: "#1a1a1a",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </NeuPressable>
        </View>

        {/* Name + Score — flex:1 on left so score never gets pushed off */}
        <View style={{
          flexDirection: "row", alignItems: "flex-start",
          paddingHorizontal: 16, paddingTop: 16, gap: 12,
        }}>
          {/* Left: title + brand */}
          <View style={{ flex: 1 }}>
            <Text style={type.h1} numberOfLines={3}>{snack.name}</Text>
            <Text style={[type.metadata, { marginTop: 4 }]}>{snack.brand ?? "–"}</Text>
          </View>
          {/* Right: score number + label */}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={detailScore}>{displayScore}</Text>
            <Text style={[type.metadata, { marginTop: 2 }]}>Score</Text>
          </View>
        </View>

        {/* Hero image — no shadow */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <View style={{
            width: "100%", height: 220,
            borderRadius: 16, borderWidth: 2, borderColor: "#1a1a1a",
            overflow: "hidden",
          }}>
            {imgError || !snack.imageUrl ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F2EFE7" }}>
                <Ionicons name="image-outline" size={48} color="#717171" />
                <Text style={[type.metadata, { marginTop: 8 }]}>No image available</Text>
              </View>
            ) : (
              <Image
                source={{ uri: snack.imageUrl }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                onError={() => setImgError(true)}
              />
            )}
          </View>
        </View>

        {/* Pill tags */}
        {snack.tags && snack.tags.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, paddingTop: 16 }}>
            {snack.tags.map((tag) => {
              const c = getTagColor(tag);
              return (
                <View
                  key={tag}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 6,
                    borderRadius: 9999, borderWidth: 2, borderColor: c.border,
                    backgroundColor: c.bg,
                  }}
                >
                  <Text style={[type.tag, { color: c.text }]}>{tag}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Description */}
        {snack.description && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={[type.body, { color: "#686870" }]}>{snack.description}</Text>
          </View>
        )}

        {/* Get in Store */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Text style={[type.h2, { marginBottom: 12 }]}>Get in Store</Text>
          {snack.stores.length === 0 ? (
            <Text style={type.metadata}>No nearby stores found.</Text>
          ) : (
            <View style={{ gap: 8 }}>
              {snack.stores.map((store) => (
                <NeuPressable
                  key={store.id}
                  fullWidth
                  style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                    backgroundColor: "#fff",
                    borderWidth: 2, borderColor: "#1a1a1a", borderRadius: 14,
                    paddingHorizontal: 16, paddingVertical: 14,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="location-sharp" size={18} color="#F25F06" />
                    <Text style={type.body}>{store.name}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={type.metadata}>
                      {store.distanceMi != null ? `${store.distanceMi} mi` : "—"}
                    </Text>
                    <Ionicons name="navigate" size={16} color="#000000" />
                  </View>
                </NeuPressable>
              ))}
            </View>
          )}
        </View>

      </ScrollView>

      {/* Fixed CTA */}
      <View style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        paddingHorizontal: 16, paddingBottom: 32, paddingTop: 12,
        borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.1)",
        backgroundColor: "#F2EFE7",
      }}>
        <View style={{ height: 54 }}>
          <Animated.View style={{
            position: "absolute", top: 2, left: 2, right: 0, bottom: 0,
            height: 52, borderRadius: 14, backgroundColor: "#1a1a16",
            opacity: shadowOpacity,
          }} />
          <Animated.View style={{
            position: "absolute", top: 0, left: 0, right: 2,
            transform: [{ translateX: btnTranslate }, { translateY: btnTranslate }],
          }}>
            <Pressable
              onPress={() => onSave?.(snack)}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              style={{
                height: 52, borderRadius: 14,
                borderWidth: 2, borderColor: "#1a1a16",
                backgroundColor: "#F25F06",
                flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
              }}
            >
              <Ionicons name="bookmark" size={20} color="#fff" />
              <Text style={detailButtonCta}>Save to Collection</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>

    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const detailScore: TextStyle = { ...type.h1, fontSize: 40, lineHeight: 44, letterSpacing: -0.5 };
const detailButtonCta: TextStyle = { ...type.h3, color: "#fff" };
