"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/Icon";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleAuth() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (authError) setError(authError.message);
    } catch (e) {
      setError("Connexion Google indisponible pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col min-h-0">
      <div
        className="flex-none flex flex-col items-center justify-center gap-3 py-10"
        style={{ background: "linear-gradient(145deg, var(--ink), #3a2214)" }}
      >
        <div className="font-display font-extrabold text-gold text-[26px]">KORAA</div>
        <p className="text-[13px] text-white/70 text-center max-w-[260px] px-4">
          Découvre, suis et achète directement depuis tes créateurs préférés.
        </p>
      </div>

      <div className="flex-1 px-5 -mt-6">
        <div className="auth-card bg-white rounded-xl2 p-[26px_22px] shadow-soft">
          <div className="flex bg-beige-light rounded-full p-1 mb-5">
            {(["login", "signup", "forgot"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 text-center py-2.5 rounded-full font-bold text-[13.5px] transition-colors ${
                  tab === t ? "bg-ink text-white" : "text-grey-soft"
                }`}
              >
                {t === "login" ? "Connexion" : t === "signup" ? "Inscription" : "Oublié"}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-[rgba(182,68,55,0.1)] text-danger border border-[rgba(182,68,55,0.25)] rounded-sm2 px-3 py-2.5 text-[12.5px] font-semibold mb-3 leading-snug">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {tab === "signup" && (
              <div className="field">
                <label htmlFor="name">Nom complet</label>
                <input id="name" type="text" placeholder="Votre nom" />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="vous@exemple.com" />
            </div>
            {tab !== "forgot" && (
              <div className="field">
                <label htmlFor="password">Mot de passe</label>
                <input id="password" type="password" placeholder="••••••••" />
              </div>
            )}
            <button type="submit" className="btn-gold w-full py-3.5 rounded-md2 font-bold text-[14.5px]">
              {tab === "login" ? "Se connecter" : tab === "signup" ? "Créer mon compte" : "Envoyer le lien"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5 text-[12px] text-grey-soft">
            <span className="flex-1 h-px bg-line" /> ou <span className="flex-1 h-px bg-line" />
          </div>

          <div className="space-y-2.5">
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="btn-outline w-full py-3 rounded-md2 font-bold text-[13.5px] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <span className="spin-loader" /> : null}
              Continuer avec Google
            </button>

            <div className="tooltip-wrap">
              <button
                disabled
                className="btn-ghost w-full py-3 rounded-md2 font-bold text-[13.5px] opacity-60 cursor-not-allowed"
              >
                Continuer avec TikTok
              </button>
              <span className="tooltip-bubble">Bientôt disponible</span>
            </div>
          </div>

          <p className="auth-foot-link text-center text-[13px] text-grey-soft mt-4">
            En continuant, tu acceptes les <b className="text-gold-dark">Conditions d&apos;utilisation</b>.
          </p>
        </div>
      </div>
    </main>
  );
}
