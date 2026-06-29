import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { UserPlus, Users, Bell, CheckCircle } from 'lucide-react';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { 
    notificationsList, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useNotifications();

  if (!isOpen) return null;

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markNotificationAsRead(notif.id);
    }
    
    if (onClose) onClose();

    if (notif.type === 'CONNECTION_REQUEST') {
      navigate('/network');
    } else if (notif.type === 'CONNECTION_ACCEPTED') {
      navigate(`/profile?userId=${notif.senderId}`);
    }
  };

  const formatNotificationTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="absolute top-12 right-0 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-[24px] shadow-2xl border border-slate-100 z-[100] animate-in fade-in slide-in-from-top-5 duration-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50">
        <h3 className="font-extrabold text-charcoal text-[14px]">Notifications</h3>
        {notificationsList.some(n => !n.isRead) && (
          <button 
            onClick={markAllNotificationsAsRead}
            className="text-[11px] font-bold text-rgukt-maroon hover:underline transition-colors cursor-pointer"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[350px] overflow-y-auto custom-scrollbar flex-1">
        {notificationsList.length > 0 ? (
          notificationsList.map(notif => {
            const isRequest = notif.type === 'CONNECTION_REQUEST';
            const initials = notif.senderName
              ? notif.senderName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
              : 'U';

            return (
              <div 
                key={notif.id} 
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 flex gap-3 hover:bg-slate-50/80 cursor-pointer transition-all border-b border-slate-50 last:border-none relative items-center ${
                  !notif.isRead ? 'bg-rgukt-maroon/[0.02]' : ''
                }`}
              >
              
                <div className="relative shrink-0">
                  <div className="w-10 h-10 bg-rgukt-slate rounded-full flex items-center justify-center font-bold text-rgukt-maroon text-xs border border-slate-100 overflow-hidden">
                    {notif.senderPhoto ? (
                      <img src={notif.senderPhoto} alt={notif.senderName} className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                 
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-white ${
                    isRequest ? 'bg-blue-500' : 'bg-emerald-500'
                  }`}>
                    {isRequest ? <UserPlus size={10} /> : <Users size={10} />}
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <p className={`text-xs leading-snug ${!notif.isRead ? 'font-bold text-charcoal' : 'text-slate-500'}`}>
                    <span className="font-extrabold text-charcoal">{notif.senderName}</span>
                    {isRequest ? ' sent you a connection request.' : ' accepted your connection request.'}
                  </p>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase mt-1 block">
                    {formatNotificationTime(notif.createdAt)}
                  </span>
                </div>

                {!notif.isRead && (
                  <span className="absolute right-4 w-2 h-2 bg-rgukt-maroon rounded-full"></span>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 px-4 flex flex-col items-center justify-center text-slate-400/80">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <CheckCircle size={24} className="text-slate-300" />
            </div>
            <p className="text-xs font-bold">You're all caught up!</p>
            <p className="text-[10px] text-slate-400 mt-1">No new notifications here.</p>
          </div>
        )}
      </div>

      <div className="p-2.5 bg-slate-50/50 border-t border-slate-100 text-center rounded-b-[24px]">
        <button 
          onClick={() => {
            if (onClose) onClose();
            navigate('/network');
          }}
          className="text-[11px] font-bold text-slate-500 hover:text-rgukt-maroon transition-colors cursor-pointer"
        >
          Manage Connection Requests
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;