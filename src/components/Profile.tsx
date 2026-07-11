import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Trophy,
  Briefcase,
  ShieldCheck,
  GraduationCap,
  Mail,
  UserCheck,
  TrendingUp,
  Plus,
  X,
  Edit2,
  Trash2,
  BookOpen,
  Calendar
} from 'lucide-react';
import { UserProfile, Achievement } from '../types';

interface ProfileProps {
  user: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

export default function Profile({ user, onUpdateProfile }: ProfileProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  // Form states
  const [formName, setFormName] = useState(user.name);
  const [formEmail, setFormEmail] = useState(user.email);
  const [formDept, setFormDept] = useState(user.department);
  const [formProgram, setFormProgram] = useState(user.program);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name: formName,
      email: formEmail,
      department: formDept,
      program: formProgram
    });
    setIsEditModalOpen(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || user.skills.includes(newSkill.trim())) return;
    onUpdateProfile({
      ...user,
      skills: [...user.skills, newSkill.trim()]
    });
    setNewSkill('');
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim() || user.interests.includes(newInterest.trim())) return;
    onUpdateProfile({
      ...user,
      interests: [...user.interests, newInterest.trim()]
    });
    setNewInterest('');
  };

  const handleRemoveSkill = (skill: string) => {
    onUpdateProfile({
      ...user,
      skills: user.skills.filter(s => s !== skill)
    });
  };

  const handleRemoveInterest = (interest: string) => {
    onUpdateProfile({
      ...user,
      interests: user.interests.filter(i => i !== interest)
    });
  };

  // Get icon component dynamically based on badge icon string
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award className="h-5 w-5 text-brand-primary" />;
      case 'Trophy': return <Trophy className="h-5 w-5 text-amber-500" />;
      case 'Briefcase': return <Briefcase className="h-5 w-5 text-sky-500" />;
      case 'ShieldCheck': return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
      default: return <Award className="h-5 w-5 text-brand-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Cover and Profile Avatar */}
      <div className="bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg overflow-hidden shadow-custom-card relative">
        {/* Cover image banner */}
        <div className="h-44 w-full relative overflow-hidden bg-bg-primary dark:bg-gray-800">
          <img
            src={user.banner}
            alt="University Campus Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* User absolute bio content */}
        <div className="p-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="h-24 w-24 rounded-custom-md object-cover border-4 border-bg-surface dark:border-[#111827] shadow-md shrink-0 bg-bg-surface"
            />
            <div className="space-y-1 pb-1">
              <h1 className="text-2xl font-display font-bold text-text-primary dark:text-gray-100 leading-tight flex items-center justify-center md:justify-start gap-2">
                {user.name}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1 hover:bg-bg-primary dark:hover:bg-gray-850 rounded-custom-sm text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
                  title="Edit Profile"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </h1>
              <p className="text-xs font-semibold text-text-secondary dark:text-gray-400 font-sans">
                {user.program} • Student ID: {user.studentId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-center md:self-end">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-custom-md text-xs font-bold bg-brand-light dark:bg-brand-primary/10 text-brand-primary border border-brand-primary/10">
              <GraduationCap className="h-4 w-4" /> Academic Year 2026
            </span>
          </div>
        </div>
      </div>

      {/* 2. Stats bento cards and Academic Details split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Stats & Tag Editors */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bento Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Cumulative GPA', value: user.gpa.toFixed(2), desc: 'Dean\'s List Status', color: 'border-t-emerald-500' },
              { label: 'Credits Completed', value: user.creditsCompleted, desc: `Of ${user.creditsRequired} Required`, color: 'border-t-brand-primary' },
              { label: 'Department Rank', value: '#8', desc: 'Top 5% of program', color: 'border-t-amber-500' },
              { label: 'Academic Badges', value: user.achievements.length, desc: 'Unlocked Honors', color: 'border-t-indigo-500' }
            ].map((stat, i) => (
              <div
                key={i}
                className={`p-4 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card text-center border-t-4 ${stat.color} flex flex-col justify-between h-28`}
              >
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider font-sans block truncate">
                  {stat.label}
                </span>
                <p className="text-2xl font-display font-bold text-text-primary dark:text-gray-100 my-1">
                  {stat.value}
                </p>
                <span className="text-[9px] text-text-secondary dark:text-gray-400 font-sans block truncate">
                  {stat.desc}
                </span>
              </div>
            ))}
          </div>

          {/* Interactive Skills & Interests Tags Editor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Skills Card */}
            <div className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card space-y-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
                Technical Skills
              </h3>

              {/* Tag list */}
              <div className="flex flex-wrap gap-1.5 min-h-12">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-custom-md text-xs font-semibold bg-bg-primary dark:bg-gray-855 border border-border-custom dark:border-gray-800 text-text-secondary dark:text-gray-300 group"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-text-muted hover:text-rose-500 cursor-pointer transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add form */}
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g., Node)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 font-sans text-text-primary"
                />
                <button
                  type="submit"
                  className="px-3 bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Interests Card */}
            <div className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card space-y-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
                Research Interests
              </h3>

              {/* Tag list */}
              <div className="flex flex-wrap gap-1.5 min-h-12">
                {user.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-custom-md text-xs font-semibold bg-bg-primary dark:bg-gray-855 border border-border-custom dark:border-gray-800 text-text-secondary dark:text-gray-300 group"
                  >
                    {interest}
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-text-muted hover:text-rose-500 cursor-pointer transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add form */}
              <form onSubmit={handleAddInterest} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add interest..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 font-sans text-text-primary"
                />
                <button
                  type="submit"
                  className="px-3 bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Add
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Right Column: Academic details & Achievements/Badges */}
        <div className="space-y-6">
          
          {/* Academic Details Card */}
          <div className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
              Academic Outline
            </h3>

            <div className="space-y-3">
              {[
                { title: 'Registered Email', value: user.email, icon: Mail },
                { title: 'Program & Major', value: user.program, icon: GraduationCap },
                { title: 'Primary Department', value: user.department, icon: BookOpen },
                { title: 'Academic Advisor', value: 'Dr. Aris Thorne', icon: UserCheck }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-bg-primary dark:bg-gray-850 text-text-muted border border-border-custom rounded-custom-md flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-brand-primary" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-text-muted block leading-none font-sans font-medium">{item.title}</span>
                      <p className="text-xs font-semibold text-text-secondary dark:text-gray-300 mt-1 leading-snug break-words font-sans">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unlocked Badges / Honors */}
          <div className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
              Achievements & Badges
            </h3>

            <div className="space-y-3.5 max-h-52 overflow-y-auto pr-1">
              {user.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-start gap-3.5 p-2 bg-bg-primary/30 dark:bg-gray-855/10 border border-border-custom/50 dark:border-gray-800/40 rounded-custom-md hover:shadow-xs transition-shadow"
                >
                  <div className="h-10 w-10 bg-bg-surface dark:bg-gray-900 border border-border-custom rounded-custom-md flex items-center justify-center shrink-0 shadow-sm">
                    {getBadgeIcon(ach.icon)}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-text-primary dark:text-gray-255 leading-snug font-sans">
                      {ach.title}
                    </h4>
                    <p className="text-[10px] text-text-muted font-sans leading-normal">
                      {ach.description}
                    </p>
                    <span className="text-[8px] text-brand-primary font-mono font-bold block pt-0.5">
                      Completed {ach.unlockedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg max-w-sm w-full p-6 shadow-custom-modal space-y-4">
            <div className="flex items-center justify-between border-b border-divider-custom dark:border-gray-800 pb-3">
              <h3 className="font-display font-bold text-md text-text-primary dark:text-gray-100 flex items-center gap-2">
                <Edit2 className="h-4.5 w-4.5 text-brand-primary" /> Edit Student Bio
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-text-muted hover:text-text-primary cursor-pointer transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted block font-sans">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-1.5 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none text-text-primary"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted block font-sans">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3.5 py-1.5 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none text-text-primary"
                />
              </div>

              {/* Program Major */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted block font-sans">
                  Program & Major
                </label>
                <input
                  type="text"
                  required
                  value={formProgram}
                  onChange={(e) => setFormProgram(e.target.value)}
                  className="w-full px-3.5 py-1.5 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none text-text-primary"
                />
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted block font-sans">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                  className="w-full px-3.5 py-1.5 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none text-text-primary"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-divider-custom dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-text-secondary dark:text-gray-350 hover:bg-bg-primary dark:hover:bg-gray-850 rounded-custom-md border border-border-custom dark:border-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md shadow-custom-card cursor-pointer transition-all"
                >
                  Update Bio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
