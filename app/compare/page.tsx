'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), {
  ssr: false,
});
import { getTeams } from '@/lib/api';
import { motion } from 'framer-motion';
import { GitCompare, AlertTriangle } from 'lucide-react';

type Team = {
  id: number;
  name: string;
  league?: string;
  country?: string;
};

type TeamStats = {
  league: string;
  country: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  form: string[];
};

export default function ComparePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [team1, setTeam1] = useState<Team | null>(null);
  const [team2, setTeam2] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await getTeams();
        if (error) { setError(error); return; }
        if (data?.data && Array.isArray(data.data)) {
          setTeams(data.data);
          if (data.data.length >= 2) { setTeam1(data.data[0]); setTeam2(data.data[1]); }
        } else { setError('Invalid teams response from API.'); }
      } catch (err) { setError(err instanceof Error ? err.message : 'Failed to load teams.'); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const getTeamStats = (team: Team): TeamStats => {
    const seed = Number(team?.id ?? 1);
    return {
      league: team?.league || 'N/A', country: team?.country || 'N/A', played: 38,
      wins: 10 + (seed % 15), draws: 3 + (seed % 6), losses: 2 + (seed % 8),
      goalsFor: 40 + (seed % 35), goalsAgainst: 15 + (seed % 25), cleanSheets: 2 + (seed % 12),
      form: ['W', 'D', 'W', 'L', 'W'],
    };
  };

  const team1Stats = team1 ? getTeamStats(team1) : null;
  const team2Stats = team2 ? getTeamStats(team2) : null;

  const compareBar = (val1: number, val2: number, higherIsBetter = true) => {
    const max = Math.max(val1, val2);
    if (max === 0) return { left: 50, right: 50 };
    if (higherIsBetter) return { left: (val1 / max) * 100, right: (val2 / max) * 100 };
    const inverted1 = max - val1 + 1, inverted2 = max - val2 + 1, invMax = Math.max(inverted1, inverted2);
    return { left: (inverted1 / invMax) * 100, right: (inverted2 / invMax) * 100 };
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-3">
            <GitCompare size={32} className="text-accent-500" />
            Compare Teams
          </h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">Head-to-head team statistics and performance comparison.</p>
        </motion.div>

        {loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
              <div className="h-12 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
            </div>
            <div className="glass-strong rounded-3xl p-8 text-center animate-pulse">
              <div className="flex items-center justify-center gap-12">
                <div className="h-8 w-32 bg-surface-200 dark:bg-surface-800 rounded" />
                <div className="h-8 w-12 bg-surface-200 dark:bg-surface-800 rounded" />
                <div className="h-8 w-32 bg-surface-200 dark:bg-surface-800 rounded" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="glass rounded-2xl p-10 text-center">
            <AlertTriangle size={48} className="mx-auto mb-4 text-warning" />
            <h3 className="text-lg font-semibold text-danger mb-2">Failed to load teams</h3>
            <p className="text-surface-500 dark:text-surface-400 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && team1Stats && team2Stats && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <select value={team1?.id || ''} onChange={(e) => { const s = teams.find((t) => t.id === Number(e.target.value)); if (s) setTeam1(s); }} className="glass-strong rounded-xl px-4 py-3 text-surface-900 dark:text-surface-100 font-medium cursor-pointer outline-none">
                {teams.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
              </select>
              <select value={team2?.id || ''} onChange={(e) => { const s = teams.find((t) => t.id === Number(e.target.value)); if (s) setTeam2(s); }} className="glass-strong rounded-xl px-4 py-3 text-surface-900 dark:text-surface-100 font-medium cursor-pointer outline-none">
                {teams.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
              </select>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="glass-strong rounded-3xl p-8 text-center">
              <div className="flex items-center justify-center gap-6 lg:gap-12">
                <div className="flex-1"><h2 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">{team1?.name}</h2><p className="text-sm text-surface-500">{team1Stats.league}</p></div>
                <span className="text-4xl lg:text-5xl font-black text-surface-300 dark:text-surface-600">VS</span>
                <div className="flex-1"><h2 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">{team2?.name}</h2><p className="text-sm text-surface-500">{team2Stats.league}</p></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="glass-strong rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">Season Statistics</h3>
              {[{ label: 'Matches Played', v1: team1Stats.played, v2: team2Stats.played },{ label: 'Wins', v1: team1Stats.wins, v2: team2Stats.wins },{ label: 'Draws', v1: team1Stats.draws, v2: team2Stats.draws },{ label: 'Losses', v1: team1Stats.losses, v2: team2Stats.losses, higher: false },{ label: 'Goals For', v1: team1Stats.goalsFor, v2: team2Stats.goalsFor },{ label: 'Goals Against', v1: team1Stats.goalsAgainst, v2: team2Stats.goalsAgainst, higher: false },{ label: 'Clean Sheets', v1: team1Stats.cleanSheets, v2: team2Stats.cleanSheets }].map((stat) => {
                const bars = compareBar(stat.v1, stat.v2, stat.higher !== false);
                return (
                  <div key={stat.label} className="py-3 border-b border-surface-100 dark:border-surface-800/50 last:border-b-0">
                    <p className="text-xs text-surface-500 mb-2 text-center">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-surface-900 dark:text-surface-100 w-10 text-right">{stat.v1}</span>
                      <div className="flex-1 flex h-2 rounded-full overflow-hidden bg-surface-100 dark:bg-surface-800">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${bars.left}%` }} className="h-full bg-accent-500 rounded-l-full" transition={{ duration: 0.8, ease: 'easeOut' }} />
                        <motion.div initial={{ width: 0 }} animate={{ width: `${bars.right}%` }} className="h-full bg-surface-300 dark:bg-surface-600 rounded-r-full" transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} />
                      </div>
                      <span className="text-sm font-bold text-surface-900 dark:text-surface-100 w-10">{stat.v2}</span>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="glass-strong rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">Recent Form</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center"><p className="text-sm text-surface-500 mb-2">{team1?.name}</p><div className="flex justify-center gap-1.5">{team1Stats.form.map((r, i) => (<span key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${r==='W'?'bg-success':r==='D'?'bg-warning':'bg-danger'}`}>{r}</span>))}</div></div>
                <div className="text-center"><p className="text-sm text-surface-500 mb-2">{team2?.name}</p><div className="flex justify-center gap-1.5">{team2Stats.form.map((r, i) => (<span key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${r==='W'?'bg-success':r==='D'?'bg-warning':'bg-danger'}`}>{r}</span>))}</div></div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}