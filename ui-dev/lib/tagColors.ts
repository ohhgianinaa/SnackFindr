// ─── Tag color map ────────────────────────────────────────────────────────────
// Each tag gets a background fill + matching border color

type TagColor = { bg: string; border: string; text: string };

const TAG_COLORS: Record<string, TagColor> = {
  "SWEET":        { bg: "#FF3D7F", border: "#000000", text: "#fff" },
  "FRUITY":       { bg: "#FF9500", border: "#000000", text: "#fff" },
  "CREAMY":       { bg: "#FFD000", border: "#000000", text: "#1a1a1a" },
  "SPICY":        { bg: "#FF2200", border: "#000000", text: "#fff" },
  "SALTY":        { bg: "#0088FF", border: "#000000", text: "#fff" },
  "CRUNCHY":      { bg: "#FF6A00", border: "#000000", text: "#fff" },
  "SAVORY":       { bg: "#00B800", border: "#000000", text: "#fff" },
  "BITTER SWEET": { bg: "#9900FF", border: "#000000", text: "#fff" },
  "BITTER":       { bg: "#66BB00", border: "#000000", text: "#fff" },
  "MILD":         { bg: "#00CC77", border: "#000000", text: "#fff" },
  "SOFT":         { bg: "#DD00AA", border: "#000000", text: "#fff" },
  "REGIONAL":     { bg: "#00BBAA", border: "#000000", text: "#fff" },
  "SOUR":         { bg: "#AADD00", border: "#000000", text: "#1a1a1a" },
  "TANGY":        { bg: "#DD8800", border: "#000000", text: "#fff" },
  "UNRATED":      { bg: "#888888", border: "#000000", text: "#fff" },
};

const DEFAULT_COLOR: TagColor = { bg: "#D0CCC8", border: "#000000", text: "#1a1a1a" };

export function getTagColor(tag: string): TagColor {
  return TAG_COLORS[tag.toUpperCase()] ?? DEFAULT_COLOR;
}
