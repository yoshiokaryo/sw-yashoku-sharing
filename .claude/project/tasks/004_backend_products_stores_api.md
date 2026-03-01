---
status: completed
---

# 004 バックエンド：商品・店舗 API 実装

## 概要

GET /api/products（一覧）、GET /api/products/:id（詳細）、GET /api/stores（店舗一覧）を実装する。adapter/repository で Supabase（pgx）に接続し、usecase を経由して controller が JSON を返す。認証は不要。

## 参照

- [architecture.md](../design/architecture.md) - API 設計（エンドポイント一覧）、データベース設計、バックエンド構成
- タスク 003 で作成した domain / usecase / port / adapter の骨組み

## タスク

### 1. Repository 実装（adapter/repository）

- [x] `adapter/repository/product.go` を実装
  - [x] ProductRepository インターフェース（port）を実装
  - [x] 商品一覧取得：`stores` JOIN `products` JOIN `inventory` で、在庫あり（stock > 0）のものを取得し、割引率・賞味期限を含めて返す
  - [x] 商品詳細取得：product_id で 1 件取得
- [x] 店舗一覧は `product.go` に含める（ListStores）
  - [x] 店舗一覧取得：`stores` を全件返す

### 2. Use Case 実装（usecase）

- [x] `usecase/product.go` で、ProductRepository を呼び出して一覧・詳細・店舗一覧を返すロジックは既に完成済み

### 3. Controller 実装（adapter/controller）

- [x] `adapter/controller/product.go` を実装
  - [x] GET /api/products：一覧を JSON で返す（在庫・割引・賞味期限を含む）
  - [x] GET /api/products/:id：1 件を JSON で返す。存在しなければ 404（repository.ErrNotFound）
  - [x] GET /api/stores：店舗一覧を JSON で返す

### 4. ルーティング・DI 接続

- [x] `router/router.go` で GET /api/products, GET /api/products/:id, GET /api/stores は既に登録済み
- [x] `main.go` で ProductRepository を usecase に注入し、controller に usecase を渡していることを確認済み

### 5. 動作確認

- [ ] ローカルで API を起動し、GET /api/stores と GET /api/products で想定どおりの JSON が返ることを確認（DB にシードがあれば。なければ空配列でも可）
- [ ] GET /api/products/:id で存在する id を指定した場合に 1 件返り、存在しない id で 404 になることを確認

## 注意事項

- 認証は不要のため、middleware は CORS のみ適用でよい
- レスポンス形式は architecture.md の API 設計に合わせる（必要なら DTO を domain または adapter に定義）
