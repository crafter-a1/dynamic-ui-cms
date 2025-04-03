
import { cn } from "@/lib/utils";

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
  selectedFieldId: string | null;
}

export function FieldList({ fields, onSelectField, selectedFieldId }: FieldListProps) {
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
          onClick={() => onSelectField(field.id)}
        >
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">{field.name}</span>
              {field.required && (
                <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">Required</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">Type: {field.type}</div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-1.5 h-6 rounded-full bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
