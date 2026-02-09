'use client';

import { useEffect } from 'react';

/**
 * Visual keyboard shortcut badge for buttons.
 * Shows ⌘⏎ (Cmd+Enter) hint.
 */
export function KbdShortcut() {
  return (
    <kbd className="ml-2 text-[10px] px-1 py-0.5 rounded bg-primary-foreground/20 font-sans">
      &#8984;&#9166;
    </kbd>
  );
}

/**
 * Hook that fires a callback on Cmd+Enter (or Ctrl+Enter).
 * Only fires when `enabled` is true.
 */
export function useCmdEnter(callback: () => void, enabled = true) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && enabled) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback, enabled]);
}
