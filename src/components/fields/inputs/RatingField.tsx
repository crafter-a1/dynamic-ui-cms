
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface RatingFieldProps {
  id: string;
  label?: string;
  value?: number;
  onChange: (value: number) => void;
  required?: boolean;
  helpText?: string;
  className?: string;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  allowHalf?: boolean;
  readonly?: boolean;
}

export function RatingField({
  id,
  label,
  value = 0,
  onChange,
  required = false,
  helpText,
  className,
  maxRating = 5,
  size = 'md',
  color = 'text-amber-400',
  allowHalf = false,
  readonly = false
}: RatingFieldProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (readonly) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const starWidth = rect.width;
    const mouseX = e.clientX - rect.left;
    
    // For half-star rating
    if (allowHalf) {
      if (mouseX < starWidth / 2) {
        setHoverRating(starIndex + 0.5);
      } else {
        setHoverRating(starIndex + 1);
      }
    } else {
      setHoverRating(starIndex + 1);
    }
  };
  
  const handleMouseLeave = () => {
    setHoverRating(0);
  };
  
  const handleClick = (ratingValue: number) => {
    if (!readonly) {
      onChange(ratingValue);
    }
  };
  
  // Determine star size based on prop
  const starSize = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }[size];
  
  // Create stars array
  const starsArray = Array.from({ length: maxRating }, (_, i) => i);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div 
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {starsArray.map((starIndex) => {
          const starValue = starIndex + 1;
          const displayRating = hoverRating || value;
          
          // Determine fill state (full, half, or empty)
          let fillState = 'empty';
          if (displayRating >= starValue) {
            fillState = 'full';
          } else if (allowHalf && displayRating === starIndex + 0.5) {
            fillState = 'half';
          }
          
          return (
            <div
              key={starIndex}
              className={cn(
                "relative cursor-default",
                !readonly && "cursor-pointer"
              )}
              onMouseMove={(e) => handleMouseMove(e, starIndex)}
              onClick={() => handleClick(starValue)}
              aria-label={`Rate ${starValue} out of ${maxRating}`}
            >
              {/* Empty star (background) */}
              <Star 
                className={cn(
                  starSize,
                  "text-gray-200 dark:text-gray-700"
                )}
                fill="currentColor"
              />
              
              {/* Filled star (overlay) */}
              {fillState !== 'empty' && (
                <div 
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ 
                    width: fillState === 'half' ? '50%' : '100%' 
                  }}
                >
                  <Star 
                    className={cn(
                      starSize,
                      color
                    )}
                    fill="currentColor"
                  />
                </div>
              )}
            </div>
          );
        })}
        
        {/* Optional numeric display */}
        <span className="ml-2 text-sm text-muted-foreground">
          {value} / {maxRating}
        </span>
      </div>
      
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default RatingField;
