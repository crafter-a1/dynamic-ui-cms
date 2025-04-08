
import React, { useEffect, useState } from "react";
import { FieldAdvancedPanel } from "./FieldAdvancedPanel";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface FieldAdvancedTabProps {
  fieldType: string | null;
  fieldData?: any;
  onUpdate: (data: any) => void;
}

export function FieldAdvancedTab({ fieldType, fieldData, onUpdate }: FieldAdvancedTabProps) {
  const [advancedSettings, setAdvancedSettings] = useState<any>(
    fieldData?.advanced || (fieldData?.settings?.advanced || {})
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update local state when fieldData changes
  useEffect(() => {
    if (fieldData?.advanced) {
      setAdvancedSettings(fieldData.advanced);
    } else if (fieldData?.settings?.advanced) {
      setAdvancedSettings(fieldData.settings.advanced);
    } else {
      setAdvancedSettings({});
    }
  }, [fieldData]);

  // Handle saving advanced settings
  const handleSaveAdvancedSettings = (advancedSettings: any) => {
    setIsSaving(true);
    
    try {
      setAdvancedSettings(advancedSettings);
      
      // Create a deep copy of the existing field data to work with
      let updatedData = JSON.parse(JSON.stringify(fieldData || {}));
      
      // Preserve all existing settings and just update the advanced part
      // This ensures we don't lose appearance, validation, or ui_options
      
      console.log("[FieldAdvancedTab] Original field data before update:", JSON.stringify(updatedData, null, 2));
      
      // Set the advanced settings directly
      updatedData.advanced = advancedSettings;
      
      // CRITICAL: Preserve ALL other settings explicitly
      // Special focus on appearance which must never be lost
      if (fieldData?.appearance) {
        console.log("[FieldAdvancedTab] Preserving appearance settings:", 
          JSON.stringify(fieldData.appearance, null, 2));
        updatedData.appearance = { ...fieldData.appearance };
        
        // Extra safeguard for UI variant
        console.log("[FieldAdvancedTab] UI Variant being preserved:", fieldData.appearance.uiVariant);
      }
      
      // Preserve other important settings
      if (fieldData?.validation) {
        updatedData.validation = { ...fieldData.validation };
      }
      
      if (fieldData?.ui_options) {
        updatedData.ui_options = { ...fieldData.ui_options };
      }
      
      if (fieldData?.helpText) {
        updatedData.helpText = fieldData.helpText;
      }
      
      // Log what we're saving to debug any issues
      console.log("[FieldAdvancedTab] Saving advanced settings:", JSON.stringify(advancedSettings, null, 2));
      console.log("[FieldAdvancedTab] Complete updated field data:", JSON.stringify(updatedData, null, 2));
      
      // Update the field data with our deep-copied and merged object
      onUpdate(updatedData);
      
      toast({
        title: "Advanced settings updated",
        description: "Your field's advanced settings have been saved"
      });
    } catch (error) {
      console.error("[FieldAdvancedTab] Error saving advanced settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your advanced settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FieldAdvancedPanel
        fieldType={fieldType}
        initialData={advancedSettings}
        onSave={handleSaveAdvancedSettings}
      />
    </div>
  );
}

export default FieldAdvancedTab;
