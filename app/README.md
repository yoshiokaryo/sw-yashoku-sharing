# レス飯 — Next.js フロントエンド

LP・認証・アプリ（商品一覧・AI提案・カート・アカウント）を Next.js（App Router）で実装。

## 環境変数

`.env.local` に以下を設定（`.env.example` をコピーして編集）。

| 変数 | 説明 |
|------|------|
| `AUTH_SECRET` | Auth.js 用秘密鍵（`npx auth secret` で生成） |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth のクライアント ID / シークレット |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名キー |
| `SUPABASE_SERVICE_ROLE_KEY` | サーバー用（users テーブル登録・ログイン時 upsert に使用） |
| `NEXT_PUBLIC_API_URL` | バックエンド API のベース URL（未設定時は同一オリジン） |

## users テーブル（登録・ログイン）

Google でサインインすると、**初回は users テーブルに登録**、**2回目以降は同じ行を更新**（upsert）します。ログイン時には必ずこのテーブルに情報があるか確かめ、なければ挿入・あれば更新します。

1. Supabase の SQL エディタで `sql/migrations/0001_create_users.sql` を実行して `users` テーブルを作成してください。
2. `SUPABASE_SERVICE_ROLE_KEY` を設定すると、Auth.js のサインイン時に自動で upsert が行われます。

## 起動

まずバックエンド（Hono）を別ターミナルで起動し、`NEXT_PUBLIC_API_URL` にその URL を指定してください。

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
