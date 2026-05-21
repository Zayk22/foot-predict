'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), {
  ssr: false,
});
import { getMatches } from '@/lib/api';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
export default function LiveScoresPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Fetch matches
  useEffect(() => {
    async function load() {
      const { data, error } = await getMatches();
      if (error) {
        setError(error);
      } else if (data?.data) {
        setMatches(data.data);
      }
      setLoading(false);
    }
    load();

    // Auto-refresh every 30 seconds for "live" feel
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  // GSAP animation
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
  }, [loading, matches]);

  // Group matches by league
  const groupedMatches: Record<string, any[]> = {};
  matches.forEach((m) => {
    const league = m.league || 'Other';
    if (!groupedMatches[league]) groupedMatches[league] = [];
    groupedMatches[league].push(m);
  });

  // Status badge helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return { text: 'LIVE', color: 'bg-danger text-white animate-pulse' };
      case 'finished':
        return { text: 'FT', color: 'bg-surface-300 dark:bg-surface-700 text-surface-600 dark:text-surface-300' };
      default:
        return { text: 'Upcoming', color: 'bg-accent-500/10 text-accent-600 dark:text-accent-400' };
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100">
              📡 Live Scores
            </h1>
            <p className="mt-2 text-surface-500 dark:text-surface-400">
              Real-time match updates across all leagues.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-surface-500">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            Auto-refreshing
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-3 border-accent-500 border-t-transparent rounded-full mb-4" />
            <p className="text-surface-500">Loading matches...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass rounded-2xl p-10 text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-lg font-semibold text-danger mb-2">Failed to load matches</h3>
            <p className="text-surface-500 text-sm">Make sure the API server is running on port 5000.</p>
          </div>
        )}

        {/* Match cards grouped by league */}
        {!loading && !error && Object.keys(groupedMatches).length === 0 && (
          <div className="glass rounded-2xl p-10 text-center">
            <span className="text-4xl mb-4 block">📭</span>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              No matches scheduled
            </h3>
            <p className="text-surface-500 text-sm">Check back later for upcoming fixtures.</p>
          </div>
        )}

        {!loading && !error && Object.entries(groupedMatches).map(([league, leagueMatches]) => (
          <div key={league}>
            <h2 className="text-lg font-semibold text-surface-600 dark:text-surface-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-accent-500 rounded-full" />
              {league}
            </h2>
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leagueMatches.map((m) => {
                const statusBadge = getStatusBadge(m.status);
                return (
                  <motion.div
                    key={m.id}
                    whileHover={{ y: -2 }}
                    className={`glass-strong rounded-2xl p-6 relative overflow-hidden
                      ${m.status === 'live' ? 'ring-2 ring-danger/30' : ''}
                    `}
                  >
                    {/* Live indicator */}
                    {m.status === 'live' && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-danger via-warning to-danger animate-pulse" />
                    )}

                    {/* Status + Date */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                      <span className="text-xs text-surface-500">
                        {formatDate(m.match_date)}
                      </span>
                    </div>

                    {/* Teams + Score */}
                    <div className="flex items-center justify-between gap-4">
                      {/* Home team */}
                      <div className="flex-1 text-center">
                        <span className="text-sm text-surface-500 block mb-1">
                          {m.home_team?.short_name || 'HOME'}
                        </span>
                        <p className="text-lg font-bold text-surface-900 dark:text-surface-100">
                          {m.home_team?.name || 'TBD'}
                        </p>
                      </div>

                      {/* Score */}
                      <div className="flex flex-col items-center min-w-[60px]">
                        {m.status === 'scheduled' ? (
                          <span className="text-2xl font-bold text-surface-400">VS</span>
                        ) : (
                          <div className="text-center">
                            <span className="text-3xl font-bold text-surface-900 dark:text-surface-100">
                              {m.home_score} - {m.away_score}
                            </span>
                            {m.status === 'live' && (
                              <span className="text-[10px] text-danger animate-pulse block mt-1">
                                ● LIVE
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Away team */}
                      <div className="flex-1 text-center">
                        <span className="text-sm text-surface-500 block mb-1">
                          {m.away_team?.short_name || 'AWAY'}
                        </span>
                        <p className="text-lg font-bold text-surface-900 dark:text-surface-100">
                          {m.away_team?.name || 'TBD'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}