'use client';

import { getIcon } from '@/lib/icons';
import { Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

const mainItems = [
  { name: 'Home', href: '/', icon: 'home' },
  { name: 'Predictions', href: '/predictions', icon: 'predictions' },
  { name: 'Live Scores', href: '/live', icon: 'live' },
  { name: 'Standings', href: '/standings', icon: 'standings' },
  { name: 'Compare Teams', href: '/compare', icon: 'compare' },
  { name: 'Statistics', href: '/stats', icon: 'stats' },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const authItems = user
    ? [{ name: 'Logout', href: '#', icon: 'logout', action: signOut }]
    : [
        { name: 'Login', href: '/login', icon: 'login' },
        { name: 'Sign Up', href: '/signup', icon: 'signup' },
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
          bg-white dark:bg-gray-950
          border-r border-gray-200 dark:border-gray-800
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-accent-500">
              <Flame size={28} />
            </span>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">FootPredict</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Premium Analytics</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {mainItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                <span className="group-hover:scale-110 transition-transform">
                  {getIcon(item.icon, 20)}
                </span>
                <span>{item.name}</span>
                {isActive && (
                  <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-500" />
                )}
              </Link>
            );
          })}

          <div className="my-3 border-t border-gray-200 dark:border-gray-800" />

          {authItems.map((item) =>
            'action' in item ? (
              <button
                key={item.name}
                onClick={() => { if ('action' in item) item.action(); onClose(); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left
                  text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200
                  transition-all duration-200 group"
              >
                <span className="group-hover:scale-110 transition-transform">
                  {getIcon(item.icon, 20)}
                </span>
                <span>{item.name}</span>
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl
                  text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200
                  transition-all duration-200 group"
              >
                <span className="group-hover:scale-110 transition-transform">
                  {getIcon(item.icon, 20)}
                </span>
                <span>{item.name}</span>
              </Link>
            )
          )}
        </nav>

        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center text-white font-medium text-sm">
                {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Signed in</p>
              </div>
            </div>
          </div>
        )}

        {!user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">PRO PLAN</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Upgrade Now</p>
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