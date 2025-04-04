
import React from "react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";

export interface SelectButtonOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectButtonFieldProps {
  id?: string;
  name?: string;
  label?: string;
  options: SelectButtonOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  invalid?: boolean;
  errorMessage?: string;
  className?: string;
}

export function SelectButtonField({
  id,
  name,
  label,
  options,
  value,
  onChange,
  multiple = false,
  required = false,
  disabled = false,
  helpText,
  invalid = false,
  errorMessage,
  className,
}: SelectButtonFieldProps) {
  const handleValueChange = (newValue: string | string[]) => {
    onChange(newValue);
  };

  // If multiple is true, ensure value is always an array
  let currentValue: string | string[] = value;
  if (multiple && !Array.isArray(value)) {
    currentValue = value ? [value] : [];
  }
  // If multiple is false, ensure value is always a string
  else if (!multiple && Array.isArray(value)) {
    currentValue = value.length > 0 ? value[0] : '';
  }

  const helpTextId = `${id}-help`;
  const errorId = `${id}-error`;

  // We need to render different ToggleGroup based on the type
  // to fix the TypeScript error
  if (multiple) {
    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={id}
            className={cn(
              "block",
              invalid ? "text-red-500" : "",
              disabled ? "text-gray-400 cursor-not-allowed" : "",
              required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""
            )}
          >
            {label}
          </Label>
        )}

        <ToggleGroup 
          type="multiple"
          value={currentValue as string[]}
          onValueChange={handleValueChange}
          className={cn("flex flex-wrap gap-2", className)}
          disabled={disabled}
        >
          {options.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              disabled={option.disabled || disabled}
              className="data-[state=on]:bg-blue-600 data-[state=on]:text-white"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

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
  } else {
    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={id}
            className={cn(
              "block",
              invalid ? "text-red-500" : "",
              disabled ? "text-gray-400 cursor-not-allowed" : "",
              required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""
            )}
          >
            {label}
          </Label>
        )}

        <ToggleGroup 
          type="single"
          value={currentValue as string}
          onValueChange={handleValueChange}
          className={cn("flex flex-wrap gap-2", className)}
          disabled={disabled}
        >
          {options.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              disabled={option.disabled || disabled}
              className="data-[state=on]:bg-blue-600 data-[state=on]:text-white"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

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
}

export default SelectButtonField;
