output "cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = aws_ecs_cluster.openclaw.arn
}

output "cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.openclaw.name
}

output "security_group_id" {
  description = "Security group ID for OpenClaw tasks"
  value       = aws_security_group.openclaw_tasks.id
}

output "task_definition_arn" {
  description = "ARN of the task definition"
  value       = aws_ecs_task_definition.openclaw_agent.arn
}

output "task_execution_role_arn" {
  description = "ARN of the task execution IAM role"
  value       = aws_iam_role.task_execution.arn
}

output "task_role_arn" {
  description = "ARN of the task IAM role"
  value       = aws_iam_role.task.arn
}

output "log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.openclaw.name
}
