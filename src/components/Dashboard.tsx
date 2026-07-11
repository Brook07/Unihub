import { motion } from 'motion/react';
import {
  TrendingUp,
  Clock,
  BookOpen,
  Calendar,
  ChevronRight,
  Plus,
  Compass,
  FileText,
  UserCheck,
  MessageCircle,
  AlertCircle,
  Megaphone
} from 'lucide-react';
import { UserProfile, Course, Assignment, Announcement, CalendarEvent, Chat, ViewType } from '../types';

interface DashboardProps {
  user: UserProfile;
  courses: Course[];
  assignments: Assignment[];
  announcements: Announcement[];
  events: CalendarEvent[];
  chats: Chat[];
  setView: (view: ViewType) => void;
  setSelectedChatId?: (chatId: string) => void;
  onOpenNewTaskModal: () => void;
}

export default function Dashboard({
  user,
  courses,
  assignments,
  announcements,
  events,
  chats,
  setView,
  setSelectedChatId,
  onOpenNewTaskModal
}: DashboardProps) {
  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Compute pending assignments
  const pendingAssignments = assignments.filter(a => a.status === 'todo' || a.status === 'inprogress');
  const criticalAssignments = pendingAssignments
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // Compute stats
  const completedAssignmentsCount = assignments.filter(a => a.status === 'completed' || a.status === 'submitted').length;
  const totalAssignmentsCount = assignments.length;
  const assignmentRatio = totalAssignmentsCount > 0 ? (completedAssignmentsCount / totalAssignmentsCount) * 100 : 0;

  // Filter today's classes and events (using current day / mock current day)
  const todayEvents = events.slice(0, 3); // Get first 3 as mockup of today's schedule

  // Pinned announcements
  const pinnedAnnouncements = announcements.filter(a => a.isPinned).slice(0, 2);

  // Quick chats
  const activeChats = chats.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary dark:text-white tracking-tight">
            {getGreeting()}, {user.name.split(' ')[0]}
          </h2>
          <p className="text-sm md:text-base text-text-muted dark:text-gray-400 font-sans mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={onOpenNewTaskModal}
          className="bg-brand-primary hover:bg-brand-hover text-white px-5 py-2.5 rounded-custom-md font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> New Task
        </button>
      </div>

      {/* Stats Cards Grid - Blue and White, perfectly matching user reference with high contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Assignments Due',
            value: pendingAssignments.length,
            icon: AlertCircle,
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100 dark:bg-red-950/40 border-red-200 dark:border-red-900/30',
            targetView: 'assignments' as ViewType
          },
          {
            title: 'Unread News',
            value: announcements.length,
            icon: Megaphone,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/30',
            targetView: 'announcements' as ViewType
          },
          {
            title: "Today's Classes",
            value: todayEvents.length,
            icon: BookOpen,
            iconColor: 'text-brand-primary',
            iconBg: 'bg-brand-light dark:bg-brand-primary/20 border-blue-200 dark:border-blue-900/30',
            targetView: 'calendar' as ViewType
          },
          {
            title: 'Upcoming Events',
            value: events.filter(e => e.type !== 'class').length || 1,
            icon: Calendar,
            iconColor: 'text-orange-600',
            iconBg: 'bg-orange-100 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/30',
            targetView: 'calendar' as ViewType
          }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setView(stat.targetView)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setView(stat.targetView);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${stat.title}, currently ${stat.value}`}
              className="p-4 bg-bg-surface dark:bg-[#111827] rounded-custom-lg border border-border-custom dark:border-gray-800 flex items-center gap-4 shadow-custom-card hover:border-brand-primary/40 dark:hover:border-gray-700 hover-lift active:scale-[0.98] transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            >
              <div className={`w-12 h-12 rounded-custom-md border flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-muted dark:text-gray-400 font-sans truncate">
                  {stat.title}
                </p>
                <p className="text-2xl md:text-3xl font-display font-extrabold text-text-primary dark:text-gray-100 mt-0.5">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Schedule */}
          <div className="p-6 bg-bg-surface dark:bg-[#111827] rounded-custom-lg border border-border-custom dark:border-gray-800/80 shadow-custom-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-extrabold text-lg text-text-primary dark:text-gray-100">
                Today's Schedule
              </h2>
              <button
                onClick={() => setView('calendar')}
                className="text-xs font-bold text-brand-primary dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Full Timetable
              </button>
            </div>

            {todayEvents.length === 0 ? (
              <p className="text-sm text-text-muted py-6 text-center font-medium">No classes or meetings scheduled for today.</p>
            ) : (
              <div className="space-y-3">
                {todayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center gap-4 p-4 hover:bg-bg-primary/50 dark:hover:bg-gray-800/50 rounded-custom-md transition-all border-l-4 border-l-brand-primary bg-bg-primary dark:bg-gray-800/10"
                  >
                    <div className="flex h-9 w-9 bg-brand-light dark:bg-blue-950/40 rounded-full items-center justify-center border border-blue-200 dark:border-blue-900/30 text-brand-primary dark:text-blue-400 shrink-0">
                      <BookOpen className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-extrabold text-text-primary dark:text-gray-100 truncate">
                        {evt.courseCode ? `${evt.courseCode}: ` : ''}{evt.title}
                      </h4>
                      <p className="text-xs text-text-secondary dark:text-gray-400 font-sans truncate mt-1">
                        {evt.location} • {evt.duration === '10m' ? 'Prof. Samantha Reed' : 'Prof. Alan Turing'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-text-primary dark:text-gray-200 block font-mono">
                        {evt.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Assignments */}
          <div className="p-6 bg-bg-surface dark:bg-[#111827] rounded-custom-lg border border-border-custom dark:border-gray-800/80 shadow-custom-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-extrabold text-lg text-text-primary dark:text-gray-100">
                Pending Assignments
              </h2>
            </div>

            {criticalAssignments.length === 0 ? (
              <div className="text-center py-8 bg-bg-primary dark:bg-gray-800/20 rounded-custom-md">
                <p className="text-sm text-text-muted font-medium">All caught up! No assignments due.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criticalAssignments.slice(0, 2).map((asg, index) => {
                  // Custom mock values to fit the reference visual style perfectly
                  const isFirst = index === 0;
                  const progress = isFirst ? 75 : 20;
                  const progressColor = isFirst ? 'bg-red-600' : 'bg-brand-primary';
                  const badgeText = isFirst ? 'HIGH PRIORITY' : 'NORMAL';
                  const badgeBg = isFirst ? 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400';

                  return (
                    <div
                      key={asg.id}
                      onClick={() => setView('assignments')}
                      className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg cursor-pointer hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${badgeBg}`}>
                            {badgeText}
                          </span>
                          <span className="text-xs text-text-muted dark:text-gray-400 font-medium">
                            Due: {new Date(asg.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-text-primary dark:text-gray-100 line-clamp-1 leading-snug">
                            {asg.title}
                          </h4>
                          <p className="text-xs text-text-muted mt-1">
                            {asg.courseCode === 'CS-401' ? 'Artificial Intelligence (CS401)' : 'Systems Programming (CS305)'}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full ${progressColor}`} style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-text-muted">
                          <span>{progress}% Complete</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Column - Sidebar in Dashboard */}
        <div className="space-y-6">

          {/* Solid Blue Quick Actions Card - Exactly matching screenshot */}
          <div className="p-6 bg-brand-primary dark:bg-[#003ca0] text-white rounded-custom-lg shadow-custom-card space-y-5">
            <h2 className="font-display font-extrabold text-lg text-white">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'Upload File', icon: FileText, action: onOpenNewTaskModal },
                { title: 'Ask Question', icon: MessageCircle, action: () => setView('messages') },
                { title: 'New Group', icon: Plus, action: () => setView('groups') },
                { title: 'Timetable', icon: Calendar, action: () => setView('calendar') }
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.title}
                    onClick={act.action}
                    className="p-3.5 bg-transparent border border-white/20 hover:border-white/40 rounded-custom-md text-center hover:bg-white/5 active:scale-95 cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <Icon className="h-5 w-5 text-white/90" />
                    <span className="text-[11px] font-bold text-white tracking-tight">
                      {act.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Announcements Card */}
          <div className="p-6 bg-bg-surface dark:bg-[#111827] rounded-custom-lg border border-border-custom dark:border-gray-800/80 shadow-custom-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-extrabold text-lg text-text-primary dark:text-gray-100">
                Announcements
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Mid-term schedule update',
                  desc: 'Dr. Reed: "Please note the Mid-term has been shifted..."',
                  time: '2h ago',
                  iconBg: 'bg-blue-100 dark:bg-blue-950/40 text-brand-primary dark:text-blue-400'
                },
                {
                  title: 'Server Maintenance',
                  desc: 'The student portal will be offline from 12AM-4AM tonight.',
                  time: '5h ago',
                  iconBg: 'bg-blue-100 dark:bg-blue-950/40 text-brand-primary dark:text-blue-400'
                }
              ].map((ann, idx) => (
                <div
                  key={idx}
                  onClick={() => setView('announcements')}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${ann.iconBg}`}>
                    <Megaphone className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-text-primary dark:text-gray-100 truncate group-hover:text-brand-primary transition-colors">
                      {ann.title}
                    </h4>
                    <p className="text-[10px] text-text-secondary dark:text-gray-400 font-sans line-clamp-1 mt-0.5 leading-normal">
                      {ann.desc}
                    </p>
                    <span className="text-[9px] text-text-muted font-sans mt-1 block">
                      {ann.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages Card */}
          <div className="p-6 bg-bg-surface dark:bg-[#111827] rounded-custom-lg border border-border-custom dark:border-gray-800/80 shadow-custom-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-extrabold text-lg text-text-primary dark:text-gray-100">
                Recent Messages
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: 'Sarah Jenkins',
                  snippet: 'Did you finish the assi...',
                  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
                  unread: true
                },
                {
                  name: 'Marco V.',
                  snippet: 'Join the study group meet...',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
                  unread: false
                }
              ].map((msg, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (setSelectedChatId) setSelectedChatId('chat-1');
                    setView('messages');
                  }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={msg.avatar}
                    alt={msg.name}
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-full object-cover border border-border-custom"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-text-primary dark:text-gray-100 truncate group-hover:text-brand-primary transition-colors">
                      {msg.name}
                    </h4>
                    <p className="text-[10px] text-text-secondary dark:text-gray-400 font-sans truncate mt-0.5">
                      {msg.snippet}
                    </p>
                  </div>
                  {msg.unread && (
                    <span className="h-2 w-2 rounded-full bg-brand-primary shrink-0"></span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
