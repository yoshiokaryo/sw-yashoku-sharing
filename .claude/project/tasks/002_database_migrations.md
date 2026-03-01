---
status: pending
---

# 002 データベース用 SQL の作成（Supabase コンソールで自前実行）

## 概要

Supabase（PostgreSQL）用の **SQL ファイルのみ** を作成する。学生（profiles）と商品（stores, products, inventory）、注文モック（orders, order_items）の DDL・RLS・トリガ・シードを **0001_xxx.sql** 形式で用意し、**実行は Supabase のコンソール（SQL エディタ）で自前で行う**。バックエンドからのマイグレーション実行は行わない。

## 参照

- [architecture.md](../design/architecture.md) - データベース設計（テーブル定義、RLS 方針、SQL 命名ルール）

## タスク（SQL の作成のみ）

### 1. 配置場所と命名

- [ ] SQL を置くディレクトリを用意する（例: `backend/infrastructure/db/migrations/` または `sql/migrations/`）
- [ ] ファイル名は **0001_xxx.sql**, **0002_xxx.sql** の連番形式にする

### 2. テーブル作成用 SQL

- [ ] `0001_create_stores_and_products.sql` を作成
  - [ ] `stores` テーブル（id uuid PK, name, floor, section, created_at）
  - [ ] `products` テーブル（id uuid PK, store_id FK, name, category, price, image_url, created_at）
- [ ] `0002_create_inventory.sql` を作成
  - [ ] `inventory` テーブル（id uuid PK, product_id FK UNIQUE, stock, discount_rate, expires_at, updated_at）
- [ ] `0003_create_profiles.sql` を作成
  - [ ] `profiles` テーブル（id uuid PK, display_name, allergies text[], created_at, updated_at）
  - [ ] `auth.users` 作成時に `profiles` に 1 行挿入するトリガ（Supabase の `auth.users` 向け）
- [ ] `0004_create_orders.sql` を作成
  - [ ] `orders` テーブル（id uuid PK, user_id uuid FK, status, created_at）
  - [ ] `order_items` テーブル（id uuid PK, order_id FK, product_id FK, quantity）

### 3. RLS 用 SQL

- [ ] 上記のいずれのファイルか、または `0005_rls_policies.sql` で RLS を定義する
  - [ ] `profiles`: 認証ユーザーが自分自身の行のみ SELECT / UPDATE 可能
  - [ ] `stores`, `products`, `inventory`: 全員 SELECT 可能（INSERT/UPDATE/DELETE は想定しない）
  - [ ] `orders`, `order_items`: 認証ユーザーが自分に紐づく注文のみ SELECT / INSERT 可能

### 4. シード用 SQL（任意）

- [ ] `0005_seed_stores_and_products.sql` または別ファイルで、`stores` / `products` / `inventory` の初期データを投入する SQL を用意する

## 実行について

- **本タスクでは SQL ファイルの作成のみ行う**
- 適用は **Supabase のダッシュボード（SQL エディタ）で、作成した SQL を 0001 から順に貼り付けて実行する**

## 注意事項

- `profiles.id` は `auth.users.id` と一致させる。トリガは Supabase の `auth.users` に連動する形で記述する
- SQL ファイル名は **0001_**, **0002_** の 4 桁連番 + `_` + スラッグの形式にする
- **その他考慮事項**（インデックス・制約・デフォルト値・RLS の有効化・環境分離など）は [architecture.md](../design/architecture.md) の「データベースで考慮すべきこと」を参照し、必要に応じて DDL に反映する
