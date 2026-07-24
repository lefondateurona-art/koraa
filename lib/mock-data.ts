/**
 * TEMPORARY MOCK DATA — used only until Supabase tables are wired up.
 * Shapes and helper functions mirror the prototype (index (3).html) so the
 * ported views render 1:1. Replace with real Supabase queries later
 * (see SETUP_REQUIRED.md). Nothing here is real user data.
 */

/* ---------- Helpers ported verbatim from the prototype ---------- */
export function fmtFCFA(n: number): string {
  return Math.round(n).toLocaleString("fr-FR").replace(/ /g, " ") + " F";
}
export function fmtCompact(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return String(n);
}
export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
const GRADIENTS = [
  "linear-gradient(150deg,#3a2e1f,#8a6a35)",
  "linear-gradient(150deg,#2c3b2e,#5f8a63)",
  "linear-gradient(150deg,#3a2222,#8a4a3d)",
  "linear-gradient(150deg,#22303a,#3d6a8a)",
  "linear-gradient(150deg,#332440,#6a4a8a)",
  "linear-gradient(150deg,#403322,#8a6f3d)",
  "linear-gradient(150deg,#1f3a37,#3d8a7a)",
  "linear-gradient(150deg,#3a2a3a,#8a3d78)",
];
export function gradFor(seed: string): string {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}
export function levelPct(level: string): number {
  return (
    ({ Débutant: 20, Ambassadeur: 40, Influenceur: 65, Étoile: 85, Icône: 100 } as Record<
      string,
      number
    >)[level] || 20
  );
}

/* ---------- Types ---------- */
export type MockProduct = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  cat: string;
};
export type MockShop = {
  id: string;
  name: string;
  cat: string;
  color: string;
  followers: number;
  rating: number;
  premium?: boolean;
  desc: string;
  products: MockProduct[];
};
export type MockComment = { id: string; author: string; color: string; text: string };
export type MockPost = {
  id: string;
  shopId: string;
  productName: string;
  productPrice: number;
  productOld?: number;
  creatorId: string;
  creatorName: string;
  creatorLevel: string;
  desc: string;
  hashtags: string[];
  music: string;
  grad: string;
  likes: number;
  comments: MockComment[];
  shares: number;
  gifts: number;
  liked: boolean;
};

/* ---------- Shops (sample catalogue, stands in for Orbit-synced shops) ---------- */
export const mockShops: MockShop[] = [
  {
    id: "shop-adama",
    name: "Adama Mode",
    cat: "Mode femme",
    color: gradFor("Adama Mode"),
    followers: 12400,
    rating: 4.8,
    premium: true,
    desc: "Prêt-à-porter wax & tendances d'Abidjan, livraison partout en Côte d'Ivoire.",
    products: [
      { id: "p-1", name: "Robe wax imprimée", price: 15000, oldPrice: 20000, cat: "Mode femme" },
      { id: "p-2", name: "Ensemble pagne moderne", price: 22000, cat: "Mode femme" },
    ],
  },
  {
    id: "shop-techhub",
    name: "TechHub CI",
    cat: "Électronique",
    color: gradFor("TechHub CI"),
    followers: 30500,
    rating: 4.6,
    premium: true,
    desc: "High-tech, accessoires et gadgets au meilleur prix. Garantie 12 mois.",
    products: [
      { id: "p-3", name: "Écouteurs sans fil", price: 12500, cat: "Électronique" },
      { id: "p-4", name: "Montre connectée", price: 28000, oldPrice: 35000, cat: "Électronique" },
    ],
  },
  {
    id: "shop-ebene",
    name: "Beauté d'Ébène",
    cat: "Cosmétiques",
    color: gradFor("Beauté d'Ébène"),
    followers: 8900,
    rating: 4.9,
    desc: "Cosmétiques naturels au karité et à l'huile de coco, faits en Côte d'Ivoire.",
    products: [
      { id: "p-5", name: "Beurre de karité bio", price: 4000, cat: "Cosmétiques" },
      { id: "p-6", name: "Savon noir gommant", price: 3000, oldPrice: 4500, cat: "Cosmétiques" },
    ],
  },
  {
    id: "shop-koffi",
    name: "Chaussures Koffi",
    cat: "Chaussures",
    color: gradFor("Chaussures Koffi"),
    followers: 5200,
    rating: 4.4,
    desc: "Sneakers et modèles unisexes, du 36 au 46. Nouveautés chaque semaine.",
    products: [
      { id: "p-7", name: "Sneakers unisexe", price: 22000, oldPrice: 27000, cat: "Chaussures" },
    ],
  },
];

export function shopOf(id: string): MockShop | undefined {
  return mockShops.find((s) => s.id === id);
}

/* ---------- Feed posts (creator content promoting shops) ---------- */
const SAMPLE_COMMENTS: MockComment[] = [
  { id: "c1", author: "Mariam Traoré", color: gradFor("Mariam"), text: "Trop bien, je commande direct 😍" },
  { id: "c2", author: "Yao Kouadio", color: gradFor("Yao"), text: "Le prix est correct pour la qualité" },
  { id: "c3", author: "Grace Bamba", color: gradFor("Grace"), text: "J'ai déjà testé, c'est top !" },
];

