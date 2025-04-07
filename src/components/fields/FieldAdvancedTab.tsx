
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
      
      // Merge with existing field data if needed
      const updatedData = {
        ...(fieldData || {}),
        advanced: advancedSettings
      };
      
      // Ensure we don't lose appearance settings if they exist
      if (fieldData?.appearance) {
        updatedData.appearance = fieldData.appearance;
      }
      
      // Log what we're saving to debug any issues
      console.log("Saving advanced settings:", advancedSettings);
      console.log("Updated field data:", updatedData);
      
      onUpdate(updatedData);
      
      toast({
        title: "Advanced settings updated",
        description: "Your field's advanced settings have been saved"
      });
    } catch (error) {
      console.error("Error saving advanced settings:", error);
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
