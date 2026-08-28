'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';
import gsap from 'gsap';
import { Button } from '@/shared/ui/button';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface NotificationContextType {
  notify: (
    message: string,
    type?: Notification['type'],
    duration?: number
  ) => void;
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const removeNotification = useCallback((id: string) => {
    const element = document.getElementById(`notification-${id}`);

    if (element) {
      gsap.to(element, {
        opacity: 0,
        x: 64,
        scale: 0.9,
        duration: 0.34,
        ease: 'power2.in',
        onComplete: () => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        },
      });
    } else {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }

    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
  }, []);

  const notify = useCallback(
    (message: string, type: Notification['type'] = 'info', duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const notification: Notification = { id, message, type, duration };

      setNotifications(prev => [...prev, notification]);

      if (duration > 0) {
        const timeout = setTimeout(() => removeNotification(id), duration);
        timeoutsRef.current[id] = timeout;
      }
    },
    [removeNotification]
  );

  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
      timeoutsRef.current = {};
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notify, notifications, removeNotification }}
    >
      {children}
      <NotificationStack
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }

  return context;
}

function NotificationStack({
  notifications,
  removeNotification,
}: {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-[var(--page-gutter)] top-[calc(var(--app-header-height)+1rem)] z-[9999] flex flex-col gap-3 sm:left-auto sm:w-[min(25rem,calc(100vw-(2*var(--page-gutter))))]">
      {notifications.map(notif => (
        <NotificationItem
          key={notif.id}
          notification={notif}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
}

function NotificationItem({
  notification,
  onRemove,
}: {
  notification: Notification;
  onRemove: (id: string) => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemRef.current) return;

    gsap.fromTo(
      itemRef.current,
      {
        opacity: 0,
        y: -18,
        x: 64,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.5)',
      }
    );
  }, []);

  const getColors = () => {
    const colors: Record<
      Notification['type'],
      { bg: string; border: string; icon: string }
    > = {
      success: {
        bg: 'color-mix(in srgb, var(--status-success) 12%, transparent)',
        border: 'var(--status-success)',
        icon: '✓',
      },
      error: {
        bg: 'color-mix(in srgb, var(--status-error) 12%, transparent)',
        border: 'var(--status-error)',
        icon: '✗',
      },
      info: {
        bg: 'color-mix(in srgb, var(--status-info) 12%, transparent)',
        border: 'var(--status-info)',
        icon: 'ℹ',
      },
      warning: {
        bg: 'color-mix(in srgb, var(--status-warning) 12%, transparent)',
        border: 'var(--status-warning)',
        icon: '!',
      },
    };

    return colors[notification.type];
  };

  const colors = getColors();

  return (
    <div
      id={`notification-${notification.id}`}
      ref={itemRef}
      className="pointer-events-auto flex items-start gap-3 rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md"
      // eslint-disable-next-line no-restricted-syntax
      style={{ background: colors.bg, border: `1.5px solid ${colors.border}` }}
      onMouseEnter={e => {
        gsap.to(e.currentTarget, {
          x: -5,
          duration: 0.2,
        });
      }}
      onMouseLeave={e => {
        gsap.to(e.currentTarget, {
          x: 0,
          duration: 0.2,
        });
      }}
    >
      <div
        className="flex h-6 min-w-6 items-center justify-center rounded-full text-sm font-bold text-white"
        // eslint-disable-next-line no-restricted-syntax
        style={{ background: colors.border }}
      >
        {colors.icon}
      </div>

      <div className="flex-1 text-sm leading-[1.5] text-white/90">
        {notification.message}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(notification.id)}
        aria-label="Dismiss notification"
        className="min-w-6 min-h-0 h-auto p-0 text-[18px] text-white/55 hover:text-[var(--app-primary)]"
      >
        ✕
      </Button>
    </div>
  );
}
