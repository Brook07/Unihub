import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Bell,
  Lock,
  Globe,
  HelpCircle,
  Check,
  User,
  Shield,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (updatedSettings: AppSettings) => void;
}

export default function SettingsView({ settings, onUpdateSettings }: SettingsProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Theme Selection Effect
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    onUpdateSettings({
      ...settings,
      theme: newTheme
    });

    const root = window.document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System choice
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    triggerToast(`Theme preference updated to ${newTheme}`);
  };

  const toggleEmailPref = (key: 'assignments' | 'announcements' | 'messages' | 'grades') => {
    onUpdateSettings({
      ...settings,
      emailNotifications: {
        ...settings.emailNotifications,
        [key]: !settings.emailNotifications[key]
      }
    });
    triggerToast('Email preferences updated successfully.');
  };

  const togglePushPref = (key: 'assignments' | 'announcements' | 'messages' | 'grades') => {
    onUpdateSettings({
      ...settings,
      pushNotifications: {
        ...settings.pushNotifications,
        [key]: !settings.pushNotifications[key]
      }
    });
    triggerToast('Push alert preferences updated successfully.');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative">
      
      {/* Settings Options (Left 2 Columns) */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Theme Settings (Aesthetics & Theme selector with Radio Cards) */}
        <div className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card space-y-4">
          <h3 className="text-sm font-bold text-text-primary dark:text-gray-200">
            Appearance & Themes
          </h3>
          <p className="text-[10px] text-text-muted font-sans -mt-2">
            Personalize your academic workspace. Setting dark mode decreases blue eye strain.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'light' as const, label: 'Light Mode', icon: Sun, desc: 'Clean paper vibe' },
              { id: 'dark' as const, label: 'Dark Mode', icon: Moon, desc: 'Midnight focus' },
              { id: 'system' as const, label: 'System Theme', icon: Monitor, desc: 'Match OS presets' }
            ].map((themeOpt) => {
              const Icon = themeOpt.icon;
              const isSelected = settings.theme === themeOpt.id;

              return (
                <button
                  key={themeOpt.id}
                  onClick={() => handleThemeChange(themeOpt.id)}
                  className={`p-4 border rounded-custom-lg flex flex-col items-center text-center gap-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-light dark:bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm'
                      : 'border-border-custom dark:border-gray-800 bg-bg-surface hover:bg-bg-primary/50 dark:bg-[#111827] text-text-secondary dark:text-gray-400'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-brand-primary' : 'text-text-muted'}`} />
                  <div>
                    <p className="text-xs font-bold leading-none">{themeOpt.label}</p>
                    <p className="text-[9px] text-text-muted font-sans mt-1 leading-none">{themeOpt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification Matrix Table */}
        <div className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-brand-primary" />
            <h3 className="text-sm font-bold text-text-primary dark:text-gray-200">
              Notification Preferences
            </h3>
          </div>

          <div className="overflow-x-auto border border-border-custom dark:border-gray-800 rounded-custom-md">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-bg-primary dark:bg-gray-855/10 border-b border-border-custom dark:border-gray-800 text-[10px] font-bold text-text-muted uppercase font-mono">
                  <th className="p-3">Event Topic</th>
                  <th className="p-3 text-center">Email Updates</th>
                  <th className="p-3 text-center">Push / App Alerts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/60 dark:divide-gray-800/80 text-text-secondary dark:text-gray-300">
                {[
                  { key: 'assignments' as const, title: 'Assignments & Deadlines', desc: 'Alerts before files are due' },
                  { key: 'announcements' as const, title: 'Broadcast Postings', desc: 'Syllabus/Midterm schedules' },
                  { key: 'messages' as const, title: 'Unread Chats', desc: 'Direct faculty messages' },
                  { key: 'grades' as const, title: 'Grade Publications', desc: 'Scores and GPA uploads' }
                ].map((item) => (
                  <tr key={item.key}>
                    <td className="p-3 font-semibold">
                      <div>
                        <p className="text-xs font-bold text-text-primary dark:text-gray-250">{item.title}</p>
                        <p className="text-[9px] text-text-muted mt-0.5">{item.desc}</p>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications[item.key]}
                        onChange={() => toggleEmailPref(item.key)}
                        className="h-4 w-4 text-brand-primary focus:ring-brand-primary/40 rounded border-border-custom dark:border-gray-700 dark:bg-gray-900 cursor-pointer accent-brand-primary"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications[item.key]}
                        onChange={() => togglePushPref(item.key)}
                        className="h-4 w-4 text-brand-primary focus:ring-brand-primary/40 rounded border-border-custom dark:border-gray-700 dark:bg-gray-900 cursor-pointer accent-brand-primary"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Settings Area */}
        <div className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4.5 w-4.5 text-brand-primary" />
            <h3 className="text-sm font-bold text-text-primary dark:text-gray-200">
              Security & Credentials
            </h3>
          </div>

          <div className="space-y-4">
            {/* Two-Factor Toggle */}
            <div className="flex items-center justify-between p-3 bg-bg-primary/50 dark:bg-gray-855/10 rounded-custom-md border border-border-custom dark:border-gray-800/80">
              <div>
                <p className="text-xs font-bold text-text-primary dark:text-gray-255">
                  Two-Factor Authentication (2FA)
                </p>
                <p className="text-[9px] text-text-muted font-sans mt-0.5">
                  Protects your student logs and academic grades with an OTP code.
                </p>
              </div>
              <button
                onClick={() => {
                  const updated = !settings.twoFactorAuth;
                  onUpdateSettings({ ...settings, twoFactorAuth: updated });
                  triggerToast(`Two-Factor Authentication is now ${updated ? 'enabled' : 'disabled'}`);
                }}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.twoFactorAuth ? 'bg-brand-primary' : 'bg-border-custom dark:bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    settings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Simulated Password update */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-4">
              <div className="flex-1 w-full space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">
                  Modify Portal Password
                </label>
                <input
                  type="password"
                  disabled
                  value="••••••••••••••••"
                  className="w-full px-3.5 py-1.5 text-xs bg-bg-primary dark:bg-gray-800 text-text-muted border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none cursor-not-allowed"
                />
              </div>
              <button
                type="button"
                onClick={() => triggerToast('Password modification link dispatched to student email!')}
                className="px-4 py-2 text-xs font-bold bg-bg-surface border border-border-custom text-brand-primary dark:border-gray-800 dark:bg-gray-850 hover:bg-brand-light rounded-custom-md cursor-pointer transition-colors shrink-0 font-sans shadow-sm"
              >
                Dispatch Link
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Connected Integrations & Support (Right 1 Column) */}
      <div className="space-y-6">
        
        {/* Connected Accounts / Integrations */}
        <div className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card space-y-4">
          <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
            Connected integrations
          </h4>

          <div className="space-y-3">
            {[
              { provider: 'Google Classroom', icon: Globe, status: 'Linked', action: 'Revoke' },
              { provider: 'GitHub Accounts', icon: Shield, status: 'Not Linked', action: 'Link' }
            ].map((account) => {
              const Icon = account.icon;
              return (
                <div
                  key={account.provider}
                  className="flex items-center justify-between p-3 bg-bg-primary/40 dark:bg-gray-855/10 border border-border-custom dark:border-gray-800 rounded-custom-md text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-text-muted" />
                    <div>
                      <p className="font-bold text-text-primary dark:text-gray-255">{account.provider}</p>
                      <p className="text-[9px] text-text-muted font-sans mt-0.5">{account.status}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast(`Successfully updated integration for ${account.provider}!`)}
                    className="text-[10px] font-bold text-brand-primary hover:text-brand-hover hover:underline cursor-pointer transition-colors"
                  >
                    {account.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language & Help desk Card */}
        <div className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card space-y-4">
          <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono">
            Help & Accessibility
          </h4>

          <div className="space-y-3">
            {/* Language Selection */}
            <div className="space-y-1">
              <span className="text-[10px] text-text-muted font-sans">Primary Language</span>
              <select
                value={settings.language}
                onChange={(e) => {
                  onUpdateSettings({ ...settings, language: e.target.value });
                  triggerToast(`Language updated to ${e.target.value}`);
                }}
                className="w-full px-3 py-1.5 text-xs bg-bg-primary dark:bg-gray-855 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 transition-all font-sans text-text-primary"
              >
                <option value="English">English (United States)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="German">German (Deutsch)</option>
                <option value="French">French (Français)</option>
              </select>
            </div>

            {/* Help options list */}
            <div className="space-y-1 pt-1">
              <button
                onClick={() => triggerToast('Launching University Helpdesk Guidelines...')}
                className="w-full flex items-center justify-between p-2 hover:bg-bg-primary dark:hover:bg-gray-850 rounded-custom-md text-left cursor-pointer transition-colors text-xs text-text-secondary dark:text-gray-300"
              >
                <span className="font-medium">Academic Portal Guidelines</span>
                <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
              </button>
              <button
                onClick={() => triggerToast('Initializing IT Help Request ticket dispatch...')}
                className="w-full flex items-center justify-between p-2 hover:bg-bg-primary dark:hover:bg-gray-850 rounded-custom-md text-left cursor-pointer transition-colors text-xs text-text-secondary dark:text-gray-300"
              >
                <span className="font-medium">File an IT Service Ticket</span>
                <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Design-System Toast overlay */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-text-primary text-white text-xs font-semibold rounded-custom-md shadow-custom-modal border border-white/5"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
