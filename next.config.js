/**
 * Serve the ORIGINAL prototype HTML verbatim.
 * The source design file lives at public/app.html (byte-for-byte the client's
 * HTML). A beforeFiles rewrite makes it the app served at "/", taking
 * precedence over the (now unused) app-router pages. This guarantees 100%
 * fidelity to the source and lets the prototype's own auth screens gate access.
 * Supabase is wired in via the prototype's data layer, not by rewriting the UI.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [{ source: '/', destination: '/app.html' }],
      afterFiles: [],
      fallback: [],
    };
  },
};

module.exports = nextConfig;
