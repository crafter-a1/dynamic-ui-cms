
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';

interface RadioOption {
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
}

interface RadioCardsFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  helpText?: string;
  className?: string;
}

export function RadioCardsField({
  id,
  label,
  value = '',
  onChange,
  options = [],
  required = false,
  helpText,
  className
}: RadioCardsFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {options.map((option) => (
          <div key={option.value} className="relative">
            <RadioGroupItem
              id={`${id}-${option.value}`}
              value={option.value}
              className="sr-only"
            />
            <Label
              htmlFor={`${id}-${option.value}`}
              className="cursor-pointer"
            >
              <Card className={cn(
                "overflow-hidden transition-all border-2",
                value === option.value 
                  ? "border-primary" 
                  : "border-transparent hover:border-muted-foreground/30"
              )}>
                {value === option.value && (
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
        ))}
      </RadioGroup>
      
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default RadioCardsField;
