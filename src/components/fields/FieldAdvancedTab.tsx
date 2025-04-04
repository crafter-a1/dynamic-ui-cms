
import React from "react";
import { FieldAdvancedPanel } from "./FieldAdvancedPanel";

interface FieldAdvancedTabProps {
  fieldType: string | null;
  fieldData?: any;
  onUpdate: (data: any) => void;
}

export function FieldAdvancedTab({ fieldType, fieldData, onUpdate }: FieldAdvancedTabProps) {
  // Handle saving advanced settings
  const handleSaveAdvancedSettings = (advancedSettings: any) => {
    // Merge with existing field data if needed
    const updatedData = {
      ...(fieldData || {}),
      advanced: advancedSettings
    };
    
    onUpdate(updatedData);
  };

  return (
    <div className="space-y-6">
      <FieldAdvancedPanel
        fieldType={fieldType}
        initialData={fieldData?.advanced}
        onSave={handleSaveAdvancedSettings}
      />
    </div>
  );
}

export default FieldAdvancedTab;
