
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface RawGroupFieldProps {
  id: string;
  title?: string;
  className?: string;
  bordered?: boolean;
  background?: 'none' | 'subtle' | 'muted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const RawGroupField = ({
  id,
  title,
  className,
  bordered = true,
  background = 'subtle',
  padding = 'md',
  children
}: RawGroupFieldProps) => {
  // Define background styles
  const backgroundStyles = {
    none: '',
    subtle: 'bg-slate-50',
    muted: 'bg-muted'
  };

  // Define padding styles
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div 
      id={id} 
      className={cn("w-full", className)}
    >
      <Card className={cn(
        "overflow-hidden",
        backgroundStyles[background],
        paddingStyles[padding],
        !bordered && "border-0 shadow-none"
      )}>
        {title && (
          <div className="font-medium text-sm mb-2">{title}</div>
        )}
        <div>
          {children}
        </div>
      </Card>
    </div>
  );
};

export default RawGroupField;
