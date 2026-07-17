import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ session, children }) => {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notificationsList, setNotificationsList] = useState([]);
  const [activeChatUserId, setActiveChatUserId] = useState(null);

  const stompClientRef = useRef(null);
  const messageListenersRef = useRef([]);
  const activeChatUserIdRef = useRef(null);
 
  useEffect(() => {
    activeChatUserIdRef.current = activeChatUserId;
  }, [activeChatUserId]);
 
  const registerMessageListener = (callback) => {
    messageListenersRef.current.push(callback);
  };

  const unregisterMessageListener = (callback) => {
    messageListenersRef.current = messageListenersRef.current.filter(l => l !== callback);
  };
 
  const sendStompMessage = (destination, payload) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination,
        body: JSON.stringify(payload)
      });
      return true;
    }
    return false;
  };
 
  const fetchUnreadCounts = async () => {
    if (!session) return;
    try {
      const [msgRes, notifCountRes, notifListRes] = await Promise.all([
        axios.get('/api/chat/unread-count', { headers: { Authorization: `Bearer ${session.token}` } }),
        axios.get('/api/notifications/unread-count', { headers: { Authorization: `Bearer ${session.token}` } }),
        axios.get('/api/notifications', { headers: { Authorization: `Bearer ${session.token}` } })
      ]);
      setUnreadMessages(msgRes.data.unreadCount);
      setUnreadNotifications(notifCountRes.data.unreadCount);
      setNotificationsList(notifListRes.data);
    } catch (err) {
      console.error('Failed to fetch initial notifications / unread counts:', err);
    }
  };
 
  const markNotificationAsRead = async (id) => {
    if (!session) return;
    try {
      await axios.put(`/api/notifications/read/${id}`, {}, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setUnreadNotifications(prev => Math.max(0, prev - 1));
      setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };
 
  const markAllNotificationsAsRead = async () => {
    if (!session) return;
    try {
      await axios.put('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setUnreadNotifications(0);
      setNotificationsList(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };
 
  useEffect(() => {
    if (!session) {
      setUnreadMessages(0);
      setUnreadNotifications(0);
      setNotificationsList([]);
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
      return;
    }

    fetchUnreadCounts();
 
    const apiBase = import.meta.env.VITE_API_URL || window.location.origin;
    const brokerURL = `${apiBase.replace(/^http/, 'ws')}/ws-chat/websocket`;

    const client = new Client({
      brokerURL,
      connectHeaders: {
        Authorization: `Bearer ${session.token}`
      },
      debug: (str) => {
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    const handleIncomingMessage = (msg) => {
      if (activeChatUserIdRef.current === msg.sender.id || msg.sender.id === session.id) {
      } else {
        setUnreadMessages(prev => prev + 1);
      }
      messageListenersRef.current.forEach(listener => {
        try {
          listener(msg);
        } catch (e) {
          console.error('Error in message listener callback:', e);
        }
      });
    };

    const handleIncomingNotification = (notif) => {
      setUnreadNotifications(prev => prev + 1);
      
      setNotificationsList(prev => [notif, ...prev]);
 
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-500.wav');
        audio.volume = 0.2;
        audio.play().catch(() => {});
      } catch (e) {}
    };

    client.onConnect = () => {
      console.log('[Global WS]: Connected successfully.');

      client.subscribe('/user/queue/messages', (message) => {
        try {
          handleIncomingMessage(JSON.parse(message.body));
        } catch (e) {
          console.error('Error parsing WS message:', e);
        }
      });
 
      client.subscribe('/user/queue/notifications', (message) => {
        try {
          handleIncomingNotification(JSON.parse(message.body));
        } catch (e) {
          console.error('Error parsing WS notification:', e);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('[Global WS]: Protocol error:', frame);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [session]);

  return (
    <NotificationContext.Provider value={{
      unreadMessages,
      setUnreadMessages,
      unreadNotifications,
      notificationsList,
      activeChatUserId,
      setActiveChatUserId,
      registerMessageListener,
      unregisterMessageListener,
      sendStompMessage,
      fetchUnreadCounts,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      stompClient: stompClientRef.current
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
