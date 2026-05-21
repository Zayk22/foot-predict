'use client';

import { useEffect, useState } from 'react';
import { getPredictions } from '@/lib/api';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';

export default function PickOfTheDay() {
  const [pick, setPick] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await getPredictions();
      if (data?.data?.length) {
        // Only show predictions from covered leagues
        const covered = data.data.filter((p: any) =>
          ['Premier League', 'La Liga', 'UEFA Champions League'].includes(p.match?.league)
        );
        const pool = covered.length > 0 ? covered : data.data;
        const best = pool.reduce((prev: any, curr: any) =>
          (curr.confidence > prev.confidence ? curr : prev)
        );
        setPick(best);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="glass-strong rounded-3xl p-6 animate-pulse">
        <div className="h-4 w-32 bg-surface-200 dark:bg-surface-800 rounded mb-4" />
        <div className="h-8 w-64 bg-surface-200 dark:bg-surface-800 rounded mb-2" />
        <div className="h-4 w-48 bg-surface-200 dark:bg-surface-800 rounded" />
      </div>
    );
  }

  if (!pick) return null;

  const matchDate = pick.match?.match_date
    ? new Date(pick.match.match_date).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : 'TBD';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-500 via-accent-600 to-accent-800 p-6 sm:p-8 text-white"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles size={14} />
          PICK OF THE DAY
        </span>
      </div>

      <div className="mb-4">
        <p className="text-white/70 text-sm mb-1">{pick.match?.league || 'N/A'}</p>
        <h3 className="text-xl sm:text-2xl font-bold">
          {pick.match?.home_team?.name || 'TBD'} vs {pick.match?.away_team?.name || 'TBD'}
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div>
          <p className="text-white/60 text-xs mb-1">AI PREDICTION</p>
          <p className="text-lg font-bold">{pick.predicted_outcome}</p>
        </div>
        <div>
          <p className="text-white/60 text-xs mb-1">CONFIDENCE</p>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} />
            <span className="text-lg font-bold">{pick.confidence}%</span>
          </div>
        </div>
        <div className="sm:ml-auto">
          <div className="flex items-center gap-1.5 text-white/70 text-sm">
            <Clock size={14} />
            {matchDate}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-5 px-5 py-2.5 bg-white text-accent-700 font-semibold rounded-xl text-sm hover:bg-white/90 transition-colors"
      >
        View Full Analysis →
      </motion.button>
    </motion.div>
  );
}