output "api_enabled" {
  description = "Vertex AI API が有効化されているか"
  value       = true
}

output "region" {
  description = "Vertex AI を利用するリージョン"
  value       = var.region
}
