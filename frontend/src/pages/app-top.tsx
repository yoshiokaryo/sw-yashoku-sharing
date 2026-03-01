/** Logged-in app top. Client-side: if no session, redirect to / or /auth/login. */
export function AppTop() {
  const url = Deno.env.get("SUPABASE_URL") ?? ""
  const key = Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>アプリ</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
</head>
<body>
  <div id="root">
    <h1>ログイン後のトップ</h1>
    <p>ここから商品一覧・AI提案などに遷移できます。</p>
    <p><a href="/">LP へ戻る</a></p>
  </div>
  <script>
    (function() {
      var url = ${JSON.stringify(url)};
      var key = ${JSON.stringify(key)};
      if (!url || !key) { location.href = '/'; return; }
      var supabase = window.supabase.createClient(url, key);
      supabase.auth.getSession().then(function(r) {
        if (!r.data.session) location.replace('/auth/login');
      });
    })();
  </script>
</body>
</html>`
}
