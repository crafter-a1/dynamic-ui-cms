
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export function StatsCard({ title, value, className }: StatsCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg p-6 shadow-sm border border-gray-100",
      className
    )}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
