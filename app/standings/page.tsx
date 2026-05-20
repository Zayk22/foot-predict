'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getStandings } from '@/lib/api';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LEAGUES = ['Premier League', 'La Liga'];

export default function StandingsPage() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState('Premier League');
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch standings
  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await getStandings(selectedLeague);
      if (error) {
        setError(error);
      } else if (data?.data) {
        setStandings(data.data.sort((a: any, b: any) => b.points - a.points));
      }
      setLoading(false);
    }
    load();
  }, [selectedLeague]);

  // GSAP animation
  useEffect(() => {
    if (loading || !tableRef.current) return;
    gsap.fromTo(
      tableRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: tableRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [loading]);

  // Zone indicator
  const getZoneColor = (pos: number, total: number) => {
    if (pos <= 4) return 'border-l-4 border-l-accent-500'; // Champions League
    if (pos === 5) return 'border-l-4 border-l-warning'; // Europa League
    if (pos >= total - 2) return 'border-l-4 border-l-danger'; // Relegation
    return 'border-l-4 border-l-transparent';
  };

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
            🏆 League Standings
          </h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            Full league tables with team statistics.
          </p>
        </motion.div>

        {/* League selector */}
        <div className="flex gap-3">
          {LEAGUES.map((league) => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all
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

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-accent-500" />
            <span className="text-surface-500">Champions League</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-warning" />
            <span className="text-surface-500">Europa League</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-danger" />
            <span className="text-surface-500">Relegation</span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-3 border-accent-500 border-t-transparent rounded-full mb-4" />
            <p className="text-surface-500">Loading standings...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass rounded-2xl p-10 text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-lg font-semibold text-danger mb-2">Failed to load standings</h3>
            <p className="text-surface-500 text-sm">Make sure the API server is running on port 5000.</p>
          </div>
        )}

        {/* Standings table */}
        {!loading && !error && standings.length > 0 && (
          <div ref={tableRef} className="glass-strong rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50">
                    <th className="py-4 px-4 text-xs font-medium text-surface-500 uppercase tracking-wider w-12">#</th>
                    <th className="py-4 px-4 text-xs font-medium text-surface-500 uppercase tracking-wider">Team</th>
                    <th className="py-4 px-4 text-xs font-medium text-surface-500 uppercase tracking-wider text-center">P</th>
                    <th className="py-4 px-4 text-xs font-medium text-surface-500 uppercase tracking-wider text-center">W</th>
                    <th className="py-4 px-4 text-xs font-medium text-surface-500 uppercase tracking-wider text-center">D</th>
                    <th className="py-4 px-4 text-xs font-medium text-surface-500 uppercase tracking-wider text-center">L</th>
                    <th className="py-4 px-4 text-xs font-medium text-surface-500 uppercase tracking-wider text-center hidden sm:table-cell">GF</th>
                    <th className="py-4 px-4 text-xs font-medium text-surface-500 uppercase tracking-wider text-center hidden sm:table-cell">GA</th>
                    <th className="py-4 px-4 text-xs font-medium text-surface-500 uppercase tracking-wider text-center">Pts</th>
                    <th className="py-4 px-4 text-xs font-medium text-surface-500 uppercase tracking-wider text-center hidden md:table-cell">Form</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => (
                    <motion.tr
                      key={team.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        ${getZoneColor(index + 1, standings.length)}
                        border-b border-surface-100 dark:border-surface-800/50
                        hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors
                      `}
                    >
                      <td className="py-4 px-4">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                          ${index === 0 ? 'bg-warning/20 text-warning' : ''}
                          ${index < 4 ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400' : ''}
                          ${index >= standings.length - 2 ? 'bg-danger/10 text-danger' : ''}
                          ${index >= 4 && index < standings.length - 2 ? 'text-surface-500' : ''}
                        `}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                            {team.name}
                          </span>
                          <span className="text-xs text-surface-400 hidden sm:inline">
                            {team.short_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-surface-600 dark:text-surface-400">
                        {team.played}
                      </td>
                      <td className="py-4 px-4 text-center text-sm font-medium text-surface-700 dark:text-surface-300">
                        {team.won}
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-surface-600 dark:text-surface-400">
                        {team.drawn}
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-surface-600 dark:text-surface-400">
                        {team.lost}
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-surface-600 dark:text-surface-400 hidden sm:table-cell">
                        {team.goals_for}
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-surface-600 dark:text-surface-400 hidden sm:table-cell">
                        {team.goals_against}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-lg font-bold text-surface-900 dark:text-surface-100">
                          {team.points}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <div className="flex gap-1 justify-center">
                          {(team.form || []).map((result: string, i: number) => (
                            <span
                              key={i}
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                                ${result === 'W' ? 'bg-success/20 text-success' : ''}
                                ${result === 'D' ? 'bg-warning/20 text-warning' : ''}
                                ${result === 'L' ? 'bg-danger/20 text-danger' : ''}
                              `}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && standings.length === 0 && (
          <div className="glass rounded-2xl p-10 text-center">
            <span className="text-4xl mb-4 block">📭</span>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              No standings available
            </h3>
            <p className="text-surface-500 text-sm">Try selecting a different league.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}