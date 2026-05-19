'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

const mainItems = [
  { name: 'Home', href: '/', icon: '⚽', active: true },
  { name: 'Predictions', href: '/predictions', icon: '🔮', active: false },
  { name: 'Live Scores', href: '/live', icon: '📡', active: false },
  { name: 'Standings', href: '/standings', icon: '🏆', active: false },
  { name: 'Compare Teams', href: '/compare', icon: '⚖️', active: false },
  { name: 'Statistics', href: '/stats', icon: '📊', active: false },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, signOut } = useAuth();

  const authItems = user
    ? [{ name: 'Logout', href: '#', icon: '🚪', action: signOut }]
    : [
        { name: 'Login', href: '/login', icon: '🔑' },
        { name: 'Sign Up', href: '/signup', icon: '✨' },
      ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-surface-50 dark:bg-surface-950
          border-r border-surface-200 dark:border-surface-800
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚽</span>
            <div>
              <h1 className="text-lg font-bold text-surface-900 dark:text-surface-100 leading-tight">FootPredict</h1>
              <p className="text-xs text-surface-500 dark:text-surface-400">Premium Analytics</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {mainItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 group
                ${item.active
                  ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400 font-medium'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200'
                }
              `}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span>{item.name}</span>
              {item.active && (
                <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-500" />
              )}
            </Link>
          ))}

          <div className="my-3 border-t border-surface-200 dark:border-surface-800" />

          {authItems.map((item) =>
            item.action ? (
              <button
                key={item.name}
                onClick={() => { item.action(); onClose(); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left
                  text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200
                  transition-all duration-200 group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl
                  text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200
                  transition-all duration-200 group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            )
          )}
        </nav>

        {user && (
          <div className="p-4 border-t border-surface-200 dark:border-surface-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center text-white font-medium text-sm">
                {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-surface-500">Signed in</p>
              </div>
            </div>
          </div>
        )}

        {!user && (
          <div className="p-4 border-t border-surface-200 dark:border-surface-800">
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-2">PRO PLAN</p>
              <p className="text-lg font-bold text-surface-900 dark:text-surface-100">Upgrade Now</p>
              <button className="mt-2 w-full py-2 bg-accent-500 hover:bg-accent-600 text-white text-sm rounded-lg transition-colors">
                Get Premium
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}