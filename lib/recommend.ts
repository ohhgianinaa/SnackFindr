import type { Craving, Snack, SnackCard, Vibe } from "../types/snack";

function makeWhy(craving: Craving, vibe: Vibe, snack: Snack): string {
  const cravingLine: Record<Craving, string> = {
    sweet: "Sweet fix incoming",
    salty: "Salty satisfaction",
    crunchy: "Crunch that hits",
    greasy: "Greasy comfort mode",
    cold: "Cold and refreshing",
    surprise: "Trust this one",
  };

  const vibeLine: Record<Vibe, string> = {
    cozy: "soft, comforting, low effort",
    chaotic: "loud flavor, instant gratification",
    nostalgic: "classic vibes you already trust",
    "healthy-ish": "lighter but still satisfying",
    comfort: "pure comfort energy",
    adventurous: "a fun twist for your taste buds",
  };

  return `${cravingLine[craving]} — ${snack.name} feels right: ${vibeLine[vibe]}.`;
}

export function recommend(
  snacks: Snack[],
  craving: Craving,
  vibe: Vibe,
  count = 3
): SnackCard[] {
  const desiredCraving: Craving | null = craving === "surprise" ? null : craving;

  const scored = snacks.map((s) => {
    let score = 0;
    if (desiredCraving && s.cravingTags.includes(desiredCraving)) score += 3;
    if (s.vibeTags.includes(vibe)) score += 2;
    if (s.imageUrl && s.imageUrl.trim().length > 0) score += 1;
    return { snack: s, score };
  });

  scored.sort((a, b) => b.score - a.score || Math.random() - 0.5);

  let picked = scored
    .filter((x) => x.score > 0)
    .slice(0, count)
    .map(({ snack }) => ({
      ...snack,
      why: makeWhy(craving, vibe, snack),
      tags: [] as readonly string[],
    }));

  // fallback fill if not enough matches
  if (picked.length < count) {
    const already = new Set(picked.map((p) => p.id));
    const fillers = snacks.filter((s) => !already.has(s.id));
    while (picked.length < count && fillers.length > 0) {
      const idx = Math.floor(Math.random() * fillers.length);
      const snack = fillers.splice(idx, 1)[0];
      picked.push({
        ...snack,
        why: makeWhy(craving, vibe, snack),
        tags: ["surprise"] as const,
      });
    }
  }

  return picked.slice(0, count);
}