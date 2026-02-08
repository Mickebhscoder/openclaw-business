'use client';

import { useEffect } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!;

let initialized = false;

export function AmplitudeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (initialized || !API_KEY) return;
    initialized = true;

    const sessionReplay = sessionReplayPlugin({ sampleRate: 1 });
    amplitude.add(sessionReplay);
    amplitude.init(API_KEY, {
      autocapture: true,
    });
  }, []);

  return <>{children}</>;
}
