
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

interface FieldLayoutPanelProps {
  initialData?: any;
  onSave?: (data: any) => void;
}

export function FieldLayoutPanel({ initialData = {}, onSave }: FieldLayoutPanelProps) {
  const [selectedLayout, setSelectedLayout] = useState(initialData.layout || 'standard');
  const [isSaving, setIsSaving] = useState(false);

  const layouts = [
    {
      id: 'standard',
      name: 'Standard Layout',
      description: 'Label above field with full width',
      preview: (
        <div className="border p-2 rounded-md">
          <div className="mb-1 text-xs">Label</div>
          <div className="bg-gray-100 h-6 rounded-sm"></div>
        </div>
      )
    },
    {
      id: 'inline',
      name: 'Inline Layout',
      description: 'Label and field on same line',
      preview: (
        <div className="border p-2 rounded-md">
          <div className="flex items-center">
            <div className="text-xs w-1/3">Label</div>
            <div className="bg-gray-100 h-6 rounded-sm flex-1"></div>
          </div>
        </div>
      )
    },
    {
      id: 'compact',
      name: 'Compact Layout',
      description: 'Reduced padding and margins',
      preview: (
        <div className="border p-1 rounded-md">
          <div className="mb-0.5 text-xs">Label</div>
          <div className="bg-gray-100 h-5 rounded-sm"></div>
        </div>
      )
    },
    {
      id: 'floating',
      name: 'Floating Label',
      description: 'Label floats within the field',
      preview: (
        <div className="border p-2 rounded-md">
          <div className="relative">
            <div className="absolute top-0 left-2 text-xs bg-white px-1 -mt-2 text-blue-500">Label</div>
            <div className="bg-gray-100 h-8 rounded-sm"></div>
          </div>
        </div>
      )
    }
  ];

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const layoutData = {
        layout: selectedLayout,
        ...initialData
      };
      
      if (onSave) {
        onSave(layoutData);
      }
      
      toast({
        title: "Layout settings saved",
        description: "Your field layout changes have been saved",
      });
    } catch (error) {
      console.error("Error saving layout settings:", error);
      toast({
        title: "Error saving layout",
        description: "There was a problem saving your layout settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Field Layout Configuration</h2>
      <p className="text-gray-500">
        Configure the layout settings for your fields
      </p>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label className="text-base">Select Layout Style</Label>
            
            <RadioGroup
              value={selectedLayout}
              onValueChange={setSelectedLayout}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {layouts.map((layout) => (
                <div key={layout.id} className="relative">
                  <RadioGroupItem
                    value={layout.id}
                    id={`layout-${layout.id}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`layout-${layout.id}`}
                    className={cn(
                      "flex flex-col h-full border rounded-md p-4 hover:border-primary transition-colors",
                      selectedLayout === layout.id && "border-2 border-primary"
                    )}
                  >
                    {selectedLayout === layout.id && (
                      <CheckCircle className="h-5 w-5 absolute top-2 right-2 text-primary" />
                    )}
                    <span className="font-medium mb-2">{layout.name}</span>
                    <div className="my-2">{layout.preview}</div>
                    <span className="text-xs text-gray-500 mt-2">{layout.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? "Saving..." : "Save Layout Settings"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FieldLayoutPanel;
