
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

interface FieldListProps {
  fields: Field[];
  onSelectField: (fieldId: string) => void;
  onDeleteField?: (fieldId: string) => void;
  selectedFieldId: string | null;
}

export function FieldList({ fields, onSelectField, onDeleteField, selectedFieldId }: FieldListProps) {
  if (fields.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No fields added yet</p>
        <p className="text-sm mt-2">Click 'Add Field' to create your first field</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <div
          key={field.id}
          className={cn(
            "flex justify-between items-center p-3 rounded-md cursor-pointer border",
            selectedFieldId === field.id 
              ? "border-cms-blue bg-blue-50" 
              : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
          )}
        >
          <div 
            className="flex-1"
            onClick={() => onSelectField(field.id)}
          >
            <div className="flex items-center">
              <span className="font-medium">{field.name}</span>
              {field.required && (
                <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">Required</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">Type: {field.type}</div>
          </div>
          <div className="flex items-center gap-2">
            {onDeleteField && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Are you sure you want to delete "${field.name}" field?`)) {
                    onDeleteField(field.id);
                  }
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-shrink-0 ml-1">
              <div className="w-1.5 h-6 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
