
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateUIVariant } from "@/utils/inputAdapters";

export interface NumberInputFieldProps {
  id: string;
  value: number | null;
  onChange: (value: number | null) => void;
  label?: string;
  placeholder?: string;
  helpText?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  showButtons?: boolean;
  buttonLayout?: "horizontal" | "vertical";
  prefix?: string;
  suffix?: string;
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

export const NumberInputField = ({
  id,
  value,
  onChange,
  label,
  placeholder,
  helpText,
  min,
  max,
  step = 1,
  required = false,
  showButtons = false,
  buttonLayout = "horizontal",
  prefix = "",
  suffix = "",
  floatLabel = false,
  filled = false,
  textAlign = "right",
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
}: NumberInputFieldProps) => {
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
    const basePadding = fieldSize === "small" ? "0.375rem 0.5rem" : 
                        fieldSize === "medium" ? "0.5rem 0.75rem" : 
                        "0.75rem 1rem";
    
    // Adjust padding if prefix or suffix exists
    const prefixPadding = prefix ? (fieldSize === "small" ? "1.5rem" : fieldSize === "medium" ? "1.75rem" : "2rem") : "";
    const suffixPadding = suffix ? (fieldSize === "small" ? "1.5rem" : fieldSize === "medium" ? "1.75rem" : "2rem") : "";
    
    if (prefixPadding && suffixPadding) {
      return `${basePadding.split(' ')[0]} ${suffixPadding} ${basePadding.split(' ')[0]} ${prefixPadding}`;
    } else if (prefixPadding) {
      return `${basePadding.split(' ')[0]} ${basePadding.split(' ')[1]} ${basePadding.split(' ')[0]} ${prefixPadding}`;
    } else if (suffixPadding) {
      return `${basePadding.split(' ')[0]} ${suffixPadding} ${basePadding.split(' ')[0]} ${basePadding.split(' ')[1]}`;
    }
    
    return basePadding;
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
      paddingLeft: prefix ? undefined : '0 !important',
      paddingRight: suffix ? undefined : '0 !important',
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
      paddingLeft: prefix ? undefined : '0 !important',
      paddingRight: suffix ? undefined : '0 !important',
      backgroundColor: 'transparent !important',
    };
  }

  // Handle increment/decrement
  const incrementValue = () => {
    if (disabled) return;
    
    const currentValue = value === null ? 0 : value;
    const newValue = currentValue + step;
    
    if (max !== undefined && newValue > max) {
      onChange(max);
    } else {
      onChange(newValue);
    }
  };
  
  const decrementValue = () => {
    if (disabled) return;
    
    const currentValue = value === null ? 0 : value;
    const newValue = currentValue - step;
    
    if (min !== undefined && newValue < min) {
      onChange(min);
    } else {
      onChange(newValue);
    }
  };
  
  // Handle direct input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === "") {
      onChange(null);
      return;
    }
    
    const numValue = parseFloat(inputValue);
    
    if (!isNaN(numValue)) {
      if (min !== undefined && numValue < min) {
        onChange(min);
      } else if (max !== undefined && numValue > max) {
        onChange(max);
      } else {
        onChange(numValue);
      }
    }
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
          floatLabel && "pt-4",
          showButtons && buttonLayout === "horizontal" && "flex items-stretch"
        )}
        style={{ width: labelPosition === "left" ? `${100 - labelWidth}%` : "100%" }}
      >
        {floatLabel && label && (
          <Label
            htmlFor={id}
            className={cn(
              "absolute transition-all duration-200 pointer-events-none",
              (hasFocus || value !== null) ? "-top-3 left-2 bg-white px-1 text-xs" : "top-1/2 left-3 -translate-y-1/2"
            )}
            style={{
              color: hasFocus ? (colors.focus || "#3b82f6") : (colors.label || "#64748b"),
              zIndex: 10
            }}
          >
            {label}
          </Label>
        )}
        
        {showButtons && buttonLayout === "horizontal" && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={decrementValue}
            disabled={disabled || (min !== undefined && (value === null || value <= min))}
            className="rounded-r-none"
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
        )}
        
        <div className="relative flex-1">
          {prefix && (
            <div 
              className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500"
              style={{ fontSize: inputStyle.fontSize }}
            >
              {prefix}
            </div>
          )}
          
          <Input
            id={id}
            type="number"
            value={value === null ? "" : value.toString()}
            onChange={handleInputChange}
            placeholder={floatLabel && label ? "" : placeholder}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            min={min}
            max={max}
            step={step}
            required={required}
            disabled={disabled}
            style={inputStyle}
            data-ui-variant={validatedUiVariant}
            className={cn(
              "focus:ring-1 focus:ring-offset-0",
              hasFocus && "outline-none",
              invalid && "border-red-500 focus:ring-red-500",
              showButtons && buttonLayout === "horizontal" && "rounded-none",
              `input-variant-${validatedUiVariant}`
            )}
          />
          
          {suffix && (
            <div 
              className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
              style={{ fontSize: inputStyle.fontSize }}
            >
              {suffix}
            </div>
          )}
          
          {showButtons && buttonLayout === "vertical" && (
            <div className="absolute inset-y-0 right-0 flex flex-col">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={incrementValue}
                disabled={disabled || (max !== undefined && (value === null || value >= max))}
                className="h-1/2 px-1 py-0 rounded-none rounded-tr-md"
              >
                <PlusIcon className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={decrementValue}
                disabled={disabled || (min !== undefined && (value === null || value <= min))}
                className="h-1/2 px-1 py-0 rounded-none rounded-br-md"
              >
                <MinusIcon className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        {showButtons && buttonLayout === "horizontal" && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={incrementValue}
            disabled={disabled || (max !== undefined && (value === null || value >= max))}
            className="rounded-l-none"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {helpText && (
        <p className={cn("text-sm", invalid ? "text-red-500" : "text-gray-500")}>
          {helpText}
        </p>
      )}
    </div>
  );
};
