'use client';

import { Provider } from 'react-redux';
import { NotificationProvider } from '@/shared/contexts/NotificationContext';
import { store } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NotificationProvider>{children}</NotificationProvider>
    </Provider>
  );
}
