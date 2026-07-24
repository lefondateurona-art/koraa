"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import {
  fmtFCFA,
  fmtCompact,
  initials,
  levelPct,
  type MockShop,
  type MockCreator,
  type FlatProduct,
} from "@/lib/mock-data";

/** Shared card components ported from the prototype's HTML builders
 *  (shopGridCardHTML / productCardHTML / creatorRowHTML). */

export function ShopCard({ shop: s, onOpen }: { shop: MockShop; onOpen: () => void }) {
  return (
    <div className="shop-card" style={{ cursor: "pointer" }} onClick={onOpen}>
      <div className="sc-cover" style={{ background: `linear-gradient(135deg,${s.color},#1c1c1c)` }}>
        {s.premium && <div className="premium-tag">★ Premium</div>}
        <div className="sc-logo">{initials(s.name)}</div>
      </div>
      <div className="sc-body">
        <div className="sc-name">{s.name}</div>
        <div className="sc-cat">{s.cat}</div>
        <div className="sc-stats">
          <span>{fmtCompact(s.followers)} abonnés</span>
          <span>★ {s.rating}</span>
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ product: p, onOpen }: { product: FlatProduct; onOpen: () => void }) {
  const [fav, setFav] = useState(false);
  return (
    <div className="product-card" style={{ cursor: "pointer" }} onClick={onOpen}>
      <div className="pc-img" style={{ background: `linear-gradient(135deg,${p.shopColor},#2a241d)` }}>
        <button
          className="pc-fav"
          onClick={(e) => {
            e.stopPropagation();
            setFav((v) => !v);
          }}
        >
          <Icon name={fav ? "heartFill" : "heart"} size={15} />
        </button>
      </div>
      <div className="pc-body">
        <div className="pc-name">{p.name}</div>
        <div className="pc-shop">{p.shopName}</div>
        <div className="pc-price">{fmtFCFA(p.price)}</div>
      </div>
    </div>
  );
}

export function CreatorRow({ creator: c, rank: i }: { creator: MockCreator; rank: number }) {
  return (
    <div className="dash-row" style={{ cursor: "pointer" }}>
      <div
        style={{
          width: 22,
          textAlign: "center",
          fontWeight: 800,
          color: i < 3 ? "var(--gold-dark)" : "var(--grey-soft)",
        }}
      >
        {i + 1}
      </div>
      <div
        className="level-ring"
        style={{ ["--lvl" as string]: levelPct(c.level), width: 38, height: 38 } as React.CSSProperties}
      >
        <div className="lr-inner" style={{ width: "100%", height: "100%", background: c.color, fontSize: 12 }}>
          {initials(c.name)}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "13.5px", fontWeight: 700 }}>{c.name}</div>
        <div style={{ fontSize: 11, color: "var(--grey-soft)" }}>
          {c.level} · {fmtCompact(c.followers)} abonnés
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold-dark)" }}>
        {fmtCompact(c.videos)} vids
      </div>
    </div>
  );
}
