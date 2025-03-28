
import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InputNumberFieldProps {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  invalid?: boolean;
  currency?: boolean;
  prefix?: string;
  suffix?: string;
  showButtons?: boolean;
  verticalButtons?: boolean;
  floatLabel?: boolean;
  className?: string;
}

export function InputNumberField({
  label,
  value = 0,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  invalid = false,
  currency = false,
  prefix,
  suffix,
  showButtons = false,
  verticalButtons = false,
  floatLabel = false,
  className
}: InputNumberFieldProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  
  const formatValue = (val: number) => {
    if (currency) {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(val);
    }
    return val.toString();
  };
  
  const handleIncrease = () => {
    if (disabled) return;
    const newValue = value + step;
    if (max !== undefined && newValue > max) return;
    onChange?.(newValue);
  };
  
  const handleDecrease = () => {
    if (disabled) return;
    const newValue = value - step;
    if (min !== undefined && newValue < min) return;
    onChange?.(newValue);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newValue = parseFloat(e.target.value);
    if (isNaN(newValue)) return;
    if (min !== undefined && newValue < min) return;
    if (max !== undefined && newValue > max) return;
    onChange?.(newValue);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && !floatLabel && <Label>{label}</Label>}
      <div className={cn("relative flex items-center", floatLabel && "h-14")}>
        {prefix && (
          <span className="absolute left-3 text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          type="text"
          value={currency ? formatValue(value) : value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "pr-10", // Space for buttons
            prefix && "pl-8", // Space for prefix
            suffix && "pr-8", // Space for suffix
            invalid && "border-destructive",
            floatLabel && "pt-6",
            showButtons && !verticalButtons && "pr-16"
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={invalid}
        />
        {label && floatLabel && (
          <Label
            className={cn(
              "absolute left-3 transition-all duration-150",
              isFocused || value !== 0
                ? "top-1 text-xs"
                : "top-2.5 text-muted-foreground",
              disabled && "cursor-not-allowed opacity-70"
            )}
          >
            {label}
          </Label>
        )}
        {suffix && (
          <span className="absolute right-3 text-muted-foreground">
            {suffix}
          </span>
        )}
        {showButtons && (
          <div 
            className={cn(
              "absolute right-1",
              verticalButtons 
                ? "flex flex-col h-full top-0" 
                : "flex items-center"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleIncrease}
              disabled={disabled || (max !== undefined && value >= max)}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleDecrease}
              disabled={disabled || (min !== undefined && value <= min)}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
