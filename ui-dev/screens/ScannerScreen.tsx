import { NeuPressable } from "@/components/ui/NeuPressable";
import { BottomTabBar } from "@/screens/HomeScreen";
import { getTagColor } from "@/lib/tagColors";
import { type } from "@/lib/typography";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_W = Dimensions.get("window").width;
const SCREEN_H = Dimensions.get("window").height;
const WIN      = 260; // scanning window square size

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScanResult = {
  name: string;
  brand: string;
  score: number;
  tags: string[];
  imageUrl?: string;
};

// ─── Mock barcode → snack lookup ─────────────────────────────────────────────
// Swap the lookup for a real API call: GET /api/snacks/barcode/:code

const BARCODE_DB: Record<string, ScanResult> = {
  "4549660641742": { name: "Kit Kat Matcha",   brand: "Nestle",   score: 9.2, tags: ["CREAMY", "BITTER SWEET"], imageUrl: "https://www.figma.com/api/mcp/asset/13245c2d-b9d6-4583-8753-92d90f5998b4" },
  "4901777317994": { name: "Jagarico Salad",   brand: "Calbee",   score: 9.1, tags: ["CRUNCHY", "SALTY"],       imageUrl: "https://www.figma.com/api/mcp/asset/28152af1-c36a-4541-8364-fd296df398e7" },
  "8801073143319": { name: "Carbonara Buldak", brand: "Samyang",  score: 8.8, tags: ["CREAMY", "SPICY"],        imageUrl: "https://cdn.shopify.com/s/files/1/0631/7424/6498/files/BG12742-8801073143319-SamyangBuldakRamenCreamCarbonaraHotChicken_5packs.jpg?v=1753904010" },
  "4902777000336": { name: "Pocky Strawberry", brand: "Glico",    score: 8.0, tags: ["SWEET", "CRUNCHY"],       imageUrl: "https://cdn.shopify.com/s/files/1/1969/5775/files/Strawberry-Pocky-Strawberry-Chocolate-Biscuit-Sticks-Pack-of-6-1-2026-02-17T07_14_23.424Z.jpg?v=1775306920" },
  "4901777220935": { name: "Pretz Tomato",     brand: "Glico",    score: 7.9, tags: ["SAVORY", "TANGY"] },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  onBack?: () => void;
  onViewDetails?: (result: ScanResult) => void;
}

