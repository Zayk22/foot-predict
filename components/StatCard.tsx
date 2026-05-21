'use client';
import { getIcon } from '@/lib/icons';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
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

export default function StatCard({ label, value, change, icon, index }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // GSAP scroll-triggered reveal animation
    gsap.fromTo(
      card,
      { 
        opacity: 0, 
        y: 40,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.1, // Stagger effect based on card position
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%', // When top of card is 90% down the viewport
          toggleActions: 'play none none none', // Play once
        },
      }
    );

    // Floating hover effect with GSAP
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      // Clean up ScrollTrigger
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="glass-strong rounded-2xl p-6 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
       <span className="text-accent-500">
  {getIcon(icon, 24)}
</span>
        <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
          {change}
        </span>
      </div>
      <p className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">
        {value}
      </p>
      <p className="text-sm text-surface-500 dark:text-surface-400">
        {label}
      </p>
    </div>
  );
}