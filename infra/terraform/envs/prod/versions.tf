terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # 本番環境は GCS で state を管理する（bucket は事前に GCP で作成し、名前を合わせること）
  backend "gcs" {
    bucket = "your-tfstate-bucket-prod"
    prefix = "prod"
  }
}

provider "google" {
  project = var.project
  region  = var.region
}