export const mockPosts: MockPost[] = [
  {
    id: "post-1",
    shopId: "shop-adama",
    productName: "Robe wax imprimée",
    productPrice: 15000,
    productOld: 20000,
    creatorId: "cr-aicha",
    creatorName: "Aïcha Koné",
    creatorLevel: "Étoile",
    desc: "Je viens de tester cette robe chez Adama Mode 😍 verdict dans la vidéo !",
    hashtags: ["#AdamaMode", "#KORAA", "#Modefemme"],
    music: "Adama Mode • Son original",
    grad: gradFor("Robe wax imprimée0"),
    likes: 3400,
    comments: SAMPLE_COMMENTS.slice(0, 2),
    shares: 214,
    gifts: 32,
    liked: false,
  },
  {
    id: "post-2",
    shopId: "shop-techhub",
    productName: "Écouteurs sans fil",
    productPrice: 12500,
    creatorId: "cr-serge",
    creatorName: "Serge Kouassi",
    creatorLevel: "Influenceur",
    desc: "Mon avis honnête sur ces écouteurs — vous allez adorer.",
    hashtags: ["#TechHubCI", "#KORAA", "#Électronique"],
    music: "TechHub CI • Son original",
    grad: gradFor("Écouteurs sans fil1"),
    likes: 7600,
    comments: SAMPLE_COMMENTS,
    shares: 342,
    gifts: 51,
    liked: false,
  },
  {
    id: "post-3",
    shopId: "shop-ebene",
    productName: "Beurre de karité bio",
    productPrice: 4000,
    creatorId: "cr-fatou",
    creatorName: "Fatou Diabaté",
    creatorLevel: "Ambassadeur",
    desc: "Ma routine peau douce avec ce beurre 100% naturel chez Beauté d'Ébène.",
    hashtags: ["#BeautédÉbène", "#KORAA", "#Cosmétiques"],
    music: "Beauté d'Ébène • Son original",
    grad: gradFor("Beurre de karité bio2"),
    likes: 2100,
    comments: SAMPLE_COMMENTS.slice(1),
    shares: 88,
    gifts: 12,
    liked: false,
  },
];

/* ---------- Creators (ranking / discover) ---------- */
export type MockCreator = {
  id: string;
  name: string;
  handle: string;
  level: string;
  color: string;
  followers: number;
  videos: number;
  sales: number;
};
export const mockCreators: MockCreator[] = [
  { id: "cr-aicha", name: "Aïcha Koné", handle: "@aichakone", level: "Étoile", color: gradFor("Aïcha"), followers: 21500, videos: 34, sales: 128 },
  { id: "cr-serge", name: "Serge Kouassi", handle: "@sergekouassi", level: "Influenceur", color: gradFor("Serge"), followers: 9800, videos: 21, sales: 64 },
  { id: "cr-fatou", name: "Fatou Diabaté", handle: "@fatoudiabate", level: "Ambassadeur", color: gradFor("Fatou"), followers: 3200, videos: 12, sales: 27 },
  { id: "cr-david", name: "David Yao", handle: "@davidyao", level: "Débutant", color: gradFor("David"), followers: 640, videos: 4, sales: 3 },
];

/* ---------- Products flattened (trending / search) ---------- */
export type FlatProduct = MockProduct & { shopId: string; shopName: string; shopColor: string };
export function allProducts(): FlatProduct[] {
  return mockShops.flatMap((s) =>
    s.products.map((p) => ({ ...p, shopId: s.id, shopName: s.name, shopColor: s.color }))
  );
}

/* ---------- Popular hashtags ---------- */
export const topHashtags: [string, number][] = [
  ["#KORAA", 1240],
  ["#AdamaMode", 386],
  ["#TechHubCI", 512],
  ["#Cosmétiques", 274],
  ["#BonPlan", 903],
  ["#MadeInCI", 641],
];

/* ---------- Categories (Discover) ---------- */
export const mockCategories = [
  "Tout",
  "Mode femme",
  "Mode homme",
  "Électronique",
  "Cosmétiques",
  "Chaussures",
  "Maison",
];

/* ---------- Conversations / messages ---------- */
export type MockConversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
};
export const mockConversations: MockConversation[] = [
  { id: "chat-adama", name: "Adama Mode", preview: "Votre commande est en préparation", time: "10:24", unread: 2 },
  { id: "chat-techhub", name: "TechHub CI", preview: "Merci pour votre achat !", time: "Hier", unread: 0 },
  { id: "chat-ebene", name: "Beauté d'Ébène", preview: "Le colis part demain matin", time: "Lun", unread: 1 },
];
export type MockMessage = { id: string; chatId: string; mine: boolean; text: string; time: string };
export const mockMessages: MockMessage[] = [
  { id: "m1", chatId: "chat-adama", mine: false, text: "Bonjour 👋 bienvenue chez Adama Mode !", time: "10:10" },
  { id: "m2", chatId: "chat-adama", mine: true, text: "Bonjour, ma commande arrive quand ?", time: "10:12" },
  { id: "m3", chatId: "chat-adama", mine: false, text: "Votre commande est en préparation, livraison sous 48h.", time: "10:24" },
];

/* ---------- Notifications ---------- */
export type MockNotification = {
  id: string;
  icon: string;
  text: string;
  time: string;
  read: boolean;
};
export const mockNotifications: MockNotification[] = [
  { id: "n1", icon: "badge", text: "Bienvenue sur KORAA ! Ton badge « Bienvenue » a été débloqué 🎉", time: "1 min", read: false },
  { id: "n2", icon: "users", text: "Serge Kouassi a commencé à te suivre", time: "5 h", read: false },
  { id: "n3", icon: "tag", text: "-20% chez Beauté d'Ébène ce weekend", time: "1 j", read: true },
];
