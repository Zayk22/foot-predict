'use client';

import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, User, LogOut, Crown, X } from 'lucide-react';

export default function Header({ 
  onMenuClick 
}: { 
  onMenuClick: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-800">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <svg className="w-5 h-5 text-surface-700 dark:text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <p className="text-sm text-surface-500 dark:text-surface-400">Dashboard</p>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Overview</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>

          {/* User avatar — only show if logged in */}
          {user && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center text-white font-medium text-sm cursor-pointer"
              >
                {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </motion.button>

              {/* Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setProfileOpen(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 glass-strong rounded-2xl p-4 z-50 shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">Account</span>
                        <button onClick={() => setProfileOpen(false)} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
                          <X size={14} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-surface-50 dark:bg-surface-800">
                        <div className="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center text-white font-medium text-sm">
                          {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                            {user.user_metadata?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-surface-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors mb-1">
                        <Crown size={16} className="text-warning" />
                        Upgrade to Premium
                      </button>

                      <button
                        onClick={() => { signOut(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-danger hover:bg-danger/5 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}