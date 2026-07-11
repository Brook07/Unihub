import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { ViewType, UserProfile, Course, Assignment, Announcement, CalendarEvent, ResourceFolder, ResourceFile, Chat, Message, StudyGroup, AppSettings } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import Assignments from './components/Assignments';
import Announcements from './components/Announcements';
import CalendarView from './components/CalendarView';
import Resources from './components/Resources';
import Messages from './components/Messages';
import StudyGroups from './components/StudyGroups';
import Profile from './components/Profile';
import SettingsView from './components/Settings';
import Login from './components/Login';

import {
  INITIAL_USER_PROFILE,
  INITIAL_COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_RESOURCE_FOLDERS,
  INITIAL_RESOURCE_FILES,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_STUDY_GROUPS,
  INITIAL_SETTINGS
} from './data';

export default function App() {
  // Global States backed by LocalStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('unihub_authenticated') === 'true';
  });

  const [currentView, setView] = useState<ViewType>(() => {
    const savedView = localStorage.getItem('unihub_view');
    return (savedView as ViewType) || 'dashboard';
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('unihub_user');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('unihub_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('unihub_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('unihub_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('unihub_events');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  const [resourceFolders, setResourceFolders] = useState<ResourceFolder[]>(() => {
    const saved = localStorage.getItem('unihub_folders');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCE_FOLDERS;
  });

  const [resourceFiles, setResourceFiles] = useState<ResourceFile[]>(() => {
    const saved = localStorage.getItem('unihub_files');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCE_FILES;
  });

  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('unihub_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('unihub_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('unihub_groups');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_GROUPS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('unihub_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isOpenNewTaskModal, setIsOpenNewTaskModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active course focus tracking state
  const [activeCourseId, setActiveCourseIdState] = useState<string | null>(() => {
    return localStorage.getItem('unihub_active_course_id') || null;
  });

  const setActiveCourseId = (id: string | null) => {
    setActiveCourseIdState(id);
    if (id) {
      localStorage.setItem('unihub_active_course_id', id);
    } else {
      localStorage.removeItem('unihub_active_course_id');
    }
  };

  // Nav history stack supporting pristine Go Back action
  const [navHistory, setNavHistory] = useState<Array<{ view: ViewType; courseId: string | null }>>(() => {
    const saved = localStorage.getItem('unihub_nav_history');
    return saved ? JSON.parse(saved) : [{ view: currentView, courseId: activeCourseId }];
  });

  const navigate = (view: ViewType, courseId?: string | null) => {
    setView(view);
    localStorage.setItem('unihub_view', view);

    const targetCourseId = courseId !== undefined ? courseId : activeCourseId;
    if (courseId !== undefined) {
      setActiveCourseId(courseId);
    }

    setNavHistory((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.view === view && last.courseId === targetCourseId) {
        return prev;
      }
      const updated = [...prev, { view, courseId: targetCourseId }];
      localStorage.setItem('unihub_nav_history', JSON.stringify(updated));
      return updated;
    });
  };

  const navigateBack = () => {
    if (navHistory.length <= 1) {
      setView('dashboard');
      localStorage.setItem('unihub_view', 'dashboard');
      setActiveCourseId(null);
      setNavHistory([{ view: 'dashboard', courseId: null }]);
      localStorage.setItem('unihub_nav_history', JSON.stringify([{ view: 'dashboard', courseId: null }]));
      return;
    }

    const updated = [...navHistory];
    updated.pop(); // Pop current view

    const prevScreen = updated[updated.length - 1];
    setNavHistory(updated);
    localStorage.setItem('unihub_nav_history', JSON.stringify(updated));

    if (prevScreen) {
      setView(prevScreen.view);
      localStorage.setItem('unihub_view', prevScreen.view);
      setActiveCourseId(prevScreen.courseId);
    } else {
      setView('dashboard');
      localStorage.setItem('unihub_view', 'dashboard');
      setActiveCourseId(null);
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Local storage migration to ensure new subject names are propagated correctly
  useEffect(() => {
    // Check if there is stale data from an older template version
    const hasStaleCourses = courses.some(c => 
      c.code.startsWith('CS-') || 
      c.code.startsWith('MATH-') || 
      c.name.includes('Advanced ML') || 
      c.name.includes('Linear Algebra') || 
      c.name.includes('DBMS')
    );

    const hasStaleCalendar = calendarEvents.some(evt => 
      evt.courseCode?.startsWith('CS-') || 
      evt.courseCode?.startsWith('MATH-') || 
      evt.title.includes('Advanced ML') || 
      evt.title.includes('Linear Algebra') || 
      evt.title.includes('DBMS') || 
      evt.title.includes('Software Engin') || 
      evt.title.includes('Bioinformatics') || 
      evt.title.includes('AI Research')
    );

    const hasStaleAssignments = assignments.some(a => 
      a.courseCode?.startsWith('CS-') || 
      a.courseCode?.startsWith('MATH-')
    );

    const hasStaleAnnouncements = announcements.some(an => 
      an.courseCode?.startsWith('CS-') || 
      an.courseCode?.startsWith('MATH-')
    );

    if (hasStaleCourses || courses.length === 0) {
      setCourses(INITIAL_COURSES);
      localStorage.setItem('unihub_courses', JSON.stringify(INITIAL_COURSES));
    } else {
      const migratedCourses = courses.map(c => {
        if (c.code === 'COMP 302' && c.name !== 'System Analysis and Design') {
          return { ...c, name: 'System Analysis and Design', description: 'System development life cycle, requirements determination, data modeling (ERD), process modeling (DFD), object-oriented analysis with UML, and system implementation strategies.' };
        }
        if (c.code === 'COMP 314' && c.name !== 'Algorithms and Complexity') {
          return { ...c, name: 'Algorithms and Complexity', description: 'Analysis of algorithms, divide-and-conquer, greedy method, dynamic programming, backtracking, branch-and-bound, NP-completeness, and approximation algorithms.' };
        }
        if (c.code === 'COMP 343' && c.name !== 'Information System Ethics') {
          return { ...c, name: 'Information System Ethics', description: 'Ethical analysis frameworks, privacy, intellectual property, cybercrime, reliability, professional responsibility, and the social impact of information technology.' };
        }
        return c;
      });
      if (JSON.stringify(migratedCourses) !== JSON.stringify(courses)) {
        setCourses(migratedCourses);
      }
    }

    if (hasStaleCalendar || calendarEvents.length === 0) {
      setCalendarEvents(INITIAL_CALENDAR_EVENTS);
      localStorage.setItem('unihub_events', JSON.stringify(INITIAL_CALENDAR_EVENTS));
    } else {
      const migratedCalendar = calendarEvents.map(evt => {
        if (evt.courseCode === 'COMP 302' && !evt.title.includes('System Analysis and Design')) {
          return { ...evt, title: 'COMP 302: System Analysis and Design' };
        }
        if (evt.courseCode === 'COMP 314' && !evt.title.includes('Algorithms and Complexity')) {
          return { ...evt, title: 'COMP 314: Algorithms and Complexity' };
        }
        if (evt.courseCode === 'COMP 343' && !evt.title.includes('Information System Ethics')) {
          return { ...evt, title: 'COMP 343: Information System Ethics' };
        }
        if (evt.courseCode === 'COMP 409' && evt.title.includes('Compiler Design Class')) {
          return { ...evt, title: 'COMP 409: Compiler Design' };
        }
        if (evt.courseCode === 'COMP 323' && evt.title.includes('Graph Theory Class')) {
          return { ...evt, title: 'COMP 323: Graph Theory' };
        }
        return evt;
      });
      if (JSON.stringify(migratedCalendar) !== JSON.stringify(calendarEvents)) {
        setCalendarEvents(migratedCalendar);
      }
    }

    if (hasStaleAssignments || assignments.length === 0) {
      setAssignments(INITIAL_ASSIGNMENTS);
      localStorage.setItem('unihub_assignments', JSON.stringify(INITIAL_ASSIGNMENTS));
    } else {
      const migratedAssignments = assignments.map(a => {
        if (a.courseCode === 'COMP 302' && (a.title.includes('Presentation - System Requirements Specification') || a.title.includes('Multi-threaded Web Server Implementation'))) {
          return {
            ...a,
            title: 'COMP 302 Assignment 1 - System Requirements Specification Design',
            description: 'Create a comprehensive System Requirements Specification (SRS) document for a university management system, detailing DFDs, ERDs, and use cases.'
          };
        }
        return a;
      });
      if (JSON.stringify(migratedAssignments) !== JSON.stringify(assignments)) {
        setAssignments(migratedAssignments);
      }
    }

    if (hasStaleAnnouncements || announcements.length === 0) {
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      localStorage.setItem('unihub_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
    } else {
      const migratedAnnouncements = announcements.map(an => {
        if (an.courseCode === 'COMP 302' && (an.title.includes('Presentation schedule updated') || an.title.includes('Lab Schedule Updated'))) {
          return {
            ...an,
            title: 'COMP 302 Presentation Schedule Finalized',
            content: 'The System Analysis and Design (COMP 302) presentation schedule for the SRS milestone is now live. Please review your team slot.'
          };
        }
        return an;
      });
      if (JSON.stringify(migratedAnnouncements) !== JSON.stringify(announcements)) {
        setAnnouncements(migratedAnnouncements);
      }
    }
  }, []);

  // Synchronizers to LocalStorage
  useEffect(() => {
    localStorage.setItem('unihub_authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('unihub_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('unihub_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('unihub_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('unihub_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('unihub_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('unihub_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('unihub_folders', JSON.stringify(resourceFolders));
  }, [resourceFolders]);

  useEffect(() => {
    localStorage.setItem('unihub_files', JSON.stringify(resourceFiles));
  }, [resourceFiles]);

  useEffect(() => {
    localStorage.setItem('unihub_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('unihub_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('unihub_groups', JSON.stringify(studyGroups));
  }, [studyGroups]);

  useEffect(() => {
    localStorage.setItem('unihub_settings', JSON.stringify(settings));
  }, [settings]);

  // Synchronize Dark theme class on load
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // View Routing Handlers
  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
    setView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('login');
    localStorage.removeItem('unihub_authenticated');
  };

  // State Modification Operations (Write real integrations)
  const handleEnrollInCourse = (newCourse: Course) => {
    // Add to courses list
    const enrolledCourse: Course = {
      ...newCourse,
      progress: 0,
      grade: 'N/A',
      announcementsCount: 0,
      assignmentsCount: 0
    };
    setCourses([...courses, enrolledCourse]);
    setToastMessage(`Enrolled successfully in ${newCourse.code}: ${newCourse.name}!`);
  };

  const handleAddAssignment = (newAsg: Assignment) => {
    setAssignments([newAsg, ...assignments]);
    // Also inject into calendar events automatically! High fidelity sync
    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: `DUE: ${newAsg.title}`,
      date: newAsg.dueDate,
      time: '11:59 PM',
      duration: '10m',
      location: 'Online Submission Portal',
      courseCode: newAsg.courseCode,
      color: 'indigo',
      type: 'assignment'
    };
    setCalendarEvents([newEvt, ...calendarEvents]);
  };

  const handleUpdateAssignmentStatus = (id: string, newStatus: any) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const handleAddAnnouncement = (newAnn: Announcement) => {
    setAnnouncements([newAnn, ...announcements]);
  };

  const handleAddCalendarEvent = (newEvt: CalendarEvent) => {
    setCalendarEvents([newEvt, ...calendarEvents]);
  };

  const handleAddResourceFile = (newFile: ResourceFile) => {
    setResourceFiles([newFile, ...resourceFiles]);
    // Also update count in folders
    setResourceFolders(resourceFolders.map(f => f.id === newFile.folderId ? { ...f, filesCount: f.filesCount + 1 } : f));
  };

  const handleDeleteResourceFile = (id: string) => {
    const file = resourceFiles.find(f => f.id === id);
    if (file) {
      setResourceFiles(resourceFiles.filter(f => f.id !== id));
      setResourceFolders(resourceFolders.map(f => f.id === file.folderId ? { ...f, filesCount: Math.max(0, f.filesCount - 1) } : f));
    }
  };

  const handleSendMessage = (chatId: string, text: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId: 'alex-rivera',
      senderName: userProfile.name,
      senderAvatar: userProfile.avatar,
      senderRole: 'student',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      read: true
    };

    setMessages([...messages, newMsg]);

    // Update last message in Chat List
    setChats(chats.map(c => c.id === chatId ? { ...c, lastMessage: text, lastMessageTime: newMsg.timestamp } : c));
  };

  const handleReceiveMessage = (chatId: string, text: string, senderName: string, senderAvatar: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId: chatId, // Mock sender
      senderName,
      senderAvatar,
      senderRole: 'faculty',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      read: false
    };

    setMessages([...messages, newMsg]);

    // Update last message & increment unread in Chat List
    setChats(chats.map(c => c.id === chatId ? {
      ...c,
      lastMessage: text,
      lastMessageTime: newMsg.timestamp,
      unreadCount: currentView === 'messages' && selectedChatId === chatId ? c.unreadCount : c.unreadCount + 1
    } : c));
  };

  // Mark messages as read when selecting chat
  useEffect(() => {
    if (selectedChatId && currentView === 'messages') {
      setChats(chats.map(c => c.id === selectedChatId ? { ...c, unreadCount: 0 } : c));
    }
  }, [selectedChatId, currentView]);

  const handleJoinStudyGroup = (id: string) => {
    setStudyGroups(studyGroups.map(g => g.id === id ? { ...g, isJoined: true, membersCount: g.membersCount + 1 } : g));
    setToastMessage('You have successfully enrolled in this study group community!');
  };

  const handleAddStudyGroup = (newGrp: StudyGroup) => {
    setStudyGroups([newGrp, ...studyGroups]);
    setToastMessage(`Successfully launched study community: "${newGrp.name}"!`);
  };

  // Compute unread message counts for badge on Sidebar
  const totalUnreadMessages = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  // Render correct view inside main grid
  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            user={userProfile}
            courses={courses}
            assignments={assignments}
            announcements={announcements}
            events={calendarEvents}
            chats={chats}
            setView={navigate}
            setSelectedChatId={setSelectedChatId}
            onOpenNewTaskModal={() => setIsOpenNewTaskModal(true)}
          />
        );
      case 'courses':
        return (
          <Courses
            courses={courses}
            onEnroll={handleEnrollInCourse}
            setView={navigate}
            activeCourseId={activeCourseId}
            setActiveCourseId={setActiveCourseId}
          />
        );
      case 'assignments':
        return (
          <Assignments
            assignments={assignments}
            courses={courses}
            onAddAssignment={handleAddAssignment}
            onUpdateStatus={handleUpdateAssignmentStatus}
            onDeleteAssignment={handleDeleteAssignment}
            isOpenNewTaskModal={isOpenNewTaskModal}
            setIsOpenNewTaskModal={setIsOpenNewTaskModal}
            activeCourseId={activeCourseId}
            setActiveCourseId={setActiveCourseId}
          />
        );
      case 'announcements':
        return (
          <Announcements
            announcements={announcements}
            courses={courses}
            user={userProfile}
            onAddAnnouncement={handleAddAnnouncement}
            activeCourseId={activeCourseId}
            setActiveCourseId={setActiveCourseId}
          />
        );
      case 'calendar':
        return <CalendarView events={calendarEvents} onAddEvent={handleAddCalendarEvent} />;
      case 'resources':
        return (
          <Resources
            folders={resourceFolders}
            files={resourceFiles}
            onAddFile={handleAddResourceFile}
            onDeleteFile={handleDeleteResourceFile}
            courses={courses}
            activeCourseId={activeCourseId}
            setActiveCourseId={setActiveCourseId}
          />
        );
      case 'messages':
        return (
          <Messages
            chats={chats}
            messages={messages}
            user={userProfile}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            onSendMessage={handleSendMessage}
            onReceiveMessage={handleReceiveMessage}
          />
        );
      case 'groups':
        return <StudyGroups groups={studyGroups} onJoinGroup={handleJoinStudyGroup} onAddGroup={handleAddStudyGroup} />;
      case 'profile':
        return <Profile user={userProfile} onUpdateProfile={setUserProfile} />;
      case 'settings':
        return <SettingsView settings={settings} onUpdateSettings={setSettings} />;
      default:
        return (
          <Dashboard
            user={userProfile}
            courses={courses}
            assignments={assignments}
            announcements={announcements}
            events={calendarEvents}
            chats={chats}
            setView={navigate}
            onOpenNewTaskModal={() => setIsOpenNewTaskModal(true)}
          />
        );
    }
  };

  // Secure login router
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary text-text-primary transition-colors">
      
      {/* Universal Left Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setView={(v) => navigate(v)}
        user={userProfile}
        unreadCount={totalUnreadMessages}
        onLogout={handleLogout}
      />

      {/* Main Container Right Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Simple Global Header bar */}
        <header className="h-16 bg-bg-surface border-b border-border-custom px-6 flex items-center justify-between shrink-0 z-20 shadow-custom-card">
          <div className="flex items-center gap-3">
            {currentView !== 'dashboard' && (
              <button
                onClick={navigateBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-text-primary dark:text-gray-200 bg-bg-primary dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-border-custom dark:border-gray-700 rounded-custom-md shadow-sm transition-colors cursor-pointer select-none"
                title="Go to previous page"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}
            <span className="text-xs font-semibold text-text-muted capitalize">
              Academic Hub
            </span>
            <span className="text-xs text-border-custom">/</span>
            <span className="text-xs font-bold text-brand-primary font-sans capitalize">
              {currentView.replace(/([A-Z])/g, ' $1')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-text-secondary bg-bg-primary px-3 py-1.5 rounded-custom-md border border-border-custom">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Scrollable Main Workspace View */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-bg-primary">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* Floating custom Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-white dark:bg-gray-900 border border-brand-primary/20 text-text-primary dark:text-gray-100 px-4 py-3 rounded-custom-lg shadow-custom-modal flex items-center gap-3 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-brand-primary shrink-0"></span>
          <span className="text-xs font-bold font-sans">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
