import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Chrome,
  User,
  School,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpId, setSignUpId] = useState('');
  const [signUpProgram, setSignUpProgram] = useState('B.Tech in Artificial Intelligence');
  const [signUpPassword, setSignUpPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Simulate login by loading default user profile
    const loggedUser: UserProfile = {
      name: 'Utsav Adhikari',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
      banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200&h=400',
      email: email || 'utsav.adhikari@student.ku.edu.np',
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

    onLoginSuccess(loggedUser);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpId || !signUpPassword) return;

    // Build custom newly registered user profile! Extremely high fidelity
    const newUserProfile: UserProfile = {
      name: signUpName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
      banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200&h=400',
      email: signUpEmail,
      studentId: signUpId,
      department: 'Computer Science Department',
      program: signUpProgram,
      gpa: 4.00, // Initial perfect GPA!
      creditsCompleted: 0,
      creditsRequired: 120,
      skills: ['General Academic Studies'],
      interests: ['Artificial Intelligence', 'Software Architecture'],
      achievements: [
        {
          id: 'ach-1',
          title: 'UniHub Scholar',
          description: 'Registered into the academic portal as a verified student candidate.',
          icon: 'ShieldCheck',
          unlockedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        }
      ]
    };

    onLoginSuccess(newUserProfile);
  };

  const handleContinueWithGoogle = () => {
    // Simulate immediate successful Google login
    const googleUser: UserProfile = {
      name: 'Utsav',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200',
      banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200&h=400',
      email: 'utsav@university.edu',
      studentId: 'UG-2022-9904',
      department: 'Computer Science & Software Eng',
      program: 'M.S. in Machine Learning Engineering',
      gpa: 3.92,
      creditsCompleted: 44,
      creditsRequired: 64,
      skills: ['Python', 'Golang', 'PyTorch', 'TensorFlow', 'PostgreSQL', 'Docker'],
      interests: ['Transformers', 'Large Language Models', 'Reinforcement Learning'],
      achievements: [
        {
          id: 'ach-1',
          title: 'Dean\'s Scholar',
          description: 'Outstanding graduate academic marks.',
          icon: 'Award',
          unlockedAt: 'January 2024'
        }
      ]
    };
    onLoginSuccess(googleUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-primary transition-colors relative overflow-hidden">
      {/* Abstract mesh background details */}
      <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-brand-primary),_transparent_70%)] pointer-events-none"></div>
      <div className="absolute left-0 top-0 bottom-0 w-1/4 opacity-15 bg-[radial-gradient(circle_at_center,_var(--color-brand-primary),_transparent_60%)] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-bg-surface border border-border-custom p-8 rounded-custom-xl max-w-md w-full shadow-custom-modal space-y-6 relative text-text-primary"
      >
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-brand-light dark:bg-brand-primary/10 rounded-custom-md flex items-center justify-center border border-brand-primary/20 mx-auto text-brand-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-text-primary tracking-tight">
              {isSignUp ? 'Enroll in UniHub' : 'Welcome to UniHub'}
            </h1>
            <p className="text-xs text-text-muted font-sans font-medium">
              {isSignUp ? 'Create your credential profiles to register' : 'Access your courses, dashboard, and calendars'}
            </p>
          </div>
        </div>

        {/* Continue with Google button */}
        <button
          onClick={handleContinueWithGoogle}
          className="w-full py-2.5 bg-bg-surface border border-border-custom rounded-custom-md hover:bg-bg-primary text-xs font-bold text-text-secondary flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm active:scale-95"
        >
          <Chrome className="h-4.5 w-4.5 text-brand-primary" /> Continue with Google
        </button>

        {/* Separator */}
        <div className="flex items-center gap-3 text-[10px] text-text-muted font-bold uppercase tracking-wider font-mono">
          <div className="flex-1 h-px bg-border-custom"></div>
          <span>Or with email</span>
          <div className="flex-1 h-px bg-border-custom"></div>
        </div>

        {/* Login / Sign Up Form Switch */}
        {!isSignUp ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono block">
                Student Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-text-muted" />
                <input
                  type="email"
                  required
                  placeholder="e.g. utsav.adhikari@student.ku.edu.np"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-bg-primary border border-border-custom rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-sans text-text-primary placeholder:text-text-muted/60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono block">
                  Portal Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Dispatched password assistance credentials to registered student email!')}
                  className="text-[9px] font-bold text-brand-primary hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-text-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-bg-primary border border-border-custom rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-sans text-text-primary placeholder:text-text-muted/60"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md text-xs font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95 font-sans"
            >
              Access Portal <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          /* Sign Up / Register Form */
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-text-muted" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-bg-primary border border-border-custom rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-sans text-text-primary placeholder:text-text-muted/60"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono block">
                Student Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-text-muted" />
                <input
                  type="email"
                  required
                  placeholder="e.g. utsav.adhikari@student.ku.edu.np"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-bg-primary border border-border-custom rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-sans text-text-primary placeholder:text-text-muted/60"
                />
              </div>
            </div>

            {/* Split row: Student ID & Major */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono block">
                  Student ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="UG-2022-8742"
                  value={signUpId}
                  onChange={(e) => setSignUpId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-custom rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-sans text-text-primary placeholder:text-text-muted/60"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono block">
                  Academic Major
                </label>
                <select
                  value={signUpProgram}
                  onChange={(e) => setSignUpProgram(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-bg-primary border border-border-custom rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-sans text-text-primary"
                >
                  <option value="B.Tech in Artificial Intelligence">B.Tech in AI</option>
                  <option value="B.S. in Computer Science">Computer Science</option>
                  <option value="M.S. in Software Engineering">Software Eng</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-text-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••••••"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-bg-primary border border-border-custom rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-sans text-text-primary placeholder:text-text-muted/60"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md text-xs font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95 font-sans"
            >
              Enroll Student <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Mode Switcher footer */}
        <div className="text-center pt-2">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[11px] font-bold text-text-muted hover:text-brand-primary cursor-pointer transition-colors"
          >
            {isSignUp ? 'Already registered? Log in here' : 'New student? Setup your profile here'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
