import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const MOCK_SNACKS = [
  {
    id: "1",
    name: "Meiji Yan Yan",
    brand: "Meiji",
    category: "Biscuit",
    why: "Perfect sweet-crunchy combo. A Japanese konbini staple.",
    cravingTags: ["sweet", "crunchy"],
    vibeTags: ["nostalgic", "cozy"],
  },
  {
    id: "2",
    name: "Calbee Shrimp Chips",
    brand: "Calbee",
    category: "Chips",
    why: "Light, airy, and dangerously addictive. Umami in every puff.",
    cravingTags: ["salty", "crunchy"],
    vibeTags: ["chaotic", "adventurous"],
  },
  {
    id: "3",
    name: "Pocky Matcha",
    brand: "Glico",
    category: "Biscuit",
    why: "Earthy matcha coating over a crispy stick. Pairs with anything.",
    cravingTags: ["sweet"],
    vibeTags: ["cozy", "nostalgic"],
  },
  {
    id: "4",
    name: "Koikeya Karamucho",
    brand: "Koikeya",
    category: "Chips",
    why: "Fiery hot chili sticks. Not for the faint of heart.",
    cravingTags: ["salty", "crunchy"],
    vibeTags: ["chaotic", "adventurous"],
  },
];

const CRAVING_FILTERS = ["All", "Sweet", "Salty", "Crunchy", "Cold", "Surprise"];

// Simple search icon
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F2EFE7]">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-[#F2EFE7] border-b-2 border-black px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">SnackFindr</span>
        <div className="flex gap-2">
          <Button variant="secondary" size="md">Log in</Button>
          <Button variant="primary" size="md">Sign up</Button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-10">

        {/* Hero */}
        <section className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Find your next<br />
            <span className="underline decoration-4 underline-offset-4">favorite snack.</span>
          </h1>
          <p className="text-[#717171] text-base">
            Tell us what you're craving. We'll find the snack.
          </p>
          <Input
            leftIcon={<SearchIcon />}
            placeholder="Search snacks, brands, vibes…"
          />
        </section>

        {/* Craving filter pills */}
        <section className="flex flex-col gap-3">
          <p className="text-sm font-bold uppercase tracking-widest text-[#717171]">What are you craving?</p>
          <div className="flex flex-wrap gap-2">
            {CRAVING_FILTERS.map((f) => (
              <button
                key={f}
                className={`px-4 py-2 rounded-full border-2 border-black text-sm font-bold transition-transform active:translate-x-[2px] active:translate-y-[2px]
                  ${f === "All"
                    ? "bg-black text-white shadow-[2px_2px_0px_#717171]"
                    : "bg-white text-black shadow-[2px_2px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000000]"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* Snack cards */}
        <section className="flex flex-col gap-4">
          <p className="text-sm font-bold uppercase tracking-widest text-[#717171]">Recommended for you</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {MOCK_SNACKS.map((snack) => (
              <Card key={snack.id} className="p-4 flex flex-col gap-3">
                {/* Image placeholder */}
                <div className="w-full h-36 rounded-xl border-2 border-black bg-white flex items-center justify-center">
                  <span className="text-4xl">🍡</span>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-base leading-tight">{snack.name}</p>
                      {snack.brand && (
                        <p className="text-xs text-[#717171]">{snack.brand} · {snack.category}</p>
                      )}
                    </div>
                    <Badge>{snack.cravingTags[0]}</Badge>
                  </div>
                  <p className="text-sm text-[#717171] leading-snug">{snack.why}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {snack.vibeTags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-0.5 rounded-full border-2 border-black text-xs font-bold bg-[#F2EFE7] uppercase"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button variant="primary" size="md" className="flex-1 text-sm">
                    Save to Collection
                  </Button>
                  <Button variant="secondary" size="md" className="px-3 text-xl">
                    👎
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
