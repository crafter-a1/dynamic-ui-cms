
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { validateUIVariant } from "@/utils/inputAdapters";

export interface InputTextFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  helpText?: string;
  errorMessage?: string; // Added for error message support
  required?: boolean;
  keyFilter?: "none" | "letters" | "numbers" | "alphanumeric";
  floatLabel?: boolean;
  filled?: boolean;
  textAlign?: "left" | "center" | "right";
  labelPosition?: "top" | "left";
  labelWidth?: number;
  showBorder?: boolean;
  roundedCorners?: "none" | "small" | "medium" | "large";
  fieldSize?: "small" | "medium" | "large";
  labelSize?: "small" | "medium" | "large";
  customClass?: string;
  color?: string;
  colors?: {
    border?: string;
    text?: string;
    background?: string;
    focus?: string;
    label?: string;
  };
  // UI variant for styling
  uiVariant?: "standard" | "material" | "pill" | "borderless" | "underlined";
  // Add additional props that are being used
  disabled?: boolean;
  invalid?: boolean;
  size?: string; // Accept string for size
}

export const InputTextField = ({
  id,
  value,
  onChange,
  label,
  placeholder,
  helpText,
  errorMessage,
  required = false,
  keyFilter = "none",
  floatLabel = false,
  filled = false,
  textAlign = "left",
  labelPosition = "top",
  labelWidth = 30,
  showBorder = true,
  roundedCorners = "medium",
  fieldSize = "medium",
  labelSize = "medium",
  customClass = "",
  disabled = false,
  invalid = false,
  size,
  colors = {},
  uiVariant = "standard"
}: InputTextFieldProps) => {
  const [hasFocus, setHasFocus] = useState(false);

  // Validate UI variant
  const validatedUiVariant = validateUIVariant(uiVariant);
  console.log(`UI Variant in InputTextField ${id}:`, validatedUiVariant);

  // Use size prop if provided (for backwards compatibility)
  const effectiveFieldSize = size || fieldSize;

  // Generate dynamic styles based on props
  const inputContainerStyle: React.CSSProperties = {
    display: labelPosition === "left" ? "flex" : "block",
    alignItems: "center",
    position: "relative"
  };

  const labelStyle: React.CSSProperties = {
    width: labelPosition === "left" ? `${labelWidth}%` : "auto",
    fontSize: labelSize === "small" ? "0.875rem" : labelSize === "medium" ? "1rem" : "1.125rem",
    fontWeight: labelSize === "large" ? 600 : 500,
    color: colors.label || (invalid ? "#dc2626" : "#64748b"),
    marginBottom: labelPosition === "top" ? "0.5rem" : "0"
  };

  // Get border radius based on roundedCorners prop
  const getBorderRadius = () => {
    switch (roundedCorners) {
      case "none": return "0";
      case "small": return "0.25rem";
      case "medium": return "0.375rem";
      case "large": return "0.5rem";
      default: return "0.375rem";
    }
  };

  // Get padding based on fieldSize prop
  const getPadding = () => {
    switch (effectiveFieldSize) {
      case "small": return "0.375rem 0.5rem";
      case "medium": return "0.5rem 0.75rem";
      case "large": return "0.75rem 1rem";
      default: return "0.5rem 0.75rem";
    }
  };

  // Base input style
  let inputStyle: React.CSSProperties = {
    width: labelPosition === "left" ? `${100 - labelWidth}%` : "100%",
    backgroundColor: filled ? (colors.background || "#f1f5f9") : "transparent",
    border: showBorder ? `1px solid ${colors.border || (invalid ? "#dc2626" : "#e2e8f0")}` : "none",
    borderRadius: getBorderRadius(),
    padding: getPadding(),
    fontSize: effectiveFieldSize === "small" ? "0.875rem" : effectiveFieldSize === "medium" ? "1rem" : "1.125rem",
    textAlign: textAlign,
    color: colors.text || "#1e293b",
    transition: "all 0.2s ease"
  };

  // Force apply UI variant styles
  console.log(`Applying UI variant to input field ${id}:`, validatedUiVariant);

  // Apply UI variant styles directly based on the variant
  if (validatedUiVariant === 'pill') {
    console.log(`Applying PILL style to input field ${id}`);
    inputStyle = {
      ...inputStyle,
      borderRadius: '9999px !important',
      border: `1px solid ${colors.border || (invalid ? "#dc2626" : "#e2e8f0")} !important`,
    };
  } else if (validatedUiVariant === 'material') {
    console.log(`Applying MATERIAL style to input field ${id}`);
    inputStyle = {
      ...inputStyle,
      border: 'none !important',
      borderBottom: `2px solid ${colors.border || (invalid ? "#dc2626" : "#e2e8f0")} !important`,
      borderRadius: '0 !important',
      paddingLeft: '0 !important',
      paddingRight: '0 !important',
    };
  } else if (validatedUiVariant === 'borderless') {
    console.log(`Applying BORDERLESS style to input field ${id}`);
    inputStyle = {
      ...inputStyle,
      border: 'none !important',
      backgroundColor: `${colors.background || 'rgba(241, 245, 249, 0.7)'} !important`,
    };
  } else if (validatedUiVariant === 'underlined') {
    console.log(`Applying UNDERLINED style to input field ${id}`);
    inputStyle = {
      ...inputStyle,
      border: 'none !important',
      borderBottom: `1px solid ${colors.border || (invalid ? "#dc2626" : "#e2e8f0")} !important`,
      borderRadius: '0 !important',
      paddingLeft: '0 !important',
      paddingRight: '0 !important',
      backgroundColor: 'transparent !important',
    };
  } else {
    // Standard is the default style
    console.log(`Applying STANDARD style to input field ${id}`);
  }

  // Filter key presses based on keyFilter prop
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (keyFilter === "letters" && !/^[a-zA-Z\s]$/.test(key)) {
      if (key !== "Backspace" && key !== "Delete" && key !== "ArrowLeft" && key !== "ArrowRight") {
        e.preventDefault();
      }
    } else if (keyFilter === "numbers" && !/^[0-9]$/.test(key)) {
      if (key !== "Backspace" && key !== "Delete" && key !== "ArrowLeft" && key !== "ArrowRight") {
        e.preventDefault();
      }
    } else if (keyFilter === "alphanumeric" && !/^[a-zA-Z0-9\s]$/.test(key)) {
      if (key !== "Backspace" && key !== "Delete" && key !== "ArrowLeft" && key !== "ArrowRight") {
        e.preventDefault();
      }
    }
  };

  // This function handles the onChange event from the Input component
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div 
      className={cn("space-y-2", customClass, `ui-variant-${validatedUiVariant}`)} 
      style={inputContainerStyle}
      data-ui-variant={validatedUiVariant}
    >
      {/* Add a visual indicator for the UI variant */}
      <div className="text-xs text-gray-500 mb-1" style={{display: 'none'}}>
        UI Variant: {validatedUiVariant}
      </div>

      {label && !floatLabel && (
        <Label
          htmlFor={id}
          style={labelStyle}
          className={required ? "after:content-['*'] after:ml-1 after:text-red-600" : ""}
        >
          {label}
        </Label>
      )}
      <div
        className={cn(
          "relative",
          floatLabel && "pt-4"
        )}
        style={{ width: labelPosition === "left" ? `${100 - labelWidth}%` : "100%" }}
      >
        {floatLabel && label && (
          <Label
            htmlFor={id}
            className={cn(
              "absolute transition-all duration-200 pointer-events-none",
              (hasFocus || value) ? "-top-3 left-2 bg-white px-1 text-xs" : "top-1/2 left-3 -translate-y-1/2"
            )}
            style={{
              color: hasFocus ? (colors.focus || "#3b82f6") : (colors.label || "#64748b"),
              zIndex: 10
            }}
          >
            {label}
          </Label>
        )}
        <Input
          id={id}
          value={value}
          onChange={handleInputChange}
          placeholder={floatLabel && label ? "" : placeholder}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          onKeyDown={handleKeyPress}
          required={required}
          disabled={disabled}
          style={inputStyle}
          data-ui-variant={validatedUiVariant}
          className={cn(
            "focus:ring-1 focus:ring-offset-0",
            hasFocus && "outline-none",
            invalid && "border-red-500 focus:ring-red-500",
            `input-variant-${validatedUiVariant}`
          )}
        />
      </div>
      {(helpText || errorMessage) && (
        <p className={cn("text-sm", invalid || errorMessage ? "text-red-500" : "text-gray-500")}>
          {errorMessage || helpText}
        </p>
      )}
    </div>
  );
};

export default InputTextField;
