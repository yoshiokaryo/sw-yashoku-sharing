# Terraform インフラ管理

Terraform のルートは **`infra/terraform/`**。GCP（Cloud Run）のみを管理する。Vercel は Terraform 外で設定する。

## ディレクトリ構成

```text
infra/terraform/
├── modules/
│   └── cloudrun/    # Cloud Run サービスモジュール
├── envs/
│   ├── dev/         # 開発環境
│   └── prod/        # 本番環境
├── versions.tf      # Terraform バージョン固定（任意）
└── README.md
```

## 事前準備

```bash
# GCP 認証
gcloud auth application-default login
```

## 実行手順

### 開発環境

```bash
cd infra/terraform/envs/dev
terraform init
terraform plan -out=dev.tfplan
terraform apply dev.tfplan
```

### 本番環境

```bash
cd infra/terraform/envs/prod
terraform init
terraform plan -out=prod.tfplan
terraform apply prod.tfplan
```

## State の管理

- **開発環境（dev）**: state は **ローカルファイル**（`envs/dev/terraform.tfstate`）で管理する。
- **本番環境（prod）**: state は **GCS** で管理する。事前に GCS バケットを作成し、`envs/prod/versions.tf` の `backend "gcs"` の `bucket` をそのバケット名に変更する。または `backend.config.example` をコピーして `backend.config` を作成し、`terraform init -backend-config=backend.config` で初期化する。

## 注意事項

- 各環境は独立した state で管理する（ディレクトリ分離方式）
- `terraform.tfvars` に機密情報を含める場合は `.gitignore` に追加する
- apply は必ず `plan` の内容を確認してから実行する

## 参照

- 設計: [.claude/project/design/infra-design.md](../../.claude/project/design/infra-design.md)
