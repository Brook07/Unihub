import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Tag,
  BookOpen,
  RefreshCw,
  Sparkles,
  Check,
  Download,
  AlertCircle,
  User
} from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
}

interface TimetableItem {
  day: string;
  startHour: number; // e.g. 9
  endHour: number;   // e.g. 11
  code: string;
  name: string;
  instructor: string;
  room: string;
  color: string;
}

// Exactly specified Kathmandu University CS-III/II timetable items with dynamic span support
const KU_TIMETABLE_ITEMS: TimetableItem[] = [
  // Monday:
  { day: 'Monday', startHour: 9, endHour: 11, code: 'COMP 314', name: 'Algorithms and Complexity', instructor: 'Dr. Prakash Poudyal', room: '9-310', color: 'blue' },
  { day: 'Monday', startHour: 12, endHour: 14, code: 'COMP 323', name: 'Graph Theory', instructor: 'Harish Chandra Bhandari', room: '8-505', color: 'orange' },
  { day: 'Monday', startHour: 14, endHour: 17, code: 'COMP 341', name: 'Human Computer Interaction', instructor: 'Dr. Sushil Shrestha', room: '9-404', color: 'purple' },

  // Wednesday:
  { day: 'Wednesday', startHour: 7, endHour: 9, code: 'COMP 302', name: 'System Analysis and Design', instructor: 'Mr. Umesh Dahal', room: '9-310', color: 'teal' },
  { day: 'Wednesday', startHour: 9, endHour: 11, code: 'COMP 343', name: 'Information System Ethics', instructor: 'Mr. Lal Bahadur Khadka', room: '10-107', color: 'navy' },

  // Thursday:
  { day: 'Thursday', startHour: 9, endHour: 11, code: 'COMP 343', name: 'Information System Ethics', instructor: 'Mr. Lal Bahadur Khadka', room: '8-502', color: 'navy' },
  { day: 'Thursday', startHour: 12, endHour: 14, code: 'COMP 409', name: 'Compiler Design', instructor: 'Mr. Sushil Nepal', room: '9-404', color: 'gold' },
  { day: 'Thursday', startHour: 14, endHour: 16, code: 'COMP 323', name: 'Graph Theory', instructor: 'Harish Chandra Bhandari', room: '8-505', color: 'orange' },

  // Friday:
  { day: 'Friday', startHour: 7, endHour: 9, code: 'COMP 302', name: 'System Analysis and Design', instructor: 'Mr. Umesh Dahal', room: '9-304', color: 'teal' },
  { day: 'Friday', startHour: 9, endHour: 11, code: 'COMP 409', name: 'Compiler Design', instructor: 'Mr. Sushil Nepal', room: '9-310', color: 'gold' },
  { day: 'Friday', startHour: 12, endHour: 14, code: 'COMP 314', name: 'Algorithms and Complexity', instructor: 'Dr. Prakash Poudyal', room: '9-402', color: 'blue' }
];

