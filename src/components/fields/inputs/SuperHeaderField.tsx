
import React from 'react';
import { cn } from '@/lib/utils';

interface SuperHeaderFieldProps {
  id: string;
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'default' | 'muted' | 'primary' | 'destructive';
  align?: 'left' | 'center' | 'right';
  hasDivider?: boolean;
  dividerThickness?: number;
  icon?: React.ReactNode;
}

export const SuperHeaderField = ({
  id,
  text,
  className,
  size = 'lg',
  color = 'default',
  align = 'left',
  hasDivider = true,
  dividerThickness = 2,
  icon
}: SuperHeaderFieldProps) => {
  // Define size styles
  const sizeStyles = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  // Define color styles
  const colorStyles = {
    default: 'text-foreground border-border',
    muted: 'text-muted-foreground border-muted',
    primary: 'text-primary border-primary',
    destructive: 'text-destructive border-destructive'
  };

  // Define alignment styles
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <div 
      id={id} 
      className={cn(
        "w-full my-4",
        className
      )}
    >
      <div className={cn(
        "font-bold tracking-tight mb-2 flex items-center gap-2",
        sizeStyles[size],
        colorStyles[color],
        alignStyles[align]
      )}>
        {icon && <div className="flex-shrink-0">{icon}</div>}
        {text}
      </div>
      
      {hasDivider && (
        <div 
          className={cn(
            "w-full border-t",
            colorStyles[color]
          )}
          style={{ borderTopWidth: `${dividerThickness}px` }}
        />
      )}
    </div>
  );
};

export default SuperHeaderField;
