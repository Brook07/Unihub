/**
 * Types and interfaces for the UniHub Academic Platform
 */

export type ViewType =
  | 'login'
  | 'dashboard'
  | 'courses'
  | 'assignments'
  | 'announcements'
  | 'calendar'
  | 'resources'
  | 'messages'
  | 'groups'
  | 'profile'
  | 'settings';

export interface UserProfile {
  name: string;
  avatar: string;
  banner: string;
  email: string;
  studentId: string;
  department: string;
  program: string;
  gpa: number;
  creditsCompleted: number;
  creditsRequired: number;
  skills: string[];
  interests: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  progress: number; // percentage
  grade: string;
  schedule: string;
  color: string; // Tailwind color class suffix
  image: string;
  syllabusUrl?: string;
  description?: string;
  announcementsCount: number;
  assignmentsCount: number;
}

export type AssignmentStatus = 'todo' | 'inprogress' | 'submitted' | 'completed';

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseCode: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  points: number;
  submittedAt?: string;
  attachment?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  sender: {
    name: string;
    role: string;
    avatar: string;
  };
  courseCode?: string;
  date: string;
  isPinned: boolean;
  category: 'academic' | 'campus' | 'exam' | 'general';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: string;
  location: string;
  courseCode?: string;
  color: string;
  type: 'class' | 'exam' | 'assignment' | 'meeting' | 'study';
}

export interface ResourceFolder {
  id: string;
  name: string;
  filesCount: number;
  size: string;
  icon: string;
  color: string;
}

export interface ResourceFile {
  id: string;
  name: string;
  folderId: string;
  size: string;
  type: 'pdf' | 'doc' | 'slides' | 'zip' | 'mp4';
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: 'student' | 'faculty';
  content: string;
  timestamp: string; // HH:MM
  date: string; // YYYY-MM-DD
  read: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  type: 'faculty' | 'group' | 'direct';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  online?: boolean;
  role?: string; // e.g. "Professor of Computer Science" for faculty
  department?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  courseCode: string;
  membersCount: number;
  maxMembers: number;
  description: string;
  image: string;
  nextMeeting?: string;
  isJoined: boolean;
  topics: string[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: {
    assignments: boolean;
    announcements: boolean;
    messages: boolean;
    grades: boolean;
  };
  pushNotifications: {
    assignments: boolean;
    announcements: boolean;
    messages: boolean;
    grades: boolean;
  };
  twoFactorAuth: boolean;
  language: string;
  privacyMode: boolean;
}
