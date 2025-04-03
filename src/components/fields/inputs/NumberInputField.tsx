
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronUp, ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberInputFieldProps {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  locale?: string;
  currency?: string;
  showButtons?: boolean;
  buttonLayout?: "horizontal" | "vertical";
  label?: string;
  floatLabel?: boolean;
  filled?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function NumberInputField({
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder = "Enter a number",
  prefix,
  suffix,
  locale,
  currency,
  showButtons = false,
  buttonLayout = "horizontal",
  label,
  floatLabel = false,
  filled = false,
  invalid = false,
  disabled = false,
  required = false,
  id,
  name,
  className,
  style,
}: NumberInputFieldProps) {
  const [localValue, setLocalValue] = useState<string>(
    value !== null ? String(value) : ""
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Update local value when prop value changes
    setLocalValue(value !== null ? String(value) : "");
  }, [value]);

  const formatNumber = (num: number): string => {
    if (currency) {
      return new Intl.NumberFormat(locale || undefined, {
        style: "currency",
        currency: currency,
      }).format(num);
    }
    if (locale) {
      return new Intl.NumberFormat(locale).format(num);
    }
    return String(num);
  };

  const parseNumber = (str: string): number | null => {
    if (!str) return null;
    
    // Remove prefix, suffix, and formatting characters
    let cleanedStr = str;
    if (prefix) {
      cleanedStr = cleanedStr.replace(prefix, "");
    }
    if (suffix) {
      cleanedStr = cleanedStr.replace(suffix, "");
    }
    
    // Remove currency symbols and separators
    cleanedStr = cleanedStr.replace(/[^-0-9.]/g, "");
    
    const parsed = parseFloat(cleanedStr);
    if (isNaN(parsed)) return null;
    
    // Apply constraints
    if (min !== undefined && parsed < min) return min;
    if (max !== undefined && parsed > max) return max;
    
    return parsed;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setLocalValue(inputValue);
    
    const parsedValue = parseNumber(inputValue);
    onChange(parsedValue);
  };

  const handleIncrement = () => {
    if (disabled) return;
    
    const currentValue = value ?? 0;
    const newValue = currentValue + step;
    
    if (max !== undefined && newValue > max) return;
    
    onChange(newValue);
    setLocalValue(String(newValue));
  };

  const handleDecrement = () => {
    if (disabled) return;
    
    const currentValue = value ?? 0;
    const newValue = currentValue - step;
    
    if (min !== undefined && newValue < min) return;
    
    onChange(newValue);
    setLocalValue(String(newValue));
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    // Format the value as needed when leaving the field
    if (value !== null) {
      if (currency || locale) {
        setLocalValue(formatNumber(value));
      } else {
        setLocalValue(String(value));
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    
    // When focusing, show the raw value for easier editing
    if (value !== null) {
      setLocalValue(String(value));
    }
  };

  // Prepare display value with prefix/suffix
  const displayValue = localValue 
    ? `${prefix || ""}${localValue}${suffix || ""}`
    : "";

  const inputClasses = cn(
    "flex",
    filled ? "bg-gray-100" : "bg-white",
    invalid ? "border-red-500" : "border-gray-300",
    isFocused && !invalid ? "ring-2 ring-blue-500 border-blue-500" : "",
    disabled ? "opacity-60 cursor-not-allowed" : ""
  );

  return (
    <div className="w-full space-y-1">
      {label && !floatLabel && (
        <Label
          htmlFor={id}
          className={cn(
            "text-sm font-medium",
            required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : "",
            invalid ? "text-red-500" : ""
          )}
        >
          {label}
        </Label>
      )}
      
      <div
        className={cn(
          "relative",
          buttonLayout === "vertical" && showButtons ? "flex" : "",
          className
        )}
        style={style}
      >
        {floatLabel && (
          <Label
            htmlFor={id}
            className={cn(
              "absolute text-xs transition-all duration-200 pointer-events-none",
              isFocused || localValue
                ? "-top-2 left-2 px-1 bg-white text-blue-500 text-xs z-10"
                : "top-2.5 left-3 text-gray-500",
              required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : "",
              invalid ? "text-red-500" : ""
            )}
          >
            {label}
          </Label>
        )}
        
        <div className="relative flex-1">
          <Input
            type="text"
            id={id}
            name={name}
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              inputClasses,
              showButtons && buttonLayout === "horizontal" ? "pr-16" : ""
            )}
            aria-invalid={invalid}
            aria-required={required}
            min={min}
            max={max}
            step={step}
          />
          
          {showButtons && buttonLayout === "horizontal" && (
            <div className="absolute inset-y-0 right-0 flex flex-col border-l">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-1/2 w-8 rounded-none rounded-tr border-b"
                onClick={handleIncrement}
                disabled={disabled || (max !== undefined && (value ?? 0) >= max)}
                aria-label="Increment"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-1/2 w-8 rounded-none rounded-br"
                onClick={handleDecrement}
                disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
                aria-label="Decrement"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        {showButtons && buttonLayout === "vertical" && (
          <div className="flex flex-col ml-1 space-y-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrement}
              disabled={disabled || (max !== undefined && (value ?? 0) >= max)}
              aria-label="Increment"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrement}
              disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
              aria-label="Decrement"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {invalid && (
        <p className="text-xs text-red-500 mt-1">
          Invalid value. Please enter a valid number.
        </p>
      )}
    </div>
  );
}
