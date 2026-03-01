---
status: done
---

# 003 バックエンド（Go）クリーンアーキテクチャ骨組み

## 概要

Go バックエンドを architecture.md に従い、クリーンアーキテクチャで構成する。domain / usecase（port） / adapter（controller, repository, middleware） / infrastructure のディレクトリを作成し、main.go で DI ワイヤリングとルーティングを定義する。実エンドポイントの実装は 004・005 で行う。

## 参照

- [architecture.md](../design/architecture.md) - バックエンドのディレクトリ構成、レイヤーと依存の向き、実装時のポイント

## タスク

### 1. ディレクトリ構造の作成

- [ ] `backend/domain/` を作成（entity 用。product.go, order.go, suggestion.go 等のスタブまたは空でよい）
- [ ] `backend/usecase/` と `backend/usecase/port/` を作成
- [ ] `backend/adapter/controller/`, `backend/adapter/repository/`, `backend/adapter/ai/`, `backend/adapter/middleware/` を作成
- [ ] `backend/infrastructure/db/` を作成（connection.go, migrations は 002 で配置済み想定）
- [ ] `backend/router/` を作成

### 2. Domain（エンティティ・値オブジェクト）

- [ ] `domain/product.go` に Product, Store, Inventory の構造体を定義（DB に依存しない純粋な型）
- [ ] `domain/order.go` に Order 関連の構造体を定義
- [ ] `domain/suggestion.go` に AI 提案用の値オブジェクト・レスポンス用構造体を定義

### 3. Use Case 層と Port（インターフェース）

- [ ] `usecase/port/product_repository.go` に商品・在庫取得のインターフェースを定義
- [ ] `usecase/port/order_repository.go` に注文の取得・作成のインターフェースを定義
- [ ] `usecase/port/ai_gateway.go` に AI 提案を呼び出すインターフェースを定義
- [ ] `usecase/product.go` に商品一覧・詳細取得のユースケース骨組み（port を注入する形）を実装
- [ ] `usecase/order.go` に注文作成のユースケース骨組みを実装
- [ ] `usecase/suggest.go` に AI 提案ユースケースの骨組みを実装

### 4. Adapter：ミドルウェア

- [ ] `adapter/middleware/cors.go` を作成（Vercel ドメイン等を許可する CORS）
- [ ] `adapter/middleware/auth.go` を作成（Supabase JWT 検証の骨組み。Authorization: Bearer からトークン取得し、検証して context に user_id を載せる）

### 5. Adapter：ルーターと main.go

- [ ] `router/router.go` で Gin のルーターを組み立て、`/api/products`, `/api/stores`, `/api/suggest`, `/api/orders`, `/api/users/me` のパスを登録（ハンドラは 004・005 で実装するため、ここではプレースホルダでも可）
- [ ] `main.go` で DB 接続・repository 実装・usecase ・controller を生成し、router に渡してサーバー起動する DI ワイヤリングを実装

### 6. インフラ：DB 接続

- [ ] `infrastructure/db/connection.go` で pgx を使った Supabase（PostgreSQL）接続プールを取得する関数を実装（環境変数で接続文字列を読む）

### 7. 動作確認

- [ ] `go build ./...` が成功することを確認
- [ ] `main.go` を実行し、サーバーが起動し、CORS とルートが有効であることを確認（ハンドラが未実装なら 404 でもルートが登録されていれば可）

## 注意事項

- domain は他レイヤーに依存しない。usecase は port のみに依存し、adapter が port を実装する
- 実装の詳細（repository の SQL、controller の JSON 返却）は 004・005 で行う
