import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Megaphone,
  Pin,
  Search,
  Plus,
  Calendar,
  User,
  Filter,
  Check,
  ChevronRight,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { Announcement, Course, UserProfile } from '../types';

interface AnnouncementsProps {
  announcements: Announcement[];
  courses: Course[];
  user: UserProfile;
  onAddAnnouncement: (announcement: Announcement) => void;
  activeCourseId?: string | null;
  setActiveCourseId?: (id: string | null) => void;
}

export default function Announcements({
  announcements,
  courses,
  user,
  onAddAnnouncement,
  activeCourseId,
  setActiveCourseId
}: AnnouncementsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'academic' | 'campus' | 'exam' | 'general'>('general');
  const [formCourse, setFormCourse] = useState('all');
  const [formContent, setFormContent] = useState('');

  const categories = [
    { id: 'all', label: 'All Updates' },
    { id: 'academic', label: 'Academic' },
    { id: 'exam', label: 'Exams & Quizzes' },
    { id: 'campus', label: 'Campus Life' },
    { id: 'general', label: 'General Updates' }
  ];

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: formTitle,
      content: formContent,
      sender: {
        name: user.name,
        role: 'Student Leader',
        avatar: user.avatar
      },
      courseCode: formCourse === 'all' ? undefined : formCourse,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      isPinned: false,
      category: formCategory
    };

    onAddAnnouncement(newAnn);
    setFormTitle('');
    setFormContent('');
    setIsPostModalOpen(false);
  };

  // Filter announcements
  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesCategory = activeCategory === 'all' || ann.category === activeCategory;
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ann.courseCode && ann.courseCode.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesCourse = true;
    if (activeCourseId) {
      const activeCourseObj = courses.find(c => c.id === activeCourseId);
      if (activeCourseObj) {
        matchesCourse = (ann.courseCode === activeCourseObj.code) || 
                        ann.title.toUpperCase().includes(activeCourseObj.code.toUpperCase()) || 
                        ann.content.toUpperCase().includes(activeCourseObj.code.toUpperCase());
      }
    }

    return matchesCategory && matchesSearch && matchesCourse;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.isPinned);
  const recentAnnouncements = filteredAnnouncements.filter((a) => !a.isPinned);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary dark:text-gray-100">
            Announcements
          </h1>
          <p className="text-xs md:text-sm text-text-muted dark:text-gray-400 font-sans">
            Stay up to date with departmental postings, syllabus updates, and campus life notifications.
          </p>
        </div>

        {/* Create Button */}
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-4 py-2 text-xs font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md cursor-pointer transition-all inline-flex items-center gap-1.5 shadow-custom-card self-start md:self-auto"
        >
          <Plus className="h-4 w-4" /> Broadcast Update
        </button>
      </div>

      {/* Course Focus Selector Bar */}
      <div className="p-4 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-custom-card">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-brand-light dark:bg-blue-950/40 text-brand-primary dark:text-blue-400 rounded-custom-md flex items-center justify-center border border-brand-primary/10">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-sans leading-none">
              Course Focus Context
            </h3>
            <p className="text-xs font-extrabold text-text-primary dark:text-gray-200 mt-1">
              {activeCourseId && courses.find(c => c.id === activeCourseId)
                ? `${courses.find(c => c.id === activeCourseId)?.code}: ${courses.find(c => c.id === activeCourseId)?.name}`
                : 'All Enrolled Courses'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="course-context-select-ann" className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-sans shrink-0">
            Focus:
          </label>
          <select
            id="course-context-select-ann"
            value={activeCourseId || 'all'}
            onChange={(e) => {
              if (setActiveCourseId) {
                setActiveCourseId(e.target.value === 'all' ? null : e.target.value);
              }
            }}
            className="text-xs font-bold text-text-primary dark:text-gray-300 bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 px-3 py-1.5 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 cursor-pointer"
          >
            <option value="all">📚 All Enrolled Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
          {activeCourseId && (
            <button
              onClick={() => {
                if (setActiveCourseId) {
                  setActiveCourseId(null);
                }
              }}
              className="text-[10px] font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/20 px-2.5 py-1.5 rounded-custom-md border border-red-200/50 cursor-pointer transition-colors"
            >
              Clear Focus
            </button>
          )}
        </div>
      </div>

      {/* Categories Tabs & Search bar split */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-custom dark:border-gray-800 pb-2">
        {/* Category horizontal scroller */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 -mb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-custom-sm transition-all shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-brand-primary text-white shadow-custom-card'
                  : 'text-text-secondary hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-850'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search broadcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all font-sans"
          />
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-6">
        {/* Pinned Section */}
        {pinnedAnnouncements.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider font-sans flex items-center gap-1.5">
              <Pin className="h-3.5 w-3.5 text-brand-primary" /> Pinned Updates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => setSelectedAnn(ann)}
                  className="p-5 bg-blue-50/20 dark:bg-blue-950/5 border border-blue-100 dark:border-gray-800 rounded-custom-lg cursor-pointer hover:shadow-custom-card hover-lift transition-all relative group overflow-hidden"
                >
                  <div className="absolute right-3 top-3 text-brand-primary/30">
                    <Pin className="h-4.5 w-4.5 rotate-45" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-brand-primary/10 text-brand-primary dark:text-blue-400 capitalize font-mono">
                      {ann.category}
                    </span>
                    {ann.courseCode && (
                      <span className="text-[10px] text-brand-primary dark:text-blue-400 font-mono font-bold">
                        {ann.courseCode}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-text-primary dark:text-gray-200 leading-snug line-clamp-1 group-hover:text-brand-primary transition-colors">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-text-secondary dark:text-gray-400 font-sans line-clamp-3 mt-1.5 leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-divider-custom dark:border-gray-800">
                    <img
                      src={ann.sender.avatar}
                      alt={ann.sender.name}
                      referrerPolicy="no-referrer"
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-[10px] font-bold text-text-primary dark:text-gray-350 leading-none">
                        {ann.sender.name}
                      </p>
                      <p className="text-[8px] text-text-muted font-sans leading-none mt-0.5">
                        {ann.sender.role} • {ann.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent updates */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider font-sans">
            Recent Postings
          </h3>
          {recentAnnouncements.length === 0 ? (
            <div className="text-center py-10 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg">
              <p className="text-sm text-text-muted font-sans">No matching announcements found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => setSelectedAnn(ann)}
                  className="p-4 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-md cursor-pointer hover:border-brand-primary/40 dark:hover:border-gray-700 hover-lift hover:shadow-custom-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-custom-card"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 bg-bg-primary dark:bg-gray-850 rounded-custom-md flex items-center justify-center text-text-secondary shrink-0 border border-border-custom">
                      <Megaphone className="h-4.5 w-4.5 text-text-secondary group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-bold bg-bg-primary dark:bg-gray-800 text-text-secondary dark:text-gray-400 uppercase tracking-wider font-mono">
                          {ann.category}
                        </span>
                        {ann.courseCode && (
                          <span className="text-[10px] font-bold text-brand-primary dark:text-blue-400 font-mono">
                            {ann.courseCode}
                          </span>
                        )}
                        <span className="text-[10px] text-text-muted font-sans">
                          {ann.date}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-text-primary dark:text-gray-200 truncate group-hover:text-brand-primary transition-colors">
                        {ann.title}
                      </h4>
                      <p className="text-[11px] text-text-muted dark:text-gray-500 font-sans line-clamp-1">
                        {ann.content}
                      </p>
                    </div>
                  </div>

                  {/* Sender badge on the right */}
                  <div className="flex items-center gap-2.5 md:self-center bg-bg-primary dark:bg-gray-850/25 px-3 py-1.5 rounded-custom-md shrink-0 border border-border-custom">
                    <img
                      src={ann.sender.avatar}
                      alt={ann.sender.name}
                      referrerPolicy="no-referrer"
                      className="h-5.5 w-5.5 rounded-full object-cover border border-border-custom"
                    />
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-text-primary dark:text-gray-350 leading-tight">
                        {ann.sender.name}
                      </p>
                      <p className="text-[8px] text-text-muted font-sans leading-none mt-0.5">
                        {ann.sender.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Announcement Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg max-w-md w-full p-6 shadow-custom-modal space-y-4">
            <div className="flex items-center justify-between border-b border-divider-custom dark:border-gray-800 pb-3">
              <h3 className="font-display font-bold text-lg text-text-primary dark:text-gray-100 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-brand-primary" /> Broadcast an Update
              </h3>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-text-muted hover:text-text-primary dark:hover:text-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted block font-sans">
                  Broadcasting Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Study Session cancellation or Club meeting"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all font-sans text-text-primary"
                />
              </div>

              {/* Course and Category split */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted block font-sans">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 transition-all font-sans text-text-primary cursor-pointer"
                  >
                    <option value="general">General</option>
                    <option value="academic">Academic</option>
                    <option value="exam">Exam Update</option>
                    <option value="campus">Campus life</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted block font-sans">
                    Course Tag
                  </label>
                  <select
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 transition-all font-sans text-text-primary cursor-pointer"
                  >
                    <option value="all">None / General</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted block font-sans">
                  Broadcasting Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail the update, rooms, schedule edits, or instructions clearly..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all font-sans resize-none text-text-primary"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-divider-custom dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 rounded-custom-md border border-border-custom dark:border-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md shadow-custom-card cursor-pointer transition-all"
                >
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcement Detail Reader Modal */}
      {selectedAnn && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg max-w-lg w-full p-6 shadow-custom-modal space-y-4">
            <div className="flex items-center justify-between border-b border-divider-custom dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-brand-light dark:bg-blue-950 text-brand-primary dark:text-blue-400 capitalize font-mono">
                  {selectedAnn.category}
                </span>
                {selectedAnn.courseCode && (
                  <span className="text-xs font-bold text-text-muted font-mono">
                    {selectedAnn.courseCode}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedAnn(null)}
                className="text-text-muted hover:text-text-primary dark:hover:text-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-md md:text-lg font-display font-bold text-text-primary dark:text-gray-100 leading-snug">
                {selectedAnn.title}
              </h2>
              <p className="text-xs text-text-muted font-sans">
                Posted on {selectedAnn.date}
              </p>

              {/* Sender Details */}
              <div className="flex items-center gap-3 p-3 bg-bg-primary dark:bg-gray-850/50 rounded-custom-md border border-border-custom dark:border-gray-850">
                <img
                  src={selectedAnn.sender.avatar}
                  alt={selectedAnn.sender.name}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full object-cover border border-border-custom shadow-sm"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-text-primary dark:text-gray-200">
                    {selectedAnn.sender.name}
                  </p>
                  <p className="text-[10px] text-text-secondary dark:text-gray-450 font-sans font-medium">
                    {selectedAnn.sender.role}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="text-xs md:text-sm text-text-secondary dark:text-gray-300 leading-relaxed font-sans pt-2 whitespace-pre-wrap">
                {selectedAnn.content}
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end pt-3 border-t border-divider-custom dark:border-gray-800">
              <button
                onClick={() => setSelectedAnn(null)}
                className="px-4 py-2 text-xs font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md shadow-custom-card cursor-pointer transition-all"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
