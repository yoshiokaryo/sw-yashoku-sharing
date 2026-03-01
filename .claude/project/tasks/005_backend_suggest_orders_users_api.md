---
status: completed
---

# 005 バックエンド：AI 提案・注文・ユーザー API と認証

## 概要

POST /api/suggest（AI 提案）、POST /api/orders（注文作成・モック）、GET /api/users/me（ログイン中ユーザー情報）を実装する。認証が必要なエンドポイントでは middleware で JWT を検証し、user_id を context に載せる。AI 提案は Google AI Studio（Gemini）を呼び出す adapter/ai を実装する。

## 参照

- [architecture.md](../design/architecture.md) - API 設計（/api/suggest のリクエスト・レスポンス例）、データベース設計、RLS
- タスク 003・004 で作成した usecase/port、adapter、middleware の骨組み

## タスク

### 1. 認証ミドルウェアの完成（adapter/middleware/auth.go）

- [x] Supabase の JWT を検証するロジックを実装（SUPABASE_JWT_SECRET で HMAC 検証。未設定時は payload のみデコード・開発用）
- [x] `Authorization: Bearer <token>` からトークンを取得し、検証後に user_id（sub）を context に設定
- [x] 未認証・トークン不正の場合は 401 を返す

### 2. AI Gateway 実装（adapter/ai）

- [x] `usecase/port/ai_gateway.go` のインターフェースに合わせて `adapter/ai/gemini.go` を実装
- [x] 在庫データとリクエスト（mood, allergies, budget）からプロンプトを組み立て、google.golang.org/genai で Gemini API を呼び出す
- [x] レスポンスを JSON パースし、提案リスト（product_id, name, reason, discount_rate, price_after_discount）の形で返す
- [x] 環境変数 GEMINI_API_KEY で API Key を読み込む（GEMINI_MODEL でモデル指定可）

### 3. Suggest Use Case と Controller

- [x] `usecase/suggest.go` を完成させる
  - [x] ProductRepository.ListAvailableProducts で在庫ありを取得し、上位 20 件に絞り込む
  - [x] AIGateway に在庫データとリクエストを渡し、提案リストを返す
- [x] `adapter/controller/suggest.go` は既存のまま（リクエストボディパース、認証ルートで usecase 呼び出し、JSON 返却）

### 4. Order Repository と Use Case・Controller

- [x] `adapter/repository/order.go` を実装（OrderRepository port）
  - [x] 注文作成：orders に 1 行挿入、order_items に明細を挿入（トランザクション）
- [x] `usecase/order.go` は既存のまま（user_id と Order を repository に渡して保存）
- [x] `adapter/controller/order.go` を実装
  - [x] POST /api/orders：リクエストボディ `{ "items": [ {"product_id": "...", "quantity": N } ] }` を受け取り、認証ユーザーで注文を作成し、作成した注文を返す

### 5. ユーザー情報 API（profiles）

- [x] ProfileRepository の port（usecase/port/profile_repository.go）を定義し、GetByUserID を用意
- [x] `adapter/repository/profile.go` で profiles を取得（pgtype.Array で allergies をスキャン）
- [x] `usecase/user.go` で UserUseCase.GetProfile を実装
- [x] `adapter/controller/user.go` を実装
  - [x] GET /api/users/me：認証の user_id で profiles を取得し JSON で返す（存在しなければ 404）

### 6. ルーティング・DI

- [x] `router/router.go` で POST /api/suggest, POST /api/orders, GET /api/users/me は既に認証ミドルウェア付きで登録済み
- [x] `main.go` で ProfileRepository と UserUseCase を追加し、UserController に userUC を注入

### 7. 動作確認

- [ ] 認証トークン付きで POST /api/suggest を呼び出し、提案が返ることを確認
- [ ] 認証トークン付きで POST /api/orders を呼び出し、注文が作成され DB に保存されることを確認
- [ ] 認証トークン付きで GET /api/users/me を呼び出し、プロファイルが返ることを確認
- [ ] 認証なしで上記を呼んだ場合に 401 になることを確認

## 注意事項

- /api/suggest のリクエスト・レスポンス形式は architecture.md の JSON 例に合わせる
- 注文はモックのため決済処理は行わない
