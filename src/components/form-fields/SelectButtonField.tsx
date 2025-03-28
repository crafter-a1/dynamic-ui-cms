
import * as React from "react";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

interface SelectButtonFieldProps {
  label?: string;
  options: SelectOption[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

export function SelectButtonField({
  label,
  options,
  value,
  onValueChange,
  multiple = false,
  disabled = false,
  invalid = false,
  className
}: SelectButtonFieldProps) {
  // Handle single vs multiple selection
  const handleValueChange = (newValue: string | string[]) => {
    if (onValueChange) {
      if (multiple) {
        // For multiple selection
        onValueChange(newValue);
      } else {
        // For single selection, always pass the last selected value
        if (Array.isArray(newValue) && newValue.length > 0) {
          onValueChange(newValue[newValue.length - 1]);
        } else if (typeof newValue === 'string') {
          onValueChange(newValue);
        }
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className={cn(invalid && "text-destructive")}>{label}</Label>}
      <ToggleGroup
        type={multiple ? "multiple" : "single"}
        value={value}
        onValueChange={handleValueChange}
        className={cn("flex flex-wrap gap-1", invalid && "border-destructive")}
        disabled={disabled}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            disabled={disabled || option.disabled}
            className={cn(
              "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            )}
            aria-label={typeof option.label === 'string' ? option.label : undefined}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
