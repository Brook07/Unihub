import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  KanbanSquare,
  Plus,
  Clock,
  Filter,
  CheckCircle,
  FileCode,
  ArrowRight,
  ArrowLeft,
  ChevronsRight,
  Trash2,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { Assignment, AssignmentStatus, Course } from '../types';

interface AssignmentsProps {
  assignments: Assignment[];
  courses: Course[];
  onAddAssignment: (assignment: Assignment) => void;
  onUpdateStatus: (id: string, newStatus: AssignmentStatus) => void;
  onDeleteAssignment: (id: string) => void;
  isOpenNewTaskModal: boolean;
  setIsOpenNewTaskModal: (open: boolean) => void;
  activeCourseId?: string | null;
  setActiveCourseId?: (id: string | null) => void;
}

export default function Assignments({
  assignments,
  courses,
  onAddAssignment,
  onUpdateStatus,
  onDeleteAssignment,
  isOpenNewTaskModal,
  setIsOpenNewTaskModal,
  activeCourseId,
  setActiveCourseId
}: AssignmentsProps) {
  const [courseFilter, setCourseFilter] = useState<string>(activeCourseId || 'all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize internal course filter when activeCourseId changes
  useEffect(() => {
    if (activeCourseId) {
      setCourseFilter(activeCourseId);
    } else {
      setCourseFilter('all');
    }
  }, [activeCourseId]);

  // When courseFilter is updated manually, synchronize with the global state
  const handleCourseFilterChange = (val: string) => {
    setCourseFilter(val);
    if (setActiveCourseId) {
      setActiveCourseId(val === 'all' ? null : val);
    }
  };

  // Form states for creating new assignment
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || '');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newPoints, setNewPoints] = useState(100);
  const [newDesc, setNewDesc] = useState('');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) return;

    const selectedCourseObj = courses.find(c => c.id === newCourseId);

    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTitle,
      courseId: newCourseId,
      courseCode: selectedCourseObj?.code || 'GEN',
      dueDate: newDueDate,
      status: 'todo',
      priority: newPriority,
      points: newPoints,
      description: newDesc
    };

    onAddAssignment(newAsg);
    setNewTitle('');
    setNewDueDate('');
    setNewPoints(100);
    setNewDesc('');
    setIsOpenNewTaskModal(false);
  };

  const columns: { id: AssignmentStatus; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'border-t-brand-primary' },
    { id: 'inprogress', title: 'In Progress', color: 'border-t-amber-500' },
    { id: 'submitted', title: 'Submitted', color: 'border-t-sky-500' },
    { id: 'completed', title: 'Completed', color: 'border-t-semantic-success' }
  ];

  // Filtered assignments
  const filteredAssignments = assignments.filter(asg => {
    const matchesCourse = courseFilter === 'all' || asg.courseId === courseFilter;
    const matchesPriority = priorityFilter === 'all' || asg.priority === priorityFilter;
    const matchesSearch = asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asg.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesPriority && matchesSearch;
  });

  const activeCourseObj = courses.find(c => c.id === courseFilter);

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary dark:text-gray-100">
            Assignment Board
          </h1>
          <p className="text-xs md:text-sm text-text-muted dark:text-gray-400 font-sans">
            Track, prioritize, and submit your academic requirements using an interactive Kanban board.
          </p>
        </div>

        {/* Floating Action / Header Button */}
        <button
          onClick={() => setIsOpenNewTaskModal(true)}
          className="px-4 py-2 text-xs font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md cursor-pointer transition-all inline-flex items-center gap-1.5 shadow-custom-card self-start md:self-auto"
        >
          <Plus className="h-4 w-4" /> New Assignment
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
              {activeCourseObj ? `${activeCourseObj.code}: ${activeCourseObj.name}` : 'All Enrolled Courses'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="course-context-select-asg" className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-sans shrink-0">
            Focus:
          </label>
          <select
            id="course-context-select-asg"
            value={courseFilter}
            onChange={(e) => handleCourseFilterChange(e.target.value)}
            className="text-xs font-bold text-text-primary dark:text-gray-300 bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 px-3 py-1.5 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 cursor-pointer"
          >
            <option value="all">📚 All Enrolled Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
          {courseFilter !== 'all' && (
            <button
              onClick={() => handleCourseFilterChange('all')}
              className="text-[10px] font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/20 px-2.5 py-1.5 rounded-custom-md border border-red-200/50 cursor-pointer transition-colors"
            >
              Clear Focus
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-custom-card">
        <div className="flex flex-wrap items-center gap-3">
          {/* Course filter */}
          <div className="flex items-center gap-1.5 bg-bg-primary dark:bg-gray-850 px-3 py-1.5 rounded-custom-md border border-border-custom dark:border-gray-800">
            <Filter className="h-3.5 w-3.5 text-text-muted" />
            <select
              value={courseFilter}
              onChange={(e) => handleCourseFilterChange(e.target.value)}
              className="text-xs font-semibold text-text-secondary dark:text-gray-300 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 bg-bg-primary dark:bg-gray-850 px-3 py-1.5 rounded-custom-md border border-border-custom dark:border-gray-800">
            <Filter className="h-3.5 w-3.5 text-text-muted" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs font-semibold text-text-secondary dark:text-gray-300 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Input search */}
        <input
          type="text"
          placeholder="Filter by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3.5 py-1.5 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 transition-all font-sans w-full md:w-56 text-text-primary"
        />
      </div>

      {/* Board Layout */}
      {filteredAssignments.length === 0 ? (
        <div className="p-12 text-center bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-850 rounded-custom-xl shadow-custom-card space-y-4 max-w-lg mx-auto">
          <div className="h-16 w-16 bg-brand-light dark:bg-blue-950/40 text-brand-primary dark:text-blue-400 rounded-full flex items-center justify-center border border-brand-primary/10 mx-auto">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-md font-bold text-text-primary dark:text-gray-200">
              No Assignments Available
            </h3>
            <p className="text-xs text-text-muted dark:text-gray-400 font-sans leading-relaxed">
              {courseFilter === 'all' 
                ? "You have no assignments on your board. Click 'New Assignment' to create one!"
                : "No assignments available for this course."}
            </p>
          </div>
          {courseFilter !== 'all' && (
            <button
              onClick={() => handleCourseFilterChange('all')}
              className="px-4 py-2 text-xs font-bold text-brand-primary dark:text-blue-400 border border-brand-primary/20 hover:bg-brand-light dark:hover:bg-blue-950/20 rounded-custom-md cursor-pointer transition-all"
            >
              Show All Courses
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((col) => {
            const colAssignments = filteredAssignments.filter(a => a.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-bg-primary/50 dark:bg-gray-900/20 rounded-custom-lg p-4 border border-border-custom dark:border-gray-800/40 flex flex-col h-[calc(100vh-16rem)] overflow-hidden"
              >
                {/* Column Title */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-custom dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      col.id === 'todo' ? 'bg-brand-primary' :
                      col.id === 'inprogress' ? 'bg-warning' :
                      col.id === 'submitted' ? 'bg-blue-400' : 'bg-semantic-success'
                    }`}></span>
                    <h3 className="font-display font-bold text-sm text-text-primary dark:text-gray-200">
                      {col.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted bg-bg-primary dark:bg-gray-800 px-2 py-0.5 rounded-full font-mono">
                    {colAssignments.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {colAssignments.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-border-custom dark:border-gray-800/50 rounded-custom-md">
                      <p className="text-[11px] text-text-muted font-sans">No tasks in this list</p>
                    </div>
                  ) : (
                    colAssignments.map((asg) => {
                      // Determine status details
                      const today = new Date('2026-07-11');
                      const dueDate = new Date(asg.dueDate);
                      const isOverdue = dueDate < today;

                      let statusLabel = 'Pending';
                      let statusBadgeStyle = 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300';
                      let progressPercent = 15;

                      if (asg.status === 'completed') {
                        statusLabel = 'Graded';
                        statusBadgeStyle = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300';
                        progressPercent = 100;
                      } else if (asg.status === 'submitted') {
                        statusLabel = 'Submitted';
                        statusBadgeStyle = 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300';
                        progressPercent = 100;
                      } else if (isOverdue) {
                        statusLabel = 'Overdue';
                        statusBadgeStyle = 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 animate-pulse';
                        progressPercent = asg.status === 'inprogress' ? 60 : 15;
                      } else if (asg.status === 'inprogress') {
                        statusLabel = 'In Progress';
                        statusBadgeStyle = 'bg-warning-bg text-semantic-warning';
                        progressPercent = 60;
                      }

                      return (
                        <motion.div
                          key={asg.id}
                          layoutId={`asg-card-${asg.id}`}
                          className="p-4 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800/80 rounded-custom-md shadow-custom-card space-y-3 group hover:border-brand-primary/40 dark:hover:border-gray-700 hover-lift transition-all relative"
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-brand-light dark:bg-blue-950/40 text-brand-primary dark:text-blue-400 font-mono">
                              {asg.courseCode}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${statusBadgeStyle}`}>
                                {statusLabel}
                              </span>
                              <button
                                onClick={() => onDeleteAssignment(asg.id)}
                                className="p-1 text-text-muted hover:text-semantic-danger rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Title & Desc */}
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-primary dark:text-gray-200 leading-snug font-sans">
                              {asg.title}
                            </h4>
                            {asg.description && (
                              <p className="text-[10px] text-text-muted dark:text-gray-500 font-sans line-clamp-2 leading-relaxed">
                                {asg.description}
                              </p>
                            )}
                          </div>

                          {/* Progress bar inside card */}
                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between items-center text-[9px] font-sans font-medium text-text-muted">
                              <span>Work progress</span>
                              <span className="font-bold">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-bg-primary dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                              <div
                                className="bg-brand-primary h-full rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Footer Info */}
                          <div className="pt-2 border-t border-divider-custom dark:border-gray-850 flex items-center justify-between text-[10px] text-text-muted">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-text-muted" />
                              <span className="font-sans font-medium">
                                Due: {new Date(asg.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <span className="font-bold text-text-secondary dark:text-gray-450 font-mono">
                              {asg.points} pts
                            </span>
                          </div>

                          {/* State Shift Buttons (Ensuring 100% iframe interactions) */}
                          <div className="flex items-center justify-between pt-1 border-t border-dotted border-divider-custom dark:border-gray-850">
                            <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
                              asg.priority === 'high'
                                ? 'bg-danger-bg text-semantic-danger'
                                : asg.priority === 'medium'
                                ? 'bg-warning-bg text-semantic-warning'
                                : 'bg-success-bg text-semantic-success'
                            }`}>
                              {asg.priority}
                            </span>

                            <div className="flex items-center gap-1">
                              {col.id !== 'todo' && (
                                <button
                                  onClick={() => {
                                    const phases: AssignmentStatus[] = ['todo', 'inprogress', 'submitted', 'completed'];
                                    const currentIndex = phases.indexOf(col.id);
                                    onUpdateStatus(asg.id, phases[currentIndex - 1]);
                                  }}
                                  className="p-1 bg-bg-primary dark:bg-gray-850 hover:bg-gray-100 text-text-muted hover:text-brand-primary dark:hover:text-blue-400 rounded cursor-pointer transition-colors"
                                  title="Move Left"
                                >
                                  <ArrowLeft className="h-3 w-3" />
                                </button>
                              )}
                              {col.id !== 'completed' && (
                                <button
                                  onClick={() => {
                                    const phases: AssignmentStatus[] = ['todo', 'inprogress', 'submitted', 'completed'];
                                    const currentIndex = phases.indexOf(col.id);
                                    onUpdateStatus(asg.id, phases[currentIndex + 1]);
                                  }}
                                  className="p-1 bg-bg-primary dark:bg-gray-850 hover:bg-brand-light dark:hover:bg-blue-950 text-text-muted hover:text-brand-primary dark:hover:text-blue-400 rounded cursor-pointer transition-colors"
                                  title="Move Right"
                                >
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Submit Requirement Button */}
                          {(asg.status === 'todo' || asg.status === 'inprogress') && (
                            <button
                              onClick={() => onUpdateStatus(asg.id, 'submitted')}
                              className="w-full mt-2.5 py-1.5 bg-brand-primary hover:bg-brand-hover text-white text-[10px] font-bold rounded-custom-md cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                            >
                              <CheckCircle className="h-3.5 w-3.5" /> Submit Assignment
                            </button>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Assignment Modal Form */}
      {isOpenNewTaskModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg max-w-md w-full p-6 shadow-custom-modal space-y-4">
            <div className="flex items-center justify-between border-b border-divider-custom dark:border-gray-800 pb-3">
              <h3 className="font-display font-bold text-lg text-text-primary dark:text-gray-100 flex items-center gap-2">
                <KanbanSquare className="h-5 w-5 text-brand-primary" /> Create Assignment
              </h3>
              <button
                onClick={() => setIsOpenNewTaskModal(false)}
                className="text-text-muted hover:text-text-primary dark:hover:text-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted block font-sans">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Neural Net Layers"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all font-sans"
                />
              </div>

              {/* Course Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted block font-sans">
                  Associated Course
                </label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all font-sans cursor-pointer text-text-primary"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Split row: Due Date and Points */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted block font-sans">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all font-sans text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted block font-sans">
                    Max Points
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all font-sans text-text-primary"
                  />
                </div>
              </div>

              {/* Priority Radio Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted block font-sans">
                  Task Priority
                </label>
                <div className="flex items-center gap-3">
                  {['low', 'medium', 'high'].map((prio) => (
                    <label
                      key={prio}
                      className={`flex-1 flex items-center justify-center py-2 border rounded-custom-md text-xs font-bold capitalize cursor-pointer transition-all ${
                        newPriority === prio
                          ? 'bg-brand-light border-brand-primary/20 text-brand-primary dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400'
                          : 'bg-bg-primary border-border-custom dark:bg-gray-850 dark:border-gray-800 text-text-secondary hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={prio}
                        checked={newPriority === prio}
                        onChange={() => setNewPriority(prio as any)}
                        className="sr-only"
                      />
                      {prio}
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted block font-sans">
                  Task Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add summary of research requirements or guidelines..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary transition-all font-sans resize-none text-text-primary"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-divider-custom dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsOpenNewTaskModal(false)}
                  className="px-4 py-2 text-xs font-medium text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 rounded-custom-md border border-border-custom dark:border-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md shadow-custom-card cursor-pointer transition-all"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
