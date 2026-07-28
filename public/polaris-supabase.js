/* =====================================================================
   KORAA — Pont Supabase (aucune modification du design).
   ---------------------------------------------------------------------
   Le prototype KORAA parle déjà à un backend via `apiFetch()` (endpoints
   /auth/*, /shops, /posts/feed, /orders ...). Plutôt que de réécrire
   l'interface, ce script intercepte ces appels réseau et les sert depuis
   Supabase. Le HTML et le JS d'origine restent intacts.
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.POLARIS_SUPABASE || {};
  if (!CFG.url || !CFG.anonKey || !window.supabase) {
    console.warn("[KORAA] Supabase non configuré — le prototype garde ses données locales.");
    return;
  }

  var sb = window.supabase.createClient(CFG.url, CFG.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: "koraa_sb_auth" },
  });
  window.POLARIS_SB = sb;

  /* ---------- utilitaires ---------- */
  function json(body, status) {
    return new Response(JSON.stringify(body), {
      status: status || 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  function fail(detail, status) {
    return json({ detail: detail }, status || 400);
  }

  // Même normalisation que le prototype (normalizePhoneCI) : +225XXXXXXXXXX
  function normalizePhone(value) {
    var v = (value || "").trim().replace(/[\s().-]/g, "");
    if (v.charAt(0) === "+") return v;
    if (v.slice(0, 2) === "00") return "+" + v.slice(2);
    if (v.charAt(0) === "0") v = v.slice(1);
    return "+225" + v;
  }

  // Forme d'utilisateur attendue par le prototype (hydrateSessionFromApi)
  async function shapeUser(user) {
    if (!user) return null;
    var meta = user.user_metadata || {};
    var purchases = 0, followers = 0;
    try {
      var o = await sb.from("orders").select("id", { count: "exact", head: true }).eq("buyer_id", user.id);
      purchases = o.count || 0;
      var f = await sb.from("follows").select("follower_id", { count: "exact", head: true }).eq("following_id", user.id);
      followers = f.count || 0;
    } catch (e) { /* compteurs indisponibles : on n'empêche pas la connexion */ }
    return {
      id: user.id,
      name: meta.name || meta.full_name || (user.email || "").split("@")[0],
      email: user.email || "",
      phone: meta.phone || user.phone || "",
      phone_verified: true,
      is_creator: !!meta.is_creator,
      purchases_count: purchases,
      followers_count: followers,
    };
  }

  async function ensureProfile(user) {
    if (!user) return;
    var meta = user.user_metadata || {};
    try {
      await sb.from("profiles").upsert(
        {
          id: user.id,
          full_name: meta.name || meta.full_name || null,
          username: (meta.name || (user.email || "user").split("@")[0] || "user")
            .toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20) + user.id.slice(0, 4),
          phone: meta.phone ? normalizePhone(meta.phone) : null,
          email: user.email || null,
        },
        { onConflict: "id" }
      );
    } catch (e) { /* le profil existe déjà ou RLS l'interdit : sans effet sur la session */ }
  }

  async function sessionPayload(session) {
    var u = await shapeUser(session.user);
    await ensureProfile(session.user);
    return { access_token: session.access_token, user: u };
  }

  /* ---------- routes ---------- */
  var routes = [
    // ---- AUTH ----
    { m: "POST", re: /\/auth\/signup$/, fn: async function (b) {
        var r = await sb.auth.signUp({
          email: b.email,
          password: b.password,
          options: { data: { name: b.name, phone: normalizePhone(b.phone) } },
        });
        if (r.error) {
          var msg = r.error.message || "";
          if (/already|exist/i.test(msg)) return fail("Un compte KORAA existe déjà avec cet email.", 409);
          return fail(msg, 400);
        }
        return json({ ok: true, needs_confirmation: !r.data.session });
      } },

    // Le prototype demande un code SMS. Sans fournisseur SMS, l'étape se
    // valide en connectant directement le compte tout juste créé.
    { m: "POST", re: /\/auth\/verify-phone$/, fn: async function (b, url, init, ctx) {
        var pending = ctx.pendingSignup || {};
        if (!pending.email || !pending.password) {
          return fail("Session d'inscription expirée. Reconnecte-toi avec ton email.", 400);
        }
        var r = await sb.auth.signInWithPassword({ email: pending.email, password: pending.password });
        if (r.error) {
          return fail(
            "Compte créé. Confirme d'abord ton email (lien reçu dans ta boîte), puis connecte-toi.",
            400
          );
        }
        return json(await sessionPayload(r.data.session));
      } },

    { m: "POST", re: /\/auth\/resend-otp$/, fn: async function () {
        return json({ ok: true });
      } },

    { m: "POST", re: /\/auth\/login$/, fn: async function (b) {
        var id = (b.identifier || "").trim();
        var email = id;

        // Connexion par téléphone : le prototype envoie déjà le numéro
        // normalisé (+225XXXXXXXXXX). On résout l'email correspondant.
        if (id.indexOf("@") === -1) {
          var rp = await sb.rpc("email_for_phone", { p_phone: normalizePhone(id) });
          if (rp.error || !rp.data) {
            return fail("Aucun compte KORAA n'est associé à ce numéro.", 401);
          }
          email = rp.data;
        }

        var r = await sb.auth.signInWithPassword({ email: email, password: b.password });
        if (r.error) {
          if (/confirm/i.test(r.error.message || "")) {
            return fail("Ton email n'est pas encore confirmé. Vérifie ta boîte mail.", 403);
          }
          return fail("Identifiants incorrects.", 401);
        }
        return json(await sessionPayload(r.data.session));
      } },

    { m: "GET", re: /\/auth\/me$/, fn: async function () {
        var r = await sb.auth.getUser();
        if (r.error || !r.data.user) return fail("Non authentifié", 401);
        return json(await shapeUser(r.data.user));
      } },

    // ---- BOUTIQUES / PRODUITS ----
    { m: "GET", re: /\/shops$/, fn: async function () {
        var r = await sb.from("shops").select("id,name,description,category,logo_url").order("created_at", { ascending: false });
        if (r.error) return fail(r.error.message, 500);
        return json(r.data || []);
      } },

    { m: "GET", re: /\/shops\/([^/]+)\/products$/, fn: async function (b, url, init, ctx) {
        var shopId = ctx.params[0];
        var r = await sb.from("products").select("id,name,price,old_price,category,image_url,description").eq("shop_id", shopId);
        if (r.error) return fail(r.error.message, 500);
        return json(r.data || []);
      } },

    // ---- FIL / PUBLICATIONS ----
    { m: "GET", re: /\/posts\/feed$/, fn: async function () {
        var r = await sb.from("posts")
          .select("id,author_id,shop_id,product_id,caption,likes_count,created_at,video_url")
          .order("created_at", { ascending: false }).limit(50);
        if (r.error) return fail(r.error.message, 500);
        return json((r.data || []).map(function (p) {
          return {
            id: p.id, creator_id: p.author_id, shop_id: p.shop_id, product_id: p.product_id,
            caption: p.caption, likes_count: p.likes_count, created_at: p.created_at, video_url: p.video_url,
          };
        }));
      } },

    { m: "POST", re: /\/posts$/, fn: async function (b) {
        var u = (await sb.auth.getUser()).data.user;
        if (!u) return fail("Non authentifié", 401);
        var r = await sb.from("posts").insert({
          author_id: u.id, shop_id: b.shop_id || null, product_id: b.product_id || null,
          video_url: b.video_url || b.url || "", caption: b.caption || "",
        }).select().single();
        if (r.error) return fail(r.error.message, 400);
        return json(r.data);
      } },

    { m: "GET", re: /\/users\/([^/]+)\/public$/, fn: async function (b, url, init, ctx) {
        var id = ctx.params[0];
        var p = await sb.from("profiles").select("id,full_name,username").eq("id", id).maybeSingle();
        var f = await sb.from("follows").select("follower_id", { count: "exact", head: true }).eq("following_id", id);
        if (!p.data) return fail("Introuvable", 404);
        return json({
          id: p.data.id,
          name: p.data.full_name || p.data.username || "Créateur",
          followers_count: f.count || 0,
        });
      } },

    // ---- COMMANDES ----
    { m: "POST", re: /\/orders$/, fn: async function (b) {
        var u = (await sb.auth.getUser()).data.user;
        if (!u) return fail("Non authentifié", 401);
        var r = await sb.from("orders").insert({
          buyer_id: u.id, shop_id: b.shop_id, product_id: b.product_id,
          quantity: b.quantity || 1, price: b.price || 0,
        }).select().single();
        if (r.error) return fail(r.error.message, 400);
        return json(r.data);
      } },

    { m: "GET", re: /\/orders\/me$/, fn: async function () {
        var u = (await sb.auth.getUser()).data.user;
        if (!u) return fail("Non authentifié", 401);
        var r = await sb.from("orders").select("*").eq("buyer_id", u.id).order("created_at", { ascending: false });
        if (r.error) return fail(r.error.message, 500);
        return json(r.data || []);
      } },

    // ---- CRÉATEURS ----
    { m: "POST", re: /\/creators\/([^/]+)\/follow$/, fn: async function (b, url, init, ctx) {
        var u = (await sb.auth.getUser()).data.user;
        if (!u) return fail("Non authentifié", 401);
        await sb.from("follows").upsert({ follower_id: u.id, following_id: ctx.params[0] });
        return json({ ok: true });
      } },

    { m: "POST", re: /\/creators\/([^/]+)\/unfollow$/, fn: async function (b, url, init, ctx) {
        var u = (await sb.auth.getUser()).data.user;
        if (!u) return fail("Non authentifié", 401);
        await sb.from("follows").delete().eq("follower_id", u.id).eq("following_id", ctx.params[0]);
        return json({ ok: true });
      } },

    { m: "GET", re: /\/creators\/me\/progress$/, fn: async function () {
        var u = (await sb.auth.getUser()).data.user;
        if (!u) return fail("Non authentifié", 401);
        var o = await sb.from("orders").select("id", { count: "exact", head: true }).eq("buyer_id", u.id);
        var f = await sb.from("follows").select("follower_id", { count: "exact", head: true }).eq("following_id", u.id);
        return json({
          purchases_count: o.count || 0,
          followers_count: f.count || 0,
          is_creator: (o.count || 0) >= 10 && (f.count || 0) >= 500,
          partner_shops: [],
        });
      } },

    { m: "POST", re: /\/creators\/me\/partner-shops\/([^/]+)$/, fn: async function () {
        return json({ ok: true });
      } },
  ];

  /* ---------- interception réseau ---------- */
  var nativeFetch = window.fetch.bind(window);
  var ctx = { pendingSignup: null, params: [] };

  window.fetch = async function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url) || "";
    var method = ((init && init.method) || (input && input.method) || "GET").toUpperCase();

    // On ne détourne que les endpoints applicatifs du prototype (chemins relatifs).
    var isAppCall = /^\/(auth|shops|posts|orders|creators|users)\b/.test(url);
    if (!isAppCall) return nativeFetch(input, init);

    var body = {};
    try { if (init && init.body) body = JSON.parse(init.body); } catch (e) { /* corps non JSON */ }

    // Mémorise les identifiants d'inscription pour l'étape de vérification.
    if (/\/auth\/signup$/.test(url)) ctx.pendingSignup = { email: body.email, password: body.password };

    for (var i = 0; i < routes.length; i++) {
      var r = routes[i];
      if (r.m !== method) continue;
      var m = url.match(r.re);
      if (!m) continue;
      ctx.params = m.slice(1);
      try {
        return await r.fn(body, url, init, ctx);
      } catch (e) {
        console.error("[KORAA/Supabase]", url, e);
        return fail(e.message || "Erreur serveur", 500);
      }
    }
    return fail("Endpoint non pris en charge : " + url, 404);
  };

  console.info("[KORAA] Supabase branché ✔");
})();
