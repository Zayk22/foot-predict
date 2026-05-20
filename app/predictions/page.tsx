export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getPredictions } from '@/lib/api';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState('All');
  const cardsRef = useRef<HTMLDivElement>(null);

  // Fetch predictions
  useEffect(() => {
    async function load() {
      const { data, error } = await getPredictions();
      if (error) {
        setError(error);
      } else if (data?.data) {
        setPredictions(data.data);
        setFilteredPredictions(data.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Filter by league
  useEffect(() => {
    if (selectedLeague === 'All') {
      setFilteredPredictions(predictions);
    } else {
      setFilteredPredictions(
        predictions.filter((p) => p.match?.league === selectedLeague)
      );
    }
  }, [selectedLeague, predictions]);

  // Get unique leagues for filter
  const leagues = ['All', ...new Set(predictions.map((p) => p.match?.league).filter(Boolean))];

  // GSAP scroll animation for cards
  useEffect(() => {
    if (loading || !cardsRef.current) return;
    
    const cards = cardsRef.current.children;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [loading, filteredPredictions]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100">
            🔮 Match Predictions
          </h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            AI-powered predictions for upcoming matches across all leagues.
          </p>
        </motion.div>

        {/* League filter */}
        <div className="flex flex-wrap gap-2">
          {leagues.map((league) => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  selectedLeague === league
                    ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                }
              `}
            >
              {league}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-3 border-accent-500 border-t-transparent rounded-full mb-4" />
            <p className="text-surface-500">Loading predictions...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="glass rounded-2xl p-10 text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-lg font-semibold text-danger mb-2">Failed to load predictions</h3>
            <p className="text-surface-500 text-sm">
              Make sure the API server is running on port 5000.
            </p>
          </div>
        )}

        {/* Prediction cards grid */}
        {!loading && !error && (
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPredictions.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                className="glass-strong rounded-2xl p-6 cursor-pointer group"
              >
                {/* Match info */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                    {p.match?.league || 'N/A'}
                  </span>
                  <span className="text-xs text-surface-500">
                    {p.match?.match_date 
                      ? new Date(p.match.match_date).toLocaleDateString('en-GB', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'TBD'
                    }
                  </span>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-center gap-4 mb-5">
                  <span className="text-lg font-semibold text-surface-900 dark:text-surface-100 text-right flex-1">
                    {p.match?.home_team?.name || 'TBD'}
                  </span>
                  <span className="text-sm font-bold text-surface-400">VS</span>
                  <span className="text-lg font-semibold text-surface-900 dark:text-surface-100 flex-1">
                    {p.match?.away_team?.name || 'TBD'}
                  </span>
                </div>

                {/* Prediction */}
                <div className="bg-accent-500/5 dark:bg-accent-500/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-surface-600 dark:text-surface-400">
                      AI Prediction
                    </span>
                    <span className="text-xs font-medium text-accent-600 dark:text-accent-400 bg-accent-500/10 px-2 py-0.5 rounded-full">
                      {p.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-xl font-bold text-surface-900 dark:text-surface-100">
                    {p.predicted_outcome}
                  </p>
                  {/* Confidence bar */}
                  <div className="mt-3 w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.confidence}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-accent-400 to-accent-600 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredPredictions.length === 0 && (
          <div className="glass rounded-2xl p-10 text-center">
            <span className="text-4xl mb-4 block">📭</span>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              No predictions found
            </h3>
            <p className="text-surface-500 text-sm">
              {selectedLeague === 'All'
                ? 'No predictions available yet.'
                : `No predictions for ${selectedLeague}.`}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}