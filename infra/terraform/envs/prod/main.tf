module "api" {
  source = "../../modules/cloudrun"

  project = var.project
  name    = "api-prod"
  image   = var.api_image
  region  = var.region

  env_vars = var.api_env_vars

  cpu           = var.api_cpu
  memory        = var.api_memory
  min_instances = var.api_min_instances
  max_instances = var.api_max_instances

  allow_public_access = true

  labels = {
    env     = "prod"
    service = "api"
  }
}
