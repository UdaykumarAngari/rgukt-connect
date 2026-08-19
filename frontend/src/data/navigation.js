import { Home, Users, Briefcase, MessageSquare } from 'lucide-react';

export const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: Home,
  },
  {
    id: 'network',
    label: 'Network',
    path: '/network',
    icon: Users,
  },
  {
    id: 'jobs',
    label: 'Jobs',
    path: '/jobs',
    icon: Briefcase,
  },
  {
    id: 'messages',
    label: 'Messages',
    path: '/messages',
    icon: MessageSquare,
    badgeKey: 'unreadMessages',
  },
];
