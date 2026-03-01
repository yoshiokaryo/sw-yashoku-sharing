# Vertex AI API を有効化（Gemini 等の利用に必要）
resource "google_project_service" "vertexai" {
  project = var.project
  service = "aiplatform.googleapis.com"
  # 無効化時の destroy で API が無効になるのを防ぐ場合
  disable_on_destroy = false
}

# Vertex AI を呼び出すサービスアカウントに権限を付与（例: Cloud Run の実行 SA）
resource "google_project_iam_member" "vertexai_user" {
  count   = var.api_invoker_sa_email != "" ? 1 : 0
  project = var.project
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${var.api_invoker_sa_email}"
  depends_on = [google_project_service.vertexai]
}
