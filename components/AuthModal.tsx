'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, LogIn, UserPlus, X } from 'lucide-react';

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show modal only if user hasn't dismissed it before
    const dismissed = localStorage.getItem('auth_modal_dismissed');
    if (!dismissed) {
      // Small delay so it appears after page load
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setIsOpen(false);
    localStorage.setItem('auth_modal_dismissed', 'true');
  };

  const goTo = (path: string) => {
    localStorage.setItem('auth_modal_dismissed', 'true');
    setIsOpen(false);
    router.push(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="glass-strong rounded-3xl p-6 sm:p-8 w-full max-w-sm relative">
              {/* Close button */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-400"
              >
                <X size={18} />
              </button>

              {/* Logo */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-500/10 mb-4">
                  <Flame size={28} className="text-accent-500" />
                </div>
                <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">Welcome to FootPredict</h2>
                <p className="text-sm text-surface-500 mt-2">
                  Premium football analytics & AI predictions
                </p>
              </div>

              {/* Buttons */}
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