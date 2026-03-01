# インフラ設計（Terraform）

## 方針

- **Terraform ルート**: リポジトリ内では `infra/terraform/` をルートとする。すべての `terraform` コマンドはこの直下の `envs/<env>/` で実行する。
- **環境分離**: `envs/dev` と `envs/prod` で環境を分け、それぞれで `terraform plan` / `apply` を実行する。state は環境ごとに別管理（ディレクトリ分離）。
- **モジュール再利用**: `modules/` に共通モジュールを置き、各環境の `main.tf` から `module` で参照する。
- **Vercel**: フロントのホスティングは Terraform で管理しない。Vercel ダッシュボード等で別途設定する。

---

## ディレクトリ構成

```text
infra/
└── terraform/                    # Terraform ルート（ここが tf の作業根）
    ├── modules/                  # 再利用可能なモジュール
    │   └── cloudrun/             # Cloud Run サービス
    │       ├── main.tf
    │       ├── variables.tf
    │       └── outputs.tf
    ├── envs/
    │   ├── dev/                  # 開発環境
    │   │   ├── main.tf           # ルートモジュール（modules を call）
    │   │   ├── variables.tf
    │   │   ├── terraform.tfvars  # dev 用の変数値
    │   │   └── versions.tf       # プロバイダー・Terraform バージョン
    │   └── prod/                 # 本番環境
    │       ├── main.tf
    │       ├── variables.tf
    │       ├── terraform.tfvars
    │       └── versions.tf
    ├── versions.tf               # ルートのバージョン固定（任意）
    └── README.md                 # 実行手順
```

---

## 環境ごとの役割

| 環境 | 用途 | 例（変数・リソース規模） |
| --- | --- | --- |
| `envs/dev` | 開発・検証用 | 小さいインスタンス、min_instances=0、少リージョン |
| `envs/prod` | 本番 | 本番規模、min_instances 1 以上、冗長化・監視 |

- **開発環境（dev）**: state は **ローカルファイル**（`terraform.tfstate`）で管理する。
- **本番環境（prod）**: state は **GCS バックエンド**で管理する。`envs/prod/versions.tf` で `backend "gcs"` を指定し、事前に GCS バケットを作成しておく。

---

## モジュールの使い方

- `envs/dev/main.tf` および `envs/prod/main.tf` から、相対パスで `../../modules/cloudrun` を参照する。

```hcl
# envs/dev/main.tf の例
module "api" {
  source = "../../modules/cloudrun"

  project  = var.project
  name     = "api-dev"
  image    = var.api_image
  region   = var.region
  env_vars = var.api_env_vars
  # cpu, memory, min_instances, max_instances, labels 等
}
```

- モジュールは環境非依存とし、リソース名・リージョン・インスタンスサイズなどはすべて **variables で渡す**。
- 機密情報（API キー等）は `terraform.tfvars` に直接書かず、Secret Manager や環境変数で渡す運用を推奨する。

---

## 実行手順

```bash
# 開発環境（リポジトリルートから）
cd infra/terraform/envs/dev
terraform init
terraform plan -out=dev.tfplan
terraform apply dev.tfplan

# 本番環境
cd infra/terraform/envs/prod
terraform init
terraform plan -out=prod.tfplan
terraform apply prod.tfplan
```

- 事前に GCP の認証を行う: `gcloud auth application-default login`

---

## SQL マイグレーションの命名

- バックエンドの DB マイグレーションは **0001_xxx.sql**, **0002_xxx.sql** のように連番で管理する。詳細は [architecture.md](./architecture.md) の「データベース設計」を参照。

---

## 参照

- システム全体の技術スタック・構成: [architecture.md](./architecture.md) の「インフラ（Terraform）」を参照
