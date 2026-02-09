'use client';

import { useCallback, useMemo } from 'react';
import { useServiceUnavailable } from '@/components/contexts/ServiceUnavailableContext';

export type DormantActionOptions = {
  title?: string;
  message?: string;
  actionLabel?: string;
};

const DEFAULT_OPTIONS: Required<DormantActionOptions> = {
  title: 'Feature launching soon',
  message:
    'We are preparing this experience for production. Please check back shortly.',
  actionLabel: 'Got it',
};

type ClickEvent = { preventDefault?: () => void };

export function useDormantAction(defaultOptions?: DormantActionOptions) {
  const { open } = useServiceUnavailable();

  const baseOptions = useMemo(
    () => ({
      ...DEFAULT_OPTIONS,
      ...defaultOptions,
    }),
    [defaultOptions?.title, defaultOptions?.message, defaultOptions?.actionLabel]
  );

  return useCallback(
    (event?: ClickEvent, overrideOptions?: DormantActionOptions) => {
      event?.preventDefault?.();
      open({
        ...baseOptions,
        ...overrideOptions,
      });
    },
    [open, baseOptions]
  );
}
