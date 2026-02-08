import { SSMClient, PutParameterCommand, GetParameterCommand, DeleteParameterCommand } from '@aws-sdk/client-ssm';

const ssm = new SSMClient({ region: process.env.AWS_REGION || 'us-west-2' });

export async function putSecret(path: string, value: string) {
  const command = new PutParameterCommand({
    Name: path,
    Value: value,
    Type: 'SecureString',
    Overwrite: true,
  });
  return ssm.send(command);
}

export async function getSecret(path: string): Promise<string | undefined> {
  try {
    const command = new GetParameterCommand({
      Name: path,
      WithDecryption: true,
    });
    const result = await ssm.send(command);
    return result.Parameter?.Value;
  } catch {
    return undefined;
  }
}

export async function deleteSecret(path: string) {
  try {
    const command = new DeleteParameterCommand({ Name: path });
    return ssm.send(command);
  } catch {
    // Parameter may not exist
  }
}
