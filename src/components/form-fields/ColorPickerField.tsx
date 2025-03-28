
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ColorPickerFieldProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  inline?: boolean;
  format?: "hex" | "rgb" | "hsl";
  invalid?: boolean;
  className?: string;
}

export function ColorPickerField({
  label,
  value = "#000000",
  onChange,
  disabled = false,
  inline = false,
  format = "hex",
  invalid = false,
  className
}: ColorPickerFieldProps) {
  // Maintain internal state for the color
  const [internalValue, setInternalValue] = React.useState(value);
  
  // Display format converter
  const formatColor = (color: string) => {
    // Just a simple implementation - in a real app you would use proper color conversion
    if (format === "hex") return color;
    
    // This is a simplified implementation
    // In a real app, proper RGB/HSL conversion would be needed
    return color;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInternalValue(newColor);
    onChange?.(newColor);
  };

  // Handle text input changes for the color
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Validate hex format (simple validation)
    const isValidColor = /^#[0-9A-F]{6}$/i.test(newValue);
    
    if (isValidColor) {
      setInternalValue(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={`color-picker-${label}`}>{label}</Label>}
      <div className={cn("flex items-center gap-3", inline ? "flex-row" : "flex-col")}>
        <div className="flex items-center gap-2">
          <input
            type="color"
            id={`color-picker-${label}`}
            value={internalValue}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              "w-10 h-10 p-0 border rounded cursor-pointer",
              invalid && "border-destructive",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            aria-invalid={invalid}
            aria-label={label || "Color picker"}
          />
          <Input
            type="text"
            value={formatColor(internalValue)}
            onChange={handleTextChange}
            disabled={disabled}
            className={cn(
              "w-28",
              invalid && "border-destructive",
              disabled && "opacity-50"
            )}
            aria-invalid={invalid}
          />
        </div>
      </div>
    </div>
  );
}
