data "google_project" "project" {
  project_id = var.project
}

module "api" {
  source = "../../modules/cloudrun"

  project = var.project
  name    = "api-dev"
  image   = var.api_image
  region  = var.region

  env_vars = var.api_env_vars

  cpu           = "1000m"
  memory        = "512Mi"
  min_instances = 0
  max_instances = 5

  allow_public_access = true

  labels = {
    env     = "dev"
    service = "api"
  }
}

# Vertex AI（Gemini 等）の API 有効化と、Cloud Run 実行 SA への権限付与
module "vertexai" {
  source = "../../modules/vertexai"

  project             = var.project
  region              = var.region
  api_invoker_sa_email = "${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}
