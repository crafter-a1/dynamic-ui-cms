
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export interface RepeaterItem {
  id: string;
  [key: string]: any;
}

interface InlineRepeaterFieldProps {
  id: string;
  label: string;
  value: RepeaterItem[];
  onChange: (items: RepeaterItem[]) => void;
  fields: { key: string; label: string }[];
  required?: boolean;
  helpText?: string | null;
  className?: string;
  addButtonText?: string;
  initialItemData?: Record<string, any>;
}

export const InlineRepeaterField = ({
  id,
  label,
  value = [],
  onChange,
  fields = [],
  required = false,
  helpText = null,
  className,
  addButtonText = "Add Item",
  initialItemData = {}
}: InlineRepeaterFieldProps) => {
  const handleAddItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      ...initialItemData
    };
    onChange([...value, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...value];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleItemChange = (index: number, key: string, fieldValue: any) => {
    const newItems = [...value];
    newItems[index] = { ...newItems[index], [key]: fieldValue };
    onChange(newItems);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>

      <div className="space-y-2">
        <div className="grid gap-2">
          {value.length > 0 && (
            <Card className="p-2 shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="w-8"></th>
                    {fields.map(field => (
                      <th key={field.key} className="text-left py-2 px-2 font-medium">
                        {field.label}
                      </th>
                    ))}
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {value.map((item, index) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-2">
                        <div className="flex items-center justify-center cursor-grab">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </td>
                      {fields.map(field => (
                        <td key={`${item.id}-${field.key}`} className="py-2 px-2">
                          <Input
                            value={item[field.key] || ''}
                            onChange={(e) => handleItemChange(index, field.key, e.target.value)}
                            className="h-8"
                            placeholder={field.label}
                          />
                        </td>
                      ))}
                      <td className="py-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            {addButtonText}
          </Button>
        </div>

        {helpText && (
          <p className="text-sm text-muted-foreground">{helpText}</p>
        )}
      </div>
    </div>
  );
};

export default InlineRepeaterField;
