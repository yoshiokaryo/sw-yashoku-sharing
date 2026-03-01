variable "project" {
  description = "GCP プロジェクト ID"
  type        = string
}

variable "region" {
  description = "Vertex AI を利用するリージョン（例: asia-northeast1）"
  type        = string
}

variable "api_invoker_sa_email" {
  description = "Vertex AI API を呼び出すサービスアカウントのメール（例: Cloud Run の実行 SA）。指定時は roles/aiplatform.user を付与する"
  type        = string
  default     = ""
}
