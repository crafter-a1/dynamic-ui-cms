
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  presets?: string[];
}

export function ColorPickerField({
  label,
  value = "#000000",
  onChange,
  presets = [
    "#64748b", // gray
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#22c55e", // green
    "#eab308", // yellow
    "#f97316", // orange
    
    "#f1f5f9", // light gray
    "#dbeafe", // light blue
    "#ede9fe", // light purple
    "#fce7f3", // light pink
    "#dcfce7", // light green
    "#fef9c3", // light yellow
    "#ffedd5", // light orange
    
    "#334155", // dark gray
    "#1d4ed8", // dark blue
    "#7e22ce", // dark purple
    "#be185d", // dark pink
    "#15803d", // dark green
    "#a16207", // dark yellow
    "#c2410c", // dark orange
  ]
}: ColorPickerFieldProps) {
  const [colorValue, setColorValue] = useState(value);
  const [rgbValues, setRgbValues] = useState<{r: number, g: number, b: number, a: number}>({
    r: 0, g: 0, b: 0, a: 1
  });
  
  // Convert hex to RGB when value changes
  useEffect(() => {
    setColorValue(value);
    const rgb = hexToRgb(value);
    if (rgb) {
      setRgbValues({
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        a: 1
      });
    }
  }, [value]);
  
  // Convert hex color to RGB
  const hexToRgb = (hex: string): {r: number, g: number, b: number} | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  };
  
  // Handle color change from input
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setColorValue(newValue);
    
    // Only update RGB and trigger onChange if valid hex
    if (/^#?([a-f\d]{6})$/i.test(newValue)) {
      const rgb = hexToRgb(newValue);
      if (rgb) {
        setRgbValues({
          ...rgbValues,
          r: rgb.r,
          g: rgb.g,
          b: rgb.b
        });
        onChange(newValue);
      }
    }
  };
  
  // Handle RGB component changes
  const handleRgbChange = (component: 'r' | 'g' | 'b' | 'a', value: number) => {
    const newRgb = { ...rgbValues, [component]: value };
    setRgbValues(newRgb);
    const hexColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setColorValue(hexColor);
    onChange(hexColor);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`color-${label}`} className="mb-2 block">{label}</Label>
        <div className="flex gap-2 items-center">
          <div 
            className="w-10 h-10 rounded border" 
            style={{ backgroundColor: colorValue }}
          />
          <Input
            id={`color-${label}`}
            type="text"
            value={colorValue}
            onChange={handleHexChange}
            className="font-mono"
          />
          <Input
            type="color"
            value={colorValue}
            onChange={(e) => {
              setColorValue(e.target.value);
              onChange(e.target.value);
              const rgb = hexToRgb(e.target.value);
              if (rgb) {
                setRgbValues({
                  ...rgbValues,
                  r: rgb.r,
                  g: rgb.g,
                  b: rgb.b
                });
              }
            }}
            className="w-12 h-10 p-1"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">RGB Values</h3>
        <div className="grid grid-cols-4 gap-2">
          <div>
            <Label htmlFor={`${label}-r`} className="text-xs">R</Label>
            <Input
              id={`${label}-r`}
              type="number"
              min={0}
              max={255}
              value={rgbValues.r}
              onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor={`${label}-g`} className="text-xs">G</Label>
            <Input
              id={`${label}-g`}
              type="number"
              min={0}
              max={255}
              value={rgbValues.g}
              onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor={`${label}-b`} className="text-xs">B</Label>
            <Input
              id={`${label}-b`}
              type="number"
              min={0}
              max={255}
              value={rgbValues.b}
              onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor={`${label}-a`} className="text-xs">A</Label>
            <Input
              id={`${label}-a`}
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={rgbValues.a}
              onChange={(e) => handleRgbChange('a', parseFloat(e.target.value))}
              className="text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Color Presets</h3>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, index) => (
            <Button
              key={index}
              type="button"
              className={cn(
                "w-8 h-8 rounded-md p-0 border",
                colorValue === preset && "ring-2 ring-black dark:ring-white ring-offset-2"
              )}
              style={{ backgroundColor: preset }}
              onClick={() => {
                setColorValue(preset);
                onChange(preset);
                const rgb = hexToRgb(preset);
                if (rgb) {
                  setRgbValues({
                    ...rgbValues,
                    r: rgb.r,
                    g: rgb.g,
                    b: rgb.b
                  });
                }
              }}
              variant="outline"
            >
              <span className="sr-only">Select color {preset}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="pt-2 flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const defaultColor = "#000000";
            setColorValue(defaultColor);
            onChange(defaultColor);
            const rgb = hexToRgb(defaultColor);
            if (rgb) {
              setRgbValues({
                ...rgbValues,
                r: rgb.r,
                g: rgb.g,
                b: rgb.b
              });
            }
          }}
        >
          Reset to Default
        </Button>
      </div>
    </div>
  );
}

export default ColorPickerField;
