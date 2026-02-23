import { NextResponse } from "next/server";
import path from "path";
import { readFileSync } from "fs";

import type { Craving, Snack, Vibe } from "@/types/snack";
import { recommend } from "@/lib/recommend";


const isCraving = (x: string): x is Craving =>
  ["sweet", "salty", "crunchy", "greasy", "cold", "surprise"].includes(x);

const isVibe = (x: string): x is Vibe =>
  ["cozy", "chaotic", "nostalgic", "healthy-ish", "comfort", "adventurous"].includes(x);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shuffle = searchParams.get("shuffle") === "1";

  const cravingParam = searchParams.get("craving") ?? "surprise";
  const vibeParam = searchParams.get("vibe") ?? "cozy";

  const craving: Craving = isCraving(cravingParam) ? cravingParam : "surprise";
  const vibe: Vibe = isVibe(vibeParam) ? vibeParam : "cozy";

  const dataPath = path.join(process.cwd(), "data", "snacks.json");
  const raw = readFileSync(dataPath, "utf-8");
  const snacks = JSON.parse(raw) as Snack[];
  const snacksForRun = shuffle ? [...snacks].sort(() => Math.random() - 0.5) : snacks;

  const picks = recommend(snacksForRun, craving, vibe, 3);

  return NextResponse.json({ craving, vibe, snacks: picks });
}