
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  title: string;
  timestamp: string;
  className?: string;
}

export function ActivityItem({ title, timestamp, className }: ActivityItemProps) {
  return (
    <div className={cn(
      "flex items-center justify-between py-4 border-b border-gray-100 last:border-0",
      className
    )}>
      <span className="font-medium text-gray-800">{title}</span>
      <span className="text-sm text-gray-500">{timestamp}</span>
    </div>
  );
}
