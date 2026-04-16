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
    <div
      style={{
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        pointerEvents: 'none',
      }}
    >
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
      style={{
        background: colors.bg,
        border: `1.5px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        pointerEvents: 'auto',
      }}
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
        style={{
          minWidth: '24px',
          height: '24px',
          borderRadius: '50%',
          background: colors.border,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        {colors.icon}
      </div>

      <div
        style={{
          flex: 1,
          color: '#F5F0E8',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        {notification.message}
      </div>

      <button
        onClick={() => onRemove(notification.id)}
        style={{
          background: 'none',
          border: 'none',
          color: '#999',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '0',
          minWidth: '24px',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#C9A84C';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = '#999';
        }}
      >
        ✕
      </button>
    </div>
  );
}
