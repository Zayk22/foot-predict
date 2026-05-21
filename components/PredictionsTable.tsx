'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getPredictions } from '@/lib/api';
import { Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DEFAULT_DATA = [
  { id: 1, match: { home_team: { name: 'Arsenal' }, away_team: { name: 'Man City' }, league: 'Premier League' }, predicted_outcome: 'Home Win', confidence: 87 },
  { id: 2, match: { home_team: { name: 'Liverpool' }, away_team: { name: 'Chelsea' }, league: 'Premier League' }, predicted_outcome: 'Over 2.5', confidence: 72 },
  { id: 3, match: { home_team: { name: 'Barcelona' }, away_team: { name: 'Real Madrid' }, league: 'La Liga' }, predicted_outcome: 'BTTS', confidence: 91 },
  { id: 4, match: { home_team: { name: 'Bayern' }, away_team: { name: 'Dortmund' }, league: 'Bundesliga' }, predicted_outcome: 'Home Win', confidence: 83 },
  { id: 5, match: { home_team: { name: 'PSG' }, away_team: { name: 'Marseille' }, league: 'Ligue 1' }, predicted_outcome: 'PSG -1.5', confidence: 68 },
];

export default function PredictionsTable() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [predictions, setPredictions] = useState<any[]>(DEFAULT_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPredictions() {
      const { data, error } = await getPredictions();
      if (!error && data?.data?.length) {
        setPredictions(data.data);
      }
    }
    loadPredictions();
  }, []);

  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    gsap.fromTo(table, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: table, start: 'top 85%', toggleActions: 'play none none none' },
    });
  }, []);

  return (
    <div ref={tableRef} className="glass-strong rounded-2xl p-4 sm:p-6 overflow-x-auto">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Sparkles size={20} className="text-accent-500" />
          Recent Predictions
        </h3>
      </div>

      {error && (
        <div className="text-center py-8 text-danger">
          Failed to load predictions.
        </div>
      )}

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-surface-200 dark:border-surface-800">
            <th className="pb-3 text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Match</th>
            <th className="pb-3 text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden sm:table-cell">League</th>
            <th className="pb-3 text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Prediction</th>
            <th className="pb-3 text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((p) => (
            <tr key={p.id} className="border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
              <td className="py-4 pr-2 sm:pr-4 text-sm font-medium text-surface-900 dark:text-surface-100">
                {p.match?.home_team?.name || 'TBD'} vs {p.match?.away_team?.name || 'TBD'}
              </td>
              <td className="py-4 pr-4 text-sm text-surface-500 dark:text-surface-400 hidden sm:table-cell">
                {p.match?.league || 'N/A'}
              </td>
              <td className="py-4 pr-2 sm:pr-4">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-accent-500/10 text-accent-600 dark:text-accent-400 rounded-full whitespace-nowrap">
                  {p.predicted_outcome}
                </span>
              </td>
              <td className="py-4 pr-2 sm:pr-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-10 sm:w-16 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-500 rounded-full transition-all duration-500" style={{ width: `${p.confidence}%` }} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-300">{p.confidence}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}