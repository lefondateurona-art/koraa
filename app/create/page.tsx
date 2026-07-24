"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

/** Faithful port of the prototype CREATE view (renderCreate — "Devenir Créateur" state). */
const WIZARD_STEPS = [
  { title: "Acheter un produit", sub: "Choisis un produit dans une boutique Premium" },
  { title: "Recevoir le produit", sub: "Ta commande est livrée chez toi" },
  { title: "Réaliser une vidéo authentique", sub: "Filme ton avis sincère avec ton smartphone" },
  { title: "Publier la vidéo", sub: "Ajoute une description et des hashtags" },
  { title: "Associer la vidéo au produit", sub: "Le lien d'achat apparaît automatiquement" },
  { title: "Partager ton lien", sub: "Chaque vente te rapporte une commission" },
];

export default function CreateView() {
  const [sheet, setSheet] = useState(false);

  return (
    <section id="view-create" className="view active">
      <div className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          Devenir Créateur
        </div>
      </div>

      <div className="view-scroll">
        <div className="creator-hero">
          <h3>Transforme ta voix en revenu</h3>
          <p>
            Achète, filme, publie : chaque vente générée par tes vidéos te rapporte une commission
            automatique.
          </p>
          <button className="btn btn-gold" onClick={() => setSheet(true)}>
            Publier ma première vidéo
          </button>
        </div>

        <div className="section-row">
          <h3>Comment ça marche</h3>
        </div>
        <div className="wizard-steps">
          {WIZARD_STEPS.map((s, i) => (
            <div className="wizard-step" key={i}>
              <div className="ws-num">{i + 1}</div>
              <div>
                <div className="ws-title">{s.title}</div>
                <div className="ws-sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "0 18px 24px" }}>
          <button className="btn btn-outline btn-block">
            <Icon name="building" size={16} /> Vous représentez une entreprise ?
          </button>
        </div>
      </div>

      {sheet && <CreateOptionsSheet onClose={() => setSheet(false)} />}
    </section>
  );
}

/** Faithful port of openCreateOptionsSheet — publish via YouTube/TikTok link
 *  or upload; live is disabled ("bientôt disponible") to spare storage. */
function CreateOptionsSheet({ onClose }: { onClose: () => void }) {
  const options: {
    icon: Parameters<typeof Icon>[0]["name"];
    color: string;
    title: string;
    sub: string;
    disabled?: boolean;
  }[] = [
    {
      icon: "link",
      color: "linear-gradient(145deg,var(--gold),var(--gold-dark))",
      title: "Coller un lien YouTube / TikTok",
      sub: "Publie une vidéo hébergée ailleurs, sans surcharger le stockage.",
    },
    {
      icon: "video",
      color: "linear-gradient(145deg,#2f6fef,#1b3d8a)",
      title: "Téléverser une vidéo",
      sub: "Depuis ta galerie — associée automatiquement à une boutique.",
    },
    {
      icon: "camera",
      color: "linear-gradient(145deg,#8a6f5c,#3a2c22)",
      title: "Lancer un live",
      sub: "Bientôt disponible.",
      disabled: true,
    },
  ];

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <h4>Publier du contenu</h4>
          <button className="icon-btn" onClick={onClose} style={{ transform: "rotate(45deg)" }}>
            <Icon name="plus" size={16} />
          </button>
        </div>
        <div className="sheet-body">
          <div className="create-opt-grid">
            {options.map((o) => (
              <button
                key={o.title}
                className="create-opt"
                style={o.disabled ? { opacity: 0.55 } : undefined}
                disabled={o.disabled}
              >
                <span className="co-icon" style={{ background: o.color }}>
                  <Icon name={o.icon} size={22} />
                </span>
                <span className="co-text">
                  <b>{o.title}</b>
                  <span>{o.sub}</span>
                </span>
                <span className="co-chev">
                  <Icon name="chevRight" size={18} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
