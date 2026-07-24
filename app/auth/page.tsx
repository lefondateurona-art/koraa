"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Faithful port of the prototype AUTH view (renderAuth / renderSignupStep).
 *  Backend calls are stubbed for now — wired to Supabase auth later. */
const LANG_OPTIONS = ["Français", "Anglais", "Espagnol", "Dioula", "Baoulé"];
const INTEREST_OPTIONS = [
  "Mode",
  "Beauté",
  "Tech",
  "Maison",
  "Sport",
  "Cuisine",
  "Enfants",
  "Auto",
];

export default function AuthView() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  const enter = () => router.push("/");

  return (
    <section id="view-auth" className="view active">
      <div className="auth-wrap">
        {mode === "login" ? (
          <>
            <div className="auth-logo">
              <div className="k-mark">K</div>
              <h1>KORAA</h1>
              <p>Le réseau social e-commerce d&apos;Afrique. Découvre, achète, partage, gagne.</p>
            </div>
            <div className="auth-card">
              <div className="auth-tabs">
                <button className="auth-tab active">Connexion</button>
                <button className="auth-tab" onClick={() => { setMode("signup"); setStep(1); }}>
                  Créer un compte
                </button>
              </div>
              {error && <div className="auth-error" style={{ display: "block" }}>{error}</div>}
              <div className="field">
                <label>Email ou téléphone</label>
                <input type="text" placeholder="ex : aicha@email.com" />
              </div>
              <div className="field">
                <label>Mot de passe</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <button className="btn btn-gold btn-block" onClick={enter}>
                Se connecter
              </button>
              <p className="auth-foot-link">
                Pas encore de compte ?{" "}
                <b onClick={() => { setMode("signup"); setStep(1); }}>Inscris-toi</b>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="auth-logo" style={{ marginBottom: 10 }}>
              <div className="k-mark" style={{ width: 48, height: 48, fontSize: 20 }}>K</div>
              <h1 style={{ fontSize: 21 }}>Créer un compte</h1>
            </div>
            <div className="auth-card">
              <div className="auth-step-dots">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={i <= step ? "on" : ""} />
                ))}
              </div>
              {error && <div className="auth-error" style={{ display: "block" }}>{error}</div>}

              {step === 1 && (
                <>
                  <div className="field-row">
                    <div className="field"><label>Nom</label><input placeholder="Koné" /></div>
                    <div className="field"><label>Prénom</label><input placeholder="Aïcha" /></div>
                  </div>
                  <div className="field"><label>Email</label><input type="email" placeholder="aicha@email.com" /></div>
                  <div className="field"><label>Téléphone</label><input type="tel" placeholder="+225 07 00 00 00 00" /></div>
                  <div className="field-row">
                    <div className="field"><label>Mot de passe</label><input type="password" placeholder="8 caractères min." /></div>
                    <div className="field"><label>Confirmer</label><input type="password" placeholder="••••••••" /></div>
                  </div>
                  <div className="field-row">
                    <div className="field"><label>Date de naissance</label><input type="date" /></div>
                    <div className="field">
                      <label>Sexe</label>
                      <select>
                        <option value="F">Femme</option>
                        <option value="M">Homme</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="field"><label>Profession</label><input placeholder="Étudiant, commerçant..." /></div>
                  <div className="field-row">
                    <div className="field"><label>Ville</label><input defaultValue="Abidjan" /></div>
                    <div className="field"><label>Commune</label><input placeholder="Cocody" /></div>
                  </div>
                  <div className="field"><label>Adresse</label><input placeholder="Rue, quartier..." /></div>
                  <div className="field">
                    <label>Langue</label>
                    <select>{LANG_OPTIONS.map((l) => <option key={l}>{l}</option>)}</select>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="field">
                    <label>Centres d&apos;intérêt</label>
                    <div className="chip-select">
                      {INTEREST_OPTIONS.map((i) => (
                        <button
                          type="button"
                          key={i}
                          className={`chip-pick ${interests.includes(i) ? "picked" : ""}`}
                          onClick={() =>
                            setInterests((prev) =>
                              prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
                            )
                          }
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="consent-row">
                    <input type="checkbox" /> J&apos;accepte que mes données soient utilisées pour
                    personnaliser mon expérience KORAA, conformément à la politique de confidentialité.
                  </label>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="field">
                    <label>Code reçu par SMS</label>
                    <input type="text" inputMode="numeric" maxLength={6} placeholder="123456" />
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", margin: "-4px 0 4px" }}>
                    Un code à 6 chiffres a été envoyé à ton numéro.
                  </p>
                  <p className="auth-foot-link"><b>Renvoyer le code</b></p>
                </>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                {step > 1 && step < 4 && (
                  <button className="btn btn-outline" onClick={() => setStep((s) => s - 1)}>
                    Retour
                  </button>
                )}
                <button
                  className="btn btn-gold btn-block"
                  onClick={() => (step >= 4 ? enter() : setStep((s) => s + 1))}
                >
                  {step === 3 ? "Créer mon compte" : step === 4 ? "Vérifier mon numéro" : "Continuer"}
                </button>
              </div>
              <p className="auth-foot-link">
                Déjà inscrit ? <b onClick={() => { setMode("login"); setError(null); }}>Se connecter</b>
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
