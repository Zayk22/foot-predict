'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), {
  ssr: false,
});
import PickOfTheDay from '@/components/PickOfTheDay';
import LeagueBadge from '@/components/LeagueBadge';
import StatCard from '@/components/StatCard';
import PredictionsTable from '@/components/PredictionsTable';
import LeagueStandings from '@/components/LeagueStandings';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import { getAIPredictions, getMatches } from '@/lib/api';

const defaultStats = [
  { label: 'Predictions Today', value: '0', change: 'No matches today', icon: 'flame' },
  { label: 'AI Accuracy', value: '78%', change: 'Model confidence', icon: 'target' },
  { label: 'Live Matches', value: '0', change: 'None active', icon: 'live' },
  { label: 'Leagues Covered', value: '3', change: 'PL · La Liga · UCL', icon: 'shield' },
];

export default function Home() {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState(defaultStats);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    loadLiveStats();
  }, []);

  async function loadLiveStats() {
    try {
      const [predRes, matchRes] = await Promise.all([
        getAIPredictions(),
        getMatches(),
      ]);

      const today = new Date().toDateString();
      const todayPredictions = (predRes?.data?.data || []).filter((p: any) => {
        const matchDate = new Date(p.match?.match_date).toDateString();
        return matchDate === today;
      });

      const liveCount = matchRes?.data?.data?.filter((m: any) => m.status === 'live').length || 0;

      setStats([
        { label: 'Predictions Today', value: String(todayPredictions.length), change: todayPredictions.length > 0 ? `${todayPredictions.length} matches today` : 'No matches today', icon: 'flame' },
        { label: 'AI Accuracy', value: '78%', change: 'Model confidence', icon: 'target' },
        { label: 'Live Matches', value: String(liveCount), change: liveCount > 0 ? `${liveCount} in play` : 'None active', icon: 'live' },
        { label: 'Leagues Covered', value: '3', change: 'PL · La Liga · UCL', icon: 'shield' },
      ]);
    } catch {
      // Keep defaults
    }
    setStatsLoading(false);
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-surface-500">Loading FootPredict...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100">
            {getGreeting()}, {user?.user_metadata?.full_name || 'Analyst'}
          </h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            {statsLoading
              ? 'Loading your prediction overview...'
              : stats[0].value === '0'
                ? 'No predictions for today. Check back when new fixtures are available.'
                : `${stats[0].value} predictions available across ${stats[3].value} leagues.`}
          </p>
        </motion.div>

        <PickOfTheDay />
        <LeagueBadge />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              index={index}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PredictionsTable />
          </div>
          <div>
            <LeagueStandings />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}