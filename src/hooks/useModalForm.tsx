/**
 * Modal Form Hook
 * Provides safe form submission handling for modals
 * Prevents page refresh and handles submission state
 */

'use client';

import { useCallback, useState, useRef } from 'react';
import {
  FieldValues,
  UseFormHandleSubmit,
} from 'react-hook-form';

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
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSubmitTimeRef = useRef<number>(0);

  /**
   * Create a safe submit handler that prevents page refresh
   */
  const createSubmitHandler = useCallback(
    (handler: (data: T) => Promise<void> | void) => {
      return async (data: T) => {
        // Prevent double submissions
        const now = Date.now();
        if (now - lastSubmitTimeRef.current < debounceMs) {
          return;
        }
        lastSubmitTimeRef.current = now;

        setIsSubmitting(true);
        setError(null);

        try {
          // Call the actual handler
          await handler(data);

          // Don't navigate or refresh
          if (preventPageRefresh) {
            // Clear any pending navigation
            window.history.pushState(
              {},
              document.title,
              window.location.pathname
            );
          }

          onSuccess?.();
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Unknown error');
          setError(error);
          onError?.(error);
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [preventPageRefresh, debounceMs, onSuccess, onError]
  );

  /**
   * Handle form submission with prevent default
   */
  const handleSubmit = useCallback(
    (
      e: React.FormEvent<HTMLFormElement>,
      handler: (data: T) => Promise<void> | void
    ) => {
      e.preventDefault();
      e.stopPropagation();

      // Don't propagate to parent forms
      if (isSubmitting) {
        return;
      }

      // Get form data
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData) as T;

      const submitHandler = createSubmitHandler(handler);
      submitHandler(data);
    },
    [createSubmitHandler, isSubmitting]
  );

  /**
   * Wrap react-hook-form's handleSubmit
   */
  const wrapHandleSubmit = useCallback(
    (
      handleSubmitFromHookForm: UseFormHandleSubmit<T, undefined>,
      handler: (data: T) => Promise<void> | void
    ) => {
      return (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (isSubmitting) {
          return;
        }

        const wrappedHandler = createSubmitHandler(handler);
        handleSubmitFromHookForm(wrappedHandler)(e);
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
    }
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
  P extends { onSubmit?: (data: any) => Promise<void> | void },
>(Component: React.ComponentType<P>) {
  return function ModalSafeForm(props: P) {
    return (
      <Component
        {...props}
        onSubmit={data => {
          props.onSubmit?.(data);
        }}
      />
    );
  };
}
