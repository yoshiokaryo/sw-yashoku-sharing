# Terraform インフラ管理

Terraform のルートは **`infra/terraform/`**。GCP（Cloud Run）のみを管理する。Vercel は Terraform 外で設定する。

---

## インフラをデプロイする手順（開発環境）

### 1. 事前準備

- **GCP プロジェクト** を作成し、プロジェクト ID を控える。
- **gcloud CLI** をインストールし、ログインする。

```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

- 以下 API を有効化する（Cloud Run / Artifact Registry 用）:

```bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 2. Artifact Registry に API イメージを用意

Cloud Run はコンテナイメージが必要です。バックエンドをビルドして Artifact Registry に push します。

```bash
# リポジトリルートから
PROJECT_ID="your-gcp-project-id"
REGION="asia-northeast1"
REPO="api"

# Artifact Registry リポジトリ作成（初回のみ）
gcloud artifacts repositories create $REPO \
  --repository-format=docker \
  --location=$REGION \
  --description="API container images"

# 認証設定
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

# バックエンドをビルドして push
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/api:latest"
docker build -t $IMAGE ./backend
docker push $IMAGE
```

### 3. Terraform の変数を設定

`envs/dev/terraform.tfvars` を編集し、実際の値に置き換えます。

- **project**: GCP プロジェクト ID
- **api_image**: 上で push したイメージ URI（例: `asia-northeast1-docker.pkg.dev/YOUR_PROJECT/api/api:latest`）
- **api_env_vars**: 少なくとも `SUPABASE_URL` を設定。`DATABASE_URL`（Supabase の接続文字列）、`GEMINI_API_KEY`、`SUPABASE_JWT_SECRET` などは必要に応じて追加（機密は Secret Manager 推奨）

### 4. Terraform でデプロイ

```bash
cd infra/terraform/envs/dev
terraform init
terraform plan -out=dev.tfplan
# 内容を確認してから
terraform apply dev.tfplan
```

適用後、Cloud Run の URL が出力されます。フロントの `API_BASE_URL` にこの URL を指定すると API に接続できます。

### 5. 本番環境の場合

- **State**: `envs/prod/versions.tf` の `backend "gcs"` の `bucket` を、事前に作成した GCS バケット名に変更する。
- **tfvars**: `envs/prod/terraform.tfvars` で本番用の project・api_image・api_env_vars を設定。
- 上と同様に `terraform init` → `plan` → `apply` を実行する。

---

## ディレクトリ構成

```text
infra/terraform/
├── modules/
│   ├── cloudrun/    # Cloud Run サービスモジュール
│   └── vertexai/    # Vertex AI API 有効化・IAM（Gemini 等）
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
