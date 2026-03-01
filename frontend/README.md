# フロントエンド（Hono / Vercel）

LP とウェブアプリを Hono で構築し、Vercel にデプロイする。

## 起動

```bash
deno task start
```

## インフラ・DB の設計

- **インフラ**: Terraform ルートは `infra/terraform/`。`envs/dev` と `envs/prod` で環境を分け、`modules/cloudrun` で GCP を管理。Vercel は Terraform 外。詳細は [.claude/project/design/infra-design.md](../.claude/project/design/infra-design.md) を参照。
- **SQL マイグレーション**: バックエンドの DB マイグレーションは **0001_xxx.sql**, **0002_xxx.sql** のような連番形式で管理する（例: `0001_create_stores_and_products.sql`）。
