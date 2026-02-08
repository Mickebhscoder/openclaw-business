import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InstanceStatusBadge } from './instance-status-badge';
import type { OpenClawInstance } from '@/types/instance';

const MODEL_NAMES: Record<string, string> = {
  'claude-sonnet-4-5-20250929': 'Claude Sonnet 4.5',
  'claude-haiku-4-5-20251001': 'Claude Haiku 4.5',
  'claude-opus-4-6': 'Claude Opus 4.6',
};

function getModelName(model: string): string {
  return MODEL_NAMES[model] || model;
}

export function InstanceCard({ instance }: { instance: OpenClawInstance }) {
  return (
    <Link href={`/dashboard/instances/${instance.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{instance.name}</CardTitle>
          <InstanceStatusBadge status={instance.status} />
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{getModelName(instance.model)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Created {new Date(instance.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
