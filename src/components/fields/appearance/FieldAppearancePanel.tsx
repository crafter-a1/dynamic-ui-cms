
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { UIVariantsTab } from "./UIVariantsTab";
import { ColorsTab } from "./ColorsTab";
import { ThemeTab } from "./ThemeTab";
import { CustomCSSTab } from "./CustomCSSTab";
import { FieldPreview } from "./FieldPreview";

interface FieldAppearancePanelProps {
  fieldType: string | null;
  initialData?: any;
  onSave: (data: any) => void;
}

export function FieldAppearancePanel({ 
  fieldType, 
  initialData = {}, 
  onSave 
}: FieldAppearancePanelProps) {
  const [activeSubtab, setActiveSubtab] = useState("uiVariants");
  const [previewState, setPreviewState] = useState<'default' | 'hover' | 'focus' | 'disabled' | 'error'>('default');
  const [isDarkMode, setIsDarkMode] = useState(initialData?.isDarkMode || false);
  
  // State for appearance settings
  const [settings, setSettings] = useState({
    uiVariant: initialData?.uiVariant || 'standard',
    theme: initialData?.theme || 'classic',
    colors: initialData?.colors || {
      border: '#e2e8f0',
      text: '#1e293b',
      background: '#ffffff',
      focus: '#3b82f6',
      label: '#64748b'
    },
    customCSS: initialData?.customCSS || '',
    ...initialData
  });
  
  // Update settings and save to parent
  const updateSettings = (newSettings: Partial<typeof settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    onSave(updatedSettings);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeSubtab} onValueChange={setActiveSubtab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="uiVariants">UI Variants</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="customCSS">Custom CSS</TabsTrigger>
        </TabsList>
        
        {activeSubtab !== "customCSS" && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <FieldPreview 
                fieldType={fieldType} 
                settings={settings} 
                previewState={previewState}
                isDarkMode={isDarkMode}
                onPreviewStateChange={setPreviewState}
                onDarkModeChange={setIsDarkMode}
              />
            </CardContent>
          </Card>
        )}
        
        <TabsContent value="uiVariants">
          <UIVariantsTab 
            settings={settings} 
            onUpdate={updateSettings} 
          />
        </TabsContent>
        
        <TabsContent value="colors">
          <ColorsTab 
            settings={settings} 
            onUpdate={updateSettings} 
          />
        </TabsContent>
        
        <TabsContent value="theme">
          <ThemeTab 
            settings={settings} 
            onUpdate={updateSettings} 
          />
        </TabsContent>
        
        <TabsContent value="customCSS">
          <CustomCSSTab 
            settings={settings} 
            onUpdate={updateSettings} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FieldAppearancePanel;
