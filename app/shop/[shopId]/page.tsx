"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { mockShops, mockProducts, fmtFCFA } from "@/lib/mock-data";
import { Icon } from "@/components/Icon";

// TODO: replace with a real auth check once Supabase auth is wired up.
const CURRENT_USER_ID: string | null = null;
const SHOP_OWNER_MAP: Record<string, string> = {}; // shopId -> owner user id, filled from Supabase later

export default function ShopDetailPage() {
  const params = useParams<{ shopId: string }>();
  const shop = mockShops.find((s) => s.id === params.shopId);
  const [tab, setTab] = useState<"products" | "posts">("products");

  if (!shop) return notFound();

  const products = mockProducts.filter((p) => p.shopId === shop.id);
  const isOwner = CURRENT_USER_ID !== null && SHOP_OWNER_MAP[shop.id] === CURRENT_USER_ID;

  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <header className="flex-none relative h-36 bg-gradient-to-br from-beige to-gold-dark">
        <Link href="/shop" className="absolute top-4 left-4 bg-white/90 rounded-full p-2">
          <Icon name="chevron-left" size={18} />
        </Link>
        {isOwner && (
          <button className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-2 text-[12px] font-bold flex items-center gap-1">
            <Icon name="settings" size={15} /> Gérer
          </button>
        )}
      </header>

      <section className="px-4 -mt-8">
        <div className="w-16 h-16 rounded-[18px] bg-white border-[3px] border-white shadow-soft flex items-center justify-center font-display font-extrabold text-[22px]">
          {shop.logoInitial}
        </div>
        <h1 className="text-[19px] mt-2">{shop.name}</h1>
        <p className="text-[12.5px] text-grey-soft mt-0.5">{shop.category}</p>
        <p className="text-[13px] text-grey mt-2 leading-snug">
          Boutique certifiée KORAA. Livraison rapide, produits vérifiés.
        </p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: "Abonnés", value: shop.followers.toLocaleString("fr-FR") },
            { label: "Produits", value: shop.products },
            { label: "Note", value: `${shop.rating} ★` },
          ].map((s) => (
            <div key={s.label} className="stat-tile text-center">
              <div className="font-display font-extrabold text-[16px]">{s.value}</div>
              <div className="text-[11px] text-grey-soft">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button className="btn-gold flex-1 py-3 rounded-md2 font-bold text-[13.5px]">Suivre</button>
          <Link
            href="/messages/chat-1"
            className="btn-outline flex-1 py-3 rounded-md2 font-bold text-[13.5px] text-center"
          >
            Message
          </Link>
        </div>
      </section>

      <div className="flex-none flex px-4 gap-4 border-b border-line mt-5">
        {(["products", "posts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-3 text-[13px] font-bold border-b-2 ${
              tab === t ? "border-gold-dark text-ink" : "border-transparent text-grey-soft"
            }`}
          >
            {t === "products" ? "Produits" : "Publications"}
          </button>
        ))}
      </div>

      {tab === "products" ? (
        <div className="px-4 py-3 grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="product-card rounded-lg2 overflow-hidden bg-white border border-line shadow-card">
              <div className="h-32 bg-beige-light flex items-center justify-center text-[11px] text-grey-soft">
                {product.name}
              </div>
              <div className="p-2.5">
                <p className="text-[10.5px] text-grey-soft mb-1">{shop.name}</p>
                <p className="text-[12.5px] font-semibold truncate">{product.name}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-display font-extrabold text-[13.5px] text-gold-dark">
                    {fmtFCFA(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-[11px] text-grey-soft line-through">{fmtFCFA(product.oldPrice)}</span>
                  )}
                </div>
                {isOwner && (
                  <button className="btn-ghost w-full mt-2 py-1.5 rounded-sm2 text-[11px] font-bold">
                    Modifier
                  </button>
                )}
              </div>
            </div>
          ))}
          {isOwner && (
            <button className="rounded-lg2 border-2 border-dashed border-line flex flex-col items-center justify-center gap-1 py-10 text-grey-soft text-[12px] font-semibold">
              <Icon name="plus" size={22} />
              Ajouter un produit
            </button>
          )}
        </div>
      ) : (
        <p className="empty-state">Aucune publication pour le moment.</p>
      )}
    </main>
  );
}
