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
import { Button } from '@/shared/utils/buttons';

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
        y: -20,
        duration: 0.3,
        ease: 'back.in',
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
    <div className="pointer-events-none fixed right-[20px] top-[100px] z-[9999] flex max-w-[400px] flex-col gap-3">
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
        y: -30,
        x: 50,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.5,
        ease: 'back.out',
      }
    );
  }, []);

  const getColors = () => {
    const colors: Record<
      Notification['type'],
      { bg: string; border: string; icon: string }
    > = {
      success: {
        bg: 'rgba(76, 175, 80, 0.1)',
        border: '#4CAF50',
        icon: '✓',
      },
      error: {
        bg: 'rgba(244, 67, 54, 0.1)',
        border: '#F44336',
        icon: '✗',
      },
      info: {
        bg: 'rgba(33, 150, 243, 0.1)',
        border: '#2196F3',
        icon: 'ℹ',
      },
      warning: {
        bg: 'rgba(255, 152, 0, 0.1)',
        border: '#FF9800',
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

      <div className="flex-1 text-sm leading-[1.5] text-[#F5F0E8]">
        {notification.message}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(notification.id)}
        aria-label="Dismiss notification"
        className="min-w-6 min-h-0 h-auto p-0 text-[18px] text-[#999] hover:text-[#C9A84C]"
      >
        ✕
      </Button>
    </div>
  );
}
