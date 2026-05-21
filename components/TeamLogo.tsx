import { Shield } from 'lucide-react';

// Simple mapping of team names to colors for placeholder crests
const teamColors: Record<string, string> = {
  'Arsenal': '#EF0107',
  'Aston Villa': '#670E36',
  'Chelsea': '#034694',
  'Liverpool': '#C8102E',
  'Manchester City': '#6CABDD',
  'Manchester United': '#DA291C',
  'Tottenham': '#132257',
  'Newcastle': '#241F20',
  'Barcelona': '#A50044',
  'Real Madrid': '#FEBE10',
  'Atletico Madrid': '#272E61',
};

export default function TeamLogo({ name, size = 24 }: { name: string; size?: number }) {
  const color = teamColors[name] || '#339af0';
  const initial = name?.charAt(0) || '?';
  
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold text-xs"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.4,
      }}
    >
      {initial}
    </div>
  );
}