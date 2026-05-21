'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getStandings } from '@/lib/api';
import { Trophy } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DEFAULT_DATA = [
  { id: 1, name: 'Arsenal', position: 1, points: 82, form: ['W', 'W', 'D', 'L', 'W'] },
  { id: 2, name: 'Man City', position: 2, points: 78, form: ['W', 'D', 'W', 'W', 'L'] },
  { id: 3, name: 'Liverpool', position: 3, points: 75, form: ['D', 'W', 'W', 'L', 'W'] },
  { id: 4, name: 'Aston Villa', position: 4, points: 68, form: ['W', 'W', 'D', 'W', 'L'] },
  { id: 5, name: 'Newcastle', position: 5, points: 65, form: ['L', 'W', 'W', 'D', 'W'] },
];

export default function LeagueStandings() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [standings, setStandings] = useState<any[]>(DEFAULT_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStandings() {
      const { data, error } = await getStandings('Premier League');
      if (!error && data?.data?.length) {
        setStandings(data.data);
      }
    }
    loadStandings();
  }, []);

  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget) return;
    gsap.fromTo(widget, { opacity: 0, x: 30 }, {
      opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: widget, start: 'top 85%', toggleActions: 'play none none none' },
    });
  }, []);

  return (
    <div ref={widgetRef} className="glass-strong rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Trophy size={20} className="text-warning" />
          Premier League
        </h3>
      </div>

      {error && (
        <div className="text-center py-8 text-danger text-sm">Failed to load standings.</div>
      )}

      <div className="space-y-2">
        {standings.slice(0, 8).map((team, index) => (
          <div key={team.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
            <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
              ${index === 0 ? 'bg-warning/20 text-warning' : ''}
              ${index < 4 ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400' : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400'}
            `}>
              {team.position || index + 1}
            </span>
            <span className="flex-1 text-xs sm:text-sm font-medium text-surface-900 dark:text-surface-100 truncate">{team.name}</span>
            <span className="text-base sm:text-lg font-bold text-surface-900 dark:text-surface-100 min-w-[1.5rem] text-right">{team.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}