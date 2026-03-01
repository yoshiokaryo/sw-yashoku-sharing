---
status: pending
---

# 006 フロント：構成・LP・認証

## 概要

Hono でフロントの骨組みを整える。index.tsx で全ルートを束ね、routes/auth.tsx（ログイン・新規登録）と routes/app.tsx（ログイン後）に分離する。LP（pages/lp.tsx）を実装し、Supabase Auth を使った認証画面（メール OTP または Google）と、認証状態に応じた遷移を用意する。

## 参照

- [architecture.md](../design/architecture.md) - フロントのディレクトリ構成、認証システム、LP/フロントの説明

## タスク

### 1. エントリとルーティング（src/index.tsx）

- [ ] すべてのルートを束ねるエントリポイントを維持・整理
- [ ] `/` で LP（pages/lp）を表示するルートを登録
- [ ] `/auth/*` で認証関連（ログイン・新規登録）のルートを routes/auth に委譲
- [ ] `/app/*` でログイン後のルートを routes/app に委譲（006 ではプレースホルダでも可）

### 2. LP（pages/lp.tsx）

- [ ] `pages/lp.tsx` を実装（実際の HTML/JSX）
- [ ] サービス説明（学生向け・健康的なサラダ・賄い飯の訴求）を記載
- [ ] 「アカウントを作成する」または「ログイン」ボタンを設置し、`/auth/login` または `/auth/signup` へ誘導

### 3. 認証ルート（routes/auth.tsx）

- [ ] `routes/auth.tsx` でログイン・新規登録のルートを定義
  - [ ] ログイン画面（メール OTP または Google ログインボタン）
  - [ ] 新規登録画面（同上）
  - [ ] 必要に応じてコールバック（OAuth やマジックリンク）のハンドリング
- [ ] 認証成功後は `/app` などログイン後トップへリダイレクト

### 4. 認証ライブラリ（lib/auth）

- [ ] `src/lib/auth.ts` または `src/lib/supabase.ts` で Supabase クライアントを初期化（Vite/Deno の環境変数で URL と anon key を読む）
- [ ] セッション取得・サインアウトのヘルパーを用意（フロントで「ログイン中か」の判定に使用）

### 5. ログイン後ルートの骨組み（routes/app.tsx）

- [ ] `routes/app.tsx` で `/app`（商品一覧やダッシュボードへの入口）、`/app/suggest` 等の子パスを定義（006 ではプレースホルダまたは「ログイン後のトップ」1 ページでも可）
- [ ] 未認証で `/app/*` にアクセスした場合は LP または `/auth/login` へリダイレクトする処理を追加

### 6. レイアウト・スタイル

- [ ] 共通レイアウト（ヘッダー・フッター等）が必要なら `layout.tsx` または components で共有
- [ ] Tailwind CSS 等のスタイル設定が動作することを確認

### 7. 動作確認

- [ ] `deno task start` で起動し、`/` で LP が表示されることを確認
- [ ] 「アカウントを作成する」から認証画面に遷移し、Supabase Auth でサインアップ・ログインができることを確認
- [ ] ログイン後に `/app` に遷移し、未認証時はリダイレクトされることを確認

## 注意事項

- フロントのディレクトリ構成は architecture.md に従う（index.tsx, routes/, pages/, lib/）
- Supabase の設定（Auth の有効化、メール/Google プロバイダ）は Supabase ダッシュボードで行う
