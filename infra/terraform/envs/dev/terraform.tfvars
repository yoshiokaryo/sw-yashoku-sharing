project = "your-gcp-project-id-dev"
region  = "asia-northeast1"

api_image = "asia-northeast1-docker.pkg.dev/your-gcp-project-id-dev/api/api:latest"

api_env_vars = {
  ENV          = "development"
  PORT         = "8080"
  SUPABASE_URL = "https://your-supabase-project.supabase.co"
  # SUPABASE_ANON_KEY や GEMINI_API_KEY は Secret Manager 等で管理
}
