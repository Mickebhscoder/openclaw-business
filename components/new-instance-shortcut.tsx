'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { KbdShortcut, useCmdEnter } from '@/components/kbd-shortcut';

export function NewInstanceShortcut() {
  const router = useRouter();
  const navigate = useCallback(() => router.push('/dashboard/instances/new'), [router]);

  useCmdEnter(navigate);

  return (
    <Button onClick={navigate}>
      <Plus className="mr-2 h-4 w-4" />
      New Instance <KbdShortcut />
    </Button>
  );
}
