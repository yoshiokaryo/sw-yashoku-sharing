variable "project" {
  description = "GCP プロジェクト ID"
  type        = string
}

variable "name" {
  description = "Cloud Run サービス名"
  type        = string
}

variable "image" {
  description = "コンテナイメージ URI（例: gcr.io/project/api:latest）"
  type        = string
}

variable "region" {
  description = "デプロイリージョン（例: asia-northeast1）"
  type        = string
  default     = "asia-northeast1"
}

variable "env_vars" {
  description = "環境変数のマップ"
  type        = map(string)
  default     = {}
}

variable "cpu" {
  description = "CPU 割り当て（例: 1000m）"
  type        = string
  default     = "1000m"
}

variable "memory" {
  description = "メモリ割り当て（例: 512Mi）"
  type        = string
  default     = "512Mi"
}

variable "min_instances" {
  description = "最小インスタンス数"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "最大インスタンス数"
  type        = number
  default     = 10
}

variable "allow_public_access" {
  description = "未認証のリクエストを許可するか"
  type        = bool
  default     = true
}

variable "labels" {
  description = "リソースに付与するラベル"
  type        = map(string)
  default     = {}
}
