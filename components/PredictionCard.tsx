'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, TrendingUp, Sparkles, Clock } from 'lucide-react';

interface Prediction {
  outcome: string;
  probability: number;
}

interface MatchPrediction {
  id: number;
  match: {
    match_date: string;
    league: string;
    home_team: { name: string; short_name: string };
    away_team: { name: string; short_name: string };
  };
  topPick: Prediction;
  allPredictions: Prediction[];
}

export default function PredictionCard({ prediction }: { prediction: MatchPrediction }) {
  const [expanded, setExpanded] = useState(false);
  const { match, topPick, allPredictions } = prediction;

  const matchDate = match.match_date
    ? new Date(match.match_date).toLocaleDateString('en-GB', {
        weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : 'TBD';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-strong rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Header — always visible */}
      <div className="p-5 sm:p-6" onClick={() => setExpanded(!expanded)}>
        {/* League + Date */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
            {match.league}
          </span>
          <span className="text-xs text-surface-500 flex items-center gap-1">
            <Clock size={12} />
            {matchDate}
          </span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-lg font-bold text-surface-900 dark:text-surface-100 flex-1 text-right">
            {match.home_team.name}
          </span>
          <span className="text-sm font-bold text-surface-400">VS</span>
          <span className="text-lg font-bold text-surface-900 dark:text-surface-100 flex-1">
            {match.away_team.name}
          </span>
        </div>

        {/* Top Pick */}
        <div className="bg-accent-500/5 dark:bg-accent-500/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-accent-600 dark:text-accent-400">
              <Sparkles size={14} />
              TOP PICK
            </span>
            <span className="text-xs font-bold text-accent-600 dark:text-accent-400">
              {topPick.probability}%
            </span>
          </div>
          <p className="text-xl font-bold text-surface-900 dark:text-surface-100">
            {topPick.outcome}
          </p>
          <div className="mt-3 w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${topPick.probability}%` }}
              className="h-full bg-gradient-to-r from-accent-400 to-accent-600 rounded-full"
            />
          </div>
        </div>

        {/* Expand button */}
        <div className="flex items-center justify-center mt-3 text-surface-400">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Expanded predictions */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-surface-200 dark:border-surface-800"
          >
            <div className="p-5 sm:p-6 space-y-3">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                All Predictions
              </p>
              {allPredictions.map((p, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-surface-700 dark:text-surface-300">{p.outcome}</span>
                  <div className="flex items-center gap-2 flex-1 max-w-[120px]">
                    <div className="flex-1 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          p.probability >= 70 ? 'bg-success' : p.probability >= 50 ? 'bg-warning' : 'bg-danger'
                        }`}
                        style={{ width: `${p.probability}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-surface-500 w-8 text-right">{p.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}