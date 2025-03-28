
import * as React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioButtonFieldProps {
  label?: string;
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  filled?: boolean;
  className?: string;
}

export function RadioButtonField({
  label,
  options,
  value,
  onValueChange,
  disabled = false,
  invalid = false,
  filled = false,
  className
}: RadioButtonFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className={cn(invalid && "text-destructive")}>{label}</Label>}
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="space-y-2"
        disabled={disabled}
      >
        {options.map((option) => (
          <div className="flex items-center space-x-2" key={option.value}>
            <RadioGroupItem
              value={option.value}
              disabled={disabled || option.disabled}
              id={`radio-${option.value}`}
              className={cn(
                filled && "bg-muted border-primary",
                invalid && "border-destructive"
              )}
            />
            <Label
              htmlFor={`radio-${option.value}`}
              className={cn(
                (disabled || option.disabled) && "opacity-70 cursor-not-allowed"
              )}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
