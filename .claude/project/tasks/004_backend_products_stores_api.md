---
status: pending
---

# 004 バックエンド：商品・店舗 API 実装

## 概要

GET /api/products（一覧）、GET /api/products/:id（詳細）、GET /api/stores（店舗一覧）を実装する。adapter/repository で Supabase（pgx）に接続し、usecase を経由して controller が JSON を返す。認証は不要。

## 参照

- [architecture.md](../design/architecture.md) - API 設計（エンドポイント一覧）、データベース設計、バックエンド構成
- タスク 003 で作成した domain / usecase / port / adapter の骨組み

## タスク

### 1. Repository 実装（adapter/repository）

- [ ] `adapter/repository/product.go` を実装
  - [ ] ProductRepository インターフェース（port）を実装
  - [ ] 商品一覧取得：`stores` JOIN `products` JOIN `inventory` で、在庫あり（stock > 0）のものを取得し、割引率・賞味期限を含めて返す
  - [ ] 商品詳細取得：product_id で 1 件取得
- [ ] `adapter/repository/store.go` を実装（または product.go に含める）
  - [ ] 店舗一覧取得：`stores` を全件返す（必要なら product の件数などは 004 ではシンプルに）

### 2. Use Case 実装（usecase）

- [ ] `usecase/product.go` で、ProductRepository を呼び出して一覧・詳細を返すロジックを完成させる
- [ ] 店舗一覧用の usecase を実装（または product usecase に store 一覧取得を追加）

### 3. Controller 実装（adapter/controller）

- [ ] `adapter/controller/product.go` を実装
  - [ ] GET /api/products：一覧を JSON で返す（在庫・割引・賞味期限を含む）
  - [ ] GET /api/products/:id：1 件を JSON で返す。存在しなければ 404
- [ ] `adapter/controller/store.go` を実装（または product に統合）
  - [ ] GET /api/stores：店舗一覧を JSON で返す

### 4. ルーティング・DI 接続

- [ ] `router/router.go` で上記 controller を usecase に接続し、GET /api/products, GET /api/products/:id, GET /api/stores を登録
- [ ] `main.go` で ProductRepository 実装（adapter/repository）を usecase に注入し、controller に usecase を渡していることを確認

### 5. 動作確認

- [ ] ローカルで API を起動し、GET /api/stores と GET /api/products で想定どおりの JSON が返ることを確認（DB にシードがあれば。なければ空配列でも可）
- [ ] GET /api/products/:id で存在する id を指定した場合に 1 件返り、存在しない id で 404 になることを確認

## 注意事項

- 認証は不要のため、middleware は CORS のみ適用でよい
- レスポンス形式は architecture.md の API 設計に合わせる（必要なら DTO を domain または adapter に定義）
