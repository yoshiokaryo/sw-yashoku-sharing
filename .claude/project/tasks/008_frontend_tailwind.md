---
status: pending
---

# 008 フロント：Tailwind CSS の適用

## 概要

フロントエンド全体に **Tailwind CSS** を適用し、レイアウト・余白・色・タイポグラフィを Tailwind のユーティリティクラスで統一する。現状は CDN で読み込んでいるため、各ページ・コンポーネントの class を Tailwind に寄せ、必要に応じて tailwind.config やビルドを導入する。

## 参照

- [frontend-design.md](../design/frontend-design.md) - 画面構成・技術方針（スタイル）
- [architecture.md](../design/architecture.md) - フロント構成
- タスク 006・007 で実装した LP、認証、アプリ画面

## 前提

- **Tailwind の読み込み**: 全ページの `<head>` に `https://cdn.tailwindcss.com` を追加済み（app-layout, lp, auth-login, auth-signup, auth-callback, app-top）。未追加のルートがあれば同様に追加する。
- **本番向け**: 必要なら Tailwind CLI で CSS をビルドし、静的ファイルとして配信する構成を検討する（本タスクでは CDN 前提でも可）。

## タスク

### 1. LP（pages/lp.tsx）

- [ ] 既存のインライン `<style>` を、Tailwind のユーティリティクラスに置き換える（または併用して段階的に移行）
- [ ] コンテナ・余白: `max-w-3xl mx-auto px-6 py-8` 等
- [ ] 見出し・本文: `text-2xl font-bold`, `text-gray-600` 等
- [ ] CTA ボタン: `inline-block px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white`, `border-2 border-blue-600 text-blue-600` 等
- [ ] レイアウト: `flex`, `gap-4`, `space-y-6` 等で整える

### 2. 認証ページ（auth-login, auth-signup, auth-callback）

- [ ] ラッパー: `min-h-screen flex items-center justify-center bg-gray-50` 等
- [ ] フォーム・ボタン: `form`, `input`, `button`, `a` に Tailwind のクラスを付与（`rounded`, `px-4 py-2`, `border`, `bg-blue-600 text-white` 等）
- [ ] 認証中ページ（auth-callback）もテキスト・余白を Tailwind で整える

### 3. アプリ共通レイアウト（lib/app-layout.ts, components/header）

- [ ] `getAppPageHtml` で出力する `<main>` のスタイルを Tailwind に寄せる（`p-4 min-h-[60vh]` 等）
- [ ] ヘッダー（`getAppHeaderHtml`）: ナビ・ボタン・メニューに `flex`, `gap-2`, `p-2`, `rounded`, アイコン周りの余白等を Tailwind で指定

### 4. アプリ画面（商品一覧・カート・AI提案・アカウント・ホーム）

- [ ] **商品一覧**（products）: 商品カードを `grid grid-cols-1 sm:grid-cols-2 gap-4`、カード内を `border rounded-lg p-4`, ボタンを `mt-2 px-4 py-2 bg-blue-600 text-white rounded` 等で統一
- [ ] **カート**（cart）: リスト・合計行・注文ボタンを Tailwind で整える
- [ ] **AI提案**（suggest）: フォーム・提案カード・ボタンを Tailwind で整える
- [ ] **アカウント**（account）: フォーム・ローディング・エラー表示・ログアウトボタンを Tailwind で整える
- [ ] **ホーム**（home）: ショートカットリンクやウェルカム文を Tailwind で整える

### 5. 共通方針・コンポーネント

- [ ] ボタン・カード・入力欄など、繰り返し使うパターンは同じクラス組み合わせに揃える（例: プライマリボタンは `px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700`）
- [ ] エラー表示: `text-red-600`, `bg-red-50` 等で統一
- [ ] ローディング表示: `text-gray-500` 等

### 6. オプション：Tailwind 設定・ビルド（本番用）

- [ ] `tailwind.config.js` を追加し、`content` に `./src/**/*.{tsx,ts,html}` を指定
- [ ] エントリ CSS（例: `src/input.css`）に `@tailwind base; @tailwind components; @tailwind utilities;` を定義
- [ ] ビルドタスク（例: `deno task build:css` で Tailwind CLI を実行）を追加し、出力 CSS を静的ファイルとして配信。CDN の代わりにその CSS を `<link>` で読み込む

## 注意事項

- 既存のインライン style や class 名（例: `.lp-btn-primary`）は、Tailwind に移行しつつも動作を崩さないようにする
- アイコンは react-icons で統一（frontend-design の技術方針）
- モバイルでも見やすいよう、`sm:`, `md:` 等のブレークポイントを必要に応じて使う
