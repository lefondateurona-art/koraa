# À configurer avant mise en production — KORAA

Cette application est prête côté code, mais nécessite les éléments suivants
créés manuellement par vous avant de fonctionner réellement (aucune clé
réelle n'est présente dans le code).

## 1. Projet Supabase
- [ ] Créer un projet sur https://supabase.com (partagé avec Orbit / Orbit-BackOffice).
- [ ] Récupérer dans **Project Settings > API** :
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ ne jamais exposer côté client)
- [ ] Coller ces valeurs dans `.env.local` (copié depuis `.env.example`).

## 2. Authentification Google (OAuth)
- [ ] Dans Supabase, aller dans **Authentication > Providers > Google**.
- [ ] Créer des identifiants OAuth 2.0 sur https://console.cloud.google.com
      (Client ID + Client Secret) pour une application Web.
- [ ] Ajouter l'URL de redirection Supabase fournie dans les "Authorized redirect URIs" du client Google.
- [ ] Activer le provider Google dans Supabase et coller Client ID / Secret.
- [ ] Le code (`app/auth/page.tsx`) appelle déjà `supabase.auth.signInWithOAuth({ provider: "google" })` — rien à changer côté app.

## 3. TikTok (futur / manuel)
- [ ] Le bouton "Continuer avec TikTok" est volontairement désactivé
      ("bientôt disponible") — TikTok exige une app développeur validée
      (TikTok for Developers) avec revue manuelle, ce qui dépasse le cadre
      de cette tâche. À faire plus tard :
  - Créer une app sur https://developers.tiktok.com
  - Obtenir l'approbation "Login Kit"
  - Ajouter un provider OAuth personnalisé (TikTok n'est pas nativement
    supporté par Supabase Auth — nécessitera soit un provider OIDC custom,
    soit un flux OAuth géré manuellement côté serveur).

## 4. Projet Firebase
- [ ] Créer un projet sur https://console.firebase.google.com.
- [ ] Ajouter une "Web app" et copier la config dans les variables
      `NEXT_PUBLIC_FIREBASE_*` de `.env.local`.
- [ ] Activer **Google Analytics** si vous voulez que `lib/firebase.ts`
      initialise réellement Analytics (sinon il reste silencieusement inactif).

## 5. Firebase Cloud Messaging (notifications push web)
- [ ] Dans Firebase Console > Project Settings > Cloud Messaging, générer une
      **paire de clés VAPID** ("Web Push certificates").
- [ ] Coller la clé publique dans `NEXT_PUBLIC_FIREBASE_VAPID_KEY`.
- [ ] (À implémenter plus tard) Enregistrer le service worker FCM et appeler
      `getToken()` côté client pour obtenir le token de l'appareil.

## 6. Buckets Supabase Storage à créer
Dans **Storage** sur le dashboard Supabase, créer ces buckets (accès public
en lecture, écriture restreinte au propriétaire) :
- [ ] `avatars` — photos de profil utilisateur
- [ ] `shop-thumbnails` — logos/bannières de boutique
- [ ] `post-thumbnails` — vignettes de publications

## 7. Exécuter la migration SQL
- [ ] Ouvrir **SQL Editor** dans le dashboard Supabase du projet.
- [ ] Copier-coller le contenu de `supabase/migrations/0001_init.sql`.
- [ ] Exécuter. Cela crée toutes les tables, index (dont recherche texte
      via `pg_trgm` / `tsvector`) et les policies RLS (Row Level Security,
      activées sur chaque table).
- [ ] Vérifier dans **Authentication > Policies** que RLS est bien actif
      sur toutes les tables (`profiles`, `shops`, `products`, `posts`,
      `orders`, `favorites`, `follows`, `conversations`, `messages`,
      `notifications`).

## 8. Variables d'environnement — résumé
Voir `.env.example` pour la liste complète. Copier vers `.env.local` :

```bash
cp .env.example .env.local
```

Puis remplir chaque valeur selon les étapes ci-dessus.
