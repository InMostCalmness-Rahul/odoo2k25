import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      initializeSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  const initializeSocket = () => {
    if (socket?.connected) return;

    const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('accessToken') // Use the correct token key
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server via Socket.io');
      setIsConnected(true);
      
      // Emit user online status
      newSocket.emit('user_online');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Handle notifications
    newSocket.on('notification', (notification) => {
      console.log('New notification received:', notification);
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      showNotificationToast(notification);
    });

    // Handle user status updates
    newSocket.on('user_status_update', (data) => {
      console.log('User status update:', data);
      // You can use this to show online/offline indicators
    });

    // Handle typing indicators (for future chat feature)
    newSocket.on('user_typing', (data) => {
      console.log('User typing:', data);
    });

    newSocket.on('user_stopped_typing', (data) => {
      console.log('User stopped typing:', data);
    });

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  const showNotificationToast = (notification) => {
    const toastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (notification.type) {
      case 'new_swap_request':
        toast.info(
          <div>
            <strong>{notification.title}</strong>
            <p>{notification.message}</p>
          </div>,
          toastOptions
        );
        break;
      
      case 'swap_update':
        const isPositive = notification.data.status === 'accepted' || notification.data.status === 'completed';
        if (isPositive) {
          toast.success(
            <div>
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
            </div>,
            toastOptions
          );
        } else {
          toast.warning(
            <div>
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
            </div>,
            toastOptions
          );
        }
        break;
      
      case 'new_feedback':
        toast.success(
          <div>
            <strong>{notification.title}</strong>
            <p>{notification.message}</p>
          </div>,
          toastOptions
        );
        break;
      
      default:
        toast.info(
          <div>
            <strong>{notification.title}</strong>
            <p>{notification.message}</p>
          </div>,
          toastOptions
        );
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const emitTypingStart = (recipientId) => {
    if (socket?.connected) {
      socket.emit('typing_start', { recipientId });
    }
  };

  const emitTypingStop = (recipientId) => {
    if (socket?.connected) {
      socket.emit('typing_stop', { recipientId });
    }
  };

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllAsRead,
    clearNotifications,
    emitTypingStart,
    emitTypingStop
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
