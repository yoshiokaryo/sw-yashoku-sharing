/** LP: 学生向け・健康的なサラダ・賄い飯の訴求と認証への導線 */
export function LP() {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>夜食も、ちゃんと。</title>
      </head>
      <body>
        <div class="lp">
          <header class="lp-header">
            <h1>夜食も、ちゃんと。</h1>
            <p class="lp-tagline">学食のサラダと賄い飯を、あなたの気分に合わせて。</p>
          </header>
          <main class="lp-main">
            <section class="lp-section">
              <h2>学生のためのフードシェア</h2>
              <p>
                バイト終わりや夜遅く、コンビニの不健康な選択に頼っていませんか？
                大学の学食で余った健康的なサラダや本格的な賄い飯を、在庫と割引付きでお届けします。
              </p>
            </section>
            <section class="lp-section">
              <h2>こんな方に</h2>
              <ul>
                <li>夜食をヘルシーにしたい</li>
                <li>その日の気分に合ったメニューを提案してほしい</li>
                <li>アレルギーを考慮した提案がほしい</li>
              </ul>
            </section>
            <section class="lp-cta">
              <a href="/auth/signup" class="lp-btn lp-btn-primary">アカウントを作成する</a>
              <a href="/auth/login" class="lp-btn lp-btn-secondary">ログイン</a>
            </section>
          </main>
          <style>{`
            .lp { font-family: system-ui, sans-serif; max-width: 640px; margin: 0 auto; padding: 2rem; }
            .lp-header { text-align: center; margin-bottom: 2rem; }
            .lp-header h1 { font-size: 1.75rem; margin: 0 0 0.5rem; }
            .lp-tagline { color: #666; margin: 0; }
            .lp-section { margin-bottom: 1.5rem; }
            .lp-section h2 { font-size: 1.25rem; margin-bottom: 0.5rem; }
            .lp-section ul { margin: 0.5rem 0 0 1.25rem; }
            .lp-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem; }
            .lp-btn { display: inline-block; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
            .lp-btn-primary { background: #2563eb; color: white; }
            .lp-btn-secondary { border: 2px solid #2563eb; color: #2563eb; }
          `}</style>
        </div>
      </body>
    </html>
  )
}
