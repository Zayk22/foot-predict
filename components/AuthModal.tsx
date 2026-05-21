'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, LogIn, UserPlus, X } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is logged in, never show modal
    if (user) return;

    // Always show modal for guests — no localStorage check
    const timer = setTimeout(() => setIsOpen(true), 800);
    return () => clearTimeout(timer);
  }, [user]);

  const dismiss = () => {
    setIsOpen(false);
    // Store session-only flag so refresh still shows modal
    sessionStorage.setItem('guest_mode', 'true');
  };

  const goTo = (path: string) => {
    sessionStorage.setItem('guest_mode', 'false');
    setIsOpen(false);
    router.push(path);
  };

  // If user is logged in, don't render modal at all
  if (user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="glass-strong rounded-3xl p-6 sm:p-8 w-full max-w-sm relative">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-500/10 mb-4">
                  <Flame size={28} className="text-accent-500" />
                </div>
                <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">Welcome to FootPredict</h2>
                <p className="text-sm text-surface-500 mt-2">
                  Premium football analytics & AI predictions
                </p>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => goTo('/signup')}
                  className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus size={18} />
                  Create Free Account
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => goTo('/login')}
                  className="w-full py-3 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-900 dark:text-surface-100 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  Sign In
                </motion.button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-surface-200 dark:border-surface-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-surface-900 text-surface-400">or</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={dismiss}
                  className="w-full py-3 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 font-medium text-sm transition-colors"
                >
                  Continue as Guest →
                </motion.button>
              </div>

              <p className="text-xs text-surface-400 text-center mt-4">
                No credit card required. Free forever.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}