// ─── Taxonomy ─────────────────────────────────────────────────────────────────

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

// ─── Core snack shape (matches snacks.json + all API responses) ───────────────

export type Snack = {
  id: string;
  name: string;
  brand?: string;
  category: string;
  imageUrl?: string;
  description?: string;
  cravingTags: Craving[];
  vibeTags: Vibe[];
  tags?: readonly string[];     // freeform display tags e.g. "CREAMY", "REGIONAL"
  score?: number | null;        // 1–10 community score; null until enough ratings
  source?: "manual" | "OFF" | "USDA";
  sourceUrl?: string;
};

// ─── API response shapes ──────────────────────────────────────────────────────

/** Returned by GET /api/recommend */
export type SnackCard = Snack & {
  why: string;
};

// ─── Store / location ─────────────────────────────────────────────────────────

export type Store = {
  id: string;
  name: string;
  distanceMi?: number;    // populated at runtime from user location
  placeId?: string;       // Google Places ID for directions
};

// ─── Full detail view ─────────────────────────────────────────────────────────

/** Used by SnackDetailScreen — full snack with nearby stores */
export type SnackDetail = Snack & {
  why: string;
  stores: Store[];
};