const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Mapping of code or color identifier to professional academic styled colors
const getSubjectStyle = (input: string) => {
  const normalized = input.toUpperCase().replace(/\s+/g, '');
  
  if (normalized.includes('COMP314') || normalized === 'BLUE') {
    return {
      bg: 'bg-blue-50/60 hover:bg-blue-100/60 border-blue-200/50 text-blue-800 border-l-[5px] border-l-brand-primary dark:bg-blue-950/20 dark:hover:bg-blue-950/40 dark:border-blue-900/40 dark:text-blue-200 dark:border-l-brand-primary',
      badge: 'bg-blue-100/80 text-blue-800 border-blue-200/40 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900/40',
      dot: 'bg-brand-primary',
      text: 'text-blue-900 font-semibold dark:text-blue-100',
      meta: 'text-blue-700/80 dark:text-blue-400',
      icon: 'text-brand-primary'
    };
  }
  if (normalized.includes('COMP313') || normalized === 'CYAN') {
    return {
      bg: 'bg-cyan-50/60 hover:bg-cyan-100/60 border-cyan-200/50 text-cyan-800 border-l-[5px] border-l-cyan-600 dark:bg-cyan-950/20 dark:hover:bg-cyan-950/40 dark:border-cyan-900/40 dark:text-cyan-200 dark:border-l-cyan-500',
      badge: 'bg-cyan-100/80 text-cyan-800 border-cyan-200/40 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-900/40',
      dot: 'bg-cyan-600',
      text: 'text-cyan-900 font-semibold dark:text-cyan-100',
      meta: 'text-cyan-700/80 dark:text-cyan-400',
      icon: 'text-cyan-600'
    };
  }
  if (normalized.includes('COMP323') || normalized === 'ORANGE' || normalized === 'AMBER') {
    return {
      bg: 'bg-amber-50/60 hover:bg-amber-100/60 border-amber-200/50 text-amber-800 border-l-[5px] border-l-amber-600 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 dark:border-amber-900/40 dark:text-amber-200 dark:border-l-amber-500',
      badge: 'bg-amber-100/80 text-amber-800 border-amber-200/40 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900/40',
      dot: 'bg-amber-600',
      text: 'text-amber-900 font-semibold dark:text-amber-100',
      meta: 'text-amber-700/80 dark:text-amber-400',
      icon: 'text-amber-600'
    };
  }
  if (normalized.includes('COMP341') || normalized === 'PURPLE' || normalized === 'VIOLET') {
    return {
      bg: 'bg-purple-50/60 hover:bg-purple-100/60 border-purple-200/50 text-purple-800 border-l-[5px] border-l-purple-600 dark:bg-purple-950/20 dark:hover:bg-purple-950/40 dark:border-purple-900/40 dark:text-purple-200 dark:border-l-purple-500',
      badge: 'bg-purple-100/80 text-purple-800 border-purple-200/40 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900/40',
      dot: 'bg-purple-600',
      text: 'text-purple-900 font-semibold dark:text-purple-100',
      meta: 'text-purple-700/80 dark:text-purple-400',
      icon: 'text-purple-600'
    };
  }
  if (normalized.includes('COMP302') || normalized === 'TEAL' || normalized === 'EMERALD') {
    return {
      bg: 'bg-teal-50/60 hover:bg-teal-100/60 border-teal-200/50 text-teal-800 border-l-[5px] border-l-teal-600 dark:bg-teal-950/20 dark:hover:bg-teal-950/40 dark:border-teal-900/40 dark:text-teal-200 dark:border-l-teal-500',
      badge: 'bg-teal-100/80 text-teal-800 border-teal-200/40 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-900/40',
      dot: 'bg-teal-600',
      text: 'text-teal-900 font-semibold dark:text-teal-100',
      meta: 'text-teal-700/80 dark:text-teal-400',
      icon: 'text-teal-600'
    };
  }
  if (normalized.includes('COMP343') || normalized === 'NAVY' || normalized === 'INDIGO') {
    return {
      bg: 'bg-indigo-50/60 hover:bg-indigo-100/60 border-indigo-200/50 text-indigo-800 border-l-[5px] border-l-indigo-600 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 dark:border-indigo-900/40 dark:text-indigo-200 dark:border-l-indigo-500',
      badge: 'bg-indigo-100/80 text-indigo-800 border-indigo-200/40 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-900/40',
      dot: 'bg-indigo-600',
      text: 'text-indigo-900 font-semibold dark:text-indigo-100',
      meta: 'text-indigo-700/80 dark:text-indigo-400',
      icon: 'text-indigo-600'
    };
  }
  if (normalized.includes('COMP409') || normalized === 'GOLD' || normalized === 'OLIVE' || normalized === 'ROSE' || normalized === 'YELLOW') {
    return {
      bg: 'bg-rose-50/60 hover:bg-rose-100/60 border-rose-200/50 text-rose-800 border-l-[5px] border-l-rose-600 dark:bg-yellow-950/20 dark:hover:bg-yellow-950/40 dark:border-yellow-900/40 dark:text-yellow-200 dark:border-l-yellow-500',
      badge: 'bg-rose-100/80 text-rose-800 border-rose-200/40 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-900/40',
      dot: 'bg-rose-600',
      text: 'text-rose-900 font-semibold dark:text-yellow-100',
      meta: 'text-rose-700/80 dark:text-yellow-400',
      icon: 'text-rose-600'
    };
  }
  
  return {
    bg: 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800 border-l-[5px] border-l-gray-500 dark:bg-gray-900/40 dark:hover:bg-gray-900/60 dark:border-gray-700/30 dark:text-gray-200 dark:border-l-gray-500',
    badge: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20',
    dot: 'bg-gray-500',
    text: 'text-gray-900 font-semibold dark:text-gray-100',
    meta: 'text-gray-700/80 dark:text-gray-300/70',
    icon: 'text-gray-500 dark:text-gray-400'
  };
};

