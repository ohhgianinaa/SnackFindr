export type Craving =
  | "sweet"
  | "salty"
  | "crunchy"
  | "greasy"
  | "cold"
  | "surprise";

export type Vibe =
  | "cozy"
  | "chaotic"
  | "nostalgic"
  | "healthy-ish"
  | "comfort"
  | "adventurous";

export type Snack = {
  id: string;
  name: string;
  brand?: string;
  category: string;
  imageUrl?: string;
  cravingTags: Craving[];
  vibeTags: Vibe[];
  source?: "manual" | "OFF" | "USDA";
  sourceUrl?: string;
};

export type SnackCard = Snack & {
  why: string;
  tags?: readonly string[];
};