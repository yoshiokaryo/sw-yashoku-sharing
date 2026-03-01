project = "your-gcp-project-id-prod"
region  = "asia-northeast1"

api_image = "asia-northeast1-docker.pkg.dev/your-gcp-project-id-prod/api/api:latest"

api_env_vars = {
  ENV          = "production"
  PORT         = "8080"
  SUPABASE_URL = "https://your-supabase-project.supabase.co"
}

# 本番用のスケール
api_min_instances = 1
api_max_instances = 10
