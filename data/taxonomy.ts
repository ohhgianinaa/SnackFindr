import type { Craving, Vibe } from "../types/snack";

export const CRAVINGS: { key: Craving; label: string }[] = [
  { key: "sweet", label: "Sweet" },
  { key: "salty", label: "Salty" },
  { key: "crunchy", label: "Crunchy" },
  { key: "greasy", label: "Greasy" },
  { key: "cold", label: "Cold" },
  { key: "surprise", label: "Surprise me" },
];

export const VIBES: { key: Vibe; label: string }[] = [
  { key: "cozy", label: "Cozy" },
  { key: "chaotic", label: "Chaotic" },
  { key: "nostalgic", label: "Nostalgic" },
  { key: "healthy-ish", label: "Healthy-ish" },
  { key: "comfort", label: "Comfort" },
  { key: "adventurous", label: "Adventurous" },
];