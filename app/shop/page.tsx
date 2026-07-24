"use client";

import { useState } from "react";
import Link from "next/link";
import { mockShops, mockCategories } from "@/lib/mock-data";
import { Icon } from "@/components/Icon";

export default function ShopListPage() {
  const [tab, setTab] = useState<"all" | "favorites">("all");
  const shops = tab === "all" ? mockShops : mockShops.filter((s) => s.isFavorite);

  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <header className="flex-none px-4 pt-5 pb-3">
        <h1 className="text-[22px]">Boutiques</h1>
        <div className="mt-3 flex items-center gap-2 px-4 py-3 rounded-md2 bg-beige-light text-grey-soft text-[13.5px]">
          <Icon name="search" size={17} />
          <input
            placeholder="Rechercher une boutique..."
            className="bg-transparent flex-1 outline-none placeholder:text-grey-soft"
          />
        </div>
      </header>

      <div className="flex-none flex gap-2 px-4 pb-2 overflow-x-auto">
        {mockCategories.map((cat, i) => (
          <span key={cat} className={`chip ${i === 0 ? "active" : ""}`}>
            {cat}
          </span>
        ))}
      </div>

      <div className="flex-none flex px-4 gap-4 border-b border-line mt-2">
        <button
          onClick={() => setTab("all")}
          className={`py-3 text-[13px] font-bold border-b-2 ${
            tab === "all" ? "border-gold-dark text-ink" : "border-transparent text-grey-soft"
          }`}
        >
          Toutes ({mockShops.length})
        </button>
        <button
          onClick={() => setTab("favorites")}
          className={`py-3 text-[13px] font-bold border-b-2 flex items-center gap-1.5 ${
            tab === "favorites" ? "border-gold-dark text-ink" : "border-transparent text-grey-soft"
          }`}
        >
          <Icon name="heart" size={14} /> Favoris
        </button>
      </div>

      <div className="px-4 py-3 space-y-3">
        {shops.length === 0 && (
          <p className="empty-state">Aucune boutique favorite pour le moment.</p>
        )}
        {shops.map((shop) => (
          <Link key={shop.id} href={`/shop/${shop.id}`} className="card flex items-center gap-3 p-3.5">
            <div className="w-14 h-14 rounded-md2 bg-gradient-to-br from-beige to-gold-dark flex items-center justify-center font-display font-extrabold text-white text-lg flex-none">
              {shop.logoInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-[14.5px] truncate">{shop.name}</p>
              <p className="text-[12px] text-grey-soft">{shop.category}</p>
              <div className="flex gap-3 text-[10.5px] text-grey-soft mt-1">
                <span>{shop.followers.toLocaleString("fr-FR")} abonnés</span>
                <span>{shop.products} produits</span>
              </div>
            </div>
            {shop.isFavorite && <Icon name="heart" size={18} className="text-gold-dark" fill="currentColor" />}
          </Link>
        ))}
      </div>
    </main>
  );
}
