# Polaris — Résumé complet du projet (Koraa / Orbit / Orbit Back-Office)

> Document de contexte destiné à être réinjecté dans une nouvelle session de travail. Il décrit la vision produit, les décisions prises, l'état actuel du code, l'architecture technique, et tout ce qu'il reste à faire.

---

## 1. Vision produit

**Polaris** est une plateforme composée de 3 applications web (converties depuis des prototypes HTML statiques vers Next.js/PWA) qui partagent **un seul backend Supabase** :

1. **Koraa** — réseau social marchand ("commerce social d'Afrique"). Les boutiques d'Orbit y sont vendues via du contenu vidéo/photo façon TikTok. Les utilisateurs peuvent gagner de l'argent en créant du contenu (vidéos, posts) pour promouvoir des boutiques.
2. **Orbit** — plateforme SaaS de gestion commerciale pour les propriétaires de boutiques : abonnements payants, gestion multi-entreprises, boutiques en ligne personnalisables, produits, commandes, facturation, affiliation, assistant IA. Le lien public d'une boutique Orbit est ce qui la connecte à Koraa.
3. **Orbit Back-Office** — back-office admin plateforme : vue globale sur tout ce qui se passe dans Koraa + Orbit, modération, gestion des utilisateurs/rôles/permissions, audit, support.

