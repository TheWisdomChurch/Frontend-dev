/**
 * Modal Form Hook
 * Provides safe form submission handling for modals
 * Prevents page refresh and handles submission state
 */

'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import type { FieldValues, UseFormHandleSubmit } from 'react-hook-form';

export interface ModalFormConfig {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  preventPageRefresh?: boolean;
  debounceMs?: number;
}

/**
 * Hook for managing form submissions in modals safely
 */
export function useModalForm<T extends FieldValues>(
  config: ModalFormConfig = {}
) {
  const {
    onSuccess,
    onError,
    preventPageRefresh = true,
    debounceMs = 300,
  } = config;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSubmitTimeRef = useRef<number>(0);

  const createSubmitHandler = useCallback(
    (handler: (data: T) => Promise<void> | void) => {
      return async (data: T) => {
        const now = Date.now();

        if (now - lastSubmitTimeRef.current < debounceMs) {
          return;
        }

        lastSubmitTimeRef.current = now;
        setIsSubmitting(true);
        setError(null);

        try {
          await handler(data);

          if (preventPageRefresh && typeof window !== 'undefined') {
            window.history.replaceState(
              window.history.state,
              document.title,
              window.location.pathname +
                window.location.search +
                window.location.hash
            );
          }

          onSuccess?.();
        } catch (err) {
          const nextError =
            err instanceof Error ? err : new Error('Unknown error');
          setError(nextError);
          onError?.(nextError);
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [preventPageRefresh, debounceMs, onSuccess, onError]
  );

  const handleSubmit = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement>,
      handler: (data: T) => Promise<void> | void
    ) => {
      e.preventDefault();
      e.stopPropagation();

      if (isSubmitting) {
        return;
      }

      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries()) as T;

      const submitHandler = createSubmitHandler(handler);
      await submitHandler(data);
    },
    [createSubmitHandler, isSubmitting]
  );

  const wrapHandleSubmit = useCallback(
    (
      handleSubmitFromHookForm: UseFormHandleSubmit<T>,
      handler: (data: T) => Promise<void> | void
    ) => {
      return (e?: React.BaseSyntheticEvent) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();

        if (isSubmitting) {
          return;
        }

        const wrappedHandler = createSubmitHandler(handler);
        return handleSubmitFromHookForm(wrappedHandler)(e);
      };
    },
    [createSubmitHandler, isSubmitting]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setError(null);

    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  return {
    isSubmitting,
    error,
    handleSubmit,
    wrapHandleSubmit,
    createSubmitHandler,
    clearError,
    reset,
  };
}

/**
 * HOC to wrap form elements with modal form safety
 */
export function withModalFormSafety<
  P extends { onSubmit?: (data: unknown) => Promise<void> | void },
>(Component: React.ComponentType<P>) {
  return function ModalSafeForm(props: P) {
    return (
      <Component
        {...props}
        onSubmit={async (data: unknown) => {
          await props.onSubmit?.(data);
        }}
      />
    );
  };
}
