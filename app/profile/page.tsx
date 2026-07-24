"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";
import { fmtFCFA, fmtCompact, initials, gradFor } from "@/lib/mock-data";

/** Temporary mock user — replaced by Supabase auth/profile later. Shape
 *  mirrors the prototype defaultUser() so the view renders 1:1. */
const U = {
  name: "Utilisateur KORAA",
  handle: "@utilisateurkoraa",
  ville: "Abidjan",
  email: "elijah@email.com",
  phone: "+225 07 00 00 00 00",
  langue: "Français",
  avatarColor: gradFor("KORAA"),
  level: "Débutant",
  levelProgress: 12,
  badges: ["Bienvenue"],
  vouchers: [] as { code: string; pct: number; earnedAtOrder: number; used: boolean }[],
  following: { creators: [] as string[] },
  history: [{ label: "Compte KORAA créé", tag: "Bienvenue" }],
  stats: {
    orders: 0,
    spent: 0,
    revenue: 0,
    commissions: 0,
    videosPublished: 0,
    salesDone: 0,
    followers: 0,
    shopsFollowed: 0,
    favProducts: 0,
    ranking: 1450,
    giftsReceived: 0,
    rewardsPoints: 50,
  },
};

const LANG_OPTIONS = ["Français", "Anglais", "Espagnol", "Dioula", "Baoulé"];
type Tab = "dashboard" | "contenu" | "historique" | "parametres";
const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "contenu", label: "Contenu" },
  { id: "historique", label: "Historique" },
  { id: "parametres", label: "Paramètres" },
];

/** Faithful port of the prototype PROFILE view (renderProfile / renderProfileBody). */
export default function ProfileView() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <section id="view-profile" className="view active">
      <div className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          Profil
        </div>
        <div className="tb-actions">
          <button className="icon-btn" onClick={() => router.push("/notifications")}>
            <Icon name="bell" size={17} />
            <span className="badge-dot" />
          </button>
        </div>
      </div>

      <div className="view-scroll">
        <div className="profile-hero">
          <div className="level-ring" style={{ ["--lvl" as string]: U.levelProgress, width: 78, height: 78 }}>
            <div className="lr-inner" style={{ width: "100%", height: "100%", background: U.avatarColor, fontSize: 24 }}>
              {initials(U.name)}
            </div>
          </div>
          <div className="ph-name">{U.name}</div>
          <div className="ph-handle">
            {U.handle} · {U.ville}
          </div>
          <div className="ph-level">
            <Icon name="trophy" size={13} /> Niveau {U.level} · #{U.stats.ranking}
          </div>
          <div className="profile-followrow">
            <div className="pf-item">
              <div className="pf-num">{U.stats.shopsFollowed}</div>
              <div className="pf-label">Boutiques suivies</div>
            </div>
            <div className="pf-item">
              <div className="pf-num">{U.following.creators.length}</div>
              <div className="pf-label">Créateurs suivis</div>
            </div>
            <div className="pf-item">
              <div className="pf-num">{U.stats.favProducts}</div>
              <div className="pf-label">Favoris</div>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`profile-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div id="profile-body">
          {tab === "dashboard" && <DashboardBody />}
          {tab === "contenu" && (
            <div className="empty-state">
              <Icon name="video" size={28} />
              <p>
                Tu n&apos;as encore publié aucune vidéo.
                <br />
                Appuie sur créer pour publier ton premier contenu.
              </p>
              <button className="btn btn-gold" style={{ marginTop: 14 }} onClick={() => router.push("/create")}>
                <Icon name="plus" size={15} /> Créer
              </button>
            </div>
          )}
          {tab === "historique" && (
            <div className="dash-list" style={{ paddingTop: 14 }}>
              {U.history.map((h, i) => (
                <div className="history-row" key={i}>
                  <span>{h.label}</span>
                  <span className="hr-tag">{h.tag}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "parametres" && <SettingsBody router={router} />}
        </div>
      </div>
    </section>
  );
}

function row(icon: IconName, label: string, value: string) {
  return (
    <div className="dash-row">
      <div className="dr-icon">
        <Icon name={icon} size={17} />
      </div>
      <div className="dr-label">{label}</div>
      <div className="dr-val">{value}</div>
    </div>
  );
}

function DashboardBody() {
  const s = U.stats;
  return (
    <>
      <div className="dash-list">
        <div className="dash-row" style={{ cursor: "pointer" }}>
          <div className="dr-icon">
            <Icon name="bag" size={17} />
          </div>
          <div className="dr-label">Commandes passées ›</div>
          <div className="dr-val">{s.orders}</div>
        </div>
        {row("wallet", "Montant total dépensé", fmtFCFA(s.spent))}
        {row("wallet", "Revenus générés", fmtFCFA(s.revenue))}
        {row("tag", "Commissions", fmtFCFA(s.commissions))}
        {row("video", "Vidéos publiées", String(s.videosPublished))}
        {row("bag", "Ventes réalisées", String(s.salesDone))}
        {row("users", "Followers", fmtCompact(s.followers))}
        {row("gift", "Cadeaux reçus", String(s.giftsReceived))}
        {row("star", "Points de récompense", `${s.rewardsPoints} pts`)}
        {row("trophy", "Classement", `#${s.ranking}`)}
      </div>
      <div className="section-row">
        <h3>Badges</h3>
      </div>
      <div className="badge-row">
        {U.badges.map((b) => (
          <div className="badge-chip" key={b}>
            <div className="bc-icon">
              <Icon name="badge" size={22} />
            </div>
            <div className="bc-label">{b}</div>
          </div>
        ))}
      </div>
      <div className="section-row">
        <h3>Mes bons de réduction</h3>
        <span className="see-all">0 disponible</span>
      </div>
      <div className="empty-state" style={{ padding: "16px 18px" }}>
        <Icon name="tag" size={24} />
        <p>Encore 10 achats avant ton prochain bon de réduction.</p>
      </div>
    </>
  );
}

function SettingsBody({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <>
      <div className="settings-row">
        <span>Langue</span>
        <select
          defaultValue={U.langue}
          style={{
            border: "1.5px solid var(--line)",
            borderRadius: 999,
            padding: "7px 12px",
            fontSize: "12.5px",
            fontWeight: 700,
            background: "var(--beige-light)",
          }}
        >
          {LANG_OPTIONS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>
      <div className="settings-row">
        <span>Email</span>
        <b>{U.email || "—"}</b>
      </div>
      <div className="settings-row">
        <span>Téléphone</span>
        <b>{U.phone || "—"}</b>
      </div>
      <div className="settings-row">
        <span>Ville</span>
        <b>{U.ville}</b>
      </div>
      <div className="settings-row">
        <span>Consentement confidentialité</span>
        <b>
          <Icon name="check" size={15} />
        </b>
      </div>
      <div className="settings-row" style={{ cursor: "pointer" }}>
        <span>
          <Icon name="badge" size={14} /> Règlement intérieur
        </span>
        <span>
          <Icon name="chevRight" size={15} />
        </span>
      </div>
      <div style={{ padding: "20px 18px" }}>
        <button className="btn btn-outline btn-block" onClick={() => router.push("/auth")}>
          <Icon name="logout" size={15} /> Se déconnecter
        </button>
      </div>
    </>
  );
}
