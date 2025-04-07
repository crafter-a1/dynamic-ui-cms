
import { cn } from "@/lib/utils";
import { Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { updateFieldOrder } from "@/services/CollectionService";

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  sort_order?: number;
}

interface FieldListProps {
  fields: Field[];
  onSelectField: (fieldId: string) => void;
  onDeleteField?: (fieldId: string) => void;
  selectedFieldId: string | null;
  collectionId?: string;
}

export function FieldList({ fields, onSelectField, onDeleteField, selectedFieldId, collectionId }: FieldListProps) {
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const [orderedFields, setOrderedFields] = useState<Field[]>(fields);
  
  // Update the local state when fields prop changes
  useEffect(() => {
    setOrderedFields(fields);
  }, [fields]);
  
  if (fields.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No fields added yet</p>
        <p className="text-sm mt-2">Click 'Add Field' to create your first field</p>
      </div>
    );
  }
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, fieldId: string) => {
    e.dataTransfer.setData("text/plain", fieldId);
    setDraggingField(fieldId);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetFieldId: string) => {
    e.preventDefault();
    const sourceFieldId = e.dataTransfer.getData("text/plain");
    
    if (sourceFieldId === targetFieldId) return;
    
    const sourceIndex = orderedFields.findIndex(f => f.id === sourceFieldId);
    const targetIndex = orderedFields.findIndex(f => f.id === targetFieldId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;
    
    // Create a new array with the reordered fields
    const newFields = [...orderedFields];
    const [movedField] = newFields.splice(sourceIndex, 1);
    newFields.splice(targetIndex, 0, movedField);
    
    // Update the sort_order values
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      sort_order: index
    }));
    
    setOrderedFields(updatedFields);
    setDraggingField(null);
    
    // Save the new order to the database
    if (collectionId) {
      const fieldOrders = updatedFields.map((field, index) => ({
        id: field.id,
        sort_order: index
      }));
      
      try {
        await updateFieldOrder(collectionId, fieldOrders);
      } catch (error) {
        console.error("Error updating field order:", error);
      }
    }
  };
  
  const handleDragEnd = () => {
    setDraggingField(null);
  };

  const handleDeleteField = (fieldId: string) => {
    if (onDeleteField) {
      onDeleteField(fieldId);
    }
  };

  return (
    <div className="space-y-2">
      {orderedFields.map((field) => (
        <div
          key={field.id}
          className={cn(
            "flex justify-between items-center p-3 rounded-md cursor-pointer border",
            draggingField === field.id ? "opacity-50" : "opacity-100",
            selectedFieldId === field.id 
              ? "border-cms-blue bg-blue-50" 
              : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
          )}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, field.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, field.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-shrink-0 mr-2 cursor-grab">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
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
                  handleDeleteField(field.id);
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
