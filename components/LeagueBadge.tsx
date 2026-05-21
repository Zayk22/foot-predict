import { Shield } from 'lucide-react';

export default function LeagueBadge() {
  return (
    <div className="glass rounded-2xl px-4 py-3 text-center">
      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-surface-600 dark:text-surface-400">
        <Shield size={16} className="text-accent-500 flex-shrink-0" />
        <span>
          <span className="font-medium text-surface-900 dark:text-surface-100">Currently covering:</span> Premier League • La Liga • Champions League
        </span>
      </div>
    </div>
  );
}