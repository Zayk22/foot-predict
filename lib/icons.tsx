import {
  LayoutDashboard,
  Sparkles,
  Radio,
  Trophy,
  GitCompare,
  BarChart3,
  Key,
  LogIn,
  UserPlus,
  Moon,
  Sun,
  Bell,
  User,
  Flame,
  Target,
  TrendingUp,
  Shield,
  ChevronRight,
  Menu,
  type LucideIcon,
} from 'lucide-react';

// Map of icon names to Lucide components
export const icons: Record<string, LucideIcon> = {
  home: LayoutDashboard,
  predictions: Sparkles,
  live: Radio,
  standings: Trophy,
  compare: GitCompare,
  stats: BarChart3,
  login: LogIn,
  signup: UserPlus,
  logout: Key,
  moon: Moon,
  sun: Sun,
  bell: Bell,
  user: User,
  flame: Flame,
  target: Target,
  trending: TrendingUp,
  shield: Shield,
  chevron: ChevronRight,
  menu: Menu,
};

// Helper to get an icon by name with a fallback
export function getIcon(name: string, size: number = 20): React.ReactNode {
  const IconComponent = icons[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} />;
}