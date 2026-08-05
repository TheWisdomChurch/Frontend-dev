'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ApiQueryState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

export interface UseApiQueryOptions<T> {
  initialData?: T;
  enabled?: boolean;
}

export function useApiQuery<T>(
  query: (signal: AbortSignal) => Promise<T>,
  options: UseApiQueryOptions<T> = {}
): ApiQueryState<T> {
  const { initialData, enabled = true } = options;
  const [data, setData] = useState<T | null>(initialData ?? null);
  const [error, setError] = useState<Error | null>(null);
  const [isFetching, setIsFetching] = useState(enabled);
  const controllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsFetching(true);
    setError(null);

    try {
      const result = await query(controller.signal);
      if (!controller.signal.aborted && mountedRef.current) setData(result);
    } catch (cause) {
      if (!controller.signal.aborted && mountedRef.current) {
        setError(cause instanceof Error ? cause : new Error('Request failed'));
      }
    } finally {
      if (!controller.signal.aborted && mountedRef.current)
        setIsFetching(false);
    }
  }, [query]);

  useEffect(() => {
    mountedRef.current = true;
    let active = true;
    if (enabled) {
      queueMicrotask(() => {
        if (active) void execute();
      });
    }
    return () => {
      active = false;
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, [enabled, execute]);

  return {
    data,
    error,
    isLoading: data === null && isFetching,
    isFetching,
    refetch: execute,
  };
}
