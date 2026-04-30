import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
        {notifications.map((n) => (
          <NotificationItem 
            key={n.id} 
            notification={n} 
            onClose={() => removeNotification(n.id)} 
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function NotificationItem({ notification, onClose }) {
  const { message, type } = notification;

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  const colors = {
    success: 'border-teal-500/50 text-teal-600 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-900/20',
    error: 'border-red-500/50 text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-900/20',
    info: 'border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20',
    warning: 'border-yellow-500/50 text-yellow-600 dark:text-yellow-400 bg-yellow-50/80 dark:bg-yellow-900/20'
  };

  return (
    <div 
      className={`
        pointer-events-auto
        flex items-center gap-4 p-4 pr-12 rounded-2xl border backdrop-blur-md shadow-2xl
        animate-slide-in transition-all duration-300
        ${colors[type] || colors.success}
      `}
      style={{ minWidth: '300px' }}
    >
      <div className="text-xl">{icons[type] || icons.success}</div>
      <div className="flex-1">
        <p className="text-sm font-black uppercase tracking-widest">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
