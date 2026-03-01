variable "project" {
  description = "GCP プロジェクト ID"
  type        = string
}

variable "region" {
  description = "GCP リージョン"
  type        = string
  default     = "asia-northeast1"
}

variable "api_image" {
  description = "バックエンド API のコンテナイメージ URI"
  type        = string
}

variable "api_env_vars" {
  description = "バックエンド API の環境変数"
  type        = map(string)
  default     = {}
  sensitive   = true
}
