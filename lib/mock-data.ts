/**
 * TEMPORARY MOCK DATA — used only until Supabase tables are wired up.
 * Replace every usage of these arrays with real Supabase queries once the
 * backend is live (see SETUP_REQUIRED.md). Nothing here is real user data.
 */

export type MockShop = {
  id: string;
  name: string;
  category: string;
  logoInitial: string;
  followers: number;
  products: number;
  rating: number;
  isFavorite: boolean;
};

export const mockShops: MockShop[] = [
  { id: "shop-1", name: "Adama Boutique", category: "Mode femme", logoInitial: "A", followers: 12400, products: 86, rating: 4.8, isFavorite: true },
  { id: "shop-2", name: "TechHub CI", category: "Électronique", logoInitial: "T", followers: 30500, products: 214, rating: 4.6, isFavorite: false },
  { id: "shop-3", name: "Beauté d'Ébène", category: "Cosmétiques", logoInitial: "B", followers: 8900, products: 54, rating: 4.9, isFavorite: false },
  { id: "shop-4", name: "Chaussures Koffi", category: "Chaussures", logoInitial: "C", followers: 5200, products: 39, rating: 4.4, isFavorite: true },
];

export type MockProduct = {
  id: string;
  shopId: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
};

export const mockProducts: MockProduct[] = [
  { id: "prod-1", shopId: "shop-1", name: "Robe wax imprimée", price: 15000, oldPrice: 20000, category: "Mode femme" },
  { id: "prod-2", shopId: "shop-2", name: "Écouteurs sans fil", price: 12500, category: "Électronique" },
  { id: "prod-3", shopId: "shop-3", name: "Beurre de karité bio", price: 4000, category: "Cosmétiques" },
  { id: "prod-4", shopId: "shop-4", name: "Sneakers unisexe", price: 22000, oldPrice: 27000, category: "Chaussures" },
];

export type MockPost = {
  id: string;
  shopId: string;
  creatorName: string;
  creatorHandle: string;
  productName: string;
  caption: string;
  likes: number;
  comments: number;
  thumbnailLabel: string;
};

export const mockPosts: MockPost[] = [
  { id: "post-1", shopId: "shop-1", creatorName: "Awa Diarra", creatorHandle: "@awa.style", productName: "Robe wax imprimée", caption: "La robe parfaite pour vos sorties de weekend ✨", likes: 3400, comments: 128, thumbnailLabel: "Robe wax" },
  { id: "post-2", shopId: "shop-2", creatorName: "Yao Tech", creatorHandle: "@yao.tech", productName: "Écouteurs sans fil", caption: "Test complet des nouveaux écouteurs, le son est incroyable", likes: 7600, comments: 342, thumbnailLabel: "Écouteurs" },
  { id: "post-3", shopId: "shop-3", creatorName: "Fatou Beauté", creatorHandle: "@fatou.beaute", productName: "Beurre de karité bio", caption: "Ma routine peau douce avec ce beurre 100% naturel", likes: 2100, comments: 76, thumbnailLabel: "Karité bio" },
];

export type MockConversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
};

export const mockConversations: MockConversation[] = [
  { id: "chat-1", name: "Adama Boutique", preview: "Votre commande est en préparation", time: "10:24", unread: 2 },
  { id: "chat-2", name: "TechHub CI", preview: "Merci pour votre achat !", time: "Hier", unread: 0 },
  { id: "chat-3", name: "Fatou Beauté", preview: "Le colis part demain matin", time: "Lun", unread: 1 },
];

export type MockMessage = {
  id: string;
  chatId: string;
  author: "me" | "them";
  text: string;
  time: string;
};

export const mockMessages: MockMessage[] = [
  { id: "m1", chatId: "chat-1", author: "them", text: "Bonjour, votre commande a bien été reçue.", time: "10:10" },
  { id: "m2", chatId: "chat-1", author: "me", text: "Super, merci ! Elle arrive quand ?", time: "10:12" },
  { id: "m3", chatId: "chat-1", author: "them", text: "Votre commande est en préparation, livraison sous 48h.", time: "10:24" },
];

export type MockNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export const mockNotifications: MockNotification[] = [
  { id: "n1", title: "Nouvelle commande", body: "Votre commande #4821 a été expédiée", time: "2h", read: false },
  { id: "n2", title: "Nouveau follower", body: "Yao Tech a commencé à vous suivre", time: "5h", read: false },
  { id: "n3", title: "Promotion", body: "-20% chez Beauté d'Ébène ce weekend", time: "1j", read: true },
];

export const mockCategories = [
  "Tout", "Mode femme", "Mode homme", "Électronique", "Cosmétiques", "Chaussures", "Maison",
];

export function fmtFCFA(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

export function fmtCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}
