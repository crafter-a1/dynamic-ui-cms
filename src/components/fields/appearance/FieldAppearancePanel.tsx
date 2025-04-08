
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { UIVariantsTab } from "./UIVariantsTab";
import { ColorsTab } from "./ColorsTab";
import { ThemeTab } from "./ThemeTab";
import { CustomCSSTab } from "./CustomCSSTab";
import { FieldPreview } from "./FieldPreview";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { validateUIVariant, normalizeAppearanceSettings } from "@/utils/inputAdapters";

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
  const [isSaving, setIsSaving] = useState(false);

  // Ensure we get a valid UI variant from initialData or use 'standard' as default
  const defaultUIVariant = validateUIVariant(initialData?.uiVariant);

  // State for appearance settings
  const [settings, setSettings] = useState(normalizeAppearanceSettings(initialData));

  console.log("Initial appearance data:", JSON.stringify(initialData, null, 2));
  console.log("Default UI variant set to:", defaultUIVariant);
  console.log("Normalized settings:", JSON.stringify(settings, null, 2));

  // Update settings when initialData changes
  useEffect(() => {
    if (initialData) {
      const normalizedSettings = normalizeAppearanceSettings(initialData);
      console.log("Normalized settings from initialData:", JSON.stringify(normalizedSettings, null, 2));
      console.log("UI Variant after normalization:", normalizedSettings.uiVariant);
      setSettings(normalizedSettings);
      
      if (initialData.isDarkMode !== undefined) {
        setIsDarkMode(initialData.isDarkMode);
      }
    }
  }, [initialData]);

  // Update settings and trigger save to parent immediately
  const updateSettings = (newSettings: Partial<typeof settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    
    // Ensure UI variant is always valid
    if (newSettings.uiVariant) {
      updatedSettings.uiVariant = validateUIVariant(newSettings.uiVariant);
    }
    
    setSettings(updatedSettings);

    console.log("Updated appearance settings:", updatedSettings);
    // Ensure uiVariant is explicitly logged
    if (newSettings.uiVariant) {
      console.log("UI Variant updated to:", updatedSettings.uiVariant);
    }
    
    // Save immediately to ensure changes are persisted
    saveAllSettings(updatedSettings);
  };

  // Save all settings to parent component
  const saveAllSettings = (settingsToSave = settings) => {
    setIsSaving(true);

    try {
      // Ensure settings are properly normalized before saving
      const normalizedSettings = normalizeAppearanceSettings(settingsToSave);
      
      console.log("Saving appearance settings:", normalizedSettings);
      console.log("UI Variant being saved:", normalizedSettings.uiVariant);

      // Save settings to parent component
      onSave(normalizedSettings);

      toast({
        title: "Appearance settings saved",
        description: "Your changes have been saved successfully"
      });
    } catch (error) {
      console.error("Error saving appearance settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your appearance settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
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
                onDarkModeChange={(isDark) => {
                  setIsDarkMode(isDark);
                  updateSettings({ isDarkMode: isDark });
                }}
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

      <div className="flex justify-end">
        <Button
          onClick={() => saveAllSettings()}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <SaveIcon className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save All Appearance Settings"}
        </Button>
      </div>
    </div>
  );
}

export default FieldAppearancePanel;
