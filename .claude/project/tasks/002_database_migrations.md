---
status: pending
---

# 002 データベースマイグレーション・RLS・シード

## 概要

Supabase（PostgreSQL）用に、学生（profiles）と商品（stores, products, inventory）、注文モック（orders, order_items）のテーブルを **0001_xxx.sql**, **0002_xxx.sql** 形式のマイグレーションで作成する。RLS ポリシーとサインアップ時トリガ、必要に応じてシードデータを追加する。

## 参照

- [architecture.md](../design/architecture.md) - データベース設計（テーブル定義、RLS 方針、SQL 命名ルール）

## タスク

### 1. マイグレーション用ディレクトリ

- [ ] `backend/infrastructure/db/migrations/` ディレクトリを作成
- [ ] マイグレーションは **0001_xxx.sql**, **0002_xxx.sql** の連番形式で作成する

### 2. テーブル作成（学生・商品）

- [ ] `0001_create_stores_and_products.sql` を作成
  - [ ] `stores` テーブル（id uuid PK, name, floor, section, created_at）
  - [ ] `products` テーブル（id uuid PK, store_id FK, name, category, price, image_url, created_at）
- [ ] `0002_create_inventory.sql` を作成
  - [ ] `inventory` テーブル（id uuid PK, product_id FK UNIQUE, stock, discount_rate, expires_at, updated_at）
- [ ] `0003_create_profiles.sql` を作成
  - [ ] `profiles` テーブル（id uuid PK, display_name, allergies text[], created_at, updated_at）
  - [ ] `auth.users` 作成時に `profiles` に 1 行挿入するトリガを定義（Supabase の `auth.users` 向け）
- [ ] `0004_create_orders.sql` を作成
  - [ ] `orders` テーブル（id uuid PK, user_id uuid FK, status, created_at）
  - [ ] `order_items` テーブル（id uuid PK, order_id FK, product_id FK, quantity）

### 3. RLS（Row Level Security）

- [ ] `profiles`: 認証ユーザーが自分自身の行のみ SELECT / UPDATE 可能とするポリシーを追加
- [ ] `stores`, `products`, `inventory`: 全員 SELECT 可能、INSERT/UPDATE/DELETE は行わない想定（ポリシーは SELECT のみ許可でよい）
- [ ] `orders`, `order_items`: 認証ユーザーが自分に紐づく注文のみ SELECT / INSERT 可能とするポリシーを追加

### 4. シードデータ（任意）

- [ ] `0005_seed_stores_and_products.sql` または別ファイルで、`stores` / `products` / `inventory` の初期データを投入する SQL を用意（コンテスト用のサンプル店舗・商品・在庫）

### 5. 実行・確認

- [ ] Supabase の SQL エディタまたはマイグレーション実行手段で、0001 から順に実行できることを確認
- [ ] RLS が有効な状態で、認証あり/なしで想定どおりアクセスできることを確認

## 注意事項

- `profiles.id` は `auth.users.id` と一致させる。トリガは Supabase の `auth.users` に連動する形で記述する
- SQL ファイル名は必ず **0001_**, **0002_** の 4 桁連番 + `_` + スラッグの形式にする
