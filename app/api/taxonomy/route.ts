import { NextResponse } from "next/server";
import { CRAVINGS, VIBES } from "@/data/taxonomy";

export async function GET() {
  return NextResponse.json({ cravings: CRAVINGS, vibes: VIBES });
}