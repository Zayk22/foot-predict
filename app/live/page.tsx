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
import { Radio, AlertTriangle, Inbox, Search } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LiveScoresPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await getMatches();
      if (error) { setError(error); }
      else if (data?.data) { 
        setMatches(data.data); 
        setLastUpdated(new Date().toLocaleTimeString());
      }
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading || !cardsRef.current) return;
    const cards = cardsRef.current.children;
    gsap.fromTo(cards, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    });
  }, [loading, matches]);

  const filteredMatches = searchQuery.trim()
    ? matches.filter((m) =>
        m.home_team?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.away_team?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.league?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : matches;

  const groupedFiltered: Record<string, any[]> = {};
  filteredMatches.forEach((m) => {
    const league = m.league || 'Other';
    if (!groupedFiltered[league]) groupedFiltered[league] = [];
    groupedFiltered[league].push(m);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live': return { text: 'LIVE', color: 'bg-danger text-white animate-pulse' };
      case 'finished': return { text: 'FT', color: 'bg-surface-300 dark:bg-surface-700 text-surface-600 dark:text-surface-300' };
      default: return { text: 'Upcoming', color: 'bg-accent-500/10 text-accent-600 dark:text-accent-400' };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-3">
              <Radio size={32} className="text-accent-500" />
              Live Scores
            </h1>
            <p className="mt-2 text-surface-500 dark:text-surface-400">Real-time match updates across all leagues.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-surface-500">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            {lastUpdated ? `Updated: ${lastUpdated}` : 'Just now'}
          </div>
        </motion.div>

        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search teams or leagues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 outline-none focus:ring-2 focus:ring-accent-500 text-sm"
          />
        </div>

        {loading && (
          <div className="space-y-6">
            {['Premier League', 'La Liga', 'Bundesliga'].map((league) => (
              <div key={league}>
                <div className="h-5 w-32 bg-surface-200 dark:bg-surface-800 rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="glass-strong rounded-2xl p-6 animate-pulse">
                      <div className="flex justify-between mb-4"><div className="h-5 w-16 bg-surface-200 dark:bg-surface-800 rounded-full" /><div className="h-4 w-20 bg-surface-200 dark:bg-surface-800 rounded" /></div>
                      <div className="flex items-center justify-between"><div className="h-5 w-20 bg-surface-200 dark:bg-surface-800 rounded" /><div className="h-8 w-16 bg-surface-200 dark:bg-surface-800 rounded" /><div className="h-5 w-20 bg-surface-200 dark:bg-surface-800 rounded" /></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="glass rounded-2xl p-10 text-center">
            <AlertTriangle size={48} className="mx-auto mb-4 text-warning" />
            <h3 className="text-lg font-semibold text-danger mb-2">Failed to load matches</h3>
            <p className="text-surface-500 text-sm">Make sure the API server is running on port 5000.</p>
          </div>
        )}

        {!loading && !error && Object.keys(groupedFiltered).length === 0 && (
          <div className="glass rounded-2xl p-10 text-center">
            <Inbox size={48} className="mx-auto mb-4 text-surface-300" />
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              {searchQuery ? 'No matches found' : 'No matches scheduled'}
            </h3>
            <p className="text-surface-500 text-sm">
              {searchQuery ? 'Try a different search term.' : 'Check back later for upcoming fixtures.'}
            </p>
          </div>
        )}

        {!loading && !error && Object.entries(groupedFiltered).map(([league, leagueMatches]) => (
          <div key={league}>
            <h2 className="text-lg font-semibold text-surface-600 dark:text-surface-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-accent-500 rounded-full" />
              {league}
            </h2>
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leagueMatches.map((m) => {
                const statusBadge = getStatusBadge(m.status);
                return (
                  <motion.div key={m.id} whileHover={{ y: -2 }} className={`glass-strong rounded-2xl p-6 relative overflow-hidden ${m.status === 'live' ? 'ring-2 ring-danger/30' : ''}`}>
                    {m.status === 'live' && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-danger via-warning to-danger animate-pulse" />}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusBadge.color}`}>{statusBadge.text}</span>
                      <span className="text-xs text-surface-500">{formatDate(m.match_date)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 text-center">
                        <span className="text-sm text-surface-500 block mb-1">{m.home_team?.short_name || 'HOME'}</span>
                        <p className="text-lg font-bold text-surface-900 dark:text-surface-100">{m.home_team?.name || 'TBD'}</p>
                      </div>
                      <div className="flex flex-col items-center min-w-[60px]">
                        {m.status === 'scheduled' ? (
                          <span className="text-2xl font-bold text-surface-400">VS</span>
                        ) : (
                          <div className="text-center">
                            <span className="text-3xl font-bold text-surface-900 dark:text-surface-100">{m.home_score} - {m.away_score}</span>
                            {m.status === 'live' && <span className="text-[10px] text-danger animate-pulse block mt-1">● LIVE</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-sm text-surface-500 block mb-1">{m.away_team?.short_name || 'AWAY'}</span>
                        <p className="text-lg font-bold text-surface-900 dark:text-surface-100">{m.away_team?.name || 'TBD'}</p>
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