
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Paintbrush, EyeOff } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ColorPickerFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  showAlpha?: boolean;
}

export function ColorPickerField({
  id,
  label,
  value = '#000000',
  onChange,
  placeholder = 'Select color',
  required = false,
  helpText,
  className,
  showAlpha = false
}: ColorPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [alpha, setAlpha] = useState(1);
  const [color, setColor] = useState('#000000');
  
  // Parse value on init and when it changes externally
  useEffect(() => {
    // Check if value is rgba format
    if (value.startsWith('rgba')) {
      const rgba = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
      if (rgba) {
        // Convert rgba to hex
        const r = parseInt(rgba[1]);
        const g = parseInt(rgba[2]);
        const b = parseInt(rgba[3]);
        const a = rgba[4] ? parseFloat(rgba[4]) : 1;
        
        setColor(`#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`);
        setAlpha(a);
        return;
      }
    }
    
    // If it's already hex, just set it
    setColor(value.substring(0, 7)); // Only take the hex part, ignore alpha
    
    // Extract alpha from hex8 if present (#RRGGBBAA)
    if (value.length === 9 && value[0] === '#') {
      const alphaHex = value.substring(7, 9);
      setAlpha(parseInt(alphaHex, 16) / 255);
    }
  }, [value]);

  // Update the full color value when either color or alpha changes
  const updateColorValue = (newColor: string, newAlpha: number) => {
    if (showAlpha && newAlpha < 1) {
      // Convert hex to rgba
      const r = parseInt(newColor.substring(1, 3), 16);
      const g = parseInt(newColor.substring(3, 5), 16);
      const b = parseInt(newColor.substring(5, 7), 16);
      onChange(`rgba(${r}, ${g}, ${b}, ${newAlpha})`);
    } else {
      onChange(newColor);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    updateColorValue(newColor, alpha);
  };
  
  const handleAlphaChange = (newAlpha: number[]) => {
    setAlpha(newAlpha[0]);
    updateColorValue(color, newAlpha[0]);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-md border border-input shadow-sm flex-shrink-0"
          style={{ 
            backgroundColor: color, 
            opacity: alpha 
          }}
        />
        
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9"
              aria-label="Select color"
            >
              <Paintbrush className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label>Pick a color</Label>
                <input 
                  type="color" 
                  value={color}
                  onChange={handleColorChange}
                  className="w-full h-32 cursor-pointer rounded-md border border-input"
                />
              </div>
              
              {showAlpha && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4" />
                    Transparency
                  </Label>
                  <div 
                    className="h-3 w-full rounded-md mb-2 relative"
                    style={{
                      backgroundImage: `linear-gradient(to right, transparent, ${color})`,
                    }}
                  />
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={[alpha]}
                    onValueChange={handleAlphaChange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Transparent</span>
                    <span>Solid</span>
                  </div>
                </div>
              )}
              
              <div className="flex mt-2 items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Current: {value}
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default ColorPickerField;
