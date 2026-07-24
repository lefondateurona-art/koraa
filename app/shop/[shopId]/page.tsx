"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { shopOf, mockPosts, fmtCompact, initials } from "@/lib/mock-data";
import { ProductCard } from "@/components/Cards";

/** Faithful port of the prototype SHOP DETAIL view (renderShop). */
export default function ShopDetailView({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = use(params);
  const router = useRouter();
  const s = shopOf(shopId);
  const [following, setFollowing] = useState(false);
  const [fav, setFav] = useState(false);

  if (!s) {
    router.replace("/discover");
    return null;
  }

  const cats = [...new Set(s.products.map((p) => p.cat))];
  const videoCount = mockPosts.filter((p) => p.shopId === s.id).length;

  return (
    <section id="view-shop" className="view active">
      <div className="view-scroll">
        <div className="shop-hero" style={{ background: `linear-gradient(135deg,${s.color},#1c1c1c)` }}>
          <button className="icon-btn on-dark sh-back" onClick={() => router.push("/discover")}>
            <Icon name="chevLeft" size={18} />
          </button>
          <div className="sh-actions">
            <button className="icon-btn on-dark" onClick={() => setFav((v) => !v)}>
              <Icon name={fav ? "heartFill" : "heart"} size={17} />
            </button>
            <button className="icon-btn on-dark" onClick={() => router.push(`/messages/${s.id}`)}>
              <Icon name="message" size={16} />
            </button>
          </div>
        </div>

        <div className="shop-identity">
          <div className="si-logo" style={{ color: s.color as string }}>
            {initials(s.name)}
          </div>
          <div className="si-name">
            {s.name}{" "}
            <span style={{ color: "var(--gold-dark)", fontSize: 12 }}>★ {s.rating}</span>
          </div>
          <div className="si-cat">{s.cat} · synchronisé depuis Orbit City</div>
          <div className="si-desc">{s.desc}</div>
        </div>

        <div className="shop-stats-row">
          <div className="ssr-item">
            <div className="ssr-num">{fmtCompact(s.followers)}</div>
            <div className="ssr-label">Abonnés</div>
          </div>
          <div className="ssr-item">
            <div className="ssr-num">{s.products.length}</div>
            <div className="ssr-label">Produits</div>
          </div>
          <div className="ssr-item">
            <div className="ssr-num">{videoCount}</div>
            <div className="ssr-label">Vidéos</div>
          </div>
        </div>

        <div className="shop-cta-row">
          <button
            className={`btn ${following ? "btn-ghost" : "btn-gold"}`}
            onClick={() => setFollowing((v) => !v)}
          >
            {following ? "Suivi ✓" : "Suivre la boutique"}
          </button>
          <button className="btn btn-outline">
            <Icon name="share" size={15} /> Partager
          </button>
        </div>

        <div className="shop-cats">
          {cats.map((c) => (
            <span className="chip" key={c}>
              {c}
            </span>
          ))}
        </div>

        <div className="section-row">
          <h3>Catalogue</h3>
        </div>
        <div className="product-grid">
          {s.products.map((p) => (
            <ProductCard
              key={p.id}
              product={{ ...p, shopId: s.id, shopName: s.name, shopColor: s.color }}
              onOpen={() => {}}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
