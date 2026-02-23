// scripts/fetch_snacks.js
// Run: node scripts/fetch_snacks.js

const fs = require("fs");
const path = require("path");

const OUTPUT_PATH = path.join(process.cwd(), "data", "snacks.json");

const CRAVING_KEYWORDS = {
  sweet: ["chocolate", "cookie", "cookies", "candy", "caramel", "vanilla", "strawberry", "matcha", "mochi", "brownie", "cake", "ice cream"],
  salty: ["salt", "soy", "shoyu", "umami", "seaweed", "nori", "ramen", "chips", "crackers", "pretzel", "jerky"],
  crunchy: ["chips", "crisp", "crisps", "crunch", "cracker", "crackers", "pretzel", "corn", "puffs", "popcorn"],
  greasy: ["fried", "cheese", "cheddar", "bbq", "barbecue", "ramen", "noodle", "noodles"],
  cold: ["ice cream", "gelato", "frozen", "popsicle", "sorbet"],
};

const VIBE_KEYWORDS = {
  cozy: ["cookies", "cookie", "chocolate", "vanilla", "mochi", "marshmallow", "milk tea", "boba"],
  chaotic: ["extra hot", "xxtra", "extreme", "spicy", "flamin", "takis", "hot"],
  nostalgic: ["oreo", "kitkat", "snickers", "m&m", "doritos", "lays", "pringles", "coca-cola", "pepsi"],
  "healthy-ish": ["protein", "baked", "low sugar", "keto", "seaweed", "nuts", "almond", "granola"],
  comfort: ["ramen", "noodle", "noodles", "chips", "ice cream", "chocolate", "cheese"],
  adventurous: ["wasabi", "truffle", "matcha", "yuzu", "kimchi", "seaweed", "tamarind", "ube", "miso"],
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeText(s) {
  return (s || "").toLowerCase();
}

function pickTags(text, dict, maxTags = 2) {
  const hits = [];
  for (const [tag, words] of Object.entries(dict)) {
    for (const w of words) {
      if (text.includes(w)) {
        hits.push(tag);
        break;
      }
    }
  }
  return [...new Set(hits)].slice(0, maxTags);
}

function guessCategory(categories = "") {
  const c = normalizeText(categories);
  if (c.includes("chips") || c.includes("crisps")) return "Chips";
  if (c.includes("cookie") || c.includes("biscuits")) return "Cookies";
  if (c.includes("candy") || c.includes("chocolate")) return "Candy";
  if (c.includes("noodle") || c.includes("ramen")) return "Instant Foods";
  if (c.includes("ice cream") || c.includes("frozen")) return "Frozen";
  if (c.includes("crackers")) return "Crackers";
  return "Snacks";
}

const QUERIES = [
  { label: "chips", search_terms: "chips crisps" },
  { label: "cookies", search_terms: "cookies biscuits" },
  { label: "candy", search_terms: "candy chocolate" },
  { label: "ramen", search_terms: "ramen noodles" },
  { label: "snacks", search_terms: "snacks" },
];

async function fetchOffPage(search_terms, page, page_size) {
    const url = new URL("https://world.openfoodfacts.org/cgi/search.pl");
    url.searchParams.set("search_terms", search_terms);
    url.searchParams.set("search_simple", "1");
    url.searchParams.set("action", "process");
    url.searchParams.set("json", "1");
    url.searchParams.set("page", String(page));
    url.searchParams.set("page_size", String(page_size));
  
    const maxRetries = 5;
  
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
  
      try {
        console.log(`Fetching: ${search_terms} page ${page} (attempt ${attempt}/${maxRetries})`);
        const res = await fetch(url.toString(), {
          headers: { "User-Agent": "SnackFindr/0.1 (prototype)" },
          signal: controller.signal,
        });
  
        if (res.ok) return await res.json();
  
        // retry on 429/5xx
        if (res.status === 429 || res.status >= 500) {
          console.warn(`OFF returned ${res.status}. Retrying...`);
        } else {
          throw new Error(`OFF request failed: ${res.status} ${res.statusText}`);
        }
      } catch (err) {
        console.warn(`Fetch error: ${err?.message || err}. Retrying...`);
      } finally {
        clearTimeout(timeout);
      }
  
      // exponential backoff
      await sleep(500 * attempt * attempt);
    }
  
    throw new Error(`OFF request failed after ${maxRetries} retries`);
  }

function toSnack(offProduct) {
  const name = offProduct.product_name || offProduct.product_name_en || offProduct.generic_name;
  if (!name) return null;

  const brand = offProduct.brands ? offProduct.brands.split(",")[0].trim() : undefined;
  const categories = offProduct.categories || "";
  const category = guessCategory(categories);

  const imageUrl =
    offProduct.image_front_url ||
    offProduct.image_url ||
    offProduct.image_front_small_url ||
    "";

  const sourceUrl =
    offProduct.url ||
    (offProduct.code ? `https://world.openfoodfacts.org/product/${offProduct.code}` : undefined);

  const textBlob = normalizeText(`${name} ${brand || ""} ${categories}`);

  const cravingTags = pickTags(textBlob, CRAVING_KEYWORDS, 2);
  const vibeTags = pickTags(textBlob, VIBE_KEYWORDS, 2);

  if (cravingTags.length === 0) cravingTags.push("crunchy");

  return {
    id: offProduct.code ? `off_${offProduct.code}` : `off_${Math.random().toString(36).slice(2)}`,
    name,
    brand,
    category,
    imageUrl,
    cravingTags,
    vibeTags,
    source: "OFF",
    sourceUrl,
  };
}

async function main() {
  const seen = new Set();
  const snacks = [];

  const PAGE_SIZE = 50;
  const PAGES_PER_QUERY = 4;

  for (const q of QUERIES) {
    for (let page = 1; page <= PAGES_PER_QUERY; page++) {
      const data = await fetchOffPage(q.search_terms, page, PAGE_SIZE);
      const products = Array.isArray(data.products) ? data.products : [];

      for (const p of products) {
        const snack = toSnack(p);
        if (!snack) continue;
        if (seen.has(snack.id)) continue;
        seen.add(snack.id);
        if (!snack.name || !snack.category) continue;
        snacks.push(snack);
      }

      await sleep(250);
    }
  }

  const MAX_OUT = 600;
  const finalSnacks = snacks.slice(0, MAX_OUT);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalSnacks, null, 2), "utf-8");

  console.log(`✅ Wrote ${finalSnacks.length} snacks to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});