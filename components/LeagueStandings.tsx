'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getStandings } from '@/lib/api';
import { Trophy } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LeagueStandings() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStandings() {
      const { data, error } = await getStandings('Premier League');
      if (error) {
        setError(error);
      } else if (data?.data) {
        setStandings(data.data);
      }
      setLoading(false);
    }
    loadStandings();
  }, []);

  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget || loading) return;

    gsap.fromTo(
      widget,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: widget,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [loading]);

  return (
    <div ref={widgetRef} className="glass-strong rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Trophy size={20} className="text-warning" />
          Premier League
        </h3>
      </div>

      {loading && (
        <div className="text-center py-8 text-surface-500 dark:text-surface-400">
          <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto mb-3" />
          Loading standings...
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-danger text-sm">
          Failed to load standings.
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-2">
          {standings.slice(0, 8).map((team, index) => (
            <div
              key={team.id}
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors"
            >
              <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                ${index === 0 ? 'bg-warning/20 text-warning' : ''}
                ${index < 4 ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400' : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400'}
              `}>
                {team.position || index + 1}
              </span>
              <span className="flex-1 text-xs sm:text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                {team.name}
              </span>
              <div className="hidden sm:flex gap-1">
                {(team.form || ['W', 'D', 'W']).slice(0, 5).map((result: string, i: number) => (
                  <span
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                      ${result === 'W' ? 'bg-success/20 text-success' : ''}
                      ${result === 'D' ? 'bg-warning/20 text-warning' : ''}
                      ${result === 'L' ? 'bg-danger/20 text-danger' : ''}
                    `}
                  >
                    {result}
                  </span>
                ))}
              </div>
              <span className="text-base sm:text-lg font-bold text-surface-900 dark:text-surface-100 min-w-[1.5rem] text-right">
                {team.points}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}