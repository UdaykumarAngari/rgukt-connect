import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import { Search, ChevronLeft, Send, Image as ImageIcon, Paperclip, Smile, MoreHorizontal, Edit, Star } from 'lucide-react';
import { mockChats } from '../data/messages';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [messageText, setMessageText] = useState("");

  return (
    <div className="min-h-screen bg-rgukt-slate flex flex-col font-sans">
      <Navbar isLanding={false} />

      <main className="flex-1 max-w-[1200px] mx-auto w-full pt-4 pb-40 px-4">

        <div className="bg-white rounded-[32px] border border-slate-200 h-[80vh] flex overflow-hidden shadow-xl">
          
          {/* LEFT SIDE: Inbox List */}
          <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[380px] border-r border-slate-100`}>
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
                  placeholder="Search messages"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm text-charcoal outline-none focus:ring-2 focus:ring-rgukt-maroon/10 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {mockChats.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-start gap-3 p-4 cursor-pointer transition-all border-l-4 ${
                    selectedChat?.id === chat.id 
                    ? 'bg-rgukt-maroon/5 border-l-rgukt-maroon' 
                    : 'border-l-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="w-14 h-14 bg-rgukt-slate rounded-full flex-shrink-0 flex items-center justify-center font-bold text-rgukt-maroon text-lg border border-slate-100">
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex justify-between items-center">
                      <h4 className={`font-bold text-[15px] truncate ${selectedChat?.id === chat.id ? 'text-rgukt-maroon' : 'text-charcoal'}`}>
                        {chat.name}
                      </h4>
                      <span className="text-[10px] font-medium text-slate-400 uppercase">{chat.time}</span>
                    </div>
                    <p className="text-[13px] text-slate-500 truncate leading-tight mt-1">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Chat Thread */}
          <div className={`${!selectedChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white`}>
            {selectedChat ? (
              <>
                {/* THREAD HEADER */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedChat(null)} className="md:hidden text-slate-400 mr-2">
                      <ChevronLeft size={24} />
                    </button>
                    <div>
                      <h4 className="font-bold text-charcoal text-[15px]">{selectedChat.name}</h4>
                      <p className="text-[11px] text-rgukt-maroon font-semibold">{selectedChat.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <Star size={18} className="cursor-pointer hover:text-rgukt-gold" />
                    <MoreHorizontal size={18} className="cursor-pointer hover:text-rgukt-maroon" />
                  </div>
                </div>

                {/* MESSAGES AREA */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
                  {/* Participant Identity Header */}
                  <div className="py-8 border-b border-slate-50 flex flex-col items-center">
                    <div className="w-24 h-24 bg-rgukt-slate rounded-full flex items-center justify-center text-rgukt-maroon text-3xl font-bold mb-4 shadow-sm border border-slate-100">
                        {selectedChat.avatar}
                    </div>
                    <h3 className="text-charcoal font-bold text-2xl">{selectedChat.name}</h3>
                    <p className="text-slate-500 text-sm text-center max-w-xs mt-2 font-medium">{selectedChat.role}</p>
                    <button className="mt-4 text-rgukt-maroon font-bold text-sm hover:underline">View Profile</button>
                  </div>

                  {/* Message Bubble Example */}
                  {/* Message Bubble Example */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-rgukt-slate rounded-full flex-shrink-0 flex items-center justify-center text-rgukt-maroon text-xs font-bold border border-slate-100">
                            {selectedChat.avatar}
                        </div>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-charcoal font-bold text-[14px] hover:text-rgukt-maroon cursor-pointer transition-colors">
                                    {selectedChat.name}
                                </span>
                                {/* FIXED: Changed chat.time to selectedChat.time */}
                                <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">
                                    {selectedChat.time} 
                                </span>
                            </div>
                            <div className="text-slate-600 text-[14px] mt-1 leading-relaxed">
                                {selectedChat.lastMessage}
                            </div>
                        </div>
                    </div>
                 </div>
                {/* INPUT AREA: REPLICATING LINKEDIN STRUCTURE WITH RGUKT COLORS */}
                <div className="px-6 py-4 bg-white border-t border-slate-100">
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden focus-within:border-rgukt-maroon/30 transition-all">
                    <textarea 
                      placeholder="Write a message..."
                      className="w-full bg-transparent border-none outline-none text-charcoal p-4 text-[14px] min-h-[80px] resize-none"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
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
                           disabled={!messageText.trim()}
                           className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${
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
                  </div>
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

      <FloatingDock onPlusClick={() => {}} />
    </div>
  );
};

export default Messages;