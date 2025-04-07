
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';

interface CheckboxOption {
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
}

interface CheckboxCardsFieldProps {
  id: string;
  label?: string;
  value?: string[];
  onChange: (value: string[]) => void;
  options: CheckboxOption[];
  required?: boolean;
  helpText?: string;
  className?: string;
  maxSelections?: number;
}

export function CheckboxCardsField({
  id,
  label,
  value = [],
  onChange,
  options = [],
  required = false,
  helpText,
  className,
  maxSelections
}: CheckboxCardsFieldProps) {
  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      // If we have a max selections limit and we've reached it, remove the first item
      if (maxSelections && value.length >= maxSelections) {
        onChange([...value.slice(1), optionValue]);
      } else {
        onChange([...value, optionValue]);
      }
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          
          return (
            <div key={option.value} className="relative">
              <Checkbox
                id={`${id}-${option.value}`}
                checked={isSelected}
                onCheckedChange={(checked) => 
                  handleCheckboxChange(option.value, checked === true)
                }
                className="sr-only"
              />
              <Label
                htmlFor={`${id}-${option.value}`}
                className="cursor-pointer"
              >
                <Card className={cn(
                  "overflow-hidden transition-all border-2",
                  isSelected 
                    ? "border-primary" 
                    : "border-transparent hover:border-muted-foreground/30"
                )}>
                  {isSelected && (
                    <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                      <CheckIcon className="h-3 w-3" />
                    </div>
                  )}
                  <CardContent className="p-4 flex flex-col gap-2">
                    {option.icon && (
                      <div className="mb-2">
                        {option.icon}
                      </div>
                    )}
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Label>
            </div>
          );
        })}
      </div>
      
      {maxSelections && (
        <p className="text-muted-foreground text-xs">
          Maximum {maxSelections} selection{maxSelections !== 1 ? 's' : ''}
        </p>
      )}
      
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default CheckboxCardsField;
