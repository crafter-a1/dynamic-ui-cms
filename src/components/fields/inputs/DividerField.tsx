
import React from 'react';
import { cn } from '@/lib/utils';

interface DividerFieldProps {
  id: string;
  label?: string | null;
  className?: string;
  color?: 'default' | 'muted' | 'primary' | 'destructive';
  thickness?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  labelPosition?: 'center' | 'left' | 'right';
}

export const DividerField = ({
  id,
  label = null,
  className,
  color = 'muted',
  thickness = 1,
  style = 'solid',
  labelPosition = 'center'
}: DividerFieldProps) => {
  // Define color styles
  const colorStyles = {
    default: 'border-border',
    muted: 'border-muted',
    primary: 'border-primary',
    destructive: 'border-destructive'
  };

  const borderStyle = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  };

  if (!label) {
    return (
      <div 
        id={id} 
        className={cn(
          "w-full my-4",
          className
        )}
      >
        <div 
          className={cn(
            "w-full border-t",
            colorStyles[color],
            borderStyle[style]
          )}
          style={{ borderTopWidth: `${thickness}px` }}
        />
      </div>
    );
  }

  const labelPositionStyles = {
    center: "justify-center",
    left: "justify-start",
    right: "justify-end"
  };

  return (
    <div 
      id={id} 
      className={cn(
        "w-full my-4 flex items-center",
        className
      )}
    >
      {labelPosition !== 'right' && (
        <div 
          className={cn(
            "flex-grow border-t",
            colorStyles[color],
            borderStyle[style]
          )}
          style={{ borderTopWidth: `${thickness}px` }}
        />
      )}
      
      <div 
        className={cn(
          "px-4 text-sm font-medium text-muted-foreground",
          labelPosition === 'center' ? 'mx-4' : 'mx-2'
        )}
      >
        {label}
      </div>
      
      {labelPosition !== 'left' && (
        <div 
          className={cn(
            "flex-grow border-t",
            colorStyles[color],
            borderStyle[style]
          )}
          style={{ borderTopWidth: `${thickness}px` }}
        />
      )}
    </div>
  );
};

export default DividerField;
