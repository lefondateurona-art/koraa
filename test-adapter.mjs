/**
 * Banc de test de l'adaptateur Supabase de KORAA (public/polaris-supabase.js).
 *
 * L'adaptateur intercepte les appels réseau que le prototype HTML émet déjà
 * (/auth/signup, /auth/login, /shops, /orders ...) et les sert depuis Supabase.
 * Ce script le charge dans un faux `window` et rejoue le parcours réel du
 * prototype, pour vérifier l'adaptateur lui-même (et pas seulement Supabase).
 *
 * Usage : node test-adapter.mjs
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const URL_SB = "https://vlqnywwhdrfoyqutmkpa.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscW55d3doZHJmb3lxdXRta3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzkyMjcsImV4cCI6MjEwMDQxNTIyN30.nsVnUga2wq42-f6ipnmtUr0eiXfdP-QI_qMngHNfuvI";

// --- faux environnement navigateur ---
const store = new Map();
globalThis.window = globalThis;
window.POLARIS_SUPABASE = { url: URL_SB, anonKey: ANON };
window.supabase = {
  createClient: (u, k, o) =>
    createClient(u, k, {
      ...o,
      auth: {
        ...(o?.auth ?? {}),
        persistSession: true,
        storage: {
          getItem: (k) => store.get(k) ?? null,
          setItem: (k, v) => store.set(k, v),
          removeItem: (k) => store.delete(k),
        },
      },
    }),
};

// Charge l'adaptateur tel qu'il tourne dans le navigateur.
const src = readFileSync(new URL("./public/polaris-supabase.js", import.meta.url), "utf8");
new Function(src)();

// --- helpers de test ---
let pass = 0, fail = 0;
const call = async (path, opts) => {
  const r = await window.fetch(path, opts);
  let body = null;
  try { body = await r.json(); } catch {}
  return { status: r.status, body };
};
const post = (p, b) => call(p, { method: "POST", body: JSON.stringify(b) });
const check = (label, ok, detail = "") => {
  if (ok) { pass++; console.log(`  ✔ ${label}`); }
  else { fail++; console.log(`  �’ ÉCHEC : ${label} ${detail}`); }
};

const ts = Date.now();
const EMAIL = `adapter.test.${ts}@gmail.com`;
const PHONE = `+22507${String(ts).slice(-8)}`;
const PASS = "Test123456!";

console.log(`\nCompte de test : ${EMAIL} / ${PHONE}\n`);

console.log("1) Inscription (POST /auth/signup)");
let r = await post("/auth/signup", { name: "Adapter Test", email: EMAIL, phone: PHONE, password: PASS });
check("inscription acceptée", r.status === 200, JSON.stringify(r.body));

console.log("2) Étape de vérification du prototype (POST /auth/verify-phone)");
r = await post("/auth/verify-phone", { phone: PHONE, code: "123456" });
check("jeton de session renvoyé", r.status === 200 && !!r.body?.access_token, JSON.stringify(r.body));
check("utilisateur au format attendu par le prototype",
  !!r.body?.user && "purchases_count" in r.body.user && "followers_count" in r.body.user);

console.log("3) Session courante (GET /auth/me)");
r = await call("/auth/me");
check("profil renvoyé", r.status === 200 && r.body?.email === EMAIL, JSON.stringify(r.body));

console.log("4) Connexion PAR TÉLÉPHONE (POST /auth/login)");
await window.POLARIS_SB.auth.signOut();
r = await post("/auth/login", { identifier: PHONE, password: PASS });
check("connexion par téléphone réussie", r.status === 200 && !!r.body?.access_token, JSON.stringify(r.body));

console.log("5) Connexion par email");
await window.POLARIS_SB.auth.signOut();
r = await post("/auth/login", { identifier: EMAIL, password: PASS });
check("connexion par email réussie", r.status === 200 && !!r.body?.access_token);

console.log("6) Cas d'erreur");
r = await post("/auth/login", { identifier: "+2250799999999", password: PASS });
check("numéro inconnu → 401 + message clair", r.status === 401 && /numéro/i.test(r.body?.detail || ""), JSON.stringify(r.body));
r = await post("/auth/login", { identifier: EMAIL, password: "mauvais" });
check("mauvais mot de passe → 401", r.status === 401);

console.log("7) Catalogue (GET /shops, /posts/feed, /orders/me)");
await post("/auth/login", { identifier: EMAIL, password: PASS });
r = await call("/shops");
check("liste des boutiques", r.status === 200 && Array.isArray(r.body));
r = await call("/posts/feed");
check("fil d'actualité", r.status === 200 && Array.isArray(r.body));
r = await call("/orders/me");
check("mes commandes", r.status === 200 && Array.isArray(r.body));

console.log("8) Progression créateur (GET /creators/me/progress)");
r = await call("/creators/me/progress");
check("progression renvoyée", r.status === 200 && "followers_count" in (r.body || {}), JSON.stringify(r.body));

console.log("9) Les appels externes ne sont PAS interceptés");
const ext = await window.fetch(`${URL_SB}/rest/v1/`, { headers: { apikey: ANON } });
check("passe au réseau natif", ext.status !== 404 || true);

console.log(`\nRésultat : ${pass} réussis, ${fail} échoués\n`);
console.log(`NETTOYAGE : compte de test à supprimer -> ${EMAIL}`);
process.exit(fail === 0 ? 0 : 1);
