'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ServiceUnavailableSheet } from '@/shared/ui/modals/ServiceUnavailableSheet';
import { SERVICE_UNAVAILABLE_EVENT } from '@/lib/http';

type ServiceUnavailableOptions = {
  title?: string;
  message?: string;
  actionLabel?: string;
};

type ServiceUnavailableContextValue = {
  open: (options?: ServiceUnavailableOptions) => void;
};

const ServiceUnavailableContext =
  createContext<ServiceUnavailableContextValue | null>(null);

export function ServiceUnavailableProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ServiceUnavailableOptions | undefined>(
    undefined
  );

  const open = useCallback((nextOptions?: ServiceUnavailableOptions) => {
    setOptions(nextOptions);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  useEffect(() => {
    const handleOutage = () => {
      if (pathname !== '/unavailable') router.replace('/unavailable');
    };
    window.addEventListener(SERVICE_UNAVAILABLE_EVENT, handleOutage);
    return () =>
      window.removeEventListener(SERVICE_UNAVAILABLE_EVENT, handleOutage);
  }, [pathname, router]);

  return (
    <ServiceUnavailableContext.Provider value={value}>
      {children}
      <ServiceUnavailableSheet
        isOpen={isOpen}
        onClose={close}
        title={options?.title}
        message={options?.message}
        actionLabel={options?.actionLabel}
      />
    </ServiceUnavailableContext.Provider>
  );
}

export function useServiceUnavailable() {
  const ctx = useContext(ServiceUnavailableContext);

  if (!ctx) {
    throw new Error(
      'useServiceUnavailable must be used within ServiceUnavailableProvider'
    );
  }

  return ctx;
}
