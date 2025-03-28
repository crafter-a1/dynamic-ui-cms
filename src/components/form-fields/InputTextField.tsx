
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helpText?: string;
  invalid?: boolean;
  keyFilter?: RegExp;
  floatLabel?: boolean;
  className?: string;
}

export function InputTextField({
  label,
  helpText,
  invalid = false,
  keyFilter,
  floatLabel = false,
  className,
  disabled = false,
  value = "",
  onChange,
  ...props
}: InputTextFieldProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Apply key filter if provided
    if (keyFilter && !keyFilter.test(newValue) && newValue !== "") {
      return;
    }
    
    setInternalValue(newValue);
    
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn("relative", floatLabel && "h-16")}>
        {label && !floatLabel && <Label>{label}</Label>}
        <Input
          value={internalValue}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            invalid && "border-destructive",
            floatLabel && "pt-5",
            (floatLabel && (isFocused || String(internalValue).length > 0)) && "pt-6"
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={invalid}
          {...props}
        />
        {label && floatLabel && (
          <Label
            className={cn(
              "absolute left-3 transition-all duration-150",
              (isFocused || String(internalValue).length > 0)
                ? "top-1 text-xs"
                : "top-2.5 text-muted-foreground",
              disabled && "cursor-not-allowed opacity-70"
            )}
          >
            {label}
          </Label>
        )}
      </div>
      {helpText && (
        <p className={cn(
          "text-xs text-muted-foreground",
          invalid && "text-destructive"
        )}>
          {helpText}
        </p>
      )}
    </div>
  );
}
