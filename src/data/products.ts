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
}

const futureDate = (days: number) =>
  new Date(Date.now() + days * 86400000).toISOString();

export const products: Product[] = [
  // Private Drops (with timers)
  {
    id: "pd-001",
    name: "Midnight Reserve Bourbon",
    description:
      "Small-batch bourbon aged 18 years in charred oak. Only 200 bottles exist worldwide. Notes of dark cherry, vanilla, and smoked caramel.",
    price: 1250,
    category: "private-drops",
    categoryLabel: "Private Drop",
    image: "",
    stock: 12,
    dropTime: futureDate(2),
    gradient: "from-purple-900/40 via-amber-900/20 to-black/60",
    badge: "DROPPING SOON",
  },
  {
    id: "pd-002",
    name: "Eclipse Single Malt",
    description:
      "Japanese-inspired single malt finished in mizunara oak. Ethereal notes of sandalwood, white peach, and incense smoke.",
    price: 2200,
    category: "private-drops",
    categoryLabel: "Private Drop",
    image: "",
    stock: 6,
    dropTime: futureDate(5),
    gradient: "from-indigo-900/40 via-slate-900/30 to-black/60",
    badge: "ULTRA RARE",
  },
  {
    id: "pd-003",
    name: "Velvet Crown XO",
    description:
      "A 40-year cognac from the hidden cellars of a legendary French estate. Layers of dried fig, leather, and ancient oak.",
    price: 4500,
    category: "private-drops",
    categoryLabel: "Private Drop",
    image: "",
    stock: 3,
    dropTime: futureDate(1),
    gradient: "from-violet-900/40 via-rose-900/20 to-black/60",
    badge: "3 LEFT",
  },
  // Collectors
  {
    id: "cl-001",
    name: "Dragon's Breath Whiskey",
    description:
      "Cask-strength whiskey with chili-infused finish. A collector's conversation piece with hand-blown glass dragon bottle.",
    price: 890,
    category: "collectors",
    categoryLabel: "Collectors",
    image: "",
    stock: 25,
    gradient: "from-red-900/30 via-orange-900/20 to-black/60",
  },
  {
    id: "cl-002",
    name: "Crystal Noir Vodka",
    description:
      "Seven-times distilled from heritage Russian wheat. Presented in a hand-cut obsidian crystal decanter.",
    price: 650,
    category: "collectors",
    categoryLabel: "Collectors",
    image: "",
    stock: 40,
    gradient: "from-slate-800/40 via-zinc-900/30 to-black/60",
  },
  {
    id: "cl-003",
    name: "Obsidian Aged Rum",
    description:
      "Caribbean rum aged 25 years in volcanic stone caves. Rich molasses, tropical spice, and dark chocolate.",
    price: 1100,
    category: "collectors",
    categoryLabel: "Collectors",
    image: "",
    stock: 18,
    gradient: "from-stone-900/40 via-amber-950/20 to-black/60",
  },
  // Novelty
  {
    id: "nv-001",
    name: "Purple Reign Cocktail Kit",
    description:
      "The ultimate home mixology experience. Premium spirits, bitters, garnishes, and crystal glassware. Makes 24 craft cocktails.",
    price: 320,
    category: "novelty",
    categoryLabel: "Novelty",
    image: "",
    stock: 50,
    gradient: "from-purple-800/30 via-fuchsia-900/20 to-black/60",
  },
  {
    id: "nv-002",
    name: "Glow Tonic Mixer Set",
    description:
      "UV-reactive artisan tonics and mixers. 12 bottles that literally glow under black light. Made with natural botanicals.",
    price: 180,
    category: "novelty",
    categoryLabel: "Novelty",
    image: "",
    stock: 75,
    gradient: "from-cyan-900/30 via-emerald-900/20 to-black/60",
  },
  {
    id: "nv-003",
    name: "Sipster's Flask Collection",
    description:
      "Set of 3 titanium flasks with laser-etched art. Each holds 8oz and comes in a velvet-lined mahogany case.",
    price: 450,
    category: "novelty",
    categoryLabel: "Novelty",
    image: "",
    stock: 30,
    gradient: "from-zinc-800/40 via-neutral-900/30 to-black/60",
  },
  // Members Exclusive
  {
    id: "me-001",
    name: "The Inner Circle Blend",
    description:
      "Our signature members-only whiskey blend. Created by our master blender exclusively for verified members.",
    price: 750,
    category: "members-exclusive",
    categoryLabel: "Members Exclusive",
    image: "",
    stock: 100,
    limitPerMember: 2,
    gradient: "from-violet-900/40 via-purple-950/30 to-black/60",
    badge: "LIMIT 2",
  },
  {
    id: "me-002",
    name: "Founders Reserve Port",
    description:
      "1967 vintage port from a private Portuguese estate. Each bottle is hand-numbered and sealed with wax.",
    price: 3200,
    category: "members-exclusive",
    categoryLabel: "Members Exclusive",
    image: "",
    stock: 8,
    limitPerMember: 1,
    gradient: "from-rose-950/40 via-red-950/20 to-black/60",
    badge: "LIMIT 1",
  },
  {
    id: "me-003",
    name: "Phantom Label Tequila",
    description:
      "Extra añejo tequila aged 7 years. The label only appears when the bottle is chilled. Agave perfection.",
    price: 580,
    category: "members-exclusive",
    categoryLabel: "Members Exclusive",
    image: "",
    stock: 45,
    limitPerMember: 3,
    gradient: "from-emerald-950/30 via-teal-950/20 to-black/60",
    badge: "LIMIT 3",
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
