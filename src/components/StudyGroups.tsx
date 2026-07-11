import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users2,
  Plus,
  Compass,
  TrendingUp,
  MessageSquare,
  Clock,
  ExternalLink,
  BookOpen,
  CheckCircle,
  Hash,
  AlertCircle
} from 'lucide-react';
import { StudyGroup } from '../types';

interface StudyGroupsProps {
  groups: StudyGroup[];
  onJoinGroup: (id: string) => void;
  onAddGroup: (group: StudyGroup) => void;
}

export default function StudyGroups({ groups, onJoinGroup, onAddGroup }: StudyGroupsProps) {
  const [activeTab, setActiveTab] = useState<'joined' | 'discover'>('joined');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [grpName, setGrpName] = useState('');
  const [grpCourse, setGrpCourse] = useState('CS-401');
  const [grpMax, setGrpMax] = useState(10);
  const [grpDesc, setGrpDesc] = useState('');
  const [grpTopic1, setGrpTopic1] = useState('');
  const [grpTopic2, setGrpTopic2] = useState('');

  const joinedGroups = groups.filter(g => g.isJoined);
  const discoverGroups = groups.filter(g => !g.isJoined);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grpName.trim() || !grpDesc.trim()) return;

    const topicsList = [grpTopic1, grpTopic2].filter(t => t.trim() !== '');

    const newGrp: StudyGroup = {
      id: `grp-${Date.now()}`,
      name: grpName,
      courseCode: grpCourse,
      membersCount: 1,
      maxMembers: grpMax,
      description: grpDesc,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=300&h=180',
      nextMeeting: 'To Be Decided',
      isJoined: true,
      topics: topicsList.length > 0 ? topicsList : ['General Study', 'Code Review']
    };

    onAddGroup(newGrp);
    setGrpName('');
    setGrpDesc('');
    setGrpTopic1('');
    setGrpTopic2('');
    setIsCreateModalOpen(false);
  };

  // Activity stats mockup using customized pure SVGs for elite look & feel
  const groupStats = [
    { label: 'AI & Deep Learning', hours: 14.5, pct: 100, color: 'bg-brand-primary' },
    { label: 'Software Arch Patterns', hours: 8.0, pct: 55, color: 'bg-indigo-500' },
    { label: 'DBMS Optimization', hours: 4.5, pct: 31, color: 'bg-sky-500' },
    { label: 'Calculus Peer Sync', hours: 2.0, pct: 14, color: 'bg-amber-500' }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Groups Display Feed (Left 2 Columns) */}
      <div className="xl:col-span-2 space-y-6">
        {/* Toggle tabs and Create button */}
        <div className="flex items-center justify-between border-b border-border-custom dark:border-gray-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('joined')}
              className={`px-4 py-2 text-xs font-bold rounded-custom-md transition-all cursor-pointer ${
                activeTab === 'joined'
                  ? 'bg-brand-primary text-white shadow-custom-card'
                  : 'text-text-muted hover:bg-bg-primary dark:text-gray-400 dark:hover:bg-gray-850'
              }`}
            >
              My Joined Groups ({joinedGroups.length})
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 text-xs font-bold rounded-custom-md transition-all cursor-pointer ${
                activeTab === 'discover'
                  ? 'bg-brand-primary text-white shadow-custom-card'
                  : 'text-text-muted hover:bg-bg-primary dark:text-gray-400 dark:hover:bg-gray-850'
              }`}
            >
              Discover Communities ({discoverGroups.length})
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md cursor-pointer transition-all inline-flex items-center gap-1.5 shadow-custom-card"
          >
            <Plus className="h-4 w-4" /> Start Group
          </button>
        </div>

        {/* Display List of Groups */}
        {activeTab === 'joined' ? (
          joinedGroups.length === 0 ? (
            <div className="text-center py-12 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card">
              <Users2 className="h-10 w-10 text-text-muted mx-auto mb-3" />
              <h3 className="text-sm font-bold text-text-primary dark:text-gray-200">No joined study groups</h3>
              <p className="text-xs text-text-muted font-sans mt-1">Navigate to "Discover Communities" to connect with peers!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {joinedGroups.map((grp) => (
                <div
                  key={grp.id}
                  className="bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg overflow-hidden shadow-custom-card hover:shadow-md hover-lift transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-32 bg-bg-primary relative">
                      <img
                        src={grp.image}
                        alt={grp.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bg-surface dark:bg-gray-900/95 text-brand-primary font-mono shadow-sm">
                          {grp.courseCode}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-text-primary dark:text-gray-200 leading-snug line-clamp-1 font-sans">
                          {grp.name}
                        </h4>
                        <p className="text-[10px] text-text-muted font-sans mt-1 leading-relaxed line-clamp-2">
                          {grp.description}
                        </p>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {grp.topics.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center px-2 py-0.5 rounded-custom-sm text-[9px] font-semibold bg-bg-primary dark:bg-gray-850 text-text-secondary dark:text-gray-400 border border-border-custom dark:border-gray-800"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer metadata info */}
                  <div className="p-4 bg-bg-primary/40 dark:bg-gray-855/10 border-t border-divider-custom dark:border-gray-800 flex items-center justify-between text-[10px] text-text-muted">
                    <span className="truncate max-w-28 font-medium">📅 {grp.nextMeeting || 'No meeting set'}</span>
                    <span className="font-bold font-sans">👥 {grp.membersCount} / {grp.maxMembers} Members</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Discover Tab */
          discoverGroups.length === 0 ? (
            <div className="text-center py-12 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card">
              <Compass className="h-10 w-10 text-text-muted mx-auto mb-3" />
              <p className="text-sm text-text-muted font-sans">You have joined all available communities on campus!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discoverGroups.map((grp) => (
                <div
                  key={grp.id}
                  className="bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg overflow-hidden shadow-custom-card hover:shadow-md hover-lift transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-32 bg-bg-primary relative">
                      <img
                        src={grp.image}
                        alt={grp.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bg-surface/95 dark:bg-gray-900/95 text-brand-primary font-mono shadow-sm">
                          {grp.courseCode}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-text-primary dark:text-gray-200 leading-snug line-clamp-1 font-sans">
                          {grp.name}
                        </h4>
                        <p className="text-[10px] text-text-muted font-sans mt-1 leading-relaxed line-clamp-2">
                          {grp.description}
                        </p>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {grp.topics.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center px-2 py-0.5 rounded-custom-sm text-[9px] font-semibold bg-bg-primary dark:bg-gray-850 text-text-secondary dark:text-gray-400 border border-border-custom dark:border-gray-800"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-bg-primary/40 dark:bg-gray-855/10 border-t border-divider-custom dark:border-gray-800 flex items-center justify-between text-[10px]">
                    <span className="text-text-muted font-bold font-sans">👥 {grp.membersCount} / {grp.maxMembers} spaces</span>
                    <button
                      onClick={() => onJoinGroup(grp.id)}
                      className="px-3 py-1.5 text-[10px] font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-sm cursor-pointer transition-colors shadow-sm"
                    >
                      Join Community
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Sidebar - Collaboration Stats & Recommendation (Right 1 Column) */}
      <div className="space-y-6">
        
        {/* Collaboration Stats Graph (Pure Custom SVG/Tailwind Bento Widget!) */}
        <div className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-brand-primary" />
            <h4 className="text-xs font-bold text-text-primary dark:text-gray-200">
              Community Sync Time
            </h4>
          </div>

          <div className="space-y-3 pt-1">
            {groupStats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-semibold font-sans text-text-secondary dark:text-gray-400">
                  <span className="truncate max-w-40">{stat.label}</span>
                  <span className="font-mono">{stat.hours} hrs</span>
                </div>
                <div className="w-full bg-bg-primary dark:bg-gray-800 h-2 rounded-full overflow-hidden border border-border-custom">
                  <div
                    className={`${stat.color} h-full rounded-full transition-all`}
                    style={{ width: `${stat.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-text-muted leading-normal font-sans pt-2 border-t border-divider-custom dark:border-gray-850">
            Highly active! You logged 29 total academic peer hours over study communities this semester.
          </p>
        </div>

        {/* Quick Suggestion Card - Premium flat dark background, NO gradients */}
        <div className="p-5 bg-text-primary text-white rounded-custom-lg shadow-custom-card space-y-3 relative overflow-hidden border border-white/5">
          <div className="absolute right-0 bottom-0 top-0 w-1/4 opacity-10 bg-white pointer-events-none"></div>
          <AlertCircle className="h-5 w-5 text-brand-light" />
          <h4 className="text-xs font-bold font-display leading-tight">
            Suggested for Alex Rivera
          </h4>
          <p className="text-[10px] text-gray-300 leading-relaxed font-sans">
            "Bio-informatics Genome Mapping Labs" starts in 2 days. Joining would connect you with 4 students in CS-401 and BIO-410!
          </p>
          <button
            onClick={() => setActiveTab('discover')}
            className="text-[9px] font-bold text-brand-light hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            Find study circle <ExternalLink className="h-3 w-3" />
          </button>
        </div>

      </div>

      {/* Start Group Modal Form */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg max-w-sm w-full p-6 shadow-custom-modal space-y-4">
            <div className="flex items-center justify-between border-b border-divider-custom dark:border-gray-800 pb-3">
              <h3 className="font-display font-bold text-md text-text-primary dark:text-gray-100 flex items-center gap-2">
                <Users2 className="h-5 w-5 text-brand-primary" /> Create Study Group
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-text-muted hover:text-text-primary cursor-pointer transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              {/* Group Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted block font-sans">
                  Community Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Transformers & Seq2Seq Labs"
                  value={grpName}
                  onChange={(e) => setGrpName(e.target.value)}
                  className="w-full px-3.5 py-1.5 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 transition-all font-sans text-text-primary"
                />
              </div>

              {/* Course and max member split */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted block font-sans">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-401"
                    value={grpCourse}
                    onChange={(e) => setGrpCourse(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 transition-all font-sans text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted block font-sans">
                    Max Members Limit
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={grpMax}
                    onChange={(e) => setGrpMax(Number(e.target.value))}
                    className="w-full px-3.5 py-1.5 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 transition-all font-sans text-text-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted block font-sans">
                  Group Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail what research, exam preps, or lab codes this group meets to address..."
                  value={grpDesc}
                  onChange={(e) => setGrpDesc(e.target.value)}
                  className="w-full px-3.5 py-1.5 text-xs bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 transition-all font-sans resize-none text-text-primary"
                ></textarea>
              </div>

              {/* Topics tags */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted block font-sans">
                    Core Topic #1
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Deep Learning"
                    value={grpTopic1}
                    onChange={(e) => setGrpTopic1(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-xs bg-bg-primary dark:bg-gray-855 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted block font-sans">
                    Core Topic #2
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paper Review"
                    value={grpTopic2}
                    onChange={(e) => setGrpTopic2(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-xs bg-bg-primary dark:bg-gray-855 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none text-text-primary"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-divider-custom dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-text-secondary dark:text-gray-300 hover:bg-bg-primary dark:hover:bg-gray-850 rounded-custom-md border border-border-custom dark:border-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md shadow-custom-card cursor-pointer transition-all"
                >
                  Launch Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
