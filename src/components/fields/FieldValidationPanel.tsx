
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function FieldValidationPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Field Validation Rules</h2>
      <p className="text-gray-500">Configure validation rules for your collection fields</p>
      
      <Alert variant="info" className="bg-blue-50 border-blue-100">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Validation configuration will be available in an upcoming update. This will allow you to set 
          validation rules for each field to ensure data consistency.
        </AlertDescription>
      </Alert>
      
      <div className="mt-4">
        <p className="text-gray-500">Validation configuration coming soon...</p>
      </div>
    </div>
  );
}
