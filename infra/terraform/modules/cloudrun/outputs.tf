output "url" {
  description = "Cloud Run サービスの URL"
  value       = google_cloud_run_v2_service.this.uri
}

output "service_name" {
  description = "Cloud Run サービス名"
  value       = google_cloud_run_v2_service.this.name
}
