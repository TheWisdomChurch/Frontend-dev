'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import React from 'react';
import gsap from 'gsap';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: number;
}

const NotificationContext = createContext<{
  addNotification: (
    type: Notification['type'],
    title: string,
    message: string
  ) => void;
} | null>(null);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error('useNotification must be used within NotificationProvider');
  return context;
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    type: Notification['type'],
    title: string,
    message: string
  ) => {
    const id = `notif-${Date.now()}`;
    const newNotif: Notification = {
      id,
      type,
      title,
      message,
      timestamp: Date.now(),
    };

    setNotifications(prev => [newNotif, ...prev]);

    setTimeout(() => {
      gsap.to(`[data-notif-id="${id}"]`, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        onComplete: () => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        },
      });
    }, 4000);
  };

  const removeNotification = (id: string) => {
    gsap.to(`[data-notif-id="${id}"]`, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      },
    });
  };

  const getColorScheme = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return { bg: '#10b98120', border: '#10b981', icon: '✓' };
      case 'error':
        return { bg: '#ef444420', border: '#ef4444', icon: '✕' };
      case 'warning':
        return { bg: '#f5941620', border: '#f59416', icon: '!' };
      case 'info':
        return { bg: '#3b82f620', border: '#3b82f6', icon: 'i' };
    }
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
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
        }}
      >
        {notifications.map(notif => {
          const scheme = getColorScheme(notif.type);
          return (
            <div
              key={notif.id}
              data-notif-id={notif.id}
              style={{
                background: scheme.bg,
                border: `1px solid ${scheme.border}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                animation: 'slideIn 0.3s ease-out',
              }}
            >
              <div
                style={{
                  minWidth: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: scheme.border,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {scheme.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: '600',
                    color: 'var(--text)',
                    marginBottom: '4px',
                  }}
                >
                  {notif.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {notif.message}
                </div>
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontSize: '16px',
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}
