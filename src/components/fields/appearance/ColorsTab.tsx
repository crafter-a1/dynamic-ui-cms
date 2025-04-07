
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ColorPickerField } from "./ColorPickerField";
import { toast } from "@/hooks/use-toast";

interface ColorsTabProps {
  settings: any;
  onUpdate: (settings: any) => void;
}

export function ColorsTab({ settings, onUpdate }: ColorsTabProps) {
  const [activeColorTab, setActiveColorTab] = useState("border");
  const [colors, setColors] = useState({
    border: settings.colors?.border || "#e2e8f0",
    text: settings.colors?.text || "#1e293b",
    background: settings.colors?.background || "#ffffff",
    focus: settings.colors?.focus || "#3b82f6",
    label: settings.colors?.label || "#64748b"
  });
  
  // Update local state when settings change from parent
  useEffect(() => {
    if (settings.colors) {
      setColors({
        border: settings.colors.border || "#e2e8f0",
        text: settings.colors.text || "#1e293b",
        background: settings.colors.background || "#ffffff",
        focus: settings.colors.focus || "#3b82f6",
        label: settings.colors.label || "#64748b"
      });
    }
  }, [settings]);
  
  const handleColorChange = (type: string, value: string) => {
    const newColors = {
      ...colors,
      [type]: value
    };
    
    setColors(newColors);
    
    // Log the updated colors for debugging
    console.log("Updated colors:", newColors);
    
    // Update the parent component with the new colors
    onUpdate({
      ...settings,
      colors: newColors
    });
    
    // Show a toast for better user feedback
    toast({
      title: "Color updated",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} color has been updated`,
      variant: "default"
    });
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Colors</h3>
      <p className="text-sm text-gray-500">
        Customize the color scheme of your field
      </p>
      
      <Tabs value={activeColorTab} onValueChange={setActiveColorTab} className="mt-4">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="border">Border</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="label">Label</TabsTrigger>
        </TabsList>
        
        <TabsContent value="border">
          <Card>
            <CardContent className="pt-6">
              <ColorPickerField
                label="Border Color"
                value={colors.border}
                onChange={(value) => handleColorChange("border", value)}
                presets={[
                  "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b",
                  "#3b82f6", "#a855f7", "#ec4899", "#ef4444",
                  "#22c55e", "#eab308", "#f97316"
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="text">
          <Card>
            <CardContent className="pt-6">
              <ColorPickerField
                label="Text Color"
                value={colors.text}
                onChange={(value) => handleColorChange("text", value)}
                presets={[
                  "#1e293b", "#334155", "#475569", "#64748b",
                  "#000000", "#1e40af", "#6b21a8", "#881337",
                  "#166534", "#854d0e", "#9a3412"
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="background">
          <Card>
            <CardContent className="pt-6">
              <ColorPickerField
                label="Background Color"
                value={colors.background}
                onChange={(value) => handleColorChange("background", value)}
                presets={[
                  "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0",
                  "#dbeafe", "#ede9fe", "#fce7f3", "#fee2e2",
                  "#dcfce7", "#fef9c3", "#ffedd5"
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="focus">
          <Card>
            <CardContent className="pt-6">
              <ColorPickerField
                label="Focus State Color"
                value={colors.focus}
                onChange={(value) => handleColorChange("focus", value)}
                presets={[
                  "#3b82f6", "#2563eb", "#4f46e5", "#7c3aed", 
                  "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e",
                  "#ef4444", "#f59e0b", "#10b981"
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="label">
          <Card>
            <CardContent className="pt-6">
              <ColorPickerField
                label="Label Color"
                value={colors.label}
                onChange={(value) => handleColorChange("label", value)}
                presets={[
                  "#64748b", "#475569", "#334155", "#1e293b",
                  "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e",
                  "#10b981", "#eab308", "#f97316"
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
