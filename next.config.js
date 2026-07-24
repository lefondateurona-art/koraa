/**
 * PWA choice: hand-rolled minimal service worker (public/sw.js) + manual registration
 * (see components/ServiceWorkerRegister.tsx), instead of the `next-pwa` package.
 * Reason: next-pwa's webpack plugin (workbox-webpack-plugin) has spotty support for
 * the Next.js App Router build pipeline (14.x) and adds a heavy dependency chain that
 * is prone to install failures in constrained/offline environments. A hand-rolled SW
 * that just caches the app shell + static assets is simpler, has zero extra deps,
 * and is fully under our control.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
