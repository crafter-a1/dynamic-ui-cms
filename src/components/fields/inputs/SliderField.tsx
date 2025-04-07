
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface SliderFieldProps {
  id: string;
  label?: string;
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  helpText?: string;
  className?: string;
  showInput?: boolean;
  disabled?: boolean;
  showMarks?: boolean;
  markStep?: number;
}

export function SliderField({
  id,
  label,
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  required = false,
  helpText,
  className,
  showInput = true,
  disabled = false,
  showMarks = false,
  markStep
}: SliderFieldProps) {
  const handleSliderChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseFloat(e.target.value);
    
    // Validate input is within bounds
    if (isNaN(newValue)) {
      newValue = min;
    } else {
      newValue = Math.max(min, Math.min(max, newValue));
    }
    
    onChange(newValue);
  };

  // Generate marks if showMarks is true
  const marks = showMarks ? generateMarks(min, max, markStep || Math.max(step, (max - min) / 10)) : null;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Slider
            id={id}
            defaultValue={[value]}
            value={[value]}
            onValueChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-describedby={helpText ? `${id}-description` : undefined}
          />
          
          {showMarks && marks && (
            <div className="relative w-full h-6 mt-1">
              {marks.map((mark) => (
                <div 
                  key={mark.value}
                  className="absolute -translate-x-1/2 top-0"
                  style={{ left: `${((mark.value - min) / (max - min)) * 100}%` }}
                >
                  <div className="h-1.5 w-0.5 bg-gray-300 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">{mark.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {showInput && (
          <Input
            type="number"
            value={value}
            onChange={handleInputChange}
            className="w-20"
            min={min}
            max={max}
            step={step}
            disabled={disabled}
          />
        )}
      </div>
      
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
    </div>
  );
}

// Helper function to generate marks for the slider
function generateMarks(min: number, max: number, step: number) {
  const marks = [];
  const totalSteps = Math.floor((max - min) / step) + 1;
  const maxMarks = 11; // Maximum number of marks to show
  
  // Adjust step if there would be too many marks
  const actualStep = totalSteps > maxMarks ? ((max - min) / (maxMarks - 1)) : step;
  
  for (let value = min; value <= max; value += actualStep) {
    marks.push({
      value: Math.round(value * 100) / 100, // Round to avoid floating point issues
      label: value.toString()
    });
  }
  
  // Ensure max value is included
  if (marks[marks.length - 1]?.value !== max) {
    marks.push({
      value: max,
      label: max.toString()
    });
  }
  
  return marks;
}

export default SliderField;
