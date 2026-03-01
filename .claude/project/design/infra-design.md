# インフラ設計

## 方針

- **アプリのホスティング**: フロント・API とも **Hono 単一アプリ**として **Vercel** にデプロイする。Go バックエンド・Cloud Run は使わない。
- **Vercel**: プロジェクトの接続・環境変数・ドメインは Vercel ダッシュボードで設定する。
- **Terraform**: GCP リソース（Secret Manager 等）を必要とする場合のみ、`infra/terraform/` で任意に管理する。Cloud Run モジュールは使わない。

---

## ディレクトリ構成（参考・任意）

```text
infra/
└── terraform/                    # 任意。GCP リソース用
    ├── modules/
    └── envs/
        ├── dev/
        └── prod/
```

---

## Vercel でのデプロイ

- リポジトリを Vercel に接続し、**frontend**（またはアプリルート）をルートとする。
- 環境変数は Vercel の「Environment Variables」で設定する（例: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY` 等）。
- 本番・プレビューで異なる値を使う場合は、Environment ごとに変数を切り替える。

---

## SQL マイグレーションの命名

- DB マイグレーションは **0001_xxx.sql**, **0002_xxx.sql** のように連番で管理する。詳細は [architecture.md](./architecture.md) の「データベース設計」を参照。SQL は Supabase の SQL エディタで手動実行する。

---

## 参照

- システム全体の技術スタック・構成: [architecture.md](./architecture.md)
