---
status: pending
---

# 005 バックエンド：AI 提案・注文・ユーザー API と認証

## 概要

POST /api/suggest（AI 提案）、POST /api/orders（注文作成・モック）、GET /api/users/me（ログイン中ユーザー情報）を実装する。認証が必要なエンドポイントでは middleware で JWT を検証し、user_id を context に載せる。AI 提案は Google AI Studio（Gemini）を呼び出す adapter/ai を実装する。

## 参照

- [architecture.md](../design/architecture.md) - API 設計（/api/suggest のリクエスト・レスポンス例）、データベース設計、RLS
- タスク 003・004 で作成した usecase/port、adapter、middleware の骨組み

## タスク

### 1. 認証ミドルウェアの完成（adapter/middleware/auth.go）

- [ ] Supabase の JWT を検証するロジックを実装（公開鍵取得または Supabase クライアント利用）
- [ ] `Authorization: Bearer <token>` からトークンを取得し、検証後に user_id（sub）を context に設定
- [ ] 未認証・トークン不正の場合は 401 を返す

### 2. AI Gateway 実装（adapter/ai）

- [ ] `usecase/port/ai_gateway.go` のインターフェースに合わせて `adapter/ai/gemini.go` を実装
- [ ] 在庫データ（商品名・カテゴリ・価格・割引率・賞味期限等）とリクエスト（mood, allergies, budget）からプロンプトを組み立て、Google AI Studio API（Gemini）を呼び出す
- [ ] レスポンスをパースし、提案リスト（product_id, name, reason, discount_rate, price_after_discount）の形で返す
- [ ] 環境変数で API Key を読み込む

### 3. Suggest Use Case と Controller

- [ ] `usecase/suggest.go` を完成させる
  - [ ] ProductRepository で在庫あり（stock > 0）の商品を取得し、expires_at が近い順で上位 N 件（例: 20）に絞り込む
  - [ ] AIGateway に在庫データとリクエスト（mood, allergies, budget）を渡し、提案リストを取得して返す
- [ ] `adapter/controller/suggest.go` を実装
  - [ ] リクエストボディをパース（mood, allergies, budget）
  - [ ] 認証ミドルウェアで保護されたルートで user_id を取得
  - [ ] usecase を呼び出し、レスポンスを architecture.md の形式で JSON 返却

### 4. Order Repository と Use Case・Controller

- [ ] `adapter/repository/order.go` を実装（OrderRepository port）
  - [ ] 注文作成：orders に 1 行、order_items に明細を挿入
- [ ] `usecase/order.go` を完成させる（user_id, 商品・数量を受け取り、repository で保存）
- [ ] `adapter/controller/order.go` を実装
  - [ ] POST /api/orders：リクエストボディ（商品 ID と数量のリスト）を受け取り、認証ユーザーで注文を作成し、作成した注文を返す

### 5. ユーザー情報 API（profiles）

- [ ] ProfileRepository の port を定義し、user_id で profiles を 1 件取得するメソッドを用意
- [ ] `adapter/repository/profile.go` で Supabase から profiles を取得する実装を追加
- [ ] `usecase/user.go` または既存 usecase で「自分」のプロファイル取得を実装
- [ ] `adapter/controller/user.go` を実装
  - [ ] GET /api/users/me：認証ミドルウェアで取得した user_id で profiles を取得し、JSON で返す（存在しなければ 404 または空）

### 6. ルーティング・DI

- [ ] `router/router.go` で POST /api/suggest, POST /api/orders, GET /api/users/me を登録し、認証ミドルウェアを適用
- [ ] `main.go` で AIGateway 実装、OrderRepository、ProfileRepository を usecase に注入

### 7. 動作確認

- [ ] 認証トークン付きで POST /api/suggest を呼び出し、提案が返ることを確認
- [ ] 認証トークン付きで POST /api/orders を呼び出し、注文が作成され DB に保存されることを確認
- [ ] 認証トークン付きで GET /api/users/me を呼び出し、プロファイルが返ることを確認
- [ ] 認証なしで上記を呼んだ場合に 401 になることを確認

## 注意事項

- /api/suggest のリクエスト・レスポンス形式は architecture.md の JSON 例に合わせる
- 注文はモックのため決済処理は行わない
