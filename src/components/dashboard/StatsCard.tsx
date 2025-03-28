
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatsCard = ({ title, value, icon, change, className }: StatsCardProps) => {
  return (
    <Card className={cn("card-hover p-6", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded",
                  change.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                )}
              >
                {change.positive ? "+" : "-"}{Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">from last month</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-cms-lightGray rounded-lg">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
