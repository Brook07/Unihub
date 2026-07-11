import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  Search,
  Users2,
  Info
} from 'lucide-react';
import { Course, ViewType } from '../types';

interface CoursesProps {
  courses: Course[];
  onEnroll: (course: Course) => void;
  setView: (view: ViewType) => void;
  activeCourseId?: string | null;
  setActiveCourseId?: (id: string | null) => void;
}

export default function Courses({ courses, onEnroll, setView, activeCourseId, setActiveCourseId }: CoursesProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalTab, setModalTab] = useState<'syllabus' | 'attendance' | 'grades'>('syllabus');
  const [searchQuery, setSearchQuery] = useState('');

  // Catalog of courses available for mock enrollment
  const courseCatalog: Course[] = [
    {
      id: 'cs-422',
      code: 'CS-422',
      name: 'Distributed Systems',
      instructor: 'Dr. Ken Thompson',
      progress: 0,
      grade: 'N/A',
      schedule: 'Tue, Thu 3:00 PM - 4:30 PM',
      color: 'sky',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=300&h=180',
      description: 'Foundations of distributed systems: consensus algorithms (Raft, Paxos), vector clocks, distributed databases, MapReduce, and microservices.',
      announcementsCount: 0,
      assignmentsCount: 0
    },
    {
      id: 'cs-403',
      code: 'CS-403',
      name: 'Natural Language Processing',
      instructor: 'Dr. Christopher Manning',
      progress: 0,
      grade: 'N/A',
      schedule: 'Mon, Wed 1:30 PM - 3:00 PM',
      color: 'teal',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=300&h=180',
      description: 'Understanding computational linguistics, word representations, transformer models (BERT, GPT), syntax trees, and sentiment analysis models.',
      announcementsCount: 0,
      assignmentsCount: 0
    },
    {
      id: 'cs-333',
      code: 'CS-333',
      name: 'Human-Computer Interaction',
      instructor: 'Prof. Don Norman',
      progress: 0,
      grade: 'N/A',
      schedule: 'Fri 9:00 AM - 12:00 PM',
      color: 'pink',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=300&h=180',
      description: 'Design principles, user-centric testing, wireframing, psychological principles in interface design, and modern usability heuristics.',
      announcementsCount: 0,
      assignmentsCount: 0
    }
  ];

  // Filter out courses that are already enrolled
  const enrollableCourses = courseCatalog.filter(
    (catCourse) => !courses.some((myCourse) => myCourse.code === catCourse.code)
  );

  const filteredMyCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary dark:text-gray-100">
            My Courses
          </h1>
          <p className="text-xs md:text-sm text-text-muted dark:text-gray-400 font-sans">
            Manage your registered courses, view syllabus details, and enroll in new electives.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all font-sans"
          />
        </div>
      </div>

      {/* Course Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMyCourses.map((course) => (
          <motion.div
            key={course.id}
            layoutId={`course-card-${course.id}`}
            onClick={() => {
              setSelectedCourse(course);
              setModalTab('syllabus');
              if (setActiveCourseId) setActiveCourseId(course.id);
            }}
            className={`bg-bg-surface dark:bg-[#111827] border rounded-custom-lg overflow-hidden shadow-custom-card hover-lift cursor-pointer group flex flex-col justify-between transition-all duration-200 ${
              activeCourseId === course.id
                ? 'border-brand-primary ring-2 ring-brand-primary/20'
                : 'border-border-custom dark:border-gray-800'
            }`}
          >
            <div>
              {/* Cover Photo */}
              <div className="h-36 w-full relative overflow-hidden bg-bg-primary dark:bg-gray-800">
                <img
                  src={course.image}
                  alt={course.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/95 dark:bg-gray-900/95 text-text-primary dark:text-gray-200 shadow-custom-card font-mono">
                    {course.code}
                  </span>
                  {activeCourseId === course.id && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-primary text-white shadow-custom-card uppercase tracking-wider">
                      Active Focus
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/95 dark:bg-gray-900/95 text-brand-primary dark:text-blue-400 font-bold text-xs shadow-custom-card">
                    {course.grade}
                  </span>
                </div>
              </div>

              {/* Main Info */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-md font-bold text-text-primary dark:text-gray-200 line-clamp-1 group-hover:text-brand-primary dark:group-hover:text-blue-400 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-xs text-text-muted dark:text-gray-400 font-sans mt-0.5">
                    Professor: {course.instructor}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-sans font-medium text-text-muted">
                    <span>Syllabus Progress</span>
                    <span className="text-text-secondary dark:text-gray-300 font-bold font-mono">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-bg-primary dark:bg-gray-850 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-primary h-full rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick stats footer */}
            <div className="px-5 py-3 border-t border-divider-custom dark:border-gray-800/80 bg-bg-primary dark:bg-gray-900/20 flex items-center justify-between text-[10px] text-text-muted font-sans">
              <span className="truncate max-w-40">📅 {course.schedule.split(' ')[0]} {course.schedule.split(' ')[1]}</span>
              <div className="flex items-center gap-3">
                <span>📣 {course.announcementsCount}</span>
                <span>📋 {course.assignmentsCount}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Catalog / Enrollable Card (Direct insertion into the grid to fit elegantly!) */}
        {enrollableCourses.length > 0 && (
          <div className="bg-bg-surface dark:bg-[#111827] border border-dashed border-border-custom dark:border-indigo-900/30 rounded-custom-lg p-5 flex flex-col justify-between space-y-4 shadow-custom-card">
            <div>
              <div className="h-10 w-10 bg-brand-light dark:bg-blue-950/50 rounded-custom-md flex items-center justify-center border border-blue-100 dark:border-blue-900/10 text-brand-primary dark:text-blue-400 mb-4">
                <Plus className="h-5 w-5" />
              </div>
              <h3 className="text-md font-bold text-text-primary dark:text-gray-200">
                Enroll in Electives
              </h3>
              <p className="text-xs text-text-muted dark:text-gray-400 font-sans mt-1 leading-relaxed">
                Add computer science or interdisciplinary modules to your active semester catalog.
              </p>
            </div>

            <div className="space-y-2">
              {enrollableCourses.map((catCourse) => (
                <div
                  key={catCourse.id}
                  className="p-3 bg-bg-primary dark:bg-gray-800 hover:bg-bg-surface dark:hover:bg-gray-750 rounded-custom-md border border-divider-custom dark:border-gray-800 flex items-center justify-between shadow-custom-card transition-colors"
                >
                  <div className="min-w-0 mr-2">
                    <span className="text-[9px] font-bold text-brand-primary dark:text-blue-400 font-mono block tracking-wider">
                      {catCourse.code}
                    </span>
                    <h4 className="text-xs font-bold text-text-primary dark:text-gray-200 truncate">
                      {catCourse.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => onEnroll(catCourse)}
                    className="px-2.5 py-1.5 text-[10px] font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-sm cursor-pointer transition-all flex items-center gap-1 shrink-0"
                  >
                    Enroll
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Course Detail Overlay Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-surface dark:bg-[#111827] rounded-custom-lg max-w-xl w-full border border-border-custom dark:border-gray-800 shadow-custom-modal overflow-hidden flex flex-col"
          >
            {/* Header / Cover */}
            <div className="h-40 relative bg-bg-primary dark:bg-gray-850 shrink-0">
              <img
                src={selectedCourse.image}
                alt={selectedCourse.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent"></div>
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs font-bold text-blue-300 font-mono uppercase tracking-wider block mb-1">
                  {selectedCourse.code}
                </span>
                <h2 className="text-lg font-display font-bold leading-tight">
                  {selectedCourse.name}
                </h2>
                <p className="text-xs text-gray-300 mt-0.5 font-sans">
                  Instructed by {selectedCourse.instructor}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center cursor-pointer transition-colors border border-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Selector */}
            <div className="flex border-b border-divider-custom dark:border-gray-800/80 px-6 bg-bg-surface dark:bg-[#111827] shrink-0">
              {[
                { id: 'syllabus', label: 'Syllabus & Info' },
                { id: 'attendance', label: 'Attendance Log' },
                { id: 'grades', label: 'Grades Breakdown' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setModalTab(tab.id as any)}
                  className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    modalTab === tab.id
                      ? 'border-brand-primary text-brand-primary dark:text-blue-400'
                      : 'border-transparent text-text-muted hover:text-text-primary dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Scrollable Content Body */}
            <div className="p-6 overflow-y-auto max-h-[50vh] space-y-5">
              {modalTab === 'syllabus' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-sans">
                      Course Description
                    </h4>
                    <p className="text-xs text-text-secondary dark:text-gray-300 leading-relaxed font-sans">
                      {selectedCourse.description || 'No detailed syllabus outline provided for this module.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-bg-primary dark:bg-gray-850/30 p-4 rounded-custom-md border border-border-custom dark:border-gray-800/50">
                    <div>
                      <span className="text-[9px] text-text-muted font-sans uppercase block tracking-wider">Lecture Schedule</span>
                      <p className="text-xs font-bold text-text-primary dark:text-gray-300 mt-1 font-sans">
                        {selectedCourse.schedule}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] text-text-muted font-sans uppercase block tracking-wider">Estimated Grade</span>
                      <p className="text-xs font-extrabold text-brand-primary dark:text-blue-400 mt-1 font-mono">
                        Grade {selectedCourse.grade}
                      </p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <span className="text-[9px] text-text-muted font-sans uppercase block tracking-wider">Syllabus Covered</span>
                      <p className="text-xs font-bold text-text-primary dark:text-gray-300 mt-1 font-mono">
                        {selectedCourse.progress}% Completed
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'attendance' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between p-4 bg-bg-primary dark:bg-gray-850/30 border border-border-custom dark:border-gray-800/50 rounded-custom-md">
                    <div>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block font-sans">Overall Attendance</span>
                      <p className="text-2xl font-display font-extrabold text-brand-primary dark:text-blue-400 mt-1">
                        {selectedCourse.code === 'COMP 302' ? '95%' : selectedCourse.code === 'COMP 314' ? '90%' : selectedCourse.code === 'COMP 341' ? '100%' : '92%'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block font-sans">Lectures Attended</span>
                      <p className="text-sm font-extrabold text-text-primary dark:text-gray-200 mt-1">
                        {selectedCourse.code === 'COMP 302' ? '19 / 20' : selectedCourse.code === 'COMP 314' ? '18 / 20' : selectedCourse.code === 'COMP 341' ? '20 / 20' : '23 / 25'} Classes
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-sans">
                      Recent Attendance Log
                    </h4>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {[
                        { date: 'July 10, 2026', type: 'Lecture', status: 'Present' },
                        { date: 'July 08, 2026', type: 'Lecture', status: 'Present' },
                        { date: 'July 03, 2026', type: 'Lab Session', status: 'Present' },
                        { date: 'July 01, 2026', type: 'Lecture', status: selectedCourse.code === 'COMP 314' ? 'Absent' : 'Present' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-bg-primary dark:bg-gray-900/40 rounded-custom-sm text-xs border border-border-custom dark:border-gray-800/20">
                          <div>
                            <span className="font-bold text-text-primary dark:text-gray-200">{item.date}</span>
                            <span className="text-[10px] text-text-muted font-sans ml-2">({item.type})</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-450'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'grades' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between p-4 bg-bg-primary dark:bg-gray-850/30 border border-border-custom dark:border-gray-800/50 rounded-custom-md">
                    <div>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block font-sans">Estimated Grade</span>
                      <p className="text-2xl font-display font-extrabold text-brand-primary dark:text-blue-400 mt-1">
                        Grade {selectedCourse.grade}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block font-sans">Weighted Score</span>
                      <p className="text-sm font-extrabold text-text-primary dark:text-gray-200 mt-1">
                        {selectedCourse.code === 'COMP 302' ? '92.4%' : selectedCourse.code === 'COMP 314' ? '88.5%' : selectedCourse.code === 'COMP 341' ? '95.0%' : '87.2%'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-sans">
                      Weighted Marks Breakdown
                    </h4>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {[
                        { item: 'Internal Syllabus Quiz', score: '100%', weight: '5%' },
                        { item: 'Milestone SRS Draft Presentation', score: '92%', weight: '15%' },
                        { item: 'Mid-Term Theory Exam', score: '88%', weight: '20%' },
                        { item: 'Lab Assessment Portfolio', score: '94%', weight: '10%' },
                        { item: 'External End-Semester Exam', score: 'Pending Evaluation', weight: '50%' }
                      ].map((record, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-bg-primary dark:bg-gray-900/40 rounded-custom-sm text-xs border border-border-custom dark:border-gray-800/20">
                          <div>
                            <p className="font-bold text-text-primary dark:text-gray-200 leading-snug">{record.item}</p>
                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider font-sans">Weight: {record.weight}</span>
                          </div>
                          <span className={`text-xs font-bold font-mono ${record.score.includes('Pending') ? 'text-text-muted font-sans text-[10px]' : 'text-brand-primary dark:text-blue-400'}`}>
                            {record.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-divider-custom dark:border-gray-800/80 bg-bg-primary/30 shrink-0">
              <button
                onClick={() => {
                  setView('resources');
                  setSelectedCourse(null);
                }}
                className="px-4 py-2 text-xs font-bold text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border border-border-custom dark:border-gray-800 rounded-custom-md cursor-pointer transition-all inline-flex items-center gap-1.5"
              >
                <BookOpen className="h-3.5 w-3.5" /> View Files
              </button>
              <button
                onClick={() => {
                  setView('assignments');
                  setSelectedCourse(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md cursor-pointer transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                Assignments <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