### Exigences transverses formulées par l'utilisateur (0 à 7 du brief initial)
0. Tout doit être converti en **Next.js** avec support **PWA**.
1. Toutes les interfaces doivent être **responsives** et **animées** (transitions).
2. Le backend des 3 apps doit être implémenté avec **Supabase** (auth, base de données, temps réel, storage) — **même projet Supabase pour les 3 apps**.
3. Prévoir le branchement à **Firebase** pour les logs de crash et les statistiques (Analytics).
4. Déploiement prévu sur **Vercel**, une fois que l'utilisateur aura validé toutes les fonctionnalités.
5. Ajouter toute fonctionnalité jugée nécessaire en plus du prototype.
6. Fournir un fichier listant tout ce dont on a besoin en externe (clés Supabase, Firebase, etc.) pour que l'utilisateur puisse les fournir à la fin → fichier `SETUP_REQUIRED.md` dans chaque app.
7. **Séparer les 3 projets Next.js**, chacun lié à son propre dépôt git côté client (aucun `.git` n'a été initialisé automatiquement — c'est à l'utilisateur de le faire).

---

## 2. Prototypes source (point de départ)

Situés à la racine de `D:\projets\frontend\POLARIS\` :
- `index (3).html` (≈190 Ko) → prototype **Koraa**. Structuré en vues via `<section id="view-xxx">` : `view-auth`, `view-feed`, `view-discover`, `view-shop`, `view-create`, `view-messages`, `view-chat`, `view-profile`, `view-notifications`, `view-search`, `view-sponsor`.
- `orbit-site (26).html` (≈664 Ko) → prototype **Orbit**. Vues : `view-overview` (dashboard), `view-companies`, `view-loyalty`, `view-orders`, `view-koraa-creators`, `view-koraa-sponsoring`, `view-koraa-comptes`, `view-support`, `view-messages`, `view-milestones`, `view-pricing` (paywall/abonnements), `view-aichats` (assistant IA), `view-audit`, `view-team`. Contient aussi les styles de paiement Wave/Orange Money, bandeau d'essai gratuit 24h (`.trial-banner`), et boutique publique personnalisable (`.pubshop-box`, thèmes).
- `orbit-backoffice (11).html` (≈220 Ko) → prototype **Back-Office**. Mêmes noms de vues que ci-dessus dans ce fichier réutilisés dans un contexte admin plateforme (vue globale, modération, gestion Koraa + Orbit).

Ces 3 fichiers HTML restent dans le dossier racine comme référence design — ils n'ont pas été supprimés.

---

## 3. Décisions prises avec l'utilisateur (au fil des sessions)

- **Ordre de développement choisi** : Koraa d'abord, puis Orbit, puis Back-Office (dans cet ordre, un par session).
- **Backend pas encore créé** : l'utilisateur n'a pas encore de projet Supabase ni Firebase. Toutes les migrations SQL et configurations sont donc préparées mais **jamais exécutées** contre un vrai backend. Chaque app documente précisément ce qu'il faut créer dans son `SETUP_REQUIRED.md`.
- **Modèle de données boutique** : une boutique créée dans **Orbit** utilise la **même table `shops`** que celle affichée dans **Koraa** (pas de table séparée + synchronisation). Orbit étend cette table avec des colonnes supplémentaires (`company_id`, `theme`, `font`, `presentation_video_url`, `slug`). Résultat : une boutique créée côté Orbit apparaît automatiquement dans le catalogue Koraa.
- **Live streaming** : désactivé pour l'instant dans Koraa (bouton visible mais avec tooltip "bientôt disponible"), pour éviter de surcharger le stockage. Seul l'upload de lien YouTube/TikTok est supporté pour publier du contenu.
- **Auth TikTok** : bouton scaffoldé dans l'UI Koraa mais désactivé (tooltip "bientôt disponible"), faute d'app TikTok Developer.
- **Paiements Wave/Orange Money (Orbit)** : implémentés sous forme d'**adapters** (`lib/payments/wave.ts`, `lib/payments/orange-money.ts`) respectant une interface commune `PaymentProvider` avec une méthode `charge()`. Sans clés API réelles en environnement, ils tournent en **mode mock** et génèrent quand même un reçu avec un **code vérifiable** (`receipt_code`), stocké en base dans la table `transactions`.
- **Back-office = vue admin plateforme**, distincte du dashboard "propriétaire d'entreprise" déjà couvert par Orbit. L'utilisateur a demandé d'aller au-delà du prototype : ajout explicite de `/users` (CRUD transverse), `/roles` (rôles & permissions), `/transactions` (litiges/remboursements), `/settings` (feature flags, mode maintenance).
- **Bootstrap admin** : pas d'auto-inscription admin. Le premier compte admin doit être créé manuellement via une requête SQL (`INSERT INTO admin_users ...`) après une inscription normale, une fois le vrai projet Supabase en place.

---

## 4. Architecture technique commune aux 3 apps

Chaque app est un projet **Next.js 14 (App Router) + TypeScript + Tailwind CSS** totalement indépendant (son propre `package.json`, son propre futur dépôt git), mais suivant des conventions identiques pour rester cohérentes et faciles à maintenir ensemble :

- **PWA** : pas de `next-pwa` (jugé moins fiable avec l'App Router) → service worker écrit à la main (`public/sw.js`) + composant `components/ServiceWorkerRegister.tsx` qui l'enregistre côté client, plus un `public/manifest.json`. Le choix est documenté en commentaire dans chaque `next.config.js`.
- **Transitions/animations** : `components/PageTransition.tsx` (Framer Motion) enveloppe les routes pour animer les changements de page. Toutes les interfaces sont pensées mobile-first mais responsives desktop.
- **Supabase** :
  - `lib/supabase/client.ts` — client navigateur (`@supabase/ssr`)
  - `lib/supabase/server.ts` — client serveur (cookies, App Router)
  - Back-Office ajoute en plus `lib/supabase/admin.ts` — client privilégié utilisant `SUPABASE_SERVICE_ROLE_KEY`, protégé par le package `server-only` pour qu'il ne puisse jamais être importé côté client, réservé aux Server Actions/Route Handlers (suspension de compte, reset mot de passe, etc.)
  - Variables d'env identiques dans les 3 apps : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (optionnelle dans Koraa/Orbit, **obligatoire** dans Back-Office)
- **Firebase** : `lib/firebase.ts` initialise Firebase App + Analytics (guard SSR-safe, ne s'exécute que côté navigateur). Variables `NEXT_PUBLIC_FIREBASE_*`. Même projet Firebase partagé par les 3 apps (Analytics + logs de crash).
- **Données mock** : chaque app a un `lib/mock-data.ts` clairement commenté comme **temporaire**, utilisé pour peupler l'UI en attendant le vrai backend. Ce fichier est destiné à être supprimé/remplacé progressivement par de vraies requêtes Supabase.
- **`.gitignore`** identique dans les 3 apps (node_modules, `.next`, `.env*.local`, etc.) — prêt pour `git init` par l'utilisateur, mais **aucun `.git` n'a été créé** (conforme à la consigne : dépôts séparés gérés par l'utilisateur).
- **Vérification systématique** avant de considérer une app "terminée" : `npm install`, `npx tsc --noEmit`, `npm run build` — les 3 apps compilent et buildent sans erreur au moment de la rédaction de ce résumé.

---

## 5. App 1 — Koraa (`koraa/`)

**Identité visuelle** : palette du prototype d'origine — `--beige #FFC98A`, `--gold #E8770D`, `--cream #FFFBF7`, `--ink #201510`, polices Plus Jakarta Sans + Inter, rayons `--r-xl/lg/md/sm`, ombres douces. Reprise fidèlement dans `app/globals.css` + `tailwind.config.ts`.

**Routes** :
- `/auth` — connexion, inscription, mot de passe oublié, bouton "Continuer avec Google" (câblé sur `supabase.auth.signInWithOAuth`), bouton TikTok désactivé
- `/` — fil d'actualité vertical façon TikTok (vidéos/photos), bouton **"Commander"** sur chaque post qui renvoie vers la boutique source (`/shop/[shopId]`)
- `/discover` — recherche et découverte
- `/shop` — catalogue de boutiques (recherche, catégories, compteur, favoris) ; `/shop/[shopId]` — détail boutique avec UI d'édition **réservée au propriétaire** (actuellement `CURRENT_USER_ID = null`, TODO : brancher la vraie auth)
- `/create` — publication via lien YouTube/TikTok uniquement (pas d'upload natif), option "Lancer un live" désactivée
- `/messages` + `/messages/[chatId]` — liste de conversations + chat temps réel (canal Supabase Realtime `postgres_changes` sur `messages`, avec try/catch pour ne pas planter tant que le backend n'existe pas)
- `/profile` — onglets Tableau de bord / Contenu / Historique / Paramètres
- `/notifications` — liste de notifications, câblée sur Supabase Realtime (`postgres_changes` sur `notifications`)

Navigation : barre du bas persistante (Accueil, Boutique, bouton **+** créer, Message, Profil), conforme au prototype.

**Schéma Supabase** — `koraa/supabase/migrations/0001_init.sql` :
Tables : `profiles`, `shops`, `products`, `posts` (contenu vidéo/photo, lié à une boutique pour le bouton "Commander"), `orders`, `favorites`, `conversations`, `messages`, `notifications`, `follows`.
- Toutes les tables ont **RLS activé**.
- Recherche indexée : trigram (`pg_trgm`) + `tsvector` pour la fonctionnalité recherche façon TikTok.
- Policies : lecture publique sur boutiques/produits/posts, écriture réservée au propriétaire, messages/notifications réservés aux participants.

**Fichiers de config** : `.env.example`, `SETUP_REQUIRED.md` (checklist : créer le projet Supabase, configurer le provider OAuth Google, créer le projet Firebase + clé VAPID, créer les buckets Storage `avatars`/`shop-thumbnails`/`post-thumbnails`, exécuter la migration SQL), `README.md`.

**TODOs restants** : remplacer `mock-data.ts` par de vraies requêtes Supabase partout, implémenter la vérification propriétaire réelle sur `/shop/[shopId]`, récupérer le token FCM pour les push notifications.

---

## 6. App 2 — Orbit (`orbit/`)

**Identité visuelle** : palette "Lumen" extraite du prototype — violet `#6D4CE0`, indigo `#2F6FEF`, teal `#0BB79A`, rayons 16/10/24, polices Space Grotesk + Inter + JetBrains Mono. Support dark-mode via `prefers-color-scheme`.

**Composants de chrome** : `Sidebar.tsx` (desktop), `MobileNav.tsx` (bottom nav mobile), `AppChrome.tsx` (désactive automatiquement la navigation sur les routes publiques `/s/*` et `/verify/*`).

**Routes** (20+) :
- `/pricing` — grille de plans d'abonnement, bandeau d'essai gratuit 24h (état normal + état "critical" proche expiration), formulaires de paiement Wave/Orange Money, affichage du reçu généré. Backé par `app/api/mock-charge/route.ts`.
- `/` — dashboard global (overview)
- `/companies` — CRUD entreprises ; `/companies/[companyId]` — détail avec onglets produits / analytique / affiliation / clients / revenus
- `/companies/[companyId]/products` — CRUD produits (bouton de paiement, prix, description, options avancées)
- `/companies/[companyId]/shop-settings` — choix du thème, de la police, lien vidéo de présentation YouTube/TikTok, slug de la boutique publique (**point de connexion avec Koraa**)
- `/orders` — commandes ; la complétion d'une commande est câblée (avec TODO explicite) pour déclencher l'assistant IA
- `/ai-chats` — assistant IA post-commande + coach business/marketing (génération de rapport actuellement mockée via `generateMockAiReport`)
- `/invoices` — création/liste de factures
- `/reports` — rapports financiers
- `/affiliation` — système de parrainage (génération de lien, suivi clics/commissions)
- `/loyalty`, `/milestones`, `/support`, `/messages`, `/team`, `/audit`, `/settings`
- `/s/[shopSlug]` — **boutique publique** (aucune auth requise), rendu du thème `.pubshop-box` du prototype — c'est le lien partagé publiquement et vers Koraa
- `/verify/[receiptCode]` — page de vérification de reçu (actuellement un stub qui ne vérifie que le format du code)

**Paiements** : `lib/payments/{types,wave,orange-money,index}.ts` — interface `PaymentProvider` commune avec méthode `charge()`. Sans clé API réelle, mode **MOCK** actif, génère quand même un `receipt_code` vérifiable unique.

**Schéma Supabase** (même projet partagé que Koraa) :
- `orbit/supabase/migrations/0001_init.sql` — copie exacte de celui de Koraa (pour pouvoir bootstrap un projet Supabase vierge de façon identique).
- `orbit/supabase/migrations/0002_orbit.sql` — nouvelle migration qui :
  - Étend la table `shops` existante avec `company_id`, `theme`, `font`, `presentation_video_url`, `slug`
  - Crée : `companies`, `team_members`, `orbit_products` (nommée ainsi pour ne pas entrer en collision avec la table `products` déjà créée par Koraa), `subscriptions`, `transactions` (+ fonction `verify_receipt()` en `SECURITY DEFINER`), `invoices`, `affiliates`, `affiliate_clicks`, `ai_chats`, `ai_messages`, `audit_log`
  - RLS scoping par entreprise via une fonction helper `is_company_member()`

**Fichiers de config** : `.env.example` (mêmes clés que Koraa + `WAVE_API_KEY`/`WAVE_MERCHANT_ID`/`ORANGE_MONEY_API_KEY`/`ORANGE_MONEY_MERCHANT_ID`), `SETUP_REQUIRED.md` (précise explicitement : **même** projet Supabase/Firebase que Koraa, ordre des migrations, credentials marchand Wave/Orange Money, design de la vérification de reçu), `README.md`.

**TODOs restants** : vrais appels API Wave/Orange Money (les adapters lèvent une erreur claire "TODO" si une vraie clé est fournie mais pas encore implémentée), vrai backend IA pour `/ai-chats` et la complétion de commande, persistance des résultats de `mock-charge` dans la table `transactions`, connecter `/verify/[receiptCode]` à `verify_receipt()`, connecter `/s/[shopSlug]` à une vraie requête Supabase par slug (au lieu du tableau mock).

---

## 7. App 3 — Orbit Back-Office (`backoffice/`)

**Identité visuelle** : volontairement distincte des deux autres apps — base neutre slate/graphite + un seul accent ambre, pensée "dark-mode-first" façon "salle de contrôle", pour bien signaler qu'on est dans un outil admin et non une app grand public.

**Garde d'accès à deux niveaux** (le point le plus important architecturalement) :
1. `middleware.ts` (racine du projet) — vérifie uniquement la **présence d'une session** Supabase (cookie). Si absente → redirection vers `/login`. S'applique à toutes les routes sauf `/login`.
2. `lib/auth/require-admin.ts` — fonction serveur appelée en tête de chaque page/layout protégé, qui vérifie que l'utilisateur connecté a bien une ligne dans la table `admin_users`. Si non → redirection vers `/access-denied`.

Cette séparation en deux couches est documentée par des commentaires dans le code (le middleware ne peut pas facilement interroger Postgres, donc la vraie vérification du rôle admin se fait côté page/serveur).

**Routes** (20) :
- `/login`, `/access-denied`, `/auth/callback`
- `/` — KPIs globaux plateforme (utilisateurs, boutiques, commandes, revenu, croissance) — vue transverse Koraa + Orbit
- `/companies` — vue admin de toutes les entreprises/boutiques Orbit, actions de modération (suspendre/activer)
- `/koraa/creators` — gestion/modération des créateurs de contenu Koraa
- `/koraa/sponsoring` — gestion du sponsoring/contenu mis en avant
- `/koraa/comptes` — CRUD comptes utilisateurs Koraa (suspendre, vérifier, supprimer)
- `/orders` — vue globale de toutes les commandes plateforme
- `/loyalty`, `/milestones`, `/pricing` (gestion des plans globaux), `/support` (tickets), `/messages` (supervision), `/ai-chats` (monitoring usage IA)
- `/audit` — journal d'audit complet (lecture de la table `audit_log` créée par Orbit), filtrable
- `/team` — gestion de l'équipe admin elle-même
- **Nouvelles interfaces ajoutées au-delà du prototype** (demande explicite utilisateur) :
  - `/users` — CRUD transverse sur tous les utilisateurs (Koraa + Orbit), recherche/filtres (UI posée, pas encore branchée), suspension, déclenchement de reset mot de passe
  - `/roles` — gestion des rôles et permissions admin
  - `/transactions` — vue globale des transactions Orbit, avec statut litige/remboursement (actions UI seulement, pas d'appel réel au prestataire de paiement)
  - `/settings` — feature flags (liste togglable) + mode maintenance

Tous les boutons d'action admin sensibles (suspendre/activer, reset mot de passe, remboursement, litige) sont posés comme des formulaires avec `action="#"` et un `title` expliquant qu'ils doivent être branchés à de vraies Server Actions utilisant `lib/supabase/admin.ts` — volontairement laissés UI-only pour l'instant, cohérent avec la convention "mock jusqu'au backend réel".

**Schéma Supabase** (même projet partagé) :
- `backoffice/supabase/migrations/0001_init.sql` — copie exacte de celui de Koraa
- `backoffice/supabase/migrations/0002_orbit.sql` — copie exacte de celui d'Orbit
- `backoffice/supabase/migrations/0003_backoffice.sql` — nouvelle migration ajoutant : `admin_users`, `admin_roles`, `admin_role_permissions`, `admin_user_roles`, `support_tickets`, `support_messages`, `feature_flags`, plus une fonction `is_platform_admin()` (SECURITY DEFINER) et des **policies additives** de lecture (et UPDATE limité) sur les tables déjà créées par Koraa/Orbit — rien n'est supprimé ni remplacé dans les policies existantes.

**Fichiers de config** : `.env.example` (mêmes clés que Koraa/Orbit, mais `SUPABASE_SERVICE_ROLE_KEY` marquée **obligatoire** ici), `SETUP_REQUIRED.md` (même projet Supabase/Firebase partagé ; exécuter les migrations dans l'ordre 0001 → 0002 → 0003 ; **bootstrap manuel du premier admin** via SQL editor après la première inscription normale, puisqu'il n'y a volontairement pas d'auto-inscription admin), `README.md`.

**TODOs restants** : brancher les boutons suspendre/activer/reset mot de passe/remboursement à de vraies Server Actions, remplacer tous les imports de `mock-data.ts` par de vraies requêtes Supabase, implémenter la recherche/filtrage réel sur `/users` et `/audit`, brancher les toggles feature flags/mode maintenance de `/settings` à la table `feature_flags`.

---

## 8. Ce qui reste à faire globalement (toutes apps confondues)

### Avant de pouvoir tester quoi que ce soit en conditions réelles
1. **Créer le projet Supabase** (un seul, partagé par les 3 apps) et récupérer : URL, anon key, service role key.
2. **Exécuter les migrations SQL dans l'ordre**, dans le SQL editor Supabase ou via la CLI Supabase :
   - `koraa/supabase/migrations/0001_init.sql` (identique dans les 3 apps)
   - `orbit/supabase/migrations/0002_orbit.sql` (identique dans orbit/ et backoffice/)
   - `backoffice/supabase/migrations/0003_backoffice.sql` (uniquement dans backoffice/)
3. **Créer le projet Firebase** (partagé), récupérer la config web (`apiKey`, `projectId`, etc.) et une clé VAPID pour les notifications push.
4. **Configurer le provider OAuth Google** dans Supabase Auth.
5. **Créer les buckets Supabase Storage** nécessaires (avatars, miniatures boutiques, miniatures posts — liste précise dans `koraa/SETUP_REQUIRED.md`).
6. **Bootstrap du premier compte admin** (Back-Office) via une requête SQL manuelle après inscription.
7. **Obtenir les credentials marchand Wave et Orange Money** (Orbit) pour sortir du mode mock.
8. Renseigner tous les `.env.local` de chaque app à partir de leurs `.env.example` respectifs.

### Côté code, une fois le backend branché
- Remplacer systématiquement les `lib/mock-data.ts` par de vraies requêtes Supabase dans les 3 apps.
- Brancher les vérifications d'autorisation réelles (propriétaire de boutique dans Koraa, appartenance à l'entreprise dans Orbit, rôle admin dans Back-Office — la structure RLS est déjà prête).
- Implémenter les vrais appels API Wave/Orange Money dans les adapters Orbit.
- Implémenter un vrai backend IA pour l'assistant post-commande et le coach marketing (`/ai-chats` dans Orbit et Back-Office).
- Câbler les Server Actions admin sensibles dans Back-Office (suspension, reset mot de passe, remboursement) en utilisant `lib/supabase/admin.ts`.
- Câbler la récupération de token FCM pour les notifications push (Koraa).
- Implémenter la recherche/filtrage réels sur `/users` et `/audit` (Back-Office).

### Étapes de mise en production
- Chaque app (`koraa/`, `orbit/`, `backoffice/`) doit être poussée vers son **propre dépôt git** par l'utilisateur (`git init` + remote, aucun n'a été initialisé automatiquement).
- Déploiement prévu sur **Vercel**, un projet Vercel par app, une fois toutes les fonctionnalités validées par l'utilisateur.
- Chaque app a un `README.md` avec les instructions d'installation/dev/build.

### Hors scope explicitement mis de côté pour l'instant (à reprendre plus tard si besoin)
- Live streaming dans Koraa (juste un état "bientôt disponible")
- Authentification TikTok fonctionnelle (bouton désactivé)
- 2FA pour les comptes admin (champ prévu en base, flow non implémenté)
- Intégration réelle des remboursements/litiges de paiement dans Back-Office (UI seulement)

---

## 9. Emplacement des fichiers clés (pour retrouver rapidement)

```
D:\projets\frontend\POLARIS\
├── index (3).html                  ← prototype Koraa (référence design, conservé)
├── orbit-site (26).html            ← prototype Orbit (référence design, conservé)
├── orbit-backoffice (11).html      ← prototype Back-Office (référence design, conservé)
├── PROJECT_SUMMARY.md              ← ce document
├── koraa/
│   ├── SETUP_REQUIRED.md
│   ├── supabase/migrations/0001_init.sql
│   └── app/ (routes) lib/ components/ public/
├── orbit/
│   ├── SETUP_REQUIRED.md
│   ├── supabase/migrations/{0001_init.sql, 0002_orbit.sql}
│   ├── lib/payments/{wave.ts, orange-money.ts}
│   └── app/ (routes) lib/ components/ public/
└── backoffice/
    ├── SETUP_REQUIRED.md
    ├── middleware.ts
    ├── lib/auth/require-admin.ts
    ├── lib/supabase/admin.ts
    ├── supabase/migrations/{0001_init.sql, 0002_orbit.sql, 0003_backoffice.sql}
    └── app/ (routes) lib/ components/ public/
```

---

## 10. Comment reprendre le travail dans une nouvelle session

En donnant ce fichier (`PROJECT_SUMMARY.md`) en contexte, une nouvelle session peut directement :
- Comprendre la vision produit et les décisions déjà prises (pas besoin de re-poser les mêmes questions)
- Savoir que les 3 apps sont scaffoldées, buildent sans erreur, mais tournent encore en mode mock
- Reprendre soit sur : (a) le câblage réel Supabase/Firebase une fois les clés fournies par l'utilisateur, (b) le test visuel des 3 apps en local, (c) la préparation des 3 dépôts git, ou (d) l'implémentation des TODOs listés section 8.