export default function CalendarView({ events, onAddEvent }: CalendarViewProps) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 0-indexed, 6 = July
  const [viewType, setViewType] = useState<'timetable' | 'month' | 'day'>('timetable');
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-13'); // default Monday
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<string>('Monday');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCompleted, setSyncCompleted] = useState(false);

  // Custom Event Form States
  const [evtTitle, setEvtTitle] = useState('');
  const [evtTime, setEvtTime] = useState('10:00 AM');
  const [evtDuration, setEvtDuration] = useState('60m');
  const [evtLocation, setEvtLocation] = useState('Room 9-310');
  const [evtCategory, setEvtCategory] = useState<'class' | 'exam' | 'assignment' | 'meeting' | 'study'>('study');
  const [evtColor, setEvtColor] = useState('blue');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOffset = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOffset = getFirstDayOffset(currentMonth, currentYear);

  // Generate Month Matrix
  const calendarDays: { dayNum: number | null; dateString: string | null }[] = [];
  
  for (let i = 0; i < firstDayOffset; i++) {
    calendarDays.push({ dayNum: null, dateString: null });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = (currentMonth + 1) < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
    calendarDays.push({
      dayNum: day,
      dateString: `${currentYear}-${monthStr}-${dayStr}`
    });
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleAddCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim()) return;

    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: evtTitle,
      date: selectedDate,
      time: evtTime,
      duration: evtDuration,
      location: evtLocation,
      color: evtColor,
      type: evtCategory
    };

    onAddEvent(newEvt);
    setEvtTitle('');
    setIsEventModalOpen(false);
  };

  const handleCalendarSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncCompleted(true);
      setTimeout(() => setSyncCompleted(false), 3000);
    }, 1500);
  };

  const selectedDateEvents = events.filter(e => e.date === selectedDate);

  // Study Progress Calculations
  const totalStudyTarget = 20;
  const loggedStudyHours = 14.5;
  const progressPercent = Math.round((loggedStudyHours / totalStudyTarget) * 100);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const viewTypes = [
    { id: 'timetable', label: 'Weekly Timetable' },
    { id: 'month', label: 'Monthly' },
    { id: 'day', label: 'Day' }
  ];

  return (
    <div className="bg-bg-card text-text-primary rounded-custom-xl p-6 border border-border-custom shadow-custom-card space-y-6">
      
      {/* Dynamic Styled Header Area */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-border-custom">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 bg-brand-light text-brand-primary border border-blue-100 rounded-custom-lg flex items-center justify-center shadow-sm">
            <Calendar className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-lg md:text-xl text-text-primary leading-none tracking-tight">
              Kathmandu University Timetable
            </h2>
            <span className="text-xs text-text-secondary font-medium mt-1.5 block">
              Year III / Semester II • Computer Science
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle Pill Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-gray-800 border border-slate-200/60 dark:border-gray-700 rounded-full p-1">
            {viewTypes.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewType(tab.id as any)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  viewType === tab.id
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-text-secondary dark:text-gray-300 hover:text-text-primary dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sync Button */}
          <button
            onClick={handleCalendarSync}
            disabled={isSyncing}
            className={`px-4 py-1.5 text-xs font-bold rounded-custom-md border cursor-pointer transition-all flex items-center gap-2 ${
              syncCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-brand-primary hover:bg-brand-hover text-white border-transparent shadow-sm'
            }`}
          >
            {isSyncing ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : syncCompleted ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            {isSyncing ? 'Syncing...' : syncCompleted ? 'Synced' : 'Sync Calendar'}
          </button>
        </div>
      </div>

      {/* Main Grid View Area (Left 3 Columns & Right Sidebar Layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left main area (3 columns) */}
        <div className="xl:col-span-3 space-y-6">
          
          <AnimatePresence mode="wait">
            {/* 1. WEEKLY TIMETABLE GRID VIEW */}
            {viewType === 'timetable' && (
              <motion.div
                key="timetable"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                
                {/* Mobile Selector for Day View fallback */}
                <div className="block lg:hidden">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider font-sans">
                      Select Day Schedule:
                    </h3>
                  </div>
                  <div className="grid grid-cols-6 gap-1 bg-slate-100 dark:bg-gray-800 p-1 border border-slate-200 dark:border-gray-700 rounded-custom-md">
                    {DAYS_OF_WEEK.map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedTimetableDay(d)}
                        className={`py-2 text-[11px] font-bold rounded-custom-sm transition-all cursor-pointer ${
                          selectedTimetableDay === d
                            ? 'bg-brand-primary text-white shadow-sm'
                            : 'text-text-secondary dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-text-primary dark:hover:text-white'
                        }`}
                      >
                        {d.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop and Tablet Timetable Scrollable Grid */}
                <div className="bg-bg-card border border-border-custom rounded-custom-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left min-w-[1000px]">
                      <thead>
                        <tr className="bg-bg-sidebar border-b border-border-custom font-sans">
                          <th className="sticky left-0 bg-bg-sidebar z-20 py-4 px-4 text-xs font-bold text-text-secondary uppercase border-r border-border-custom w-32 shrink-0 text-center">
                            Day / Slot
                          </th>
                          {HOURS.map((hour) => (
                            <th
                              key={hour}
                              className="py-4 px-2 text-[11px] font-bold text-text-secondary uppercase text-center border-r border-border-custom last:border-r-0 min-w-[100px]"
                            >
                              {hour}:00-{(hour + 1)}:00
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {DAYS_OF_WEEK.map((day) => {
                          const rowCells: React.ReactNode[] = [];
                          let currentHourIdx = 0;

                          while (currentHourIdx < HOURS.length) {
                            const hour = HOURS[currentHourIdx];
                            const classItem = KU_TIMETABLE_ITEMS.find(
                              (item) => item.day === day && item.startHour === hour
                            );

                            if (classItem) {
                              const span = classItem.endHour - classItem.startHour;
                              const style = getSubjectStyle(classItem.code);

                              rowCells.push(
                                <td
                                  key={`${day}-${hour}`}
                                  colSpan={span}
                                  className="p-1 border-r border-border-custom/50 align-middle min-w-[160px]"
                                >
                                  <div
                                    className={`p-2.5 rounded-custom-md border-l-[5px] h-full flex flex-col justify-between hover:shadow-md transition-all duration-150 border border-border-custom/30 ${style.bg}`}
                                  >
                                    <div>
                                      <span className="text-[10px] font-mono font-bold tracking-wider block leading-none uppercase text-text-secondary opacity-75 mb-1">
                                        {classItem.code}
                                      </span>
                                      <h4 className={`text-xs ${style.text} tracking-tight line-clamp-1 leading-snug`} title={classItem.name}>
                                        {classItem.name}
                                      </h4>
                                    </div>
                                    <div className={`mt-2.5 pt-1.5 border-t border-slate-200/50 flex items-center justify-between text-[10px] font-medium font-sans ${style.meta}`}>
                                      <span className="truncate max-w-[85px] flex items-center gap-1" title={classItem.instructor}>
                                        <User className="h-3 w-3 opacity-75 shrink-0" />
                                        {classItem.instructor.split(' ').pop()}
                                      </span>
                                      <span className="font-bold shrink-0 font-mono flex items-center gap-1">
                                        <MapPin className="h-3 w-3 opacity-75 shrink-0" />
                                        {classItem.room}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              );
                              currentHourIdx += span;
                            } else {
                              rowCells.push(
                                <td
                                  key={`${day}-${hour}`}
                                  colSpan={1}
                                  className="p-2 border-r border-border-custom/50 text-center text-[10px] font-bold text-text-muted/30 font-mono bg-transparent align-middle select-none"
                                >
                                  -
                                </td>
                              );
                              currentHourIdx += 1;
                            }
                          }

                          return (
                            <tr
                              key={day}
                              className="border-b border-border-custom/50 last:border-b-0 hover:bg-bg-sidebar/50 transition-colors"
                            >
                              <td className="sticky left-0 bg-bg-sidebar z-10 py-5 px-4 font-display font-bold text-xs text-text-primary border-r border-border-custom w-32 shrink-0 text-center select-none">
                                {day}
                              </td>
                              {rowCells}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile View Stack (Renders selected day as list view) */}
                <div className="block lg:hidden p-4 space-y-3 bg-bg-card rounded-custom-xl border border-border-custom shadow-sm">
                  <div className="flex items-center justify-between border-b border-border-custom pb-2 mb-2">
                    <span className="text-sm font-extrabold text-brand-primary font-display">
                      {selectedTimetableDay}'s Schedule
                    </span>
                    <span className="text-[10px] text-text-secondary font-sans font-medium uppercase tracking-wider">
                      Year III Semester II
                    </span>
                  </div>

                  {(() => {
                    const daySlots = KU_TIMETABLE_ITEMS.filter(s => s.day === selectedTimetableDay);
                    if (daySlots.length === 0) {
                      return (
                        <div className="py-12 text-center text-text-secondary font-medium font-sans text-xs">
                          <AlertCircle className="h-6 w-6 text-text-muted mx-auto mb-2 opacity-50" />
                          No classes scheduled for {selectedTimetableDay}.
                        </div>
                      );
                    }

                    return daySlots.map((item, idx) => {
                      const style = getSubjectStyle(item.code);
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-custom-lg border border-border-custom flex flex-col justify-between gap-3 transition-all ${style.bg}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-bold tracking-wide font-mono block text-text-secondary">
                                {item.code} • {item.startHour < 10 ? `0${item.startHour}` : item.startHour}:00 - {item.endHour < 10 ? `0${item.endHour}` : item.endHour}:00
                              </span>
                              <h4 className={`text-sm tracking-tight mt-1 ${style.text}`}>
                                {item.name}
                              </h4>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-white/80 dark:bg-gray-800/80 border border-border-custom dark:border-gray-700 text-[10px] font-bold font-mono text-text-primary dark:text-gray-200">
                              Room {item.room}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] border-t border-slate-200/50 pt-2 opacity-90 text-text-secondary font-sans">
                            <span className="flex items-center gap-1"><User className="h-3 w-3 opacity-70" /> Instructor: {item.instructor}</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Info Bar */}
                <div className="p-4 bg-brand-light/30 border border-blue-200 rounded-custom-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans text-text-primary">
                  <div className="flex items-center gap-2.5 text-text-secondary">
                    <span className="h-2 w-2 rounded-full bg-brand-primary animate-ping shrink-0"></span>
                    <p className="font-semibold text-text-primary">
                      Ongoing: <span className="text-brand-primary font-bold">COMP 314 (Algorithms and Complexity)</span> is recommended for focus today!
                    </p>
                  </div>
                  <div className="text-[10px] font-bold text-gray-700 dark:text-gray-300 font-mono bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 px-2.5 py-1 rounded-full shadow-sm">
                    Time Zone: Kathmandu, Nepal (UTC+5:45)
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. MONTHLY CALENDAR GRID VIEW */}
            {viewType === 'month' && (
              <motion.div
                key="month"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between p-3.5 bg-bg-sidebar border border-border-custom rounded-custom-xl shadow-sm">
                  <span className="text-xs font-bold text-text-secondary font-mono uppercase tracking-wider">
                    Monthly Grid view
                  </span>
                  <div className="flex items-center gap-1.5 border border-border-custom rounded-custom-md p-1 bg-bg-card">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1 hover:bg-bg-sidebar rounded text-text-secondary cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentYear(2026);
                        setCurrentMonth(6);
                        setSelectedDate('2026-07-13');
                      }}
                      className="px-2.5 py-0.5 text-xs font-bold text-text-primary hover:bg-bg-sidebar rounded cursor-pointer"
                    >
                      July
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-1 hover:bg-bg-sidebar rounded text-text-secondary cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-bg-card border border-border-custom rounded-custom-xl overflow-hidden shadow-sm">
                  <div className="grid grid-cols-7 border-b border-border-custom text-center bg-bg-sidebar/80 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7">
                    {calendarDays.map((cell, idx) => {
                      const isSelected = cell.dateString === selectedDate;
                      const hasEvents = cell.dateString && events.some(e => e.date === cell.dateString);
                      const dayEventsList = cell.dateString ? events.filter(e => e.date === cell.dateString) : [];

                      return (
                        <div
                          key={idx}
                          onClick={() => cell.dateString && setSelectedDate(cell.dateString)}
                          className={`min-h-[100px] p-2 border-r border-b border-border-custom/60 last:border-r-0 relative cursor-pointer hover:bg-bg-sidebar/50 transition-colors flex flex-col justify-between ${
                            cell.dayNum === null ? 'bg-bg-sidebar/30 cursor-not-allowed pointer-events-none' : ''
                          } ${isSelected ? 'bg-brand-light/30 border-2 border-brand-primary z-10' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold font-mono h-6 w-6 flex items-center justify-center rounded-full ${
                              isSelected
                                ? 'bg-brand-primary text-white shadow-sm'
                                : cell.dateString === '2026-07-13'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'text-text-secondary'
                            }`}>
                              {cell.dayNum}
                            </span>
                            {hasEvents && (
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>
                            )}
                          </div>

                          <div className="space-y-1 mt-2">
                            {dayEventsList.slice(0, 2).map((evt) => {
                              const style = getSubjectStyle(evt.courseCode || evt.color);
                              
                              // Translate codes like "COMP 314" to full formatted course names
                              let displayTitle = evt.title;
                              const titleUpper = evt.title.toUpperCase();
                              if (titleUpper.includes('COMP 302') || titleUpper.includes('COMP302')) {
                                displayTitle = 'COMP 302 – System Analysis and Design';
                              } else if (titleUpper.includes('COMP 314') || titleUpper.includes('COMP314')) {
                                displayTitle = 'COMP 314 – Algorithms and Complexity';
                              } else if (titleUpper.includes('COMP 323') || titleUpper.includes('COMP323')) {
                                displayTitle = 'COMP 323 – Graph Theory';
                              } else if (titleUpper.includes('COMP 341') || titleUpper.includes('COMP341')) {
                                displayTitle = 'COMP 341 – Human Computer Interaction';
                              } else if (titleUpper.includes('COMP 343') || titleUpper.includes('COMP343')) {
                                displayTitle = 'COMP 343 – Information System Ethics';
                              } else if (titleUpper.includes('COMP 409') || titleUpper.includes('COMP409')) {
                                displayTitle = 'COMP 409 – Compiler Design';
                              } else if (titleUpper.includes('COMP 313') || titleUpper.includes('COMP313')) {
                                displayTitle = 'COMP 313 – Combined Computer Project';
                              } else {
                                displayTitle = evt.title.split(':')[1] || evt.title;
                              }

                              return (
                                <div
                                  key={evt.id}
                                  className={`px-1.5 py-0.5 text-[9px] font-bold rounded truncate leading-tight border ${style.badge}`}
                                  title={displayTitle}
                                >
                                  {displayTitle}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. DETAILED DAY TIMELINE VIEW */}
            {viewType === 'day' && (
              <motion.div
                key="day"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.18 }}
                className="bg-bg-card border border-border-custom rounded-custom-xl p-6 shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between border-b border-border-custom pb-3">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-text-primary font-sans">
                      Timeline Schedule
                    </h3>
                    <p className="text-[11px] text-text-secondary font-sans font-medium">
                      Detailed daily plan for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3.5 py-1.5 text-xs bg-bg-sidebar border border-border-custom rounded-custom-md focus:outline-none focus:ring-1 focus:ring-brand-primary text-text-primary cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedDateEvents.length === 0 ? (
                    <div className="text-center py-16 text-text-secondary">
                      <AlertCircle className="h-8 w-8 text-text-muted mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium font-sans">No sessions scheduled for this date.</p>
                      <p className="text-[10px] mt-1 font-sans">Use the 'Add Agenda' button in the sidebar to insert a custom task.</p>
                    </div>
                  ) : (
                    <div className="relative pl-6 border-l border-border-custom space-y-6 py-2">
                      {selectedDateEvents.map((evt) => {
                        const style = getSubjectStyle(evt.courseCode || evt.color);
                        
                        // Map subject names dynamically
                        let displayTitle = evt.title;
                        const titleUpper = evt.title.toUpperCase();
                        if (titleUpper.includes('COMP 302') || titleUpper.includes('COMP302')) {
                          displayTitle = 'COMP 302 – System Analysis and Design';
                        } else if (titleUpper.includes('COMP 314') || titleUpper.includes('COMP314')) {
                          displayTitle = 'COMP 314 – Algorithms and Complexity';
                        } else if (titleUpper.includes('COMP 323') || titleUpper.includes('COMP323')) {
                          displayTitle = 'COMP 323 – Graph Theory';
                        } else if (titleUpper.includes('COMP 341') || titleUpper.includes('COMP341')) {
                          displayTitle = 'COMP 341 – Human Computer Interaction';
                        } else if (titleUpper.includes('COMP 343') || titleUpper.includes('COMP343')) {
                          displayTitle = 'COMP 343 – Information System Ethics';
                        } else if (titleUpper.includes('COMP 409') || titleUpper.includes('COMP409')) {
                          displayTitle = 'COMP 409 – Compiler Design';
                        } else if (titleUpper.includes('COMP 313') || titleUpper.includes('COMP313')) {
                          displayTitle = 'COMP 313 – Combined Computer Project';
                        }

                        return (
                          <div key={evt.id} className="relative group">
                            {/* Marker circle */}
                            <span className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-4 border-white dark:border-[#111827] ${style.dot} shadow-sm`}></span>

                            <div className={`p-4 border border-border-custom rounded-custom-lg hover:shadow-md transition-all duration-150 ${style.bg}`}>
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded ${style.badge}`}>
                                  <Clock className="h-3.5 w-3.5" /> {evt.time} ({evt.duration})
                                </span>
                                <span className="text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-border-custom dark:border-gray-700 text-text-secondary dark:text-gray-300 font-mono">
                                  {evt.type}
                                </span>
                              </div>
                              <h4 className={`text-xs md:text-sm font-bold font-sans ${style.text}`}>
                                {displayTitle}
                              </h4>
                              <p className="text-[11px] text-text-secondary mt-2 font-sans flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-text-muted" /> Venue: {evt.location}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Color & Course Legend */}
          <div className="p-4 bg-bg-sidebar border border-border-custom rounded-custom-xl flex flex-wrap items-center gap-4 text-[10px] font-sans font-bold text-text-secondary uppercase tracking-wider shadow-sm">
            <span className="text-text-primary">Course Legend:</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-teal-500 shadow-sm"></span> COMP 302 (System Analysis and Design)</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-brand-primary shadow-sm"></span> COMP 314 (Algorithms and Complexity)</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-sm"></span> COMP 323 (Graph Theory)</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-purple-500 shadow-sm"></span> COMP 341 (Human Computer Interaction)</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-sm"></span> COMP 343 (Information System Ethics)</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm"></span> COMP 409 (Compiler Design)</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-sm"></span> COMP 313 (Combined Computer Project)</span>
          </div>
        </div>

        {/* Right Sidebar Widgets Pane (1 Column) */}
        <div className="space-y-6">
          
          {/* Agenda list card for currently selected day */}
          <div className="p-5 bg-bg-card border border-border-custom rounded-custom-xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border-custom pb-3">
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Agenda List
                </h3>
                <p className="text-[10px] text-text-secondary font-sans mt-0.5 font-medium">
                  {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
              
              <button
                onClick={() => setIsEventModalOpen(true)}
                className="p-1.5 bg-brand-light hover:bg-blue-100 text-brand-primary border border-blue-200 rounded-custom-sm cursor-pointer transition-colors"
                title="Add Event"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {selectedDateEvents.length === 0 ? (
                <p className="text-xs text-text-muted py-6 text-center font-sans font-medium">No custom events on this day.</p>
              ) : (
                selectedDateEvents.map((evt) => {
                  const style = getSubjectStyle(evt.courseCode || evt.color);
                  
                  // Translate subject titles
                  let displayTitle = evt.title;
                  const titleUpper = evt.title.toUpperCase();
                  if (titleUpper.includes('COMP 302') || titleUpper.includes('COMP302')) {
                    displayTitle = 'COMP 302 – System Analysis and Design';
                  } else if (titleUpper.includes('COMP 314') || titleUpper.includes('COMP314')) {
                    displayTitle = 'COMP 314 – Algorithms and Complexity';
                  } else if (titleUpper.includes('COMP 323') || titleUpper.includes('COMP323')) {
                    displayTitle = 'COMP 323 – Graph Theory';
                  } else if (titleUpper.includes('COMP 341') || titleUpper.includes('COMP341')) {
                    displayTitle = 'COMP 341 – Human Computer Interaction';
                  } else if (titleUpper.includes('COMP 343') || titleUpper.includes('COMP343')) {
                    displayTitle = 'COMP 343 – Information System Ethics';
                  } else if (titleUpper.includes('COMP 409') || titleUpper.includes('COMP409')) {
                    displayTitle = 'COMP 409 – Compiler Design';
                  } else if (titleUpper.includes('COMP 313') || titleUpper.includes('COMP313')) {
                    displayTitle = 'COMP 313 – Combined Computer Project';
                  }

                  return (
                    <div
                      key={evt.id}
                      className={`p-3 rounded-custom-md border border-border-custom/50 shadow-sm ${style.bg}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wide font-mono">
                          {evt.time} ({evt.duration})
                        </span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase ${style.badge}`}>
                          {evt.type}
                        </span>
                      </div>
                      <h4 className={`text-xs font-semibold font-sans ${style.text}`}>
                        {displayTitle}
                      </h4>
                      <p className="text-[9px] text-text-secondary font-sans mt-1">
                        📍 {evt.location}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Academic Focus Progress widget */}
          <div className="p-5 bg-bg-card border border-border-custom rounded-custom-xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-text-primary">
              Study Focus This Week
            </h3>

            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0">
                <svg className="h-20 w-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    className="stroke-slate-100 dark:stroke-gray-800"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    className="stroke-brand-primary transition-all duration-300"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-mono font-bold text-brand-primary">
                    {progressPercent}%
                  </span>
                  <span className="text-[8px] font-sans text-text-secondary leading-none">
                    goal
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-text-primary font-sans leading-snug">
                  {loggedStudyHours} of {totalStudyTarget} Hours Completed
                </p>
                <p className="text-[10px] text-text-secondary leading-relaxed font-sans">
                  You need 5.5 hours more to hit your weekly target. Keep pushing!
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Add Agenda Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-bg-card border border-border-custom rounded-custom-xl max-w-sm w-full p-6 shadow-custom-card space-y-4 text-text-primary">
            <div className="flex items-center justify-between border-b border-border-custom pb-3">
              <h3 className="font-sans font-bold text-md text-text-primary flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-primary" /> Add Agenda Event
              </h3>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomEvent} className="space-y-4">
              {/* Event Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary block font-sans">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Algorithms Lab Revision"
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  className="w-full px-3.5 py-1.5 text-xs bg-bg-sidebar border border-border-custom rounded-custom-md focus:outline-none focus:ring-1 focus:ring-brand-primary text-text-primary placeholder-gray-400"
                />
              </div>

              {/* Time and Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary block font-sans">
                    Start Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM"
                    value={evtTime}
                    onChange={(e) => setEvtTime(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-xs bg-bg-sidebar border border-border-custom rounded-custom-md focus:outline-none focus:ring-1 focus:ring-brand-primary text-text-primary placeholder-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary block font-sans">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 60m, 90m"
                    value={evtDuration}
                    onChange={(e) => setEvtDuration(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-xs bg-bg-sidebar border border-border-custom rounded-custom-md focus:outline-none focus:ring-1 focus:ring-brand-primary text-text-primary placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary block font-sans">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Room 9-310"
                  value={evtLocation}
                  onChange={(e) => setEvtLocation(e.target.value)}
                  className="w-full px-3.5 py-1.5 text-xs bg-bg-sidebar border border-border-custom rounded-custom-md focus:outline-none focus:ring-1 focus:ring-brand-primary text-text-primary placeholder-gray-400"
                />
              </div>

              {/* Event Category & Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary block font-sans">
                    Agenda Type
                  </label>
                  <select
                    value={evtCategory}
                    onChange={(e) => setEvtCategory(e.target.value as any)}
                    className="w-full px-3.5 py-1.5 text-xs bg-bg-sidebar border border-border-custom rounded-custom-md focus:outline-none focus:ring-1 focus:ring-brand-primary text-text-primary cursor-pointer"
                  >
                    <option value="study">Study Circle</option>
                    <option value="class">Lectures</option>
                    <option value="exam">Midterms/Quizzes</option>
                    <option value="meeting">Office Hours</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary block font-sans">
                    Color Accent
                  </label>
                  <select
                    value={evtColor}
                    onChange={(e) => setEvtColor(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-xs bg-bg-sidebar border border-border-custom rounded-custom-md focus:outline-none focus:ring-1 focus:ring-brand-primary text-text-primary cursor-pointer"
                  >
                    <option value="blue">Blue</option>
                    <option value="emerald">Teal</option>
                    <option value="amber">Orange</option>
                    <option value="violet">Purple</option>
                    <option value="rose">Gold</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-custom">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-sidebar rounded-custom-md border border-border-custom cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md shadow-sm cursor-pointer transition-all active:scale-95"
                >
                  Add Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
