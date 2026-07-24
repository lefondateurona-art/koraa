# KORAA

Application mobile-first (Next.js App Router + TypeScript + Tailwind) faisant
partie de la plateforme Koraa / Orbit / Orbit-BackOffice, partageant un même
backend Supabase.

## Installation

```bash
npm install
```

## Configuration

```bash
cp .env.example .env.local
```

Remplir `.env.local` avec vos clés Supabase / Firebase — voir
[`SETUP_REQUIRED.md`](./SETUP_REQUIRED.md) pour le détail de chaque étape
externe à réaliser (projet Supabase, OAuth Google, Firebase, migration SQL...).

## Développement

```bash
npm run dev
```

Ouvre http://localhost:3000

## Build de production

```bash
npm run build
npm run start
```

## Vérification des types

```bash
npm run typecheck
```

## Structure

- `app/` — routes App Router (`/auth`, `/`, `/discover`, `/shop`,
  `/shop/[shopId]`, `/create`, `/messages`, `/messages/[chatId]`,
  `/profile`, `/notifications`)
- `components/` — nav du bas, transitions de page, icônes, etc.
- `lib/supabase/` — clients Supabase (browser + server, App Router)
- `lib/firebase.ts` — init Firebase App + Analytics (guard SSR)
- `lib/mock-data.ts` — données temporaires, à remplacer par de vraies
  requêtes Supabase
- `supabase/migrations/0001_init.sql` — schéma initial (tables, index, RLS)

## PWA

Service worker minimal écrit à la main (`public/sw.js`) + `public/manifest.json`.
Voir le commentaire en tête de `next.config.js` pour le choix technique.
