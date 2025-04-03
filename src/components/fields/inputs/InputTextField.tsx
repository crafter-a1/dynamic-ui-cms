
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface InputTextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helpText?: string;
  floatLabel?: boolean;
  keyFilter?: "none" | "numeric" | "alpha" | "alphanumeric" | "custom";
  keyFilterPattern?: string;
  size?: "small" | "medium" | "large";
  invalid?: boolean;
  errorMessage?: string;
  filled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  containerClassName?: string;
}

export function InputTextField({
  id,
  label,
  helpText,
  floatLabel = false,
  keyFilter = "none",
  keyFilterPattern = "",
  size = "medium",
  invalid = false,
  errorMessage,
  filled = false,
  ariaLabel,
  ariaDescribedBy,
  className,
  containerClassName,
  disabled,
  required,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ...props
}: InputTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    (value as string) || defaultValue as string || ""
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const helpTextId = ariaDescribedBy || `${id}-help`;
  const errorId = `${id}-error`;
  
  // Update internal state when the value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value as string);
    }
  }, [value]);

  // Handle focus event
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  // Handle blur event
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Handle key filtering
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }

    // If no key filter or disabled, allow the key
    if (keyFilter === "none" || disabled) return;

    // Allow special keys like backspace, arrow keys, etc.
    const specialKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Escape", "Enter", "Home", "End"];
    if (specialKeys.includes(e.key)) return;

    // Allow copy/paste shortcuts
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v" || e.key === "x" || e.key === "a")) return;

    // Apply key filtering based on the selected filter
    let regex: RegExp;
    switch (keyFilter) {
      case "numeric":
        regex = /^\d$/;
        break;
      case "alpha":
        regex = /^[a-zA-Z]$/;
        break;
      case "alphanumeric":
        regex = /^[a-zA-Z0-9]$/;
        break;
      case "custom":
        try {
          regex = new RegExp(keyFilterPattern || ".");
        } catch (err) {
          // Default to allowing all if regex is invalid
          return;
        }
        break;
      default:
        return;
    }

    // Prevent key if it doesn't match the pattern
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (onChange) {
      onChange(e);
    }
  };

  // Determine input size class
  const sizeClass = {
    small: "h-8 text-xs px-2 py-1",
    medium: "h-10 text-sm px-3 py-2",
    large: "h-12 text-base px-4 py-3",
  }[size];

  // Determine if label should float (either specified or when input has value/focused)
  const shouldFloatLabel = floatLabel && (isFocused || inputValue);

  return (
    <div className={cn("relative space-y-2", containerClassName)}>
      <div className="relative">
        {label && !floatLabel && (
          <Label
            htmlFor={id}
            className={cn(
              "mb-2 block",
              invalid ? "text-red-500" : "",
              disabled ? "text-gray-400 cursor-not-allowed" : "",
              required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""
            )}
          >
            {label}
          </Label>
        )}

        {label && floatLabel && (
          <Label
            htmlFor={id}
            className={cn(
              "absolute transition-all duration-200 pointer-events-none",
              shouldFloatLabel
                ? "-top-2.5 left-2 text-xs bg-white px-1 z-10"
                : "top-1/2 left-3 -translate-y-1/2",
              isFocused ? "text-blue-600" : "text-gray-500",
              invalid ? "text-red-500" : "",
              disabled ? "text-gray-400 cursor-not-allowed" : "",
              required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""
            )}
          >
            {label}
          </Label>
        )}

        <Input
          id={id}
          ref={inputRef}
          className={cn(
            sizeClass,
            filled ? "bg-gray-100" : "",
            invalid ? "border-red-500 focus:ring-red-500" : "",
            floatLabel ? "pt-4 pb-2" : "",
            className
          )}
          value={value !== undefined ? value : inputValue}
          aria-invalid={invalid}
          aria-describedby={
            helpText ? helpTextId : invalid && errorMessage ? errorId : undefined
          }
          aria-label={ariaLabel || label || undefined}
          disabled={disabled}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </div>

      {helpText && !invalid && (
        <p id={helpTextId} className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}

      {invalid && errorMessage && (
        <p id={errorId} className="text-xs text-red-500 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default InputTextField;
