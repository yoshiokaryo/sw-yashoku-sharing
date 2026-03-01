/** Login page: email OTP + Google. Client-side Supabase auth. */
export function AuthLogin() {
  const url = Deno.env.get("SUPABASE_URL") ?? ""
  const key = Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ログイン</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
</head>
<body>
  <div id="root">
    <h1>ログイン</h1>
    <form id="form-otp">
      <label>メールアドレス <input type="email" name="email" required /></label>
      <button type="submit">マジックリンクを送信</button>
    </form>
    <p>または</p>
    <button type="button" id="btn-google">Google でログイン</button>
    <p><a href="/auth/signup">新規登録はこちら</a> · <a href="/">トップへ</a></p>
  </div>
  <script>
    (function() {
      var url = ${JSON.stringify(url)};
      var key = ${JSON.stringify(key)};
      if (!url || !key) { document.getElementById('root').innerHTML += '<p style="color:red">Supabase の設定がありません。</p>'; return; }
      var supabase = window.supabase.createClient(url, key);
      document.getElementById('form-otp').onsubmit = async function(e) {
        e.preventDefault();
        var email = e.target.email.value;
        var btn = e.target.querySelector('button');
        btn.disabled = true;
        try {
          var { error } = await supabase.auth.signInWithOtp({ email: email, options: { emailRedirectTo: location.origin + '/auth/callback' } });
          if (error) throw error;
          alert('メールを送信しました。リンクをクリックしてログインしてください。');
        } catch (err) {
          alert(err.message || '送信に失敗しました');
        }
        btn.disabled = false;
      };
      document.getElementById('btn-google').onclick = function() {
        supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/auth/callback' } }).then(function(r) {
          if (r.data.url) location.href = r.data.url;
          else if (r.error) alert(r.error.message);
        });
      };
    })();
  </script>
</body>
</html>`
}
