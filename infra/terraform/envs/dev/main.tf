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
