/* Polaris — Supabase runtime config (shared project for the 3 apps).
   Fill these 3 values from your Supabase project (Settings > API), then the
   app connects automatically. Left empty = the prototype keeps running on its
   built-in local data (no backend). This file is loaded by app.html BEFORE the
   prototype script, so window.POLARIS_SUPABASE is available to the integration. */
window.POLARIS_SUPABASE = {
  url: "",       // e.g. https://xxxxxxxx.supabase.co
  anonKey: "",   // public anon key (safe for the browser)
};
