
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChipsFieldProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  separator?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
}

export function ChipsField({
  label,
  placeholder = "Add tags...",
  disabled = false,
  invalid = false,
  separator = ",",
  value = [],
  onChange,
  className
}: ChipsFieldProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle separator key (default is comma)
    if (e.key === separator || e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        addChip(inputValue.trim());
      }
    }
  };

  const addChip = (chip: string) => {
    if (disabled) return;
    if (!value.includes(chip)) {
      const newValue = [...value, chip];
      onChange?.(newValue);
      setInputValue("");
    }
  };

  const removeChip = (index: number) => {
    if (disabled) return;
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange?.(newValue);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div
        className={cn(
          "flex flex-wrap gap-2 p-2 border rounded-md min-h-10",
          invalid && "border-destructive",
          disabled && "opacity-50 bg-muted",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        )}
      >
        {value.map((chip, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md",
              disabled && "opacity-50"
            )}
          >
            <span className="text-sm">{chip}</span>
            {!disabled && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full"
                onClick={() => removeChip(index)}
                aria-label={`Remove ${chip}`}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="border-0 flex-1 min-w-[120px] p-0 h-7 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled}
          aria-invalid={invalid}
        />
      </div>
    </div>
  );
}