export function ScannerScreen({ onBack, onViewDetails }: Props) {
  const [cameraPermission, requestPermission] = useCameraPermissions();
  const [scanned,    setScanned]    = useState(false);
  const [result,     setResult]     = useState<ScanResult | null>(null);
  const [flash,      setFlash]      = useState(false);

  const popoverAnim  = useRef(new Animated.Value(600)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const scanLoop     = useRef<Animated.CompositeAnimation | null>(null);

  // ── Camera permission ──────────────────────────────────────────────────────
  useEffect(() => {
    requestPermission();
  }, []);

  const permission = !cameraPermission
    ? "pending"
    : cameraPermission.granted
    ? "granted"
    : "denied";

  // ── Scanning line animation ────────────────────────────────────────────────
  useEffect(() => {
    if (scanned) {
      scanLoop.current?.stop();
      return;
    }
    scanLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    );
    scanLoop.current.start();
    return () => scanLoop.current?.stop();
  }, [scanned]);

  // ── Barcode detected ───────────────────────────────────────────────────────
  const handleScan = ({ data }: { data: string; type: string }) => {
    if (scanned) return;
    setScanned(true);
    const snack = BARCODE_DB[data] ?? {
      name: "New Snack Found",
      brand: "Unknown",
      score: 7.0,
      tags: ["UNRATED"],
    };
    setResult(snack);
    Animated.spring(popoverAnim, {
      toValue: 0, useNativeDriver: true, tension: 65, friction: 11,
    }).start();
  };

  const handleRescan = () => {
    Animated.timing(popoverAnim, {
      toValue: 600, duration: 220, useNativeDriver: true,
    }).start(() => {
      setScanned(false);
      setResult(null);
    });
  };

  // ── Derived layout ─────────────────────────────────────────────────────────
  const winLeft = (SCREEN_W - WIN) / 2;
  const winTop  = (SCREEN_H - WIN) / 2 - 60;

  const scanLineY = scanLineAnim.interpolate({
    inputRange: [0, 1], outputRange: [0, WIN - 2],
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>

      {/* Camera */}
      {permission === "granted" && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleScan}
          enableTorch={flash}
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr", "pdf417", "code128", "code39"] }}
        />
      )}

      {/* ── Dark overlay (4 panels + window cutout) ── */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {/* Top strip */}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: winTop, backgroundColor: "rgba(0,0,0,0.7)" }} />
        {/* Bottom strip */}
        <View style={{ position: "absolute", top: winTop + WIN, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)" }} />
        {/* Left strip */}
        <View style={{ position: "absolute", top: winTop, left: 0, width: winLeft, height: WIN, backgroundColor: "rgba(0,0,0,0.7)" }} />
        {/* Right strip */}
        <View style={{ position: "absolute", top: winTop, left: winLeft + WIN, right: 0, height: WIN, backgroundColor: "rgba(0,0,0,0.7)" }} />

        {/* Rounded window frame — clips scan line to rounded corners */}
        <View style={{
          position: "absolute",
          top: winTop, left: winLeft,
          width: WIN, height: WIN,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: "#fff",
          overflow: "hidden",
        }}>
          {/* Orange scan line (contained within the rounded frame) */}
          <Animated.View style={{
            position: "absolute",
            left: 4, right: 4, height: 2,
            top: 0,
            backgroundColor: "#F25F06",
            transform: [{ translateY: scanLineY }],
          }} />
        </View>
      </View>

      {/* ── Top nav ── */}
      <SafeAreaView edges={["top"]} style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        <View style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          paddingHorizontal: 16, paddingTop: 8,
        }}>
          {/* Back */}
          <NeuPressable
            onPress={onBack}
            shadowColor="rgba(255,255,255,0.4)"
            style={{
              width: 48, height: 48, borderRadius: 14,
              borderWidth: 2, borderColor: "#fff",
              backgroundColor: "rgba(0,0,0,0.45)",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </NeuPressable>

          <Text style={headerTitle}>SCAN SNACK</Text>

          {/* Flash toggle */}
          <NeuPressable
            onPress={() => setFlash(!flash)}
            shadowColor="rgba(255,255,255,0.4)"
            style={{
              width: 48, height: 48, borderRadius: 14,
              borderWidth: 2, borderColor: flash ? "#F25F06" : "#fff",
              backgroundColor: flash ? "rgba(242,95,6,0.2)" : "rgba(0,0,0,0.45)",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Ionicons name={flash ? "flash" : "flash-outline"} size={22} color={flash ? "#F25F06" : "#fff"} />
          </NeuPressable>
        </View>
      </SafeAreaView>

      {/* ── Instruction text below window ── */}
      {!scanned && (
        <View style={{ position: "absolute", top: winTop + WIN + 20, left: 0, right: 0, alignItems: "center", gap: 6 }}>
          <Text style={instructionText}>Point at a snack barcode</Text>
          <Text style={instructionSub}>Works on all packaged snacks</Text>
        </View>
      )}

      {/* ── DEV: simulate scan button (iOS Simulator can't scan) ── */}
      {!scanned && (
        <Pressable
          onPress={() => handleScan({ data: "4549660641742" })}
          style={{
            position: "absolute", bottom: 120, alignSelf: "center",
            paddingHorizontal: 18, paddingVertical: 10,
            backgroundColor: "rgba(255,255,255,0.12)",
            borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.25)",
          }}
        >
          <Text style={{ color: "rgba(255,255,255,0.7)", fontFamily: "DMSans_700Bold", fontSize: 13 }}>
            ⚡ Simulate Scan
          </Text>
        </Pressable>
      )}

      {/* ── Camera permission denied state ── */}
      {permission === "denied" && (
        <View style={{ ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
          <Ionicons name="camera-outline" size={72} color="rgba(255,255,255,0.3)" />
          <Text style={[instructionText, { marginTop: 20, textAlign: "center" }]}>
            Camera access is required to scan snacks
          </Text>
          <Text style={[instructionSub, { textAlign: "center", marginTop: 8 }]}>
            Enable it in Settings → SnackFindr
          </Text>
        </View>
      )}

      {/* ── Bottom nav bar — dark mode, Scan tab active in orange ── */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 5 }}>
        <BottomTabBar
          dark
          activeTab="Scan"
          onTabPress={(tab) => { if (tab !== "Scan") onBack?.(); }}
        />
      </View>

      {/* ── Result popover — slides up over nav bar ── */}
      <Animated.View
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          zIndex: 10,
          transform: [{ translateY: popoverAnim }],
        }}
      >
        <View style={{
          backgroundColor: "#F2EFE7",
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2,
          borderColor: "#1a1a1a",
        }}>
          {/* Drag handle */}
          <View style={{ alignItems: "center", paddingTop: 14, paddingBottom: 4 }}>
            <View style={{ width: 44, height: 4, borderRadius: 2, backgroundColor: "rgba(26,26,26,0.18)" }} />
          </View>

          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}>
            {result && (
              <Pressable
                onPress={() => onViewDetails?.(result)}
                style={{ flexDirection: "row", gap: 16, alignItems: "stretch" }}
              >
                {/* Square image */}
                <View style={{
                  width: 110, height: 110,
                  borderRadius: 14, overflow: "hidden",
                  backgroundColor: "#ebe7dc",
                  borderWidth: 2, borderColor: "#1a1a1a",
                }}>
                  {result.imageUrl ? (
                    <Image source={{ uri: result.imageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                  ) : (
                    <Image source={require("@/assets/fish-placeholder.png")} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                  )}
                </View>

                {/* Middle: name + tags */}
                <View style={{ flex: 1, justifyContent: "space-between", paddingVertical: 2 }}>
                  <Text style={cardName} numberOfLines={3}>{result.name.toUpperCase()}</Text>
                  <View style={{ gap: 5, marginTop: 8 }}>
                    {result.tags.map((tag) => {
                      const c = getTagColor(tag);
                      return (
                        <View key={tag} style={{
                          alignSelf: "flex-start",
                          paddingHorizontal: 14, paddingVertical: 5,
                          borderRadius: 9999, borderWidth: 2, borderColor: c.border,
                          backgroundColor: c.bg,
                        }}>
                          <Text style={[type.tag, { color: c.text }]}>{tag}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Right: score + bookmark */}
                <View style={{ width: 70, justifyContent: "space-between", alignItems: "flex-end", paddingVertical: 2 }}>
                  <Text style={cardScore}>{result.score.toFixed(1)}</Text>
                  {/* Bookmark button with neu drop shadow */}
                  <View style={{ width: 44 + 3, height: 44 + 3 }}>
                    {/* Shadow layer */}
                    <View style={{
                      position: "absolute", bottom: 0, right: 0,
                      width: 44, height: 44, borderRadius: 12,
                      backgroundColor: "#1a1a1a",
                    }} />
                    {/* Button face */}
                    <View style={{
                      position: "absolute", top: 0, left: 0,
                      width: 44, height: 44, borderRadius: 12,
                      borderWidth: 2, borderColor: "#1a1a1a",
                      backgroundColor: "#F2EFE7",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <Ionicons name="bookmark-outline" size={20} color="#1a1a1a" />
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
          </View>

          {/* Bottom safe area fill */}
          <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#F2EFE7" }} />
        </View>
      </Animated.View>

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const headerTitle: TextStyle = { ...type.h4, color: "#fff", letterSpacing: 1.2, textTransform: "uppercase" };

const instructionText: TextStyle = { ...type.h4, color: "rgba(255,255,255,0.85)" };

const instructionSub: TextStyle = { ...type.metadata, color: "rgba(255,255,255,0.45)" };

const cardName: TextStyle = { ...type.h2, textTransform: "uppercase" };

const cardScore: TextStyle = { ...type.h1, fontSize: 40, lineHeight: 44, letterSpacing: -0.5 };
