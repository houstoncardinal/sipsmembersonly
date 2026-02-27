export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "private-drops" | "collectors" | "novelty" | "members-exclusive";
  categoryLabel: string;
  image: string;
  stock: number;
  limitPerMember?: number;
  dropTime?: string; // ISO date string for countdown
  gradient: string;
  badge?: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
  origin?: string;
  abv?: string;
  tastingNotes?: string[];
}

const futureDate = (days: number) =>
  new Date(Date.now() + days * 86400000).toISOString();

// Product images from public folder
const PRODUCT_IMAGES = {
  premium1: "/paiprocod.jpg",
  premium2: "/proonly.jpg",
  premium3: "/qua.jpg",
  premium4: "/tuss.jpg",
};

export const products: Product[] = [
  // Private Drops (with timers) - Premium products with real images
  {
    id: "pd-001",
    name: "Midnight Reserve Bourbon",
    description:
      "Small-batch bourbon aged 18 years in charred oak. Only 200 bottles exist worldwide. Notes of dark cherry, vanilla, and smoked caramel. This exceptional spirit represents the pinnacle of American whiskey craftsmanship.",
    price: 1250,
    category: "private-drops",
    categoryLabel: "Private Drop",
    image: PRODUCT_IMAGES.premium1,
    stock: 12,
    dropTime: futureDate(2),
    gradient: "from-purple-900/40 via-amber-900/20 to-black/60",
    badge: "DROPPING SOON",
    sku: "MRB-18Y-001",
    weight: "750ml",
    abv: "45.2%",
    origin: "Kentucky, USA",
    tastingNotes: ["Dark Cherry", "Vanilla", "Smoked Caramel", "Oak"],
  },
  {
    id: "pd-002",
    name: "Eclipse Single Malt",
    description:
      "Japanese-inspired single malt finished in mizunara oak. Ethereal notes of sandalwood, white peach, and incense smoke. A masterful blend of Scottish tradition and Japanese precision.",
    price: 2200,
    category: "private-drops",
    categoryLabel: "Private Drop",
    image: PRODUCT_IMAGES.premium2,
    stock: 6,
    dropTime: futureDate(5),
    gradient: "from-indigo-900/40 via-slate-900/30 to-black/60",
    badge: "ULTRA RARE",
    sku: "ESM-MIZ-002",
    weight: "700ml",
    abv: "48.0%",
    origin: "Scotland (Mizunara Finish)",
    tastingNotes: ["Sandalwood", "White Peach", "Incense", "Honey"],
  },
  {
    id: "pd-003",
    name: "Velvet Crown XO",
    description:
      "A 40-year cognac from the hidden cellars of a legendary French estate. Layers of dried fig, leather, and ancient oak. The ultimate expression of French distillation artistry.",
    price: 4500,
    category: "private-drops",
    categoryLabel: "Private Drop",
    image: PRODUCT_IMAGES.premium3,
    stock: 3,
    dropTime: futureDate(1),
    gradient: "from-violet-900/40 via-rose-900/20 to-black/60",
    badge: "3 LEFT",
    sku: "VCXO-40Y-003",
    weight: "700ml",
    abv: "40.0%",
    origin: "Cognac, France",
    tastingNotes: ["Dried Fig", "Leather", "Ancient Oak", "Rancio"],
  },
  // Collectors - Using varied images
  {
    id: "cl-001",
    name: "Dragon's Breath Whiskey",
    description:
      "Cask-strength whiskey with chili-infused finish. A collector's conversation piece with hand-blown glass dragon bottle. Bold, fiery, and utterly unforgettable.",
    price: 890,
    category: "collectors",
    categoryLabel: "Collectors",
    image: PRODUCT_IMAGES.premium4,
    stock: 25,
    gradient: "from-red-900/30 via-orange-900/20 to-black/60",
    sku: "DBW-CS-001",
    weight: "750ml",
    abv: "58.5%",
    origin: "Ireland",
    tastingNotes: ["Chili", "Dark Chocolate", "Cinnamon", "Smoke"],
  },
  {
    id: "cl-002",
    name: "Crystal Noir Vodka",
    description:
      "Seven-times distilled from heritage Russian wheat. Presented in a hand-cut obsidian crystal decanter. The purest expression of vodka craftsmanship.",
    price: 650,
    category: "collectors",
    categoryLabel: "Collectors",
    image: PRODUCT_IMAGES.premium1,
    stock: 40,
    gradient: "from-slate-800/40 via-zinc-900/30 to-black/60",
    sku: "CNV-7D-002",
    weight: "750ml",
    abv: "40.0%",
    origin: "Russia",
    tastingNotes: ["Clean", "Pepper", "Cream", "Mineral"],
  },
  {
    id: "cl-003",
    name: "Obsidian Aged Rum",
    description:
      "Caribbean rum aged 25 years in volcanic stone caves. Rich molasses, tropical spice, and dark chocolate. A rum of extraordinary depth and complexity.",
    price: 1100,
    category: "collectors",
    categoryLabel: "Collectors",
    image: PRODUCT_IMAGES.premium2,
    stock: 18,
    gradient: "from-stone-900/40 via-amber-950/20 to-black/60",
    sku: "OAR-25Y-003",
    weight: "750ml",
    abv: "43.0%",
    origin: "Barbados",
    tastingNotes: ["Molasses", "Tropical Spice", "Dark Chocolate", "Coffee"],
  },
  // Novelty - Using varied images
  {
    id: "nv-001",
    name: "Purple Reign Cocktail Kit",
    description:
      "The ultimate home mixology experience. Premium spirits, bitters, garnishes, and crystal glassware. Makes 24 craft cocktails with step-by-step guide.",
    price: 320,
    category: "novelty",
    categoryLabel: "Novelty",
    image: PRODUCT_IMAGES.premium3,
    stock: 50,
    gradient: "from-purple-800/30 via-fuchsia-900/20 to-black/60",
    sku: "PRCK-24-001",
    weight: "2.5kg",
    dimensions: "35cm x 25cm x 15cm",
  },
  {
    id: "nv-002",
    name: "Glow Tonic Mixer Set",
    description:
      "UV-reactive artisan tonics and mixers. 12 bottles that literally glow under black light. Made with natural botanicals and zero artificial colors.",
    price: 180,
    category: "novelty",
    categoryLabel: "Novelty",
    image: PRODUCT_IMAGES.premium4,
    stock: 75,
    gradient: "from-cyan-900/30 via-emerald-900/20 to-black/60",
    sku: "GTMS-12-002",
    weight: "1.8kg",
  },
  {
    id: "nv-003",
    name: "Sipster's Flask Collection",
    description:
      "Set of 3 titanium flasks with laser-etched art. Each holds 8oz and comes in a velvet-lined mahogany case. The perfect gift for the discerning enthusiast.",
    price: 450,
    category: "novelty",
    categoryLabel: "Novelty",
    image: PRODUCT_IMAGES.premium1,
    stock: 30,
    gradient: "from-zinc-800/40 via-neutral-900/30 to-black/60",
    sku: "SFC-TI-003",
    weight: "1.2kg",
    dimensions: "20cm x 15cm x 8cm",
  },
  // Members Exclusive - Premium images
  {
    id: "me-001",
    name: "The Inner Circle Blend",
    description:
      "Our signature members-only whiskey blend. Created by our master blender exclusively for verified members. A harmonious marriage of rare casks from forgotten distilleries.",
    price: 750,
    category: "members-exclusive",
    categoryLabel: "Members Exclusive",
    image: PRODUCT_IMAGES.premium2,
    stock: 100,
    limitPerMember: 2,
    gradient: "from-violet-900/40 via-purple-950/30 to-black/60",
    badge: "LIMIT 2",
    sku: "ICB-MO-001",
    weight: "750ml",
    abv: "46.0%",
    origin: "Scotland",
    tastingNotes: ["Heather", "Honey", "Dried Fruit", "Spice"],
  },
  {
    id: "me-002",
    name: "Founders Reserve Port",
    description:
      "1967 vintage port from a private Portuguese estate. Each bottle is hand-numbered and sealed with wax. A living testament to Portuguese winemaking heritage.",
    price: 3200,
    category: "members-exclusive",
    categoryLabel: "Members Exclusive",
    image: PRODUCT_IMAGES.premium3,
    stock: 8,
    limitPerMember: 1,
    gradient: "from-rose-950/40 via-red-950/20 to-black/60",
    badge: "LIMIT 1",
    sku: "FRP-1967-002",
    weight: "750ml",
    abv: "20.0%",
    origin: "Douro Valley, Portugal",
    tastingNotes: ["Blackberry", "Walnut", "Caramel", "Earth"],
  },
  {
    id: "me-003",
    name: "Phantom Label Tequila",
    description:
      "Extra añejo tequila aged 7 years. The label only appears when the bottle is chilled. Agave perfection from the highlands of Jalisco.",
    price: 580,
    category: "members-exclusive",
    categoryLabel: "Members Exclusive",
    image: PRODUCT_IMAGES.premium4,
    stock: 45,
    limitPerMember: 3,
    gradient: "from-emerald-950/30 via-teal-950/20 to-black/60",
    badge: "LIMIT 3",
    sku: "PLT-EA7-003",
    weight: "750ml",
    abv: "40.0%",
    origin: "Jalisco, Mexico",
    tastingNotes: ["Roasted Agave", "Vanilla", "Cinnamon", "Cocoa"],
  },
];

export const categories = [
  { id: "all", label: "All Products" },
  { id: "private-drops", label: "Private Drops" },
  { id: "collectors", label: "Collectors" },
  { id: "novelty", label: "Novelty" },
  { id: "members-exclusive", label: "Members Exclusive" },
];

export const BTC_PRICE_USD = 67432.5;

export const usdToBtc = (usd: number) => usd / BTC_PRICE_USD;
export const usdToSats = (usd: number) => Math.round(usdToBtc(usd) * 1e8);
export const formatBtc = (btc: number) => btc.toFixed(8);
export const formatSats = (sats: number) =>
  sats.toLocaleString("en-US");
