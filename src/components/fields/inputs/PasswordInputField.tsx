
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateUIVariant } from "@/utils/inputAdapters";

export interface PasswordInputFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  helpText?: string;
  errorMessage?: string;
  required?: boolean;
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
  colors?: {
    border?: string;
    text?: string;
    background?: string;
    focus?: string;
    label?: string;
  };
  disabled?: boolean;
  invalid?: boolean;
  uiVariant?: "standard" | "material" | "pill" | "borderless" | "underlined";
}

export const PasswordInputField = ({
  id,
  value,
  onChange,
  label,
  placeholder,
  helpText,
  errorMessage,
  required = false,
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
  colors = {},
  disabled = false,
  invalid = false,
  uiVariant = "standard"
}: PasswordInputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  // Validate UI variant
  const validatedUiVariant = validateUIVariant(uiVariant);

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
    switch (fieldSize) {
      case "small": return "0.375rem 2.25rem 0.375rem 0.5rem";
      case "medium": return "0.5rem 2.5rem 0.5rem 0.75rem";
      case "large": return "0.75rem 3rem 0.75rem 1rem";
      default: return "0.5rem 2.5rem 0.5rem 0.75rem";
    }
  };

  // Base input style
  let inputStyle: React.CSSProperties = {
    width: labelPosition === "left" ? `${100 - labelWidth}%` : "100%",
    backgroundColor: filled ? (colors.background || "#f1f5f9") : "transparent",
    border: showBorder ? `1px solid ${colors.border || (invalid ? "#dc2626" : "#e2e8f0")}` : "none",
    borderRadius: getBorderRadius(),
    padding: getPadding(),
    fontSize: fieldSize === "small" ? "0.875rem" : fieldSize === "medium" ? "1rem" : "1.125rem",
    textAlign: textAlign,
    color: colors.text || "#1e293b",
    transition: "all 0.2s ease"
  };

  // Apply UI variant styles
  if (validatedUiVariant === 'pill') {
    inputStyle = {
      ...inputStyle,
      borderRadius: '9999px !important',
      border: `1px solid ${colors.border || (invalid ? "#dc2626" : "#e2e8f0")} !important`,
    };
  } else if (validatedUiVariant === 'material') {
    inputStyle = {
      ...inputStyle,
      border: 'none !important',
      borderBottom: `2px solid ${colors.border || (invalid ? "#dc2626" : "#e2e8f0")} !important`,
      borderRadius: '0 !important',
      paddingLeft: '0 !important',
      paddingRight: '2.5rem !important',
    };
  } else if (validatedUiVariant === 'borderless') {
    inputStyle = {
      ...inputStyle,
      border: 'none !important',
      backgroundColor: `${colors.background || 'rgba(241, 245, 249, 0.7)'} !important`,
    };
  } else if (validatedUiVariant === 'underlined') {
    inputStyle = {
      ...inputStyle,
      border: 'none !important',
      borderBottom: `1px solid ${colors.border || (invalid ? "#dc2626" : "#e2e8f0")} !important`,
      borderRadius: '0 !important',
      paddingLeft: '0 !important',
      paddingRight: '2.5rem !important',
      backgroundColor: 'transparent !important',
    };
  }

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div 
      className={cn("space-y-2", customClass, `ui-variant-${validatedUiVariant}`)} 
      style={inputContainerStyle}
      data-ui-variant={validatedUiVariant}
    >
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
        <div className="relative">
          <Input
            id={id}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={floatLabel && label ? "" : placeholder}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={togglePasswordVisibility}
            className="absolute right-0 top-0 h-full px-2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
      </div>
      {(helpText || errorMessage) && (
        <p className={cn("text-sm", invalid || errorMessage ? "text-red-500" : "text-gray-500")}>
          {errorMessage || helpText}
        </p>
      )}
    </div>
  );
};
