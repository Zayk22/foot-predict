'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), { ssr: false });
import { getAIPredictions } from '@/lib/api';
import PredictionCard from '@/components/PredictionCard';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Search, Inbox, AlertTriangle } from 'lucide-react';

if (typeof window !== 'undefined') { gsap.registerPlugin(ScrollTrigger); }

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('All');
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await getAIPredictions();
      if (error) setError(error);
      else if (data?.data) setPredictions(data.data);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    let result = [...predictions];
    if (selectedLeague !== 'All') result = result.filter((p) => p.match?.league?.includes(selectedLeague));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.match?.home_team?.name?.toLowerCase().includes(q) ||
        p.match?.away_team?.name?.toLowerCase().includes(q) ||
        p.match?.league?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [predictions, selectedLeague, searchQuery]);

  useEffect(() => {
    if (loading || !cardsRef.current) return;
    gsap.fromTo(cardsRef.current.children, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    });
  }, [loading, filtered]);

  const leagues = ['All', 'Premier League', 'La Liga', 'UEFA Champions League'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-3">
            <Sparkles size={32} className="text-accent-500" />
            AI Predictions
          </h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            Real-time predictions for upcoming matches across covered leagues.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 items-center">
          <Search size={16} className="text-surface-400" />
          <input
            type="text" placeholder="Search teams or leagues..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 outline-none focus:ring-2 focus:ring-accent-500 text-sm"
          />
          {leagues.map((league) => (
            <button key={league} onClick={() => setSelectedLeague(league)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedLeague === league ? 'bg-accent-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'}`}>
              {league}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-strong rounded-2xl p-6 animate-pulse">
                <div className="flex justify-between mb-4"><div className="h-5 w-20 bg-surface-200 dark:bg-surface-800 rounded-full" /><div className="h-4 w-24 bg-surface-200 dark:bg-surface-800 rounded" /></div>
                <div className="flex items-center justify-center gap-4 mb-5"><div className="h-5 w-24 bg-surface-200 dark:bg-surface-800 rounded" /><div className="h-4 w-8 bg-surface-200 dark:bg-surface-800 rounded" /><div className="h-5 w-24 bg-surface-200 dark:bg-surface-800 rounded" /></div>
                <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-4"><div className="h-4 w-20 bg-surface-200 dark:bg-surface-700 rounded mb-2" /><div className="h-6 w-32 bg-surface-200 dark:bg-surface-700 rounded mb-3" /><div className="h-2 w-full bg-surface-200 dark:bg-surface-700 rounded-full" /></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="glass rounded-2xl p-10 text-center">
            <AlertTriangle size={48} className="mx-auto mb-4 text-warning" />
            <h3 className="text-lg font-semibold text-danger mb-2">Failed to load predictions</h3>
            <p className="text-surface-500 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="glass rounded-2xl p-10 text-center">
            <Inbox size={48} className="mx-auto mb-4 text-surface-300" />
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              {searchQuery ? 'No matches found' : 'No upcoming predictions'}
            </h3>
            <p className="text-surface-500 text-sm">
              {searchQuery ? 'Try a different search.' : 'Check back soon for new predictions on Premier League, La Liga, and Champions League.'}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <PredictionCard key={p.id} prediction={p} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}