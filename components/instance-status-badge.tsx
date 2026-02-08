import { Badge } from '@/components/ui/badge';

const statusConfig = {
  stopped: { label: 'Stopped', variant: 'secondary' as const, dot: 'bg-gray-400' },
  starting: { label: 'Starting', variant: 'outline' as const, dot: 'bg-yellow-400 animate-pulse' },
  running: { label: 'Running', variant: 'default' as const, dot: 'bg-emerald-400' },
  error: { label: 'Error', variant: 'destructive' as const, dot: 'bg-red-400' },
};

export function InstanceStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.stopped;
  return (
    <Badge variant={config.variant} className="gap-1.5">
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  );
}
