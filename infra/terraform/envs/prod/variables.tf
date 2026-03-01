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

variable "api_cpu" {
  description = "API の CPU 割り当て"
  type        = string
  default     = "1000m"
}

variable "api_memory" {
  description = "API のメモリ割り当て"
  type        = string
  default     = "512Mi"
}

variable "api_min_instances" {
  description = "API の最小インスタンス数（本番は 1 以上推奨）"
  type        = number
  default     = 1
}

variable "api_max_instances" {
  description = "API の最大インスタンス数"
  type        = number
  default     = 10
}
