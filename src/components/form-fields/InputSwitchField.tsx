
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface InputSwitchFieldProps {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

export function InputSwitchField({
  label,
  checked = false,
  onCheckedChange,
  disabled = false,
  invalid = false,
  className
}: InputSwitchFieldProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(invalid && "data-[state=checked]:bg-destructive")}
        aria-invalid={invalid}
      />
      {label && (
        <Label className={cn(
          disabled && "opacity-70 cursor-not-allowed",
          invalid && "text-destructive"
        )}>
          {label}
        </Label>
      )}
    </div>
  );
}
