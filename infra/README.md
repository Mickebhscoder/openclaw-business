# OpenClaw Business Infrastructure

Terraform configuration for the OpenClaw managed agent platform.

## Resources

- **ECS Cluster** (`openclaw-production`) — Fargate SPOT
- **Task Definition** (`openclaw-agent`) — 2 vCPU / 4 GB, two containers:
  - `openclaw-agent` — main OpenClaw container
  - `openclaw-browser` — headless Chrome sidecar
- **Security Group** — egress-only (no inbound access)
- **IAM Roles** — task execution role (ECR pull, CloudWatch, SSM read) + task role
- **CloudWatch Log Group** — `/ecs/openclaw-instances` (7-day retention)

## Usage

```bash
cd infra
terraform init
terraform plan
terraform apply
```

## Importing Existing Resources

If resources already exist in AWS, import them:

```bash
terraform import module.openclaw.aws_ecs_cluster.openclaw openclaw-production
terraform import module.openclaw.aws_cloudwatch_log_group.openclaw /ecs/openclaw-instances
terraform import module.openclaw.aws_security_group.openclaw_tasks sg-REPLACE_ME
terraform import module.openclaw.aws_iam_role.task_execution openclaw-task-execution
terraform import module.openclaw.aws_iam_role.task openclaw-task
terraform import module.openclaw.aws_ecs_task_definition.openclaw_agent openclaw-agent
```
