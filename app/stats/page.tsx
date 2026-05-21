'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import dynamicImport from 'next/dynamic';

const DashboardLayout = dynamicImport(() => import('@/components/layout/DashboardLayout'), {
  ssr: false,
});
import { getStandings, getTeams, getMatches, getLeagueStats } from '@/lib/api';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const COLORS = ['#228be6', '#40c057', '#fab005', '#fa5252', '#7950f2', '#fd7e14', '#15aabf', '#e64980'];

export default function StatsPage() {
  const [standings, setStandings] = useState<any[]>([]);
  const [leagueStats, setLeagueStats] = useState<any[]>([]);
  const [totalTeams, setTotalTeams] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState('Premier League');
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [standingsRes, teamsRes, matchesRes] = await Promise.all([
          getStandings(selectedLeague),
          getTeams(),
          getMatches(),
        ]);

        if (standingsRes.data?.data) {
          setStandings(standingsRes.data.data.sort((a: any, b: any) => b.points - a.points));
        }
        if (teamsRes.data?.data) setTotalTeams(teamsRes.data.data.length);
        if (matchesRes.data?.data) setTotalMatches(matchesRes.data.data.length);
      } catch (err) {
        setError('Failed to load statistics');
      }
      setLoading(false);
    }
    load();
  }, [selectedLeague]);

  useEffect(() => {
    if (loading || !statsRef.current) return;
    const cards = statsRef.current.children;
    gsap.fromTo(cards, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: statsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    });
  }, [loading, standings]);

  const totalGoals = standings.reduce((sum, t) => sum + (t.goals_for || 0), 0);
  const avgGoalsPerMatch = totalMatches > 0 ? (totalGoals / (totalMatches * 2)).toFixed(1) : '0';

  const barChartData = standings.slice(0, 8).map((t) => ({
    name: t.name?.substring(0, 10) || t.short_name,
    Points: t.points || 0,
  }));

  const pieChartData = [
    { name: 'Wins', value: standings.reduce((s, t) => s + (t.won || 0), 0) },
    { name: 'Draws', value: standings.reduce((s, t) => s + (t.drawn || 0), 0) },
    { name: 'Losses', value: standings.reduce((s, t) => s + (t.lost || 0), 0) },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100">📊 Statistics</h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">Detailed team and league performance analytics.</p>
        </motion.div>

        <div className="flex gap-3">
          {['Premier League', 'La Liga'].map((league) => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                selectedLeague === league
                  ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              {league}
            </button>
          ))}
        </div>

       {loading && (
  <div className="space-y-8">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-strong rounded-2xl p-6 text-center animate-pulse">
          <div className="w-12 h-12 bg-surface-200 dark:bg-surface-800 rounded-full mx-auto mb-3" />
          <div className="h-8 w-16 bg-surface-200 dark:bg-surface-800 rounded mx-auto mb-1" />
          <div className="h-4 w-20 bg-surface-200 dark:bg-surface-800 rounded mx-auto" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-strong rounded-2xl p-6 animate-pulse">
        <div className="h-5 w-32 bg-surface-200 dark:bg-surface-800 rounded mb-4" />
        <div className="h-64 bg-surface-200 dark:bg-surface-800 rounded" />
      </div>
      <div className="glass-strong rounded-2xl p-6 animate-pulse">
        <div className="h-5 w-32 bg-surface-200 dark:bg-surface-800 rounded mb-4" />
        <div className="h-64 bg-surface-200 dark:bg-surface-800 rounded" />
      </div>
    </div>
  </div>
)}

        {error && (
          <div className="glass rounded-2xl p-10 text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-lg font-semibold text-danger mb-2">{error}</h3>
          </div>
        )}

        {!loading && !error && (
          <>
            <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Teams', value: standings.length, icon: '👥' },
                { label: 'Total Goals', value: totalGoals, icon: '⚽' },
                { label: 'Goals/Match', value: avgGoalsPerMatch, icon: '📈' },
                { label: 'Matches', value: totalMatches, icon: '📅' },
              ].map((stat) => (
                <motion.div key={stat.label} whileHover={{ y: -4 }} className="glass-strong rounded-2xl p-6 text-center">
                  <span className="text-3xl mb-3 block">{stat.icon}</span>
                  <p className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">{stat.value}</p>
                  <p className="text-sm text-surface-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-strong rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">🏆 Points by Team (Top 8)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#868e96' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#868e96' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e9ecef', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="Points" fill="#339af0" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-strong rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">📈 Results Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="glass-strong rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">📊 Points Distribution</h3>
              <div className="space-y-3">
                {standings.slice(0, 10).map((team, index) => {
                  const maxPts = standings[0]?.points || 1;
                  const width = (team.points / maxPts) * 100;
                  return (
                    <div key={team.id} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-surface-500 w-5">{index + 1}</span>
                      <span className="text-sm text-surface-700 dark:text-surface-300 w-28 truncate">{team.name}</span>
                      <div className="flex-1 h-3 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className={`h-full rounded-full ${index === 0 ? 'bg-warning' : index < 4 ? 'bg-accent-500' : 'bg-surface-300 dark:bg-surface-600'}`}
                        />
                      </div>
                      <span className="text-sm font-bold text-surface-900 dark:text-surface-100 w-8 text-right">{team.points}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}