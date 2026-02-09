terraform {
  required_version = ">= 1.0"

  backend "s3" {
    bucket = "your-terraform-state-bucket"
    key    = "your-project/terraform.tfstate"
    region = "us-west-2"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

module "openclaw" {
  source     = "./modules/openclaw"
  vpc_id     = "vpc-REPLACE_ME"
  subnet_ids = ["subnet-REPLACE_ME_1", "subnet-REPLACE_ME_2"]
}

output "cluster_arn" {
  value = module.openclaw.cluster_arn
}

output "security_group_id" {
  value = module.openclaw.security_group_id
}

output "task_definition_arn" {
  value = module.openclaw.task_definition_arn
}
