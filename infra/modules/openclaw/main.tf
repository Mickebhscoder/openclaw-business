# -----------------------------------------------------------------------------
# OpenClaw Business — ECS Infrastructure
# Defines: cluster, task definition, security group, IAM roles, log group
# -----------------------------------------------------------------------------

data "aws_caller_identity" "current" {}

# --- ECS Cluster ---

resource "aws_ecs_cluster" "openclaw" {
  name = var.cluster_name

  setting {
    name  = "containerInsights"
    value = "disabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "openclaw" {
  cluster_name       = aws_ecs_cluster.openclaw.name
  capacity_providers = ["FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }
}

# --- CloudWatch Log Group ---

resource "aws_cloudwatch_log_group" "openclaw" {
  name              = "/ecs/openclaw-instances"
  retention_in_days = var.log_retention_days
}

# --- Security Group (egress-only, no inbound) ---

resource "aws_security_group" "openclaw_tasks" {
  name        = "openclaw-tasks"
  description = "Security group for OpenClaw ECS tasks"
  vpc_id      = var.vpc_id

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "openclaw-tasks"
  }
}

# --- IAM: Task Execution Role ---

resource "aws_iam_role" "task_execution" {
  name = "openclaw-task-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "ecs-tasks.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "task_execution_ecs" {
  role       = aws_iam_role.task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "task_execution_cloudwatch" {
  name = "openclaw-cloudwatch-logs"
  role = aws_iam_role.task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.openclaw.arn}:*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "task_execution_ssm" {
  name = "openclaw-ssm-read"
  role = aws_iam_role.task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameters",
          "ssm:GetParameter",
          "ssm:GetParametersByPath"
        ]
        Resource = "arn:aws:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter/openclaw/*"
      }
    ]
  })
}

# --- IAM: Task Role (for running containers) ---

resource "aws_iam_role" "task" {
  name = "openclaw-task"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "ecs-tasks.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })
}

# --- ECS Task Definition ---

resource "aws_ecs_task_definition" "openclaw_agent" {
  family                   = "openclaw-agent"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.task_execution.arn
  task_role_arn            = aws_iam_role.task.arn

  container_definitions = jsonencode([
    {
      name      = "openclaw-agent"
      image     = "coollabsio/openclaw"
      essential = true

      entryPoint = ["sh", "-c"]
      command    = ["echo 127.0.0.1 browser >> /etc/hosts && exec /app/scripts/entrypoint.sh"]

      portMappings = [
        {
          containerPort = 18789
          hostPort      = 18789
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "OPENCLAW_GATEWAY_PORT", value = "18789" },
        { name = "BROWSER_CDP_URL", value = "http://browser:9223" },
        { name = "ANTHROPIC_API_KEY", value = "placeholder-overridden-at-runtime" },
        { name = "TELEGRAM_BOT_TOKEN", value = "placeholder-overridden-at-runtime" },
        { name = "AUTH_PASSWORD", value = "placeholder-overridden-at-runtime" },
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.openclaw.name
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "openclaw"
        }
      }
    },
    {
      name      = "openclaw-browser"
      image     = "coollabsio/openclaw-browser:latest"
      essential = false

      environment = [
        { name = "CHROME_CLI", value = "--remote-debugging-port=9222 --disable-dev-shm-usage" },
        { name = "PUID", value = "1000" },
        { name = "PGID", value = "1000" },
        { name = "TZ", value = "Etc/UTC" },
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.openclaw.name
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "browser"
        }
      }
    }
  ])
}
