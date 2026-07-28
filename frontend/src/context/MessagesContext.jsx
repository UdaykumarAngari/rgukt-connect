import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNotifications } from './NotificationContext';

const MessagesContext = createContext(null);

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};

export const MessagesProvider = ({ session, onLogout, children }) => {
  const { 
    registerMessageListener, 
    unregisterMessageListener, 
    setActiveChatUserId, 
    sendStompMessage,
    fetchUnreadCounts 
  } = useNotifications();

  const [connections, setConnections] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [myProfilePhoto, setMyProfilePhoto] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedChatRef = useRef(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const fetchMyPhoto = async () => {
    if (!session?.token) return;
    try {
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setMyProfilePhoto(res.data.profilePhoto);
    } catch (err) {
      console.error('Failed to fetch my profile photo:', err);
    }
  };

  const fetchConnections = async () => {
    if (!session?.id || !session?.token) return;
    try {
      setLoadingConnections(true);
      const res = await axios.get(`/api/connections/list/${session.id}`, {
        headers: { Authorization: `Bearer ${session.token}` }
      }); 
      const formattedConnections = res.data.map(conn => ({
        ...conn,
        avatar: conn.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        role: 'Verified RGUKT Member',
        lastMessage: conn.lastMessage || 'Select this chat to see messages',
        time: conn.lastMessageTime || ''
      }));

      formattedConnections.sort((a, b) => {
        const timeA = a.time ? new Date(a.time).getTime() : 0;
        const timeB = b.time ? new Date(b.time).getTime() : 0;
        return timeB - timeA;
      });
      setConnections(formattedConnections);

      if (formattedConnections.length > 0 && !selectedChatRef.current) {
        setSelectedChat(formattedConnections[0]);
      }
    } catch (err) {
      console.error('Failed to load active connections:', err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        onLogout();
      }
    } finally {
      setLoadingConnections(false);
    }
  };

  const fetchUnreadCountsBySender = async () => {
    if (!session?.token) return;
    try {
      const res = await axios.get('/api/chat/unread-by-sender', {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setUnreadCounts(res.data);
    } catch (err) {
      console.error('Failed to load unread counts by sender:', err);
    }
  };

  useEffect(() => {
    if (session?.token) {
      fetchMyPhoto();
      fetchConnections();
      fetchUnreadCountsBySender();
    } else {
      setConnections([]);
      setSelectedChat(null);
      setUnreadCounts({});
      setMyProfilePhoto(null);
      setMessagesList([]);
    }
  }, [session]);

  useEffect(() => {
    if (!selectedChat || !session?.token) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/api/chat/history/${selectedChat.id}`, {
          headers: { Authorization: `Bearer ${session.token}` }
        });
        setMessagesList(res.data);
        fetchUnreadCounts();
        setUnreadCounts(prev => ({
          ...prev,
          [selectedChat.id]: 0
        }));
      } catch (err) {
        console.error('Failed to load chat history:', err);
        setMessagesList([]);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          onLogout();
        }
      }
    };

    fetchHistory();
  }, [selectedChat, session]);

  useEffect(() => {
    if (selectedChat) {
      setActiveChatUserId(selectedChat.id);
    } else {
      setActiveChatUserId(null);
    }
    return () => setActiveChatUserId(null);
  }, [selectedChat]);

  useEffect(() => {
    if (!session) return;

    const handleIncomingMessage = (msg) => {
      const activeChat = selectedChatRef.current;
      if (activeChat && (msg.sender.id === activeChat.id || msg.sender.id === session.id)) {
        setMessagesList(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      } else {
        setUnreadCounts(prev => ({
          ...prev,
          [msg.sender.id]: (prev[msg.sender.id] || 0) + 1
        }));
      }

      setConnections(prev => {
        let updatedConnections = prev.map(conn => {
          if (conn.id === msg.sender.id || conn.id === msg.receiver.id) {
            const matchId = msg.sender.id === session.id ? msg.receiver.id : msg.sender.id;
            if (conn.id === matchId) {
              return {
                ...conn,
                lastMessage: msg.content,
                time: msg.timestamp || new Date().toISOString()
              };
            }
          }
          return conn;
        });

        return updatedConnections.sort((a, b) => {
          const timeA = a.time ? new Date(a.time).getTime() : 0;
          const timeB = b.time ? new Date(b.time).getTime() : 0;
          return timeB - timeA;
        });
      });
    };

    registerMessageListener(handleIncomingMessage);
    return () => unregisterMessageListener(handleIncomingMessage);
  }, [session]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !selectedChat || !session) return;

    const payload = {
      senderId: session.id,
      receiverId: selectedChat.id,
      content: messageText.trim()
    };
 
    sendStompMessage('/app/chat.sendMessage', payload);

    const localMsg = {
      id: Date.now() + Math.random(), 
      sender: { id: session.id, name: session.name },
      receiver: { id: selectedChat.id, name: selectedChat.name },
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessagesList(prev => [...prev, localMsg]);

    setConnections(prev => {
      let updatedConnections = prev.map(conn => {
        if (conn.id === selectedChat.id) {
          return {
            ...conn,
            lastMessage: messageText.trim(),
            time: localMsg.timestamp
          };
        }
        return conn;
      });

      return updatedConnections.sort((a, b) => {
        const timeA = a.time ? new Date(a.time).getTime() : 0;
        const timeB = b.time ? new Date(b.time).getTime() : 0;
        return timeB - timeA;
      });
    });

    setMessageText('');
  };

  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MessagesContext.Provider
      value={{
        connections,
        setConnections,
        selectedChat,
        setSelectedChat,
        unreadCounts,
        setUnreadCounts,
        myProfilePhoto,
        messagesList,
        setMessagesList,
        messageText,
        setMessageText,
        loadingConnections,
        searchQuery,
        setSearchQuery,
        fetchConnections,
        fetchUnreadCountsBySender,
        handleSendMessage,
        filteredConnections
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
