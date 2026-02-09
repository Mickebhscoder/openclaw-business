import { ECSClient, RunTaskCommand, StopTaskCommand, DescribeTasksCommand } from '@aws-sdk/client-ecs';

const ecs = new ECSClient({ region: process.env.AWS_REGION || 'us-west-2' });

const CLUSTER = process.env.ECS_CLUSTER_ARN || 'arn:aws:ecs:us-west-2:ACCOUNT_ID:cluster/openclaw-production';
const TASK_DEFINITION = process.env.ECS_TASK_DEFINITION || 'openclaw-agent';
const SUBNETS = (process.env.ECS_SUBNETS || 'subnet-REPLACE_ME_1,subnet-REPLACE_ME_2').split(',');
const SECURITY_GROUP = process.env.ECS_SECURITY_GROUP || '';

export async function runOpenClawTask(envVars: Record<string, string>) {
  const command = new RunTaskCommand({
    cluster: CLUSTER,
    taskDefinition: TASK_DEFINITION,
    launchType: 'FARGATE',

    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: SUBNETS,
        securityGroups: [SECURITY_GROUP],
        assignPublicIp: 'ENABLED',
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: 'openclaw-agent',
          environment: Object.entries(envVars).map(([name, value]) => ({ name, value })),
          // Override command to: (1) inject /etc/hosts for browser sidecar,
          // (2) launch background patcher that sets allowFrom=["*"] in config
          //     (required for dmPolicy=open, runs between configure and doctor),
          // (3) exec the real entrypoint
          command: [
            'echo 127.0.0.1 browser >> /etc/hosts && ' +
            '(CFG=/data/.openclaw/openclaw.json; ' +
            'while [ ! -f "$CFG" ]; do sleep 0.1; done; ' +
            'python3 -c "' +
            'import json, sys; ' +
            "f=sys.argv[1]; c=json.load(open(f)); " +
            "t=c.get(\\\"channels\\\",{}).get(\\\"telegram\\\"); " +
            "t and t.__setitem__(\\\"allowFrom\\\",[\\\"*\\\"]); " +
            'json.dump(c,open(f,\\\"w\\\"),indent=2)' +
            '" "$CFG") & ' +
            'exec /app/scripts/entrypoint.sh',
          ],
        },
      ],
    },
  });

  const result = await ecs.send(command);
  return result.tasks?.[0];
}

export async function stopOpenClawTask(taskArn: string) {
  const command = new StopTaskCommand({
    cluster: CLUSTER,
    task: taskArn,
    reason: 'Stopped by user via dashboard',
  });
  return ecs.send(command);
}

export async function describeOpenClawTask(taskArn: string) {
  const command = new DescribeTasksCommand({
    cluster: CLUSTER,
    tasks: [taskArn],
  });
  const result = await ecs.send(command);
  return result.tasks?.[0];
}

