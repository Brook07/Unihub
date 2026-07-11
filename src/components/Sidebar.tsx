import React, { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  KanbanSquare,
  Megaphone,
  Calendar,
  FolderClosed,
  MessageSquare,
  Users2,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ViewType, UserProfile } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  user: UserProfile;
  unreadCount: number;
  onLogout: () => void;
}

export default function Sidebar({ currentView, setView, user, unreadCount, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { view: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { view: 'courses' as ViewType, label: 'My Courses', icon: GraduationCap },
    { view: 'assignments' as ViewType, label: 'Assignment Board', icon: KanbanSquare },
    { view: 'announcements' as ViewType, label: 'Announcements', icon: Megaphone },
    { view: 'calendar' as ViewType, label: 'Academic Calendar', icon: Calendar },
    { view: 'resources' as ViewType, label: 'Resource Library', icon: FolderClosed },
    { view: 'messages' as ViewType, label: 'Messages', icon: MessageSquare, badge: unreadCount },
    { view: 'groups' as ViewType, label: 'Study Groups', icon: Users2 },
    { view: 'profile' as ViewType, label: 'My Profile', icon: User },
    { view: 'settings' as ViewType, label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`relative h-screen bg-bg-sidebar border-r border-border-custom dark:border-gray-800 transition-all duration-300 flex flex-col justify-between z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header / Brand */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-divider-custom dark:border-gray-800/50">
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-3 font-display font-bold text-xl tracking-tight text-brand-primary dark:text-blue-400 cursor-pointer"
          >
            <div className="h-9 w-9 bg-brand-light dark:bg-blue-950/50 rounded-custom-md flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30">
              <BookOpen className="h-5 w-5 text-brand-primary dark:text-blue-400" />
            </div>
            {!isCollapsed && <span className="animate-fade-in font-display">UniHub</span>}
          </button>

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-custom-sm hover:bg-gray-50 dark:hover:bg-gray-800 border border-border-custom dark:border-gray-800 text-text-muted hover:text-text-primary dark:hover:text-gray-300 cursor-pointer transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.view;

            return (
              <button
                key={item.view}
                id={`sidebar-nav-${item.view}`}
                onClick={() => setView(item.view)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-custom-md text-sm font-medium transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-brand-light dark:bg-blue-950/40 text-brand-primary dark:text-blue-400'
                    : 'text-text-secondary dark:text-gray-400 hover:bg-bg-primary dark:hover:bg-gray-800/50 hover:text-text-primary dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent
                    className={`h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? 'text-brand-primary dark:text-blue-400' : 'text-text-muted dark:text-gray-500'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && item.badge > 0 ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1.5 text-[10px] font-bold text-white leading-none">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Bio */}
      <div className="p-3 border-t border-divider-custom dark:border-gray-800/50 bg-bg-primary dark:bg-gray-900/20">
        <div className="flex items-center justify-between gap-2 overflow-hidden">
          <button
            onClick={() => setView('profile')}
            className="flex items-center gap-3 text-left group overflow-hidden cursor-pointer w-full"
          >
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-custom-md object-cover border border-border-custom dark:border-gray-700/60 group-hover:ring-2 group-hover:ring-brand-primary/20 transition-all shrink-0"
            />
            {!isCollapsed && (
              <div className="animate-fade-in overflow-hidden">
                <p className="text-xs font-semibold text-text-primary dark:text-gray-200 truncate group-hover:text-brand-primary dark:group-hover:text-blue-400 transition-colors">
                  {user.name}
                </p>
                <p className="text-[10px] text-text-muted dark:text-gray-500 truncate">
                  {user.studentId}
                </p>
              </div>
            )}
          </button>

          {!isCollapsed && (
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 text-text-muted hover:text-semantic-danger dark:hover:text-red-400 rounded-custom-sm hover:bg-semantic-danger-bg dark:hover:bg-red-950/20 cursor-pointer transition-colors shrink-0"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
