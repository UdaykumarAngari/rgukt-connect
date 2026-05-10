import React from 'react';
import { Bell, Briefcase, MessageSquare, Heart, UserPlus } from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'job', text: 'New Referral: SDE-1 at Amazon posted by Anjali.', time: '2h ago', icon: <Briefcase size={16}/>, color: 'bg-blue-500' },
  { id: 2, type: 'like', text: 'Ravi Teja and 5 others liked your code snippet.', time: '4h ago', icon: <Heart size={16}/>, color: 'bg-pink-500' },
  { id: 3, type: 'connection', text: 'A junior from ECE-B sent you a connection request.', time: '1d ago', icon: <UserPlus size={16}/>, color: 'bg-green-500' },
];

const NotificationDropdown = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-0 w-80 bg-white rounded-[24px] shadow-2xl border border-slate-100 z-[100] animate-in fade-in slide-in-from-top-5 duration-200">
      <div className="p-4 border-b border-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-charcoal">Notifications</h3>
        <button className="text-[11px] font-bold text-rgukt-maroon hover:underline">Mark all read</button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {mockNotifications.map(n => (
          <div key={n.id} className="p-4 flex gap-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-none">
            <div className={`w-8 h-8 ${n.color} text-white rounded-full flex items-center justify-center shrink-0`}>
              {n.icon}
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
              <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-slate-50 text-center rounded-b-[24px]">
        <button className="text-xs font-bold text-slate-500 hover:text-charcoal">View all notifications</button>
      </div>
    </div>
  );
};

export default NotificationDropdown;