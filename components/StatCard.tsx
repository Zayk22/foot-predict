'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getIcon } from '@/lib/icons';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: string;
  index: number;
}

// Generate sparkline data based on card index for variety
function generateSparklineData(index: number) {
  const datasets = [
    [4, 7, 8, 5, 9, 11, 8, 13, 15, 12, 16, 18, 15, 19, 22, 20, 24, 22],
    [65, 68, 70, 67, 72, 71, 73, 76, 74, 78, 75, 79, 82, 80, 83, 85, 82, 78],
    [2, 3, 3, 4, 5, 4, 6, 7, 6, 8, 7, 9, 8, 7, 8, 9, 8, 8],
    [5, 6, 8, 7, 9, 10, 9, 11, 12, 10, 13, 12, 14, 12, 13, 12, 14, 12],
  ];
  const data = datasets[index % datasets.length];
  return data.map((val, i) => ({ x: i, y: val }));
}

// Determine if trend is positive
function isPositive(index: number): boolean {
  return index !== 1; // Only Accuracy Rate (index 1) shows downward trend for variety
}

export default function StatCard({ label, value, change, icon, index }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const positive = isPositive(index);
  const sparklineData = generateSparklineData(index);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(card, { opacity: 0, y: 40, scale: 0.95 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.6, delay: index * 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
    });

    const handleMouseEnter = () => {
      gsap.to(card, { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', duration: 0.3, ease: 'power2.out' });
    };
    const handleMouseLeave = () => {
      gsap.to(card, { y: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', duration: 0.3, ease: 'power2.out' });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [index]);

  return (
    <div ref={cardRef} className="glass-strong rounded-2xl p-5 sm:p-6 cursor-pointer overflow-hidden">
      {/* Top row: Icon + Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-accent-500">
          {getIcon(icon, 22)}
        </span>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
          positive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
        }`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </span>
      </div>

      {/* Value */}
      <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">
        {value}
      </p>
      <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mb-3">
        {label}
      </p>

      {/* Sparkline */}
      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line
              type="monotone"
              dataKey="y"
              stroke={positive ? '#2b8a3e' : '#c92a2a'}
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
              animationBegin={index * 200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}