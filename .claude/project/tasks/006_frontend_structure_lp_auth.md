---
status: completed
---

# 006 フロント：構成・LP・認証

## 概要

Hono でフロントの骨組みを整える。index.tsx で全ルートを束ね、routes/auth.tsx（ログイン・新規登録）と routes/app.tsx（ログイン後）に分離する。LP（pages/lp.tsx）を実装し、Supabase Auth を使った認証画面（メール OTP または Google）と、認証状態に応じた遷移を用意する。

## 参照

- [architecture.md](../design/architecture.md) - フロントのディレクトリ構成、認証システム、LP/フロントの説明

## タスク

### 1. エントリとルーティング（src/index.tsx）

- [x] すべてのルートを束ねるエントリポイントを維持・整理
- [x] `/` で LP（pages/lp）を表示するルートを登録
- [x] `/auth/*` で認証関連のルートを routes/auth に委譲
- [x] `/app/*` でログイン後のルートを routes/app に委譲

### 2. LP（pages/lp.tsx）

- [x] `pages/lp.tsx` を実装（HTML/JSX）
- [x] サービス説明（学生向け・健康的なサラダ・賄い飯の訴求）を記載
- [x] 「アカウントを作成する」「ログイン」ボタンを設置し、`/auth/signup`・`/auth/login` へ誘導

### 3. 認証ルート（routes/auth.tsx）

- [x] `routes/auth.tsx` でログイン・新規登録のルートを定義
  - [x] ログイン画面（pages/auth-login）：メール OTP と Google ログインボタン
  - [x] 新規登録画面（pages/auth-signup）：同上
  - [x] `/auth/callback` で OAuth・マジックリンクのコールバックをハンドリング（クライアントでセッション設定後 `/app` へリダイレクト）
- [x] 認証成功後は `/app` へリダイレクト

### 4. 認証ライブラリ（lib/auth）

- [x] `src/lib/supabase.ts` で Supabase クライアントを初期化（Deno.env で SUPABASE_URL / SUPABASE_ANON_KEY を読む）
- [x] getSession・signOut のヘルパーを用意（フロントで「ログイン中か」の判定に使用可能）

### 5. ログイン後ルートの骨組み（routes/app.tsx）

- [x] `routes/app.tsx` で `/app`（プレースホルダ）と `/app/suggest`（プレースホルダ）を定義
- [x] 未認証で `/app/*` にアクセスした場合はクライアント側で `/auth/login` へリダイレクト（pages/app-top のスクリプト）

### 6. レイアウト・スタイル

- [x] 各ページが自身で HTML ドキュメントまたは JSX を返す形で構成。共通レイアウトは middleware/layout で通過のみ（必要に応じて拡張可）
- [x] LP はインライン style でスタイルを適用。Tailwind は未導入（必要なら後から追加可）

### 7. 動作確認

- [ ] `deno task start` で起動し、`/` で LP が表示されることを確認
- [ ] 「アカウントを作成する」から認証画面に遷移し、Supabase Auth でサインアップ・ログインができることを確認
- [ ] ログイン後に `/app` に遷移し、未認証時はリダイレクトされることを確認

## 注意事項

- フロントのディレクトリ構成は architecture.md に従う（index.tsx, routes/, pages/, lib/）
- Supabase の設定（Auth の有効化、メール/Google プロバイダ）は Supabase ダッシュボードで行う
- 起動時は `SUPABASE_URL` と `SUPABASE_ANON_KEY` を環境変数で指定すること（`deno task start` では `--allow-env` を付与済み）
