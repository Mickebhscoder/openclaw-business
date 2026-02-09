variable "vpc_id" {
  description = "VPC ID for the security group"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for ECS tasks"
  type        = list(string)
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "cluster_name" {
  description = "ECS cluster name"
  type        = string
  default     = "openclaw-production"
}

variable "task_cpu" {
  description = "CPU units for ECS task (1024 = 1 vCPU)"
  type        = number
  default     = 2048
}

variable "task_memory" {
  description = "Memory for ECS task in MB"
  type        = number
  default     = 4096
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}
