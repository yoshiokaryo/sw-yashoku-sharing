---
status: pending
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

- [ ] `src/lib/api.ts` を作成
  - [ ] ベース URL を環境変数または定数で設定
  - [ ] 認証トークン（Supabase のセッション）を取得し、`Authorization: Bearer` で付与する fetch ラッパーを用意
  - [ ] GET /api/products, GET /api/products/:id, GET /api/stores を呼び出す関数を実装
  - [ ] POST /api/suggest（mood, allergies, budget）を呼び出す関数を実装
  - [ ] POST /api/orders（注文内容）を呼び出す関数を実装
  - [ ] GET /api/users/me を呼び出す関数を実装

### 2. 商品一覧画面（pages/products または app 配下）

- [ ] 商品一覧を表示するページを実装（routes/app から参照するパスに配置）
- [ ] GET /api/products で取得したデータを表示
- [ ] 商品カード形式で、残り数・割引率・有効期限を表示する（architecture の「商品選択画面」に準拠）
- [ ] 店舗名は GET /api/stores で取得し、商品に紐づけて表示してもよい

### 3. AI 提案画面（pages/suggest または app 配下）

- [ ] AI 提案を表示するページを実装
- [ ] 入力フォーム：今日の気分（mood）、アレルギー（allergies）、予算（budget）を入力可能にする
- [ ] 送信ボタンで POST /api/suggest を呼び出し、レスポンスの suggestions を一覧表示する
- [ ] 各提案に product_id, name, reason, discount_rate, price_after_discount を表示（architecture のレスポンス例に準拠）

### 4. 注文フロー（モック）

- [ ] 商品一覧または AI 提案結果から「注文する」を選んだ場合、POST /api/orders を呼び出す処理を実装（モックのため決済は行わず、注文作成と成功メッセージ表示でよい）
- [ ] 必要に応じて注文確認モーダルやサンクス画面を用意

### 5. 共通コンポーネント・スタイル

- [ ] 商品カード、ボタン、入力フィールド等を `src/components/` に配置（再利用可能な形）
- [ ] **アイコンは react-icons で統一**（ハンバーガー・カート・切り替え等）
- [ ] Tailwind 等でスタイルを整え、スマホでも見やすいレイアウトにする

### 6. ヘッダー・カートとカート一覧画面

- [ ] **カートは Cookie で維持**する。カート内容（商品 ID・数量）を Cookie に保存し、読み込み時に復元。追加・削除・数量変更時に Cookie を更新する（[frontend-design.md](../design/frontend-design.md) の技術方針に準拠）
- [ ] ヘッダーに**買い物カートボタン**を配置（**切り替えボタンの左**）。クリックでカート一覧ページへ遷移。カート内件数は Cookie から算出してバッジ表示してもよい
- [ ] **カート一覧ページ**（`/app/cart`）を実装
  - [ ] Cookie からカート内容を読み、商品 ID で API から価格等を取得してリスト表示（商品名・価格・割引後・数量・小計）。数量変更・削除時は Cookie を更新
  - [ ] 合計金額表示と「注文する」ボタン（POST /api/orders でモック注文確定）

### 7. ナビゲーション

- [ ] ログイン後のレイアウトに、商品一覧・AI 提案・カート・ログアウトへのリンクまたはメニューを追加

### 8. 動作確認

- [ ] 商品一覧が API から取得して表示されることを確認
- [ ] AI 提案で気分・アレルギー・予算を入力し、提案リストが表示されることを確認
- [ ] 注文（モック）が作成され、成功フィードバックが得られることを確認
- [ ] 認証切れ時に API が 401 を返した場合のハンドリング（ログイン画面へ誘導）を確認

## 注意事項

- API のベース URL は環境変数で切り替え可能にし、開発時はローカルの Go API、本番は Cloud Run の URL を指すようにする
- エラー表示（ネットワークエラー、401、バリデーションエラー）をユーザーに分かりやすく表示する
- アイコンは **react-icons** で統一する（[frontend-design.md](../design/frontend-design.md) の技術方針に準拠）
