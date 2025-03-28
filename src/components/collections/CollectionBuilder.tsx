
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { PlusCircle, Trash2, ArrowUpDown, Settings, Eye, Info, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  order: number;
  config: Record<string, any>;
}

interface CollectionBuilderProps {
  activeDropId?: string;
}

const CollectionBuilder = ({ activeDropId }: CollectionBuilderProps) => {
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: 'collection-builder',
  });

  const handleSaveCollection = () => {
    if (!collectionName) {
      toast({
        title: "Collection name required",
        description: "Please provide a name for your collection",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Collection saved",
      description: `${collectionName} has been saved successfully`,
    });
  };

  const handleAddField = (type: string, name: string) => {
    const newField: Field = {
      id: `field-${Date.now()}`,
      name: `New ${name}`,
      type,
      required: false,
      order: fields.length,
      config: {},
    };
    
    setFields([...fields, newField]);
    setActiveFieldId(newField.id);
    
    toast({
      title: "Field added",
      description: `Added ${name} field to collection`,
    });
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    if (activeFieldId === id) {
      setActiveFieldId(null);
    }
    
    toast({
      title: "Field removed",
      description: "Field has been removed from collection",
    });
  };

  const getActiveField = () => {
    return fields.find(field => field.id === activeFieldId);
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Builder Area */}
      <div className="flex-1 overflow-auto">
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="collection-name" className="block text-sm font-medium mb-1">Collection Name</label>
            <Input
              id="collection-name"
              placeholder="e.g. Blog Posts, Products, Team Members"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div>
            <label htmlFor="collection-desc" className="block text-sm font-medium mb-1">Description (optional)</label>
            <Input
              id="collection-desc"
              placeholder="Describe the purpose of this collection"
              value={collectionDesc}
              onChange={(e) => setCollectionDesc(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>

        <div className="border-t border-cms-border pt-6 pb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Fields</h3>
          <Button variant="outline" onClick={handleSaveCollection}>
            Save Collection
          </Button>
        </div>

        <div 
          ref={setNodeRef} 
          className={cn(
            "min-h-[300px] border-2 border-dashed rounded-lg p-4 transition-colors",
            isOver ? "border-cms-primary bg-cms-primary/5" : "border-cms-border",
            fields.length === 0 && "flex flex-col items-center justify-center py-12"
          )}
        >
          {fields.length === 0 ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <PlusCircle size={40} className="text-cms-primary/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No fields yet</h3>
              <p className="text-gray-500 max-w-sm mb-4">
                Drag components from the panel on the right or click below to add your first field
              </p>
              <Button 
                onClick={() => handleAddField('text', 'Text Input')}
                variant="default"
              >
                Add a Text Field
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field) => (
                <div 
                  key={field.id} 
                  className={cn(
                    "p-4 border rounded-lg bg-white dark:bg-gray-800 flex items-center transition-all",
                    activeFieldId === field.id ? "border-cms-primary ring-1 ring-cms-primary" : "border-cms-border",
                    "hover:border-cms-primary/50"
                  )}
                  onClick={() => setActiveFieldId(field.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{field.name}</h4>
                      {field.required && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle size={16} className="text-cms-error" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>This field is required</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">{field.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <ArrowUpDown size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveField(field.id)}>
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Field Settings Panel */}
      <div className="w-80 border-l border-cms-border p-4">
        {activeFieldId ? (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Field Settings</h3>
            <Tabs defaultValue="general">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="validation">Validation</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Field Name</label>
                  <Input placeholder="e.g. Title, Description, Price" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Field Key</label>
                  <Input placeholder="e.g. title, description, price" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description (optional)</label>
                  <Input placeholder="Help text for content editors" />
                </div>
              </TabsContent>
              
              <TabsContent value="validation" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium mb-1">Required Field</label>
                    <p className="text-gray-500 text-xs">Must be filled to publish</p>
                  </div>
                  <div>
                    {/* Switch component would go here */}
                    <div className="w-10 h-5 bg-cms-primary rounded-full"></div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Validation Rules</label>
                  <div className="p-3 border border-dashed rounded-lg bg-cms-lightGray text-center">
                    <p className="text-sm text-gray-500">Validation options depend on field type</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium mb-1">Unique Field</label>
                    <p className="text-gray-500 text-xs">Must be unique across entries</p>
                  </div>
                  <div>
                    {/* Switch component would go here */}
                    <div className="w-10 h-5 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Default Value</label>
                  <Input placeholder="Enter a default value" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
            <Info size={32} className="mb-2" />
            <p>Select a field to edit its settings or add a new field to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionBuilder;
