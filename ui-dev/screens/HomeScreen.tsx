import { NeuPressable } from "@/components/ui/NeuPressable";
import { getTagColor } from "@/lib/tagColors";
import { type } from "@/lib/typography";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Dimensions, Image, Pressable, ScrollView, Text, TextStyle, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
// Hero: peek ~24px of next card on right
const HERO_CARD_WIDTH = SCREEN_WIDTH - 80;
// Mini: wide enough to show ~1.6 cards, feel substantial
const MINI_CARD_WIDTH = 200;
const MINI_IMG_WIDTH  = MINI_CARD_WIDTH - 32; // 16px visual inset each side

// ─── Hero card fixed zone heights ────────────────────────────────────────────
const HERO_IMG_H    = 160;
const HERO_TITLE_H  = 30 * 2; // h2 lineHeight(30) × 2 lines = 60
const MINI_NAME_H = 52; // h3 lineHeight(26) × 2 lines
const MINI_TAGS_H = 30;

// ─── Types ────────────────────────────────────────────────────────────────────

export type HomeSnack = {
  id: string;
  name: string;
  imageUrl?: string;
  emoji?: string;
  tags: string[];
  score: number;
  isLimited?: boolean;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const TOP_HITS: HomeSnack[] = [
  {
    id: "matcha-kitkat",
    name: "Limited-Run Green Kitkat (Matcha)",
    imageUrl: "https://www.figma.com/api/mcp/asset/13245c2d-b9d6-4583-8753-92d90f5998b4",
    tags: ["CREAMY", "REGIONAL", "BITTER SWEET"],
    score: 9.2,
    isLimited: true,
  },
  {
    id: "strawberry-kitkat",
    name: "Strawberry Kitkat Japan Edition",
    imageUrl: "https://www.figma.com/api/mcp/asset/d0bd3deb-093e-4c33-8e5a-cdfc557e8d13",
    tags: ["SWEET", "FRUITY"],
    score: 8.7,
    isLimited: true,
  },
  {
    id: "quattro-cheese-buldak-hero",
    name: "Quattro Cheese Buldak",
    imageUrl: "https://www.figma.com/api/mcp/asset/a4e929a4-9e46-49e6-ac64-9b901d2006d3",
    tags: ["CREAMY", "SPICY"],
    score: 9.2,
    isLimited: true,
  },
];

const BULDAK_CORNER: HomeSnack[] = [
  {
    id: "quattro-cheese-buldak", name: "Quattro Cheese Buldak",
    imageUrl: "https://www.figma.com/api/mcp/asset/a4e929a4-9e46-49e6-ac64-9b901d2006d3",
    tags: ["CREAMY", "SPICY"], score: 9.2, isLimited: true,
  },
  {
    id: "original-buldak", name: "Original Buldak",
    imageUrl: "https://cdn.shopify.com/s/files/1/0631/7424/6498/files/yabW7H1n2Yv2QupCSspYvJ7e1pQ4AMB2yy4VI2if.jpg?v=1773185600",
    tags: ["SPICY", "SAVORY"], score: 9.0,
  },
  {
    id: "carbonara-buldak", name: "Carbonara Buldak",
    imageUrl: "https://cdn.shopify.com/s/files/1/0631/7424/6498/files/BG12742-8801073143319-SamyangBuldakRamenCreamCarbonaraHotChicken_5packs.jpg?v=1753904010",
    tags: ["CREAMY", "SPICY"], score: 8.8,
  },
  {
    id: "rose-buldak", name: "Rose Buldak",
    imageUrl: "https://cdn.shopify.com/s/files/1/0668/0802/1131/files/Samyang-Buldak-Spicy-Ramen-Rose-Woori-Marketplace-29202720391307.png?v=1768048665",
    tags: ["CREAMY", "MILD"], score: 8.5,
  },
];

const NEW_DROPS: HomeSnack[] = [
  {
    id: "hi-chew-mango", name: "Hi-Chew Mango",
    imageUrl: "https://cdn.shopify.com/s/files/1/0666/7727/6952/products/hi-chew-mango-stick.png?v=1683048682",
    tags: ["SWEET", "FRUITY"], score: 8.9, isLimited: true,
  },
  {
    id: "gimme-seaweed", name: "GimMe Sea Salt Seaweed",
    imageUrl: "https://cdn.shopify.com/s/files/1/2505/0182/files/GimMeRSSSingle5g-SeaSalt-Front1256x1600.png?v=1722470352",
    tags: ["SALTY", "CRISPY"], score: 8.2,
  },
  {
    id: "strawberry-pocky", name: "Strawberry Pocky",
    imageUrl: "https://cdn.shopify.com/s/files/1/1969/5775/files/Strawberry-Pocky-Strawberry-Chocolate-Biscuit-Sticks-Pack-of-6-1-2026-02-17T07_14_23.424Z.jpg?v=1775306920",
    tags: ["SWEET", "CRUNCHY"], score: 8.0, isLimited: true,
  },
  {
    id: "mochi-strawberry", name: "Strawberry Daifuku",
    imageUrl: "https://cdn.shopify.com/s/files/1/1969/5775/files/Seiki-Bite-Sized-Amaou-Strawberry-Daifuku-Mochi-Pack-of-5-1-2026-03-26T02_17_25.114Z.jpg?v=1774491474",
    tags: ["SWEET", "SOFT"], score: 8.7,
  },
];

const NEAR_YOU: HomeSnack[] = [
  {
    id: "ramune-candy", name: "Morinaga Ramune Candy",
    imageUrl: "https://cdn.shopify.com/s/files/1/1969/5775/files/P-1-MRNG-RAMCAN-1_3-Morinaga_Ramune_Soda_Candy_Pack_of_3.jpg?v=1746685599",
    tags: ["SWEET", "SOUR"], score: 8.3,
  },
  {
    id: "tongari-corn", name: "Tongari Corn",
    imageUrl: "https://cdn.shopify.com/s/files/1/1969/5775/files/House-Tongari-Corn-Japanese-Cone-Shaped-Chips-Lightly-Salted-Pack-of-6-1-2025-08-15T09_11_18.919Z.jpg?v=1755249117",
    tags: ["CRUNCHY", "SALTY"], score: 8.1,
  },
  {
    id: "kinoko-no-yama", name: "Kinoko no Yama",
    tags: ["SWEET", "CREAMY"], score: 8.8,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function LimitedBadge({ small = false }: { small?: boolean }) {
  return (
    <View style={{
      position: "absolute",
      top: small ? 6 : 8,
      left: small ? 6 : 11,
      backgroundColor: "#c8102e",
      borderWidth: 2, borderColor: "#000",
      borderRadius: 9999,
      paddingHorizontal: 10, paddingVertical: 5,
    }}>
      <Text style={badgeText}>LIMITED</Text>
    </View>
  );
}

function SeeMore({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      <Text style={seeMoreText}>See more</Text>
      <Ionicons name="chevron-forward" size={13} color="#000" />
    </Pressable>
  );
}

// ─── Hero Card (TOP HITS) ─────────────────────────────────────────────────────

const FISH_PLACEHOLDER = require("@/assets/fish-placeholder.png");

function HeroCard({ snack, onPress, onSave }: { snack: HomeSnack; onPress?: () => void; onSave?: () => void }) {
  const pressAnim = useRef(new Animated.Value(0)).current;
  const handlePressIn  = () => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const handlePressOut = () => Animated.spring(pressAnim, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 }).start();
  const translate     = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 3] });
  const shadowOpacity = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <View style={{ width: HERO_CARD_WIDTH, marginBottom: 4, marginRight: 4 }}>
      {/* Neu drop shadow — fades as card presses in */}
      <Animated.View style={{
        position: "absolute", bottom: -4, right: -4, left: 4, top: 4,
        borderRadius: 16, backgroundColor: "#1a1a1a", opacity: shadowOpacity,
      }} />
      {/* Card face — slides toward shadow on press */}
      <Animated.View style={{ transform: [{ translateX: translate }, { translateY: translate }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            backgroundColor: "#fff",
            borderWidth: 2, borderColor: "#1a1a1a",
            borderRadius: 16,
            padding: 16,
            gap: 16,
          }}
        >
          {/* Image */}
          <View style={{
            width: "100%", height: HERO_IMG_H,
            borderRadius: 12, overflow: "hidden",
            borderWidth: 2, borderColor: "#1a1a1a",
          }}>
            {snack.imageUrl ? (
              <Image source={{ uri: snack.imageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            ) : (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "#f0ede6" }}>
                <Image source={FISH_PLACEHOLDER} style={{ width: "130%", height: "130%", marginTop: -20, marginLeft: -10 }} resizeMode="contain" />
              </View>
            )}
            {snack.isLimited && <LimitedBadge />}
          </View>

          {/* Title — exactly 2 lines */}
          <View style={{ height: HERO_TITLE_H }}>
            <Text style={heroTitle} numberOfLines={2}>{snack.name.toUpperCase()}</Text>
          </View>

          {/* Tags — 2 rows of pills. Each pill is 34px (30px content + 2px border top/bottom). 2 rows + 6px gap = 74px, +2 buffer = 76 */}
          <View style={{ height: 76, overflow: "hidden", flexDirection: "row", flexWrap: "wrap", gap: 6, alignContent: "flex-start" }}>
            {snack.tags.map((tag) => {
              const c = getTagColor(tag);
              return (
                <View key={tag} style={{
                  paddingHorizontal: 10, paddingVertical: 6,
                  borderRadius: 9999, borderWidth: 2, borderColor: c.border,
                  backgroundColor: c.bg,
                }}>
                  <Text style={[type.tag, { color: c.text }]}>{tag}</Text>
                </View>
              );
            })}
          </View>

          {/* Score + Save */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={scoreText}>{snack.score.toFixed(1)}</Text>
            <NeuPressable onPress={onSave} shadowOffset={2} style={{
              flexDirection: "row", alignItems: "center", gap: 10,
              height: 48, paddingHorizontal: 14,
              borderRadius: 14, borderWidth: 2, borderColor: "#1a1a16",
              backgroundColor: "#fff",
            }}>
              <Ionicons name="bookmark-outline" size={18} color="#000" />
              <Text style={saveBtnText}>Save</Text>
            </NeuPressable>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ─── Mini Card (category rows) ────────────────────────────────────────────────

function MiniCard({ snack, onPress, onSave }: { snack: HomeSnack; onPress?: () => void; onSave?: () => void }) {
  const pressAnim = useRef(new Animated.Value(0)).current;
  const handlePressIn  = () => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const handlePressOut = () => Animated.spring(pressAnim, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 }).start();
  const translate     = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 3] });
  const shadowOpacity = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <View style={{ width: MINI_CARD_WIDTH, marginBottom: 4, marginRight: 4 }}>
      {/* Neu drop shadow */}
      <Animated.View style={{
        position: "absolute", bottom: -4, right: -4, left: 4, top: 4,
        borderRadius: 16, backgroundColor: "#1a1a1a", opacity: shadowOpacity,
      }} />
      <Animated.View style={{ transform: [{ translateX: translate }, { translateY: translate }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            backgroundColor: "#fff",
            borderWidth: 2, borderColor: "#1a1a1a",
            borderRadius: 16,
            padding: 16,
            gap: 16,
          }}
        >
          {/* Image — 2px border to match hero card */}
          <View style={{
            width: "100%", height: 120,
            borderRadius: 12, overflow: "hidden",
            borderWidth: 2, borderColor: "#1a1a1a",
          }}>
            {snack.imageUrl ? (
              <Image source={{ uri: snack.imageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            ) : (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "#f0ede6" }}>
                <Image source={FISH_PLACEHOLDER} style={{ width: "130%", height: "130%", marginTop: -20, marginLeft: -10 }} resizeMode="contain" />
              </View>
            )}
            {snack.isLimited && <LimitedBadge small />}
          </View>

          {/* Title — 2 lines */}
          <View style={{ height: MINI_NAME_H }}>
            <Text style={miniCardName} numberOfLines={2}>{snack.name.toUpperCase()}</Text>
          </View>

          {/* Tags — 1 row */}
          <View style={{ height: MINI_TAGS_H, overflow: "hidden", flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
            {snack.tags.slice(0, 2).map((tag) => {
              const c = getTagColor(tag);
              return (
                <View key={tag} style={{
                  paddingHorizontal: 9, paddingVertical: 5,
                  borderRadius: 9999, borderWidth: 2, borderColor: c.border,
                  backgroundColor: c.bg,
                }}>
                  <Text style={[type.tag, { color: c.text }]}>{tag}</Text>
                </View>
              );
            })}
          </View>

          {/* Score + Bookmark */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={scoreText}>{snack.score.toFixed(1)}</Text>
            <NeuPressable onPress={onSave} shadowOffset={2} style={{
              width: 44, height: 44,
              borderRadius: 12, borderWidth: 2, borderColor: "#1a1a1a",
              backgroundColor: "#fff",
              alignItems: "center", justifyContent: "center",
            }}>
              <Ionicons name="bookmark-outline" size={18} color="#000" />
            </NeuPressable>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ─── Reusable section row (mini cards) ───────────────────────────────────────

function SectionRow({
  title,
  snacks,
  onSnackPress,
}: {
  title: string;
  snacks: HomeSnack[];
  onSnackPress?: (snack: HomeSnack) => void;
}) {
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={sectionHead}>{title}</Text>
        <SeeMore />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 16 }}
        style={{ marginHorizontal: -16 }}
      >
        {snacks.map((snack) => (
          <MiniCard key={snack.id} snack={snack} onPress={() => onSnackPress?.(snack)} />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────

const TABS = [
  { label: "Explore", icon: "compass-outline"  as const, activeIcon: "compass"  as const },
  { label: "Scan",    icon: "scan-outline"     as const, activeIcon: "scan"     as const },
  { label: "Saved",   icon: "bookmark-outline" as const, activeIcon: "bookmark" as const },
];

export function BottomTabBar({
  activeTab = "Explore",
  onTabPress,
  dark = false,
}: {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
  dark?: boolean;
}) {
  // Resolve per-tab colour: active Scan is always orange; other active tabs follow theme
  const iconColor = (label: string, isActive: boolean) => {
    if (isActive && label === "Scan") return "#F25F06";
    if (isActive) return dark ? "#fff" : "#1a1a1a";
    return dark ? "#fff" : "rgba(26,26,26,0.3)";
  };

  const pillBg     = dark ? "#1a1a1a"                  : "#fff";
  const pillBorder = dark ? "#fff"                       : "#1a1a1a";
  const shadowBg   = dark ? "rgba(255,255,255,0.15)"    : "#1a1a1a";

  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "transparent" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        {/* ── Pill tab bar — full width ── */}
        <View style={{ marginBottom: 4, marginRight: 4 }}>
          {/* Neu shadow */}
          <View style={{
            position: "absolute", bottom: -4, right: -4, left: 4, top: 4,
            borderRadius: 16, backgroundColor: shadowBg,
          }} />
          {/* Pill face */}
          <View style={{
            flexDirection: "row",
            backgroundColor: pillBg,
            borderRadius: 16,
            borderWidth: 2, borderColor: pillBorder,
            paddingVertical: 10,
            justifyContent: "space-around",
          }}>
            {TABS.map(({ label, icon, activeIcon }) => {
              const isActive = activeTab === label;
              const color = iconColor(label, isActive);
              const labelStyle: TextStyle = {
                fontFamily: isActive ? "DMSans_700Bold" : "DMSans_400Regular",
                fontSize: 10, letterSpacing: 0.1, color,
              };
              return (
                <Pressable
                  key={label}
                  onPress={() => onTabPress?.(label)}
                  style={{ flex: 1, alignItems: "center", gap: 3 }}
                >
                  <Ionicons name={isActive ? activeIcon : icon} size={22} color={color} />
                  <Text style={labelStyle}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

interface Props {
  onSnackPress?: (snack: HomeSnack) => void;
  onTabPress?: (tab: string) => void;
}

export function ExploreScreen({ onSnackPress, onTabPress }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2EFE7" }} edges={["top"]}>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={{
            height: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="location-sharp" size={20} color="#1a1a1a" />
              <Text style={locationText}>Nakano, Tokyo</Text>
              <Ionicons name="chevron-down" size={16} color="#1a1a1a" />
            </View>
            <View style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: "#1a1a1a", overflow: "hidden" }}>
              <Image source={{ uri: "https://www.figma.com/api/mcp/asset/022b6c73-b101-4ce5-b4de-7fd0dd8caff2" }}
                style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            </View>
          </View>

          {/* Search bar */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <View style={{ paddingBottom: 2, paddingRight: 2 }}>
              <View style={{ position: "absolute", bottom: 0, right: 0, left: 2, top: 2, borderRadius: 12, backgroundColor: "#1a1a16" }} />
              <View style={{
                flexDirection: "row", alignItems: "center", gap: 8,
                backgroundColor: "#fff", borderWidth: 2, borderColor: "#1a1a1a",
                borderRadius: 12, paddingHorizontal: 18, paddingVertical: 14,
              }}>
                <Ionicons name="search" size={16} color="#aeaeb2" />
                <Text style={searchPlaceholder}>Search snacks...</Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={{ gap: 16, paddingHorizontal: 16, paddingTop: 8 }}>

            {/* TOP HITS — hero cards with peek */}
            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={sectionHead}>TOP HITS</Text>
                <SeeMore />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 16 }}
                style={{ marginHorizontal: -16 }}
              >
                {TOP_HITS.map((snack) => (
                  <HeroCard key={snack.id} snack={snack} onPress={() => onSnackPress?.(snack)} />
                ))}
              </ScrollView>
            </View>

            <SectionRow title="BULDAK CORNER" snacks={BULDAK_CORNER} onSnackPress={onSnackPress} />
            <SectionRow title="NEW DROPS"     snacks={NEW_DROPS}     onSnackPress={onSnackPress} />
            <SectionRow title="NEAR YOU"      snacks={NEAR_YOU}      onSnackPress={onSnackPress} />

          </View>
        </ScrollView>

        <BottomTabBar activeTab="Explore" onTabPress={onTabPress} />

      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

// badge on LIMITED pill
const badgeText: TextStyle = { ...type.tag, color: "#fff" };

// hero card title — h2 + uppercase, wraps freely
const heroTitle: TextStyle = { ...type.h2, textTransform: "uppercase", flexShrink: 1 };

// mini card name — h3 (20px) + uppercase
const miniCardName: TextStyle = { ...type.h3, textTransform: "uppercase" };

// big score number — h1 but larger, scores are a hero element
const scoreText: TextStyle = { ...type.h1, fontSize: 40, lineHeight: 48, letterSpacing: -0.5 };

// save button label — h3
const saveBtnText: TextStyle = { ...type.h3, color: "#000" };

// location header — h3 (24px)
const locationText: TextStyle = { ...type.h3 };

// search placeholder — body muted
const searchPlaceholder: TextStyle = { ...type.body, color: "#aeaeb2" };

// section headers — h2
const sectionHead: TextStyle = { ...type.h2 };


// "See more" link — metadata bold
const seeMoreText: TextStyle = { ...type.metadata, fontFamily: "DMSans_700Bold", color: "#000" };
