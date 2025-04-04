
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ColorsTabProps {
  settings: any;
  onUpdate: (settings: any) => void;
}

type ColorKey = 'border' | 'text' | 'background' | 'focus' | 'label';

export function ColorsTab({ settings, onUpdate }: ColorsTabProps) {
  const [activeColorTab, setActiveColorTab] = useState<ColorKey>('border');
  
  const colorPresets = {
    base: [
      { name: 'Gray', value: '#71717a' },
      { name: 'Blue', value: '#3b82f6' },
      { name: 'Purple', value: '#8b5cf6' },
      { name: 'Pink', value: '#ec4899' },
      { name: 'Green', value: '#22c55e' },
      { name: 'Yellow', value: '#facc15' },
      { name: 'Orange', value: '#f97316' },
    ],
    pastel: [
      { name: 'Light Gray', value: '#f3f4f6' },
      { name: 'Light Blue', value: '#dbeafe' },
      { name: 'Light Purple', value: '#e9d5ff' },
      { name: 'Light Pink', value: '#fce7f3' },
      { name: 'Light Green', value: '#d1fae5' },
      { name: 'Light Yellow', value: '#fef3c7' },
      { name: 'Light Orange', value: '#ffedd5' },
    ],
    dark: [
      { name: 'Dark Gray', value: '#374151' },
      { name: 'Dark Blue', value: '#1e40af' },
      { name: 'Dark Purple', value: '#5b21b6' },
      { name: 'Dark Pink', value: '#9d174d' },
      { name: 'Dark Green', value: '#15803d' },
      { name: 'Dark Yellow', value: '#854d0e' },
      { name: 'Dark Orange', value: '#9a3412' },
    ],
  };
  
  const updateColor = (color: string) => {
    // Get existing colors or initialize default
    const currentColors = settings.colors || {
      border: '#e2e8f0',
      text: '#1e293b',
      background: '#ffffff',
      focus: '#3b82f6',
      label: '#64748b'
    };
    
    // Update the specific color
    const updatedColors = {
      ...currentColors,
      [activeColorTab]: color
    };
    
    onUpdate({ colors: updatedColors });
  };
  
  // Get the current color value for the active tab
  const currentColor = (settings.colors && settings.colors[activeColorTab]) || '#e2e8f0';
  
  // Reset to default color for the active tab
  const resetToDefault = () => {
    const defaultColors = {
      border: '#e2e8f0',
      text: '#1e293b',
      background: '#ffffff',
      focus: '#3b82f6',
      label: '#64748b'
    };
    
    updateColor(defaultColors[activeColorTab]);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Color Selection</h3>
      <Tabs defaultValue="border" value={activeColorTab} onValueChange={(value) => setActiveColorTab(value as ColorKey)}>
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="border">Border Color</TabsTrigger>
          <TabsTrigger value="text">Text Color</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="focus">Focus State</TabsTrigger>
          <TabsTrigger value="label">Label Color</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="color-picker">Color Picker</Label>
                  <div className="mt-2 flex gap-2">
                    <input 
                      type="color" 
                      id="color-picker"
                      value={currentColor}
                      onChange={(e) => updateColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded-md border"
                    />
                    <Input 
                      value={currentColor}
                      onChange={(e) => updateColor(e.target.value)}
                      className="flex-1 font-mono"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>RGB Values</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <Label htmlFor="color-r" className="text-xs">R</Label>
                      <Input 
                        id="color-r"
                        type="number" 
                        min="0" 
                        max="255"
                        value={parseInt(currentColor.slice(1, 3), 16)}
                        onChange={(e) => {
                          const r = Math.max(0, Math.min(255, Number(e.target.value))).toString(16).padStart(2, '0');
                          const g = currentColor.slice(3, 5);
                          const b = currentColor.slice(5, 7);
                          updateColor(`#${r}${g}${b}`);
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="color-g" className="text-xs">G</Label>
                      <Input 
                        id="color-g"
                        type="number" 
                        min="0" 
                        max="255"
                        value={parseInt(currentColor.slice(3, 5), 16)}
                        onChange={(e) => {
                          const r = currentColor.slice(1, 3);
                          const g = Math.max(0, Math.min(255, Number(e.target.value))).toString(16).padStart(2, '0');
                          const b = currentColor.slice(5, 7);
                          updateColor(`#${r}${g}${b}`);
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="color-b" className="text-xs">B</Label>
                      <Input 
                        id="color-b"
                        type="number" 
                        min="0" 
                        max="255"
                        value={parseInt(currentColor.slice(5, 7), 16)}
                        onChange={(e) => {
                          const r = currentColor.slice(1, 3);
                          const g = currentColor.slice(3, 5);
                          const b = Math.max(0, Math.min(255, Number(e.target.value))).toString(16).padStart(2, '0');
                          updateColor(`#${r}${g}${b}`);
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="color-a" className="text-xs">A</Label>
                      <Input 
                        id="color-a"
                        type="number" 
                        min="0" 
                        max="100"
                        value="100"
                        disabled
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    className="w-full h-8 appearance-none bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-red-500 rounded-md"
                    onChange={(e) => {
                      const hue = Number(e.target.value);
                      const color = hslToHex(hue, 100, 50);
                      updateColor(color);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h4 className="font-medium">Color Presets</h4>
                <div className="grid grid-cols-7 gap-2">
                  {colorPresets.base.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => updateColor(color.value)}
                      className="h-8 w-8 rounded-md border border-gray-200 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {colorPresets.pastel.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => updateColor(color.value)}
                      className="h-8 w-8 rounded-md border border-gray-200 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {colorPresets.dark.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => updateColor(color.value)}
                      className="h-8 w-8 rounded-md border border-gray-200 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      // Save current color to a custom palette
                      console.log("Save color to palette:", currentColor);
                    }}
                  >
                    Save Color
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetToDefault}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}

// Helper function to convert HSL to Hex
function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
