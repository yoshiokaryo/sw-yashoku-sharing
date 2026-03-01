/** OAuth / magic link callback: Supabase sets session from hash, then redirect to /app */
export function AuthCallback() {
  const url = Deno.env.get("SUPABASE_URL") ?? ""
  const key = Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>認証中…</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
</head>
<body>
  <p>認証を確認しています…</p>
  <script>
    (function() {
      var url = ${JSON.stringify(url)};
      var key = ${JSON.stringify(key)};
      if (!url || !key) { location.href = '/auth/login'; return; }
      var supabase = window.supabase.createClient(url, key);
      supabase.auth.getSession().then(function(r) {
        if (r.data.session) location.replace('/app');
        else supabase.auth.onAuthStateChange(function(e, s) {
          if (e === 'SIGNED_IN' && s) location.replace('/app');
        });
      });
      supabase.auth.getSession();
      setTimeout(function() { if (!document.hidden) location.href = '/auth/login'; }, 3000);
    })();
  </script>
</body>
</html>`
}
