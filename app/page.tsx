'use client';

import dynamic from 'next/dynamic';

const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), {
  ssr: false,
});
import PickOfTheDay from '@/components/PickOfTheDay';
import StatCard from '@/components/StatCard';
import PredictionsTable from '@/components/PredictionsTable';
import LeagueStandings from '@/components/LeagueStandings';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Predictions Today', value: '24', change: '+12%', icon: 'flame' },
  { label: 'Accuracy Rate', value: '78%', change: '+5%', icon: 'target' },
  { label: 'Live Matches', value: '8', change: '3 active', icon: 'live' },
  { label: 'League Coverage', value: '12', change: 'Top 5 EU', icon: 'shield' },
];

export default function Home() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

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
            Here's your football prediction overview for today.
          </p>
        </motion.div>

        <PickOfTheDay />

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