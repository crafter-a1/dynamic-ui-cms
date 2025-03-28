
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  autoResize?: boolean;
  floatLabel?: boolean;
  invalid?: boolean;
  keyFilter?: RegExp;
  className?: string;
}

export function TextAreaField({
  label,
  autoResize = false,
  floatLabel = false,
  invalid = false,
  keyFilter,
  className,
  value = "",
  onChange,
  disabled = false,
  ...props
}: TextAreaFieldProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [internalValue, setInternalValue] = React.useState(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height to scrollHeight to fit content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [internalValue, autoResize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <div className={cn("relative", floatLabel && "h-24")}>
        {label && !floatLabel && <Label>{label}</Label>}
        <Textarea
          ref={textareaRef}
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
    </div>
  );
}
