export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-surface-200 dark:bg-surface-800 rounded-lg ${className}`}
    />
  );
}