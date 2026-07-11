import {
  UserProfile,
  Course,
  Assignment,
  Announcement,
  CalendarEvent,
  ResourceFolder,
  ResourceFile,
  Chat,
  Message,
  StudyGroup,
  AppSettings
} from './types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Utsav Adhikari',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
  banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200&h=400',
  email: 'utsav.adhikari@student.ku.edu.np',
  studentId: 'KU-CS-2023-45',
  department: 'Department of Computer Science & Engineering',
  program: 'School of Engineering (Year III, Semester II)',
  gpa: 3.78,
  creditsCompleted: 96,
  creditsRequired: 136,
  skills: ['C++', 'Python', 'React', 'TypeScript', 'SQL', 'Compiler Construction', 'SAD Diagramming'],
  interests: ['Algorithms', 'Software Architecture', 'Compiler Design', 'Human-Computer Interaction'],
  achievements: [
    {
      id: 'ach-1',
      title: 'Dean\'s List Honor',
      description: 'Awarded for maintaining a GPA of 3.75+ during Year III Semester I.',
      icon: 'Award',
      unlockedAt: 'March 2026'
    },
    {
      id: 'ach-2',
      title: 'KU IT Meet Hackathon Winner',
      description: 'First prize in Web/SaaS track at the annual Kathmandu University IT Meet.',
      icon: 'Trophy',
      unlockedAt: 'January 2026'
    }
  ]
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'comp-302',
    code: 'COMP 302',
    name: 'System Analysis and Design',
    instructor: 'Mr. Umesh Dahal',
    progress: 75,
    grade: 'A',
    schedule: 'Wed, Fri 07:00 AM - 09:00 AM',
    color: 'emerald',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=300&h=180',
    description: 'System development life cycle, requirements determination, data modeling (ERD), process modeling (DFD), object-oriented analysis with UML, and system implementation strategies.',
    announcementsCount: 2,
    assignmentsCount: 1
  },
  {
    id: 'comp-314',
    code: 'COMP 314',
    name: 'Algorithms and Complexity',
    instructor: 'Dr. Prakash Poudyal',
    progress: 68,
    grade: 'A-',
    schedule: 'Mon 09:00 AM - 11:00 AM, Fri 12:00 PM - 02:00 PM',
    color: 'blue',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=300&h=180',
    description: 'Analysis of algorithms, divide-and-conquer, greedy method, dynamic programming, backtracking, branch-and-bound, NP-completeness, and approximation algorithms.',
    announcementsCount: 1,
    assignmentsCount: 2
  },
  {
    id: 'comp-323',
    code: 'COMP 323',
    name: 'Graph Theory',
    instructor: 'Harish Chandra Bhandari',
    progress: 80,
    grade: 'B+',
    schedule: 'Mon 12:00 PM - 02:00 PM, Thu 02:00 PM - 04:00 PM',
    color: 'amber',
    image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=300&h=180',
    description: 'Graphs, paths, cycles, trees, connectivity, Eulerian and Hamiltonian graphs, planar graphs, graph coloring, and network flows.',
    announcementsCount: 1,
    assignmentsCount: 1
  },
  {
    id: 'comp-341',
    code: 'COMP 341',
    name: 'Human Computer Interaction',
    instructor: 'Dr. Sushil Shrestha',
    progress: 85,
    grade: 'A',
    schedule: 'Mon 02:00 PM - 05:00 PM',
    color: 'violet',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=300&h=180',
    description: 'Principles of user interface design, user-centered design, prototyping, evaluation techniques, cognitive models, and modern interaction technologies.',
    announcementsCount: 3,
    assignmentsCount: 1
  },
  {
    id: 'comp-343',
    code: 'COMP 343',
    name: 'Information System Ethics',
    instructor: 'Mr. Lal Bahadur Khadka',
    progress: 90,
    grade: 'A',
    schedule: 'Wed, Thu 09:00 AM - 11:00 AM',
    color: 'indigo',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=300&h=180',
    description: 'Ethical analysis frameworks, privacy, intellectual property, cybercrime, reliability, professional responsibility, and the social impact of information technology.',
    announcementsCount: 1,
    assignmentsCount: 1
  },
  {
    id: 'comp-409',
    code: 'COMP 409',
    name: 'Compiler Design',
    instructor: 'Mr. Sushil Nepal',
    progress: 58,
    grade: 'B',
    schedule: 'Thu 12:00 PM - 02:00 PM, Fri 09:00 AM - 11:00 AM',
    color: 'rose',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=300&h=180',
    description: 'Lexical analysis, syntax analysis (LL and LR parsing), syntax-directed translation, intermediate code generation, code optimization, and code generation.',
    announcementsCount: 2,
    assignmentsCount: 2
  },
  {
    id: 'comp-313',
    code: 'COMP 313',
    name: 'Combined Computer Project',
    instructor: 'Faculty Advisor',
    progress: 60,
    grade: 'A-',
    schedule: 'Self-Directed Lab / Weekly Syncs',
    color: 'cyan',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=300&h=180',
    description: 'A comprehensive combined software engineering project designed to integrate theoretical and practical knowledge acquired during the semester.',
    announcementsCount: 1,
    assignmentsCount: 1
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'COMP 341 Assignment 2 - High Fidelity Prototype Design',
    courseId: 'comp-341',
    courseCode: 'COMP 341',
    dueDate: '2026-07-20',
    status: 'inprogress',
    priority: 'high',
    points: 100,
    description: 'Create a fully interactive high-fidelity Figma prototype for an academic portal. Incorporate user testing heuristics and submit a usability metrics report.'
  },
  {
    id: 'asg-2',
    title: 'COMP 409 Lab 3 - Lexical Analyzer Construction',
    courseId: 'comp-409',
    courseCode: 'COMP 409',
    dueDate: '2026-07-16',
    status: 'todo',
    priority: 'high',
    points: 50,
    description: 'Construct a Lexical Analyzer using Lex/Flex utility to scan token strings for a subset of C language variables, operators, and loops.'
  },
  {
    id: 'asg-3',
    title: 'COMP 302 Assignment 1 - System Requirements Specification Design',
    courseId: 'comp-302',
    courseCode: 'COMP 302',
    dueDate: '2026-07-15',
    status: 'submitted',
    priority: 'medium',
    points: 80,
    submittedAt: '2026-07-13T10:15:00Z',
    description: 'Create a comprehensive System Requirements Specification (SRS) document for a university management system, detailing DFDs, ERDs, and use cases.'
  },
  {
    id: 'asg-4',
    title: 'COMP 314 Quiz 2 - Greedy Algorithms and Dynamic Programming',
    courseId: 'comp-314',
    courseCode: 'COMP 314',
    dueDate: '2026-07-16',
    status: 'completed',
    priority: 'medium',
    points: 30,
    submittedAt: '2026-07-11T14:30:00Z',
    description: 'Prepare for the in-class quiz. Topics: Greedy choice property, Fractional Knapsack, Matrix Chain Multiplication, and Longest Common Subsequence.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'COMP 341 Assignment 2 uploaded',
    content: 'The second major assignment for Human Computer Interaction (COMP 341) is now live under assignments. Make sure you strictly follow the heuristic evaluations checklist.',
    sender: {
      name: 'Dr. Sushil Shrestha',
      role: 'Associate Professor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    },
    courseCode: 'COMP 341',
    date: 'July 11, 2026',
    isPinned: true,
    category: 'academic'
  },
  {
    id: 'ann-2',
    title: 'COMP 409 Lab postponed',
    content: 'Please be informed that this Thursday\'s compiler design lab session on Abstract Syntax Trees is postponed. The lab handout is available for self-paced work.',
    sender: {
      name: 'Mr. Sushil Nepal',
      role: 'Assistant Professor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    courseCode: 'COMP 409',
    date: 'July 10, 2026',
    isPinned: true,
    category: 'academic'
  },
  {
    id: 'ann-3',
    title: 'COMP 302 Presentation Schedule Finalized',
    content: 'The System Analysis and Design (COMP 302) presentation schedule for the SRS milestone is now live. Please review your team slot.',
    sender: {
      name: 'Mr. Umesh Dahal',
      role: 'Senior Lecturer',
      avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=100&h=100'
    },
    courseCode: 'COMP 302',
    date: 'July 09, 2026',
    isPinned: false,
    category: 'academic'
  },
  {
    id: 'ann-4',
    title: 'COMP 314 Quiz this Thursday',
    content: 'We will have an in-class quiz on Graph Traversals and shortest paths this Thursday at 12:00 PM. No calculators needed.',
    sender: {
      name: 'Dr. Prakash Poudyal',
      role: 'Lecturer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100'
    },
    courseCode: 'COMP 314',
    date: 'July 08, 2026',
    isPinned: false,
    category: 'exam'
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  // Monday Class events
  {
    id: 'evt-m1',
    title: 'COMP 314: Algorithms and Complexity',
    date: '2026-07-13',
    time: '09:00 AM',
    duration: '120m',
    location: 'Room 9-310',
    courseCode: 'COMP 314',
    color: 'blue',
    type: 'class'
  },
  {
    id: 'evt-m2',
    title: 'COMP 323: Graph Theory',
    date: '2026-07-13',
    time: '12:00 PM',
    duration: '120m',
    location: 'Room 8-505',
    courseCode: 'COMP 323',
    color: 'amber',
    type: 'class'
  },
  {
    id: 'evt-m3',
    title: 'COMP 341: Human Computer Interaction',
    date: '2026-07-13',
    time: '02:00 PM',
    duration: '180m',
    location: 'Room 9-404',
    courseCode: 'COMP 341',
    color: 'violet',
    type: 'class'
  },
  // Tuesday Class events
  {
    id: 'evt-tu1',
    title: 'COMP 313: Combined Computer Project Sync',
    date: '2026-07-14',
    time: '10:00 AM',
    duration: '90m',
    location: 'Project Advisory Lab',
    courseCode: 'COMP 313',
    color: 'cyan',
    type: 'class'
  },
  {
    id: 'evt-tu2',
    title: 'COMP 341: Human Computer Interaction Prototype Evaluation',
    date: '2026-07-14',
    time: '02:00 PM',
    duration: '120m',
    location: 'Room 9-404',
    courseCode: 'COMP 341',
    color: 'violet',
    type: 'class'
  },
  // Wednesday Class events
  {
    id: 'evt-w1',
    title: 'COMP 302: System Analysis and Design',
    date: '2026-07-15',
    time: '07:00 AM',
    duration: '120m',
    location: 'Room 9-310',
    courseCode: 'COMP 302',
    color: 'emerald',
    type: 'class'
  },
  {
    id: 'evt-w2',
    title: 'COMP 343: Information System Ethics',
    date: '2026-07-15',
    time: '09:00 AM',
    duration: '120m',
    location: 'Room 10-107',
    courseCode: 'COMP 343',
    color: 'indigo',
    type: 'class'
  },
  // Thursday Class events
  {
    id: 'evt-t1',
    title: 'COMP 343: Information System Ethics',
    date: '2026-07-16',
    time: '09:00 AM',
    duration: '120m',
    location: 'Room 8-502',
    courseCode: 'COMP 343',
    color: 'indigo',
    type: 'class'
  },
  {
    id: 'evt-t2',
    title: 'COMP 409: Compiler Design',
    date: '2026-07-16',
    time: '12:00 PM',
    duration: '120m',
    location: 'Room 9-404',
    courseCode: 'COMP 409',
    color: 'rose',
    type: 'class'
  },
  {
    id: 'evt-t3',
    title: 'COMP 323: Graph Theory',
    date: '2026-07-16',
    time: '02:00 PM',
    duration: '120m',
    location: 'Room 8-505',
    courseCode: 'COMP 323',
    color: 'amber',
    type: 'class'
  },
  // Friday Class events
  {
    id: 'evt-f1',
    title: 'COMP 302: System Analysis and Design',
    date: '2026-07-17',
    time: '07:00 AM',
    duration: '120m',
    location: 'Room 9-304',
    courseCode: 'COMP 302',
    color: 'emerald',
    type: 'class'
  },
  {
    id: 'evt-f2',
    title: 'COMP 409: Compiler Design',
    date: '2026-07-17',
    time: '09:00 AM',
    duration: '120m',
    location: 'Room 9-310',
    courseCode: 'COMP 409',
    color: 'rose',
    type: 'class'
  },
  {
    id: 'evt-f3',
    title: 'COMP 314: Algorithms and Complexity',
    date: '2026-07-17',
    time: '12:00 PM',
    duration: '120m',
    location: 'Room 9-402',
    courseCode: 'COMP 314',
    color: 'blue',
    type: 'class'
  }
];

export const INITIAL_RESOURCE_FOLDERS: ResourceFolder[] = [
  { id: 'fld-1', name: 'Lecture Notes', filesCount: 14, size: '42 MB', icon: 'BookOpen', color: 'blue' },
  { id: 'fld-2', name: 'Slides & Presentations', filesCount: 18, size: '85 MB', icon: 'Presentation', color: 'emerald' },
  { id: 'fld-3', name: 'Past Questions (KU Archive)', filesCount: 12, size: '18 MB', icon: 'FileText', color: 'amber' },
  { id: 'fld-4', name: 'Labs & Practical Guides', filesCount: 11, size: '24 MB', icon: 'Cpu', color: 'rose' }
];

export const INITIAL_RESOURCE_FILES: ResourceFile[] = [
  {
    id: 'file-1',
    name: 'COMP 341 - Lecture 04 Usability Heuristics.pdf',
    folderId: 'fld-1',
    size: '4.2 MB',
    type: 'pdf',
    uploadedBy: 'Dr. Sushil Shrestha',
    uploadedAt: '2026-07-06',
    downloads: 48
  },
  {
    id: 'file-2',
    name: 'COMP 409 - Lexical Analyzer Homework Specification.pdf',
    folderId: 'fld-4',
    size: '1.2 MB',
    type: 'pdf',
    uploadedBy: 'Mr. Sushil Nepal',
    uploadedAt: '2026-07-10',
    downloads: 32
  },
  {
    id: 'file-3',
    name: 'COMP 302 - Data Flow Diagrams Class Slides.pptx',
    folderId: 'fld-2',
    size: '12.4 MB',
    type: 'slides',
    uploadedBy: 'Mr. Umesh Dahal',
    uploadedAt: '2026-07-05',
    downloads: 51
  },
  {
    id: 'file-4',
    name: 'COMP 314 - Algorithms Past Questions 2024.pdf',
    folderId: 'fld-3',
    size: '2.8 MB',
    type: 'pdf',
    uploadedBy: 'CSE Department',
    uploadedAt: '2026-07-02',
    downloads: 124
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat-1',
    name: 'Dr. Sushil Shrestha',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
    type: 'faculty',
    lastMessage: 'Your HCI prototype project is approved.',
    lastMessageTime: '04:15 PM',
    unreadCount: 1,
    online: true,
    role: 'Associate Professor of CSE',
    department: 'Department of Computer Science & Engineering'
  },
  {
    id: 'chat-2',
    name: 'COMP 409 Compiler Design Study Group',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=100&h=100',
    type: 'group',
    lastMessage: 'Aayush: Who has the compiler parsing table notes?',
    lastMessageTime: '02:30 PM',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    chatId: 'chat-1',
    senderId: 'chat-1',
    senderName: 'Dr. Sushil Shrestha',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
    senderRole: 'faculty',
    content: 'Hi Utsav, I reviewed your group wireframes. The usability flow looks great. Keep up the clean work.',
    timestamp: '04:10 PM',
    date: '2026-07-12',
    read: true
  },
  {
    id: 'msg-2',
    chatId: 'chat-1',
    senderId: 'utsav-adhikari',
    senderName: 'Utsav Adhikari',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
    senderRole: 'student',
    content: 'Thank you, Sir! We are working on the high-fidelity mockups now and will submit the heuristic evaluation list on time.',
    timestamp: '04:12 PM',
    date: '2026-07-12',
    read: true
  },
  {
    id: 'msg-3',
    chatId: 'chat-1',
    senderId: 'chat-1',
    senderName: 'Dr. Sushil Shrestha',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
    senderRole: 'faculty',
    content: 'Perfect. Your HCI prototype project is approved.',
    timestamp: '04:15 PM',
    date: '2026-07-12',
    read: false
  }
];

export const INITIAL_STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'grp-1',
    name: 'SAD & Software Architecture Builders',
    courseCode: 'COMP 302',
    membersCount: 6,
    maxMembers: 10,
    description: 'We meet after classes to build clean process models, UML diagrams, and do mock walkthroughs of requirements specifications.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=300&h=180',
    nextMeeting: 'Thursday, 04:00 PM',
    isJoined: true,
    topics: ['ERD', 'DFD', 'UML Use-Cases']
  },
  {
    id: 'grp-2',
    name: 'Lexical Parsing & Compiler Club',
    courseCode: 'COMP 409',
    membersCount: 8,
    maxMembers: 12,
    description: 'Weekly sessions focused on implementing Lex/Yacc constructs, symbol tables, parser optimization, and grammar rules verification.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=300&h=180',
    nextMeeting: 'Tuesday, 05:00 PM',
    isJoined: false,
    topics: ['Flex & Bison', 'LR Parsing', 'Symbol Tables']
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  theme: 'light',
  emailNotifications: {
    assignments: true,
    announcements: true,
    messages: true,
    grades: false
  },
  pushNotifications: {
    assignments: true,
    announcements: true,
    messages: true,
    grades: true
  },
  twoFactorAuth: false,
  language: 'English',
  privacyMode: false
};
