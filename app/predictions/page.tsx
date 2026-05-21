'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), {
  ssr: false,
});
import { getPredictions } from '@/lib/api';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Search, ArrowUpDown, SlidersHorizontal, Flame, Clock, CheckCircle2 } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'confidence' | 'date'>('confidence');
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await getPredictions();
      if (error) {
        setError(error);
      } else if (data?.data) {
        setPredictions(data.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Apply all filters
  useEffect(() => {
    let result = [...predictions];

    // League filter
    if (selectedLeague !== 'All') {
      result = result.filter((p) => p.match?.league === selectedLeague);
    }

    // Status filter
    if (selectedStatus !== 'All') {
      result = result.filter((p) => p.match?.status === selectedStatus);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.match?.home_team?.name?.toLowerCase().includes(q) ||
          p.match?.away_team?.name?.toLowerCase().includes(q) ||
          p.predicted_outcome?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'confidence') {
      result.sort((a, b) => b.confidence - a.confidence);
    } else {
      result.sort((a, b) => new Date(a.match?.match_date || 0).getTime() - new Date(b.match?.match_date || 0).getTime());
    }

    setFilteredPredictions(result);
  }, [predictions, selectedLeague, selectedStatus, searchQuery, sortBy]);

  const leagues = ['All', ...new Set(predictions.map((p) => p.match?.league).filter(Boolean))];

  useEffect(() => {
    if (loading || !cardsRef.current) return;
    const cards = cardsRef.current.children;
    gsap.fromTo(cards, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    });
  }, [loading, filteredPredictions]);

  const getStatusBadge = (status: string) => {
    if (status === 'live') return { text: 'LIVE', icon: Flame, className: 'bg-danger/10 text-danger' };
    if (status === 'finished') return { text: 'FT', icon: CheckCircle2, className: 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300' };
    return { text: 'UPCOMING', icon: Clock, className: 'bg-accent-500/10 text-accent-600 dark:text-accent-400' };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-3">
            <Sparkles size={32} className="text-accent-500" />
            Match Predictions
          </h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            AI-powered predictions for upcoming matches across all leagues.
          </p>
        </motion.div>

        {/* Filters bar */}
        <div className="glass-strong rounded-2xl p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search teams or predictions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 outline-none focus:ring-2 focus:ring-accent-500 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <SlidersHorizontal size={16} className="text-surface-400" />

            {/* League filter */}
            {leagues.map((league) => (
              <button
                key={league}
                onClick={() => setSelectedLeague(league)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedLeague === league
                    ? 'bg-accent-500 text-white'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                {league}
              </button>
            ))}

            <span className="w-px h-5 bg-surface-300 dark:bg-surface-700 mx-1" />

            {/* Status filter */}
            {['All', 'scheduled', 'live', 'finished'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  selectedStatus === status
                    ? 'bg-accent-500 text-white'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                {status === 'All' ? 'All Status' : status}
              </button>
            ))}

            <span className="w-px h-5 bg-surface-300 dark:bg-surface-700 mx-1" />

            {/* Sort */}
            <button
              onClick={() => setSortBy(sortBy === 'confidence' ? 'date' : 'confidence')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all"
            >
              <ArrowUpDown size={14} />
              {sortBy === 'confidence' ? 'Confidence' : 'Date'}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-strong rounded-2xl p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-5 w-20 bg-surface-200 dark:bg-surface-800 rounded-full" />
                  <div className="h-4 w-24 bg-surface-200 dark:bg-surface-800 rounded" />
                </div>
                <div className="flex items-center justify-center gap-4 mb-5">
                  <div className="h-5 w-24 bg-surface-200 dark:bg-surface-800 rounded" />
                  <div className="h-4 w-8 bg-surface-200 dark:bg-surface-800 rounded" />
                  <div className="h-5 w-24 bg-surface-200 dark:bg-surface-800 rounded" />
                </div>
                <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-4">
                  <div className="h-4 w-20 bg-surface-200 dark:bg-surface-700 rounded mb-2" />
                  <div className="h-6 w-32 bg-surface-200 dark:bg-surface-700 rounded mb-3" />
                  <div className="h-2 w-full bg-surface-200 dark:bg-surface-700 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass rounded-2xl p-10 text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-lg font-semibold text-danger mb-2">Failed to load predictions</h3>
            <p className="text-surface-500 text-sm">Make sure the API server is running on port 5000.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && (
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPredictions.map((p) => {
              const badge = getStatusBadge(p.match?.status || 'scheduled');
              const BadgeIcon = badge.icon;
              return (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -4 }}
                  className="glass-strong rounded-2xl p-5 sm:p-6 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                      {p.match?.league || 'N/A'}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${badge.className}`}>
                      <BadgeIcon size={12} />
                      {badge.text}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5">
                    <span className="text-base sm:text-lg font-semibold text-surface-900 dark:text-surface-100 text-right flex-1 truncate">
                      {p.match?.home_team?.name || 'TBD'}
                    </span>
                    <span className="text-sm font-bold text-surface-400">VS</span>
                    <span className="text-base sm:text-lg font-semibold text-surface-900 dark:text-surface-100 flex-1 truncate">
                      {p.match?.away_team?.name || 'TBD'}
                    </span>
                  </div>

                  <div className="bg-accent-500/5 dark:bg-accent-500/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-surface-600 dark:text-surface-400">AI Prediction</span>
                      <span className="text-xs font-medium text-accent-600 dark:text-accent-400 bg-accent-500/10 px-2 py-0.5 rounded-full">
                        {p.confidence}%
                      </span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-100">
                      {p.predicted_outcome}
                    </p>
                    <div className="mt-3 w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.confidence}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-accent-400 to-accent-600 rounded-full"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-surface-400 mt-3 text-right">
                    {p.match?.match_date
                      ? new Date(p.match.match_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                      : 'TBD'}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredPredictions.length === 0 && (
          <div className="glass rounded-2xl p-10 text-center">
            <Search size={48} className="mx-auto mb-4 text-surface-300" />
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">No matches found</h3>
            <p className="text-surface-500 text-sm">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}