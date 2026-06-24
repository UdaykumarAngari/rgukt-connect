import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import { Search, ChevronLeft, Send, Image as ImageIcon, Paperclip, Smile, MoreHorizontal, Edit, Star } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Messages = ({ session, onLogout }) => {
  const navigate = useNavigate();
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

  // Fetch current user's profile photo
  useEffect(() => {
    const fetchMyPhoto = async () => {
      try {
        const res = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${session.token}` }
        });
        setMyProfilePhoto(res.data.profilePhoto);
      } catch (err) {
        console.error("Failed to fetch my profile photo:", err);
      }
    };
    fetchMyPhoto();
  }, [session]);
  const [messagesList, setMessagesList] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedChatRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Sync selected chat ref to prevent stale closures in WebSocket event handlers
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // Fetch active connections
  const fetchConnections = async () => {
    try {
      setLoadingConnections(true);
      const res = await axios.get(`/api/connections/list/${session.id}`, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      // Add client-side visual state placeholders
      const formattedConnections = res.data.map(conn => ({
        ...conn,
        avatar: conn.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        role: 'Verified RGUKT Member',
        lastMessage: 'Select this chat to see messages',
        time: ''
      }));
      setConnections(formattedConnections);
      
      // Auto-select first connection if available and not selected
      if (formattedConnections.length > 0 && !selectedChat) {
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
    try {
      const res = await axios.get('/api/chat/unread-by-sender', {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setUnreadCounts(res.data);
    } catch (err) {
      console.error("Failed to load unread counts by sender:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
    fetchUnreadCountsBySender();
  }, [session]);

  // Fetch history when selection changes
  useEffect(() => {
    if (!selectedChat) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/api/chat/history/${selectedChat.id}`, {
          headers: { Authorization: `Bearer ${session.token}` }
        });
        setMessagesList(res.data);

        // After loading history (which marks thread as read on BE), refresh global unread count
        fetchUnreadCounts();

        // Clear local thread unread count
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

  // Sync active chat state with global context to suppress badges for the open thread
  useEffect(() => {
    if (selectedChat) {
      setActiveChatUserId(selectedChat.id);
    } else {
      setActiveChatUserId(null);
    }
    return () => setActiveChatUserId(null);
  }, [selectedChat]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messagesList]);

  // Register global message listener
  useEffect(() => {
    const handleIncomingMessage = (msg) => {
      const activeChat = selectedChatRef.current;
      if (activeChat && (msg.sender.id === activeChat.id || msg.sender.id === session.id)) {
        setMessagesList(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      } else {
        // Increment local unread count for this sender
        setUnreadCounts(prev => ({
          ...prev,
          [msg.sender.id]: (prev[msg.sender.id] || 0) + 1
        }));
      }

      // Update sidebar last message state
      setConnections(prev => prev.map(conn => {
        if (conn.id === msg.sender.id || conn.id === msg.receiver.id) {
          const matchId = msg.sender.id === session.id ? msg.receiver.id : msg.sender.id;
          if (conn.id === matchId) {
            return {
              ...conn,
              lastMessage: msg.content,
              time: 'Just now'
            };
          }
        }
        return conn;
      }));
    };

    registerMessageListener(handleIncomingMessage);
    return () => unregisterMessageListener(handleIncomingMessage);
  }, [session]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    const payload = {
      senderId: session.id,
      receiverId: selectedChat.id,
      content: messageText.trim()
    };

    // Publish via global STOMP broker
    sendStompMessage('/app/chat.sendMessage', payload);

    // Create a local packet to display immediately in UI for premium latency-free UX
    const localMsg = {
      id: Date.now() + Math.random(), // Temporary unique key
      sender: { id: session.id, name: session.name },
      receiver: { id: selectedChat.id, name: selectedChat.name },
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessagesList(prev => [...prev, localMsg]);

    // Update connection list preview
    setConnections(prev => prev.map(conn => {
      if (conn.id === selectedChat.id) {
        return {
          ...conn,
          lastMessage: messageText.trim(),
          time: 'Just now'
        };
      }
      return conn;
    }));

    setMessageText("");
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-rgukt-slate flex flex-col font-sans">
      <Navbar isLanding={false} session={session} onLogout={onLogout} />

      <main className="flex-1 min-h-0 w-full max-w-[1400px] mx-auto px-4 pt-4 pb-28 flex flex-col">
        <div className="bg-white rounded-[32px] border border-slate-200 flex-1 min-h-0 flex overflow-hidden shadow-xl">
          
          {/* LEFT SIDE: Inbox List */}
          <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[380px] border-r border-slate-100 h-full min-h-0`}>
            <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-white">
              <h2 className="text-charcoal font-bold text-xl">Messaging</h2>
              <div className="flex gap-3">
                <MoreHorizontal size={20} className="text-slate-400 cursor-pointer hover:text-rgukt-maroon" />
                <Edit size={20} className="text-slate-400 cursor-pointer hover:text-rgukt-maroon" />
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search connections"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm text-charcoal outline-none focus:ring-2 focus:ring-rgukt-maroon/10 transition-all"
                />
              </div>
            </div>

            {/* Connection list */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loadingConnections ? (
                <div className="text-center py-8 text-xs font-bold text-slate-400 animate-pulse">
                  Loading chats...
                </div>
              ) : filteredConnections.length > 0 ? (
                filteredConnections.map(chat => (
                  <div 
                    key={chat.id} 
                    onClick={() => setSelectedChat(chat)}
                    className={`flex items-start gap-3 p-4 cursor-pointer transition-all border-l-4 ${
                      selectedChat?.id === chat.id 
                      ? 'bg-rgukt-maroon/5 border-l-rgukt-maroon' 
                      : 'border-l-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-14 h-14 bg-rgukt-slate rounded-full flex-shrink-0 flex items-center justify-center font-bold text-rgukt-maroon text-lg border border-slate-100 overflow-hidden">
                      {chat.profilePhoto ? (
                        <img src={chat.profilePhoto} alt={chat.name} className="w-full h-full object-cover" />
                      ) : (
                        chat.avatar
                      )}
                    </div>
                     <div className="flex-1 min-w-0 pb-2">
                       <div className="flex justify-between items-center">
                         <h4 className={`font-bold text-[15px] truncate ${selectedChat?.id === chat.id ? 'text-rgukt-maroon' : 'text-charcoal'}`}>
                           {chat.name}
                         </h4>
                         <div className="flex flex-col items-end gap-1 shrink-0">
                           <span className="text-[10px] font-medium text-slate-400 uppercase">{chat.time}</span>
                           {unreadCounts[chat.id] > 0 && selectedChat?.id !== chat.id && (
                             <span className="bg-rgukt-maroon text-white text-[9px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white shadow-sm shadow-rgukt-maroon/10">
                               {unreadCounts[chat.id]}
                             </span>
                           )}
                         </div>
                       </div>
                      <p className="text-[13px] text-slate-500 truncate leading-tight mt-1">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  No connected members found.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Chat Thread */}
          <div className={`${!selectedChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white h-full min-h-0`}>
            {selectedChat ? (
              <>
                {/* THREAD HEADER */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedChat(null)} className="md:hidden text-slate-400 mr-2">
                      <ChevronLeft size={24} />
                    </button>
                    <div 
                      onClick={() => navigate(`/profile?userId=${selectedChat.id}`)}
                      className="cursor-pointer flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 bg-rgukt-slate rounded-full flex-shrink-0 flex items-center justify-center font-bold text-rgukt-maroon text-sm border border-slate-100 overflow-hidden">
                        {selectedChat.profilePhoto ? (
                          <img src={selectedChat.profilePhoto} alt={selectedChat.name} className="w-full h-full object-cover" />
                        ) : (
                          selectedChat.avatar
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal text-[15px] group-hover:text-rgukt-maroon group-hover:underline transition-all">{selectedChat.name}</h4>
                        <p className="text-[11px] text-rgukt-maroon font-semibold">{selectedChat.role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <Star size={18} className="cursor-pointer hover:text-rgukt-gold" />
                    <MoreHorizontal size={18} className="cursor-pointer hover:text-rgukt-maroon" />
                  </div>
                </div>

                {/* MESSAGES AREA */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar min-h-0">
                  {/* Participant Identity Header */}
                  <div className="py-8 border-b border-slate-50 flex flex-col items-center">
                    <div 
                      onClick={() => navigate(`/profile?userId=${selectedChat.id}`)}
                      className="w-24 h-24 bg-rgukt-slate rounded-full flex items-center justify-center text-rgukt-maroon text-3xl font-bold mb-4 shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    >
                      {selectedChat.profilePhoto ? (
                        <img src={selectedChat.profilePhoto} alt={selectedChat.name} className="w-full h-full object-cover" />
                      ) : (
                        selectedChat.avatar
                      )}
                    </div>
                    <h3 
                      onClick={() => navigate(`/profile?userId=${selectedChat.id}`)}
                      className="text-charcoal font-bold text-2xl cursor-pointer hover:text-rgukt-maroon hover:underline transition-colors"
                    >
                      {selectedChat.name}
                    </h3>
                    <p className="text-slate-500 text-sm text-center max-w-xs mt-2 font-medium">{selectedChat.role}</p>
                  </div>

                  {/* Messages Bubble Loop */}
                  {messagesList.length > 0 ? (
                    messagesList.map(msg => {
                      const isMe = msg.sender.id === session.id;
                      const initials = isMe ? getInitials(session.name) : getInitials(selectedChat.name);
                      const displayName = isMe ? session.name : selectedChat.name;
                      const timeStr = msg.timestamp 
                        ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : 'Just now';

                      return (
                        <div key={msg.id} className="flex gap-4">
                          <div 
                            onClick={() => navigate(`/profile?userId=${msg.sender.id}`)}
                            className="w-10 h-10 bg-rgukt-slate rounded-full flex-shrink-0 flex items-center justify-center text-rgukt-maroon text-xs font-bold border border-slate-100 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                          >
                            {isMe ? (
                              myProfilePhoto ? (
                                <img src={myProfilePhoto} alt={session.name} className="w-full h-full object-cover" />
                              ) : (
                                initials
                              )
                            ) : (
                              selectedChat.profilePhoto ? (
                                <img src={selectedChat.profilePhoto} alt={selectedChat.name} className="w-full h-full object-cover" />
                              ) : (
                                initials
                              )
                            )}
                          </div>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span 
                                onClick={() => navigate(`/profile?userId=${msg.sender.id}`)}
                                className="text-charcoal font-bold text-[14px] cursor-pointer hover:text-rgukt-maroon hover:underline transition-colors"
                              >
                                {displayName}
                              </span>
                              <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">
                                {timeStr}
                              </span>
                            </div>
                            <div className="text-slate-600 text-[14px] mt-1 leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs italic">
                      No messages yet. Say hello!
                    </div>
                  )}
                  {/* No dummy div needed */}
                </div>

                {/* INPUT AREA */}
                <div className="px-6 py-4 bg-white border-t border-slate-100">
                  <form onSubmit={handleSendMessage} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden focus-within:border-rgukt-maroon/30 transition-all">
                    <textarea 
                      placeholder="Write a message..."
                      className="w-full bg-transparent border-none outline-none text-charcoal p-4 text-[14px] min-h-[80px] resize-none"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-100/50">
                      <div className="flex gap-5 text-slate-400">
                        <ImageIcon size={19} className="cursor-pointer hover:text-rgukt-maroon transition-colors" />
                        <Paperclip size={19} className="cursor-pointer hover:text-rgukt-maroon transition-colors" />
                        <span className="text-[11px] font-black cursor-pointer hover:text-rgukt-maroon transition-colors">GIF</span>
                        <Smile size={19} className="cursor-pointer hover:text-rgukt-maroon transition-colors" />
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                           type="submit"
                           disabled={!messageText.trim()}
                           className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                             messageText.trim() 
                             ? 'bg-rgukt-maroon text-white shadow-md hover:scale-105 active:scale-95' 
                             : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                           }`}
                        >
                          Send
                        </button>
                        <MoreHorizontal size={20} className="text-slate-400 cursor-pointer" />
                      </div>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Star size={40} className="opacity-20" />
                </div>
                <p className="font-medium text-slate-400">Select a connection to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <FloatingDock />
    </div>
  );
};

export default Messages;