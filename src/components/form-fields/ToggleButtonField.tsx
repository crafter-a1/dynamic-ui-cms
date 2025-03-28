
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface ToggleButtonFieldProps {
  label?: string;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ToggleButtonField({
  label,
  pressed = false,
  onPressedChange,
  disabled = false,
  invalid = false,
  className,
  children
}: ToggleButtonFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className={cn(invalid && "text-destructive")}>{label}</Label>}
      <Toggle
        pressed={pressed}
        onPressedChange={onPressedChange}
        disabled={disabled}
        className={cn(invalid && "border-destructive")}
        aria-invalid={invalid}
      >
        {children}
      </Toggle>
    </div>
  );
}
