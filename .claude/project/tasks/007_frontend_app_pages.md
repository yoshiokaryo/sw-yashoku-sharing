---
status: completed
---

# 007 フロント：商品一覧・AI 提案画面と API 連携

## 概要

ログイン後の画面として、商品一覧（在庫・割引・賞味期限表示）と AI 提案画面を実装する。Go API へのフェッチは lib/api.ts で共通化し、認証トークンを付与して呼び出す。必要に応じて共通コンポーネント（カード、ボタン等）を components/ に配置する。

## 参照

- [frontend-design.md](../design/frontend-design.md) - ヘッダー（カートボタン・切り替えボタン）、カート一覧画面
- [architecture.md](../design/architecture.md) - API エンドポイント、商品選択画面・自動提案 AI の説明、フロント構成
- タスク 004・005 で実装したバックエンド API
- タスク 006 で実装した routes/app、認証

## タスク

### 1. API クライアント（lib/api.ts）

- [x] `src/lib/api.ts` を作成
  - [x] ベース URL を環境変数 API_BASE_URL で設定（未設定時は http://localhost:8080）
  - [x] 認証トークン（Supabase セッション）を取得し、`Authorization: Bearer` で付与する fetch ラッパー（window.api._headers）
  - [x] getProducts, getProduct(id), getStores, suggest(body), createOrder(items), getMe を実装（401 時は _unauthorized でログインへ誘導）

### 2. 商品一覧画面（pages/app/products.tsx）

- [x] `/app/products` で商品一覧ページを実装
- [x] GET /api/products で取得し、商品カード形式で残り数・割引率・有効期限・店舗名を表示
- [x] カートに追加ボタン（Cookie 更新）

### 3. AI 提案画面（pages/app/suggest.tsx）

- [x] `/app/suggest` で AI 提案ページを実装
- [x] 入力フォーム：気分（mood）、アレルギー（allergies、カンマ区切り）、予算（budget）
- [x] POST /api/suggest で suggestions を取得し、name, reason, discount_rate, price_after_discount を表示
- [x] 各提案からカートに追加可能

### 4. 注文フロー（モック）

- [x] カート一覧の「注文する」で POST /api/orders を呼び出し、成功時はカートを空にしてメッセージ表示

### 5. 共通コンポーネント・スタイル

- [x] `src/components/header.ts` でヘッダー（カートボタン・ハンバーガーメニュー）を共有
- [x] アイコンは inline SVG で実装（Hono/vanilla JS のため react-icons は未使用。React 導入時に react-icons へ差し替え可）
- [x] 各ページでインライン style によりスマホでも見やすいレイアウト

### 6. ヘッダー・カートとカート一覧画面

- [x] **カートは Cookie（名前: cart）で維持**。lib/cart-cookie.ts で window.cart（get, set, add, remove, updateQty, count）を注入
- [x] ヘッダーに買い物カートボタン（バッジで件数表示）とハンバーガーメニューを配置
- [x] **カート一覧**（`/app/cart`）：Cookie から読み、API で商品詳細を取得してリスト表示。数量変更・削除で Cookie 更新。合計と「注文する」で POST /api/orders

### 7. ナビゲーション

- [x] ヘッダーのハンバーガーメニューからホーム・商品一覧・AI提案・カート・アカウント・ログアウトへ遷移。ホーム（/app）にショートカットリンクを配置

### 8. 動作確認

- [ ] 商品一覧が API から取得して表示されることを確認
- [ ] AI 提案で気分・アレルギー・予算を入力し、提案リストが表示されることを確認
- [ ] 注文（モック）が作成され、成功フィードバックが得られることを確認
- [ ] 認証切れ時に API が 401 を返した場合のハンドリング（ログイン画面へ誘導）を確認

## 注意事項

- API のベース URL は環境変数 **API_BASE_URL** で切り替え可能（未設定時は http://localhost:8080）。本番は Cloud Run の URL を指定する
- エラー表示は各ページの #error 要素にメッセージを表示。401 時は /auth/login へリダイレクト
- アイコンは現状 inline SVG。React 導入後に **react-icons** へ統一可能（[frontend-design.md](../design/frontend-design.md) 参照）
