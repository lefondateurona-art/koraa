"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

function isValidVideoLink(url: string) {
  return /youtu\.?be|tiktok\.com/i.test(url);
}

export default function CreatePage() {
  const [link, setLink] = useState("");
  const [caption, setCaption] = useState("");
  const [productId, setProductId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const linkValid = link.length > 0 && isValidVideoLink(link);

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!linkValid) return;
    setSubmitting(true);
    // TODO: insert into Supabase `posts` table with { video_url: link, caption, product_id }
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setDone(true);
  }

  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <header className="flex-none px-4 pt-5 pb-3">
        <h1 className="text-[22px]">Publier</h1>
        <p className="text-[13px] text-grey-soft">
          Colle un lien YouTube ou TikTok existant — pas d&apos;upload natif pour l&apos;instant.
        </p>
      </header>

      {done ? (
        <div className="empty-state flex flex-col items-center gap-3">
          <Icon name="check" size={40} className="text-success" />
          <p className="font-display font-bold text-ink">Publication envoyée !</p>
          <button onClick={() => { setDone(false); setLink(""); setCaption(""); }} className="btn-gold px-5 py-2.5 rounded-md2 font-bold text-[13px]">
            Publier autre chose
          </button>
        </div>
      ) : (
        <form onSubmit={handlePublish} className="px-4 space-y-4">
          <div className="wizard-step">
            <span className="w-11 h-11 rounded-md2 bg-beige-light flex items-center justify-center flex-none text-gold-dark">
              <Icon name="link" size={20} />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-[13.5px]">Lien de la vidéo</p>
              <p className="text-[11.5px] text-grey-soft">YouTube ou TikTok</p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="video-link">URL de la vidéo</label>
            <input
              id="video-link"
              type="url"
              placeholder="https://www.tiktok.com/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            {link.length > 0 && !linkValid && (
              <p className="text-danger text-[11.5px] mt-1.5 font-medium">
                Le lien doit provenir de YouTube ou TikTok.
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="caption">Légende</label>
            <textarea
              id="caption"
              rows={3}
              placeholder="Décris ta publication..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="product">Produit associé (optionnel)</label>
            <select id="product" value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">Aucun</option>
              <option value="prod-1">Robe wax imprimée</option>
              <option value="prod-2">Écouteurs sans fil</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!linkValid || submitting}
            className="btn-gold w-full py-3.5 rounded-md2 font-bold text-[14.5px] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting && <span className="spin-loader" />}
            Publier
          </button>

          <div className="tooltip-wrap">
            <button
              type="button"
              disabled
              className="create-opt w-full flex items-center gap-3 p-3.5 rounded-md2 border border-line opacity-60 cursor-not-allowed"
            >
              <span className="w-10 h-10 rounded-md2 flex items-center justify-center text-white" style={{ background: "linear-gradient(145deg,var(--danger),#7c261c)" }}>
                <Icon name="live" size={18} />
              </span>
              <span className="flex-1 text-left">
                <span className="block font-semibold text-[13px]">Lancer un live</span>
                <span className="block text-[12px] text-grey-soft">Diffuse en direct à tes abonnés</span>
              </span>
              <Icon name="chevron-right" size={16} />
            </button>
            <span className="tooltip-bubble">Bientôt disponible</span>
          </div>
        </form>
      )}
    </main>
  );
}
