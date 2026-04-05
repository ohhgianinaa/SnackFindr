import "./global.css";
import { useFonts, DMSans_400Regular, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ExploreScreen, HomeSnack } from "@/screens/HomeScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { ScannerScreen, ScanResult } from "@/screens/ScannerScreen";
import { SnackDetailScreen } from "@/screens/SnackDetailScreen";
import { SplashScreen } from "@/screens/SplashScreen";
import { SnackDetail } from "@/types/snack";
import { useState, useEffect } from "react";
import { View, ActivityIndicator, Text, TextInput } from "react-native";

// Set DM Sans as the default font for all Text and TextInput
const TextAny = Text as any;
const TextInputAny = TextInput as any;
const oldTextRender = TextAny.render;
const oldTextInputRender = TextInputAny.render;

TextAny.defaultProps = {
  ...(TextAny.defaultProps || {}),
  style: { fontFamily: "DMSans_400Regular" },
};
TextInputAny.defaultProps = {
  ...(TextInputAny.defaultProps || {}),
  style: { fontFamily: "DMSans_400Regular" },
};

// ─── Simple screen-stack navigator (pre-React Navigation) ────────────────────
type Screen = "splash" | "onboarding" | "home" | "scanner" | "snackDetail";

// Map a HomeSnack card to a SnackDetail for the detail screen
function homeSnackToDetail(snack: HomeSnack): SnackDetail {
  return {
    id: snack.id,
    name: snack.name,
    brand: "–",
    category: "Snack",
    imageUrl: snack.imageUrl,
    tags: snack.tags,
    score: snack.score,
    cravingTags: [],
    vibeTags: [],
    description: snack.name,
    why: "",
    stores: [],
  };
}

// Map a ScanResult to a SnackDetail for the detail screen
function scanResultToDetail(result: ScanResult): SnackDetail {
  return {
    id: result.name.toLowerCase().replace(/\s+/g, "-"),
    name: result.name,
    brand: result.brand,
    category: "Snack",
    imageUrl: result.imageUrl,
    tags: result.tags,
    score: result.score,
    cravingTags: [],
    vibeTags: [],
    description: result.name,
    why: "",
    stores: [],
  };
}

function AppNavigator() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedSnack, setSelectedSnack] = useState<SnackDetail | null>(null);

  // Splash auto-advances to onboarding after 2s
  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => setScreen("onboarding"), 2000);
      return () => clearTimeout(t);
    }
  }, [screen]);

  if (screen === "splash") {
    return <SplashScreen />;
  }

  if (screen === "onboarding") {
    return (
      <OnboardingScreen
        onComplete={() => setScreen("home")}
        onBack={() => setScreen("splash")}
      />
    );
  }

  if (screen === "scanner") {
    return (
      <ScannerScreen
        onBack={() => setScreen("home")}
        onViewDetails={(result) => {
          setSelectedSnack(scanResultToDetail(result));
          setScreen("snackDetail");
        }}
      />
    );
  }

  if (screen === "snackDetail" && selectedSnack) {
    return (
      <SnackDetailScreen
        snack={selectedSnack}
        onBack={() => setScreen("home")}
      />
    );
  }

  return (
    <ExploreScreen
      onSnackPress={(snack) => {
        setSelectedSnack(homeSnackToDetail(snack));
        setScreen("snackDetail");
      }}
      onTabPress={(tab) => {
        if (tab === "Scan") setScreen("scanner");
      }}
    />
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F2EFE7" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
