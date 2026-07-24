"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import {
  mockPosts,
  shopOf,
  fmtFCFA,
  fmtCompact,
  initials,
  levelPct,
  type MockPost,
} from "@/lib/mock-data";

/**
 * Faithful port of the prototype FEED view (renderFeed / feedCardHTML).
 * DOM structure and classes lifted 1:1 from index (3).html.
 */
export default function FeedView() {
  const router = useRouter();
  const [feedTab, setFeedTab] = useState<"abonnements" | "pourtoi">("pourtoi");
  const [posts, setPosts] = useState<MockPost[]>(mockPosts);
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const unread = 2;

  // "abonnements" tab only shows content from followed creators (empty by default)
  const list =
    feedTab === "abonnements"
      ? posts.filter((p) => following[p.creatorId])
      : posts;

  function toggleLike(id: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p
      )
    );
  }
  function toggleFollow(creatorId: string) {
    setFollowing((prev) => ({ ...prev, [creatorId]: !prev[creatorId] }));
  }

  return (
    <section id="view-feed" className="view active" style={{ background: "var(--feed-bg)" }}>
      <div className="feed-topbar">
        <div className="feed-brand">
          <span className="fb-dot" />
          <span>KORAA</span>
        </div>
        <div className="feed-tabs-group">
          <button
            className={`feed-tab ${feedTab === "abonnements" ? "active" : ""}`}
            onClick={() => setFeedTab("abonnements")}
          >
            Abonnements
          </button>
          <button
            className={`feed-tab ${feedTab === "pourtoi" ? "active" : ""}`}
            onClick={() => setFeedTab("pourtoi")}
          >
            Pour toi
          </button>
        </div>
        <div className="tb-actions">
          <button className="icon-btn on-dark" onClick={() => router.push("/discover")}>
            <Icon name="search" size={18} />
          </button>
          <button className="icon-btn on-dark" onClick={() => router.push("/notifications")}>
            <Icon name="bell" size={18} />
            {unread > 0 && <span className="badge-dot" />}
          </button>
        </div>
      </div>

      <div className="feed-scroll" id="feed-scroll">
        {list.length ? (
          list.map((p) => (
            <FeedCard
              key={p.id}
              post={p}
              following={!!following[p.creatorId]}
              onLike={() => toggleLike(p.id)}
              onFollow={() => toggleFollow(p.creatorId)}
              onOpenShop={() => router.push(`/shop/${p.shopId}`)}
            />
          ))
        ) : (
          <div
            className="feed-card"
            style={{ alignItems: "center", justifyContent: "center", color: "#fff" }}
          >
            <div className="empty-state" style={{ color: "rgba(255,255,255,.6)" }}>
              <Icon name="users" size={34} />
              <p style={{ marginTop: 10 }}>
                Suis des boutiques ou créateurs
                <br />
                pour remplir cet onglet.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FeedCard({
  post: p,
  following,
  onLike,
  onFollow,
  onOpenShop,
}: {
  post: MockPost;
  following: boolean;
  onLike: () => void;
  onFollow: () => void;
  onOpenShop: () => void;
}) {
  const s = shopOf(p.shopId)!;
  const lvl = levelPct(p.creatorLevel || "Débutant");

  return (
    <div className="feed-card" data-postid={p.id}>
      <div className="feed-media" style={{ background: p.grad }}>
        <div className="fm-scrim" />
        <div className="fm-badge">
          <Icon name="play" size={13} /> Vidéo
        </div>
      </div>

      <div className="feed-side-actions">
        <button className="fsa-btn" onClick={onOpenShop}>
          <span
            className="fsa-avatar"
            style={{
              background: s.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: "'Plus Jakarta Sans'",
              fontWeight: 800,
            }}
          >
            {initials(s.name)}
            <span className="plus">{following ? "✓" : "+"}</span>
          </span>
        </button>
        <button className={`fsa-btn ${p.liked ? "liked" : ""}`} onClick={onLike}>
          <span className="fsa-circle">
            <Icon name={p.liked ? "heartFill" : "heart"} size={22} />
          </span>
          <span>{fmtCompact(p.likes)}</span>
        </button>
        <button className="fsa-btn">
          <span className="fsa-circle">
            <Icon name="comment" size={21} />
          </span>
          <span>{fmtCompact(p.comments.length)}</span>
        </button>
        <button className="fsa-btn">
          <span className="fsa-circle">
            <Icon name="share" size={20} />
          </span>
          <span>{fmtCompact(p.shares)}</span>
        </button>
        <button className="fsa-btn">
          <span className="fsa-circle">
            <Icon name="gift" size={20} />
          </span>
          <span>{fmtCompact(p.gifts)}</span>
        </button>
      </div>

      <div className="feed-body">
        <div className="feed-shop-row">
          <div className="level-ring" style={{ ["--lvl" as string]: lvl }}>
            <div className="lr-inner">{initials(p.creatorName)}</div>
          </div>
          <div>
            <div className="fs-name">{p.creatorName}</div>
            <div className="fs-shop">
              {s.name} · {p.creatorLevel || "Débutant"}
            </div>
          </div>
          <button
            className={`feed-follow-mini ${following ? "following" : ""}`}
            onClick={onFollow}
          >
            {following ? "Suivi" : "Suivre"}
          </button>
        </div>
        <div className="feed-desc">
          {p.desc}{" "}
          {p.hashtags.map((h) => (
            <span key={h} className="tag">
              {h}{" "}
            </span>
          ))}
        </div>
        <div className="feed-music">
          <Icon name="video" size={14} /> {p.music}
        </div>
        <div className="feed-product-ribbon" onClick={onOpenShop}>
          <div className="fpr-thumb" style={{ background: s.color }} />
          <div className="fpr-info">
            <div className="fpr-name">{p.productName}</div>
            <div className="fpr-price">
              <span className="now">{fmtFCFA(p.productPrice)}</span>
              {p.productOld ? <span className="was">{fmtFCFA(p.productOld)}</span> : null}
            </div>
          </div>
          <div className="fpr-buy">Acheter</div>
        </div>
      </div>
    </div>
  );
}
