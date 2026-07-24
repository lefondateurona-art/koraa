"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ShopCard, ProductCard, CreatorRow } from "@/components/Cards";
import { mockShops, mockCreators, allProducts, topHashtags } from "@/lib/mock-data";

type Tab = "shops" | "creators" | "products" | "hashtags";
const TABS: { id: Tab; label: string }[] = [
  { id: "shops", label: "Boutiques" },
  { id: "creators", label: "Créateurs" },
  { id: "products", label: "Produits" },
  { id: "hashtags", label: "Hashtags" },
];

/** Faithful port of the prototype DISCOVER view (renderDiscover). */
export default function DiscoverView() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("shops");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const openShop = (id: string) => router.push(`/shop/${id}`);

  return (
    <section id="view-discover" className="view active">
      <div className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          Boutique
        </div>
        <div className="tb-actions">
          <button className="icon-btn">
            <Icon name="heart" size={17} />
          </button>
        </div>
      </div>

      <div className="search-bar" style={{ padding: "8px 16px" }}>
        <Icon name="search" size={17} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher boutiques, créateurs, produits..."
          style={{ flex: 1, background: "transparent", border: "none", fontSize: "13.5px" }}
        />
      </div>

      <div className="discover-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`chip ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="view-scroll" id="discover-body">
        {tab === "shops" && (
          <>
            <div className="section-row">
              <h3>Boutiques Premium</h3>
              <span className="see-all">{mockShops.length} boutiques</span>
            </div>
            <div className="product-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {mockShops
                .filter((s) => !q || s.name.toLowerCase().includes(q) || s.cat.toLowerCase().includes(q))
                .map((s) => (
                  <ShopCard key={s.id} shop={s} onOpen={() => openShop(s.id)} />
                ))}
            </div>
          </>
        )}

        {tab === "creators" && (
          <>
            <div className="section-row">
              <h3>Classement des créateurs</h3>
              <span className="see-all">🏆 Top {mockCreators.length}</span>
            </div>
            <div className="dash-list">
              {mockCreators
                .filter((c) => !q || c.name.toLowerCase().includes(q))
                .map((c, i) => (
                  <CreatorRow key={c.id} creator={c} rank={i} />
                ))}
            </div>
          </>
        )}

        {tab === "products" && (
          <>
            <div className="section-row">
              <h3>Produits tendance</h3>
            </div>
            <div className="product-grid">
              {allProducts()
                .filter((p) => !q || p.name.toLowerCase().includes(q))
                .slice(0, 20)
                .map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={() => openShop(p.shopId)} />
                ))}
            </div>
          </>
        )}

        {tab === "hashtags" && (
          <>
            <div className="section-row">
              <h3>Hashtags populaires</h3>
            </div>
            <div className="hscroll" style={{ flexWrap: "wrap" }}>
              {topHashtags.map(([h, c]) => (
                <div className="hashtag-pill" key={h}>
                  <div className="ht-name">{h}</div>
                  <div className="ht-count">{c} vidéos</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
