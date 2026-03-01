---
status: pending
---

# 001 インフラ（Terraform）の骨組み作成

## 概要

Terraform で envs/dev と envs/prod を分け、modules/ で共通モジュールを再利用する構成を作成する。infra-design.md に従い、GCP（Cloud Run）用のモジュール骨組みと各環境の main.tf / variables / tfvars を用意する。Vercel は Terraform に含めず、別途 Vercel ダッシュボード等で管理する。

## 参照

- [infra-design.md](../design/infra-design.md) - インフラ設計（envs/dev, envs/prod, modules）
- [architecture.md](../design/architecture.md) - 技術スタック・インフラ方針

## タスク

### 1. ルート・ディレクトリ構成

- [x] Terraform ルートは `infra/terraform/` とする（既存構成に合わせる）
- [ ] `infra/terraform/versions.tf` でバージョン固定（任意）
- [ ] `infra/terraform/README.md` に実行手順を記載（`cd infra/terraform/envs/dev` で init / plan / apply）

### 2. モジュール（modules/）

- [x] `infra/terraform/modules/cloudrun/` を作成済み
  - [ ] 必要に応じて `main.tf` / `variables.tf` / `outputs.tf` を調整
- [ ] Vercel は Terraform で管理しない（modules に vercel は含めない）

### 3. 開発環境（envs/dev）

- [x] `infra/terraform/envs/dev/main.tf`（cloudrun モジュールのみ呼び出し）
- [x] `infra/terraform/envs/dev/variables.tf`, `terraform.tfvars`, `versions.tf`
- [ ] 必要に応じて変数・tfvars をプロジェクトに合わせて編集

### 4. 本番環境（envs/prod）

- [x] `infra/terraform/envs/prod/main.tf`（cloudrun を api-prod で call）
- [x] `infra/terraform/envs/prod/variables.tf`, `terraform.tfvars`, `versions.tf`
- [ ] 本番用の project / api_image / api_env_vars 等を設定

### 5. 動作確認

- [ ] `cd infra/terraform/envs/dev && terraform init` が成功することを確認
- [ ] `terraform plan` がエラーなく実行できることを確認（apply はリソース作成のため任意）

## 注意事項

- Supabase は Terraform でプロビジョニングするか手動作成かは方針に応じて決める（本タスクでは GCP の骨組みを優先）
- バックエンド（state）は GCS 等を後で設定する想定で、ローカル state でも可
