import { useState, useEffect } from "react";
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, GripVertical, AlertCircle } from "lucide-react";
import { Component, ComponentField } from "./ComponentsPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { adaptFieldsForPreview } from "@/utils/fieldAdapters";
import { FieldTypeSelector } from "@/components/fields/FieldTypeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const componentCategories = [
  { value: "layout", label: "Layout" },
  { value: "form", label: "Form" },
  { value: "content", label: "Content" },
  { value: "commerce", label: "Commerce" },
  { value: "navigation", label: "Navigation" },
  { value: "data", label: "Data" },
  { value: "media", label: "Media" },
  { value: "custom", label: "Custom" }
];

const fieldTypes = {
  'Text & Numbers': [
    { id: 'text', name: 'Input Text', description: 'Single line text field' },
    { id: 'textarea', name: 'Textarea', description: 'Multi-line text field' },
    { id: 'number', name: 'Number', description: 'Numeric field with validation' },
    { id: 'password', name: 'Password', description: 'Secure password input' },
  ],
  'Selection': [
    { id: 'select', name: 'Dropdown', description: 'Single selection dropdown' },
    { id: 'checkbox', name: 'Checkbox', description: 'Simple checkbox input' },
    { id: 'radio', name: 'Radio', description: 'Radio button selection' },
    { id: 'toggle', name: 'Toggle', description: 'On/Off toggle switch' },
  ],
  'Media': [
    { id: 'image', name: 'Image', description: 'Image upload component' },
    { id: 'file', name: 'File', description: 'File upload component' },
  ],
  'Advanced': [
    { id: 'date', name: 'Date', description: 'Date picker component' },
    { id: 'relation', name: 'Relation', description: 'Relationship to other collections' },
  ],
};

type CreateComponentDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (component: Component) => void;
  initialData: Component | null;
};

export function CreateComponentDrawer({ 
  open, 
  onOpenChange, 
  onSave,
  initialData
}: CreateComponentDrawerProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("layout");
  const [fields, setFields] = useState<ComponentField[]>([]);
  const [activeTab, setActiveTab] = useState<string>(Object.keys(fieldTypes)[0]);
  const [addingField, setAddingField] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setFields(initialData.fields);
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("layout");
    setFields([]);
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!name.trim()) {
      errors.name = "Component name is required";
    }
    
    if (!description.trim()) {
      errors.description = "Description is required";
    }
    
    if (fields.length === 0) {
      errors.fields = "At least one field is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleAddField = (fieldType: string) => {
    const fieldTypeInfo = Object.values(fieldTypes)
      .flat()
      .find(type => type.id === fieldType);
    
    if (!fieldTypeInfo) return;
    
    const newField: ComponentField = {
      id: crypto.randomUUID(),
      name: fieldTypeInfo.name,
      type: fieldType,
      required: false,
      config: {}
    };
    
    setFields([...fields, newField]);
    setAddingField(false);
  };
  
  const handleRemoveField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };
  
  const handleFieldChange = (id: string, updates: Partial<ComponentField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };
  
  const handleSaveComponent = () => {
    if (!validateForm()) return;
    
    const newComponent: Component = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      description,
      category,
      fields,
      lastUpdated: new Date().toLocaleDateString()
    };
    
    onSave(newComponent);
    resetForm();
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="text-xl">
              {initialData ? "Edit Component" : "Create New Component"}
            </DrawerTitle>
          </DrawerHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Component Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter component name"
                    className={cn(validationErrors.name && "border-red-500")}
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-500">{validationErrors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter component description"
                    className={cn(validationErrors.description && "border-red-500")}
                  />
                  {validationErrors.description && (
                    <p className="text-sm text-red-500">{validationErrors.description}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {componentCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Fields</Label>
                  <Dialog open={addingField} onOpenChange={setAddingField}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="h-8">
                        <Plus className="h-4 w-4 mr-1" /> Add Field
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Add Field</DialogTitle>
                      </DialogHeader>
                      
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4 flex flex-wrap h-auto">
                          {Object.keys(fieldTypes).map((category) => (
                            <TabsTrigger key={category} value={category} className="h-9">
                              {category}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {Object.entries(fieldTypes).map(([category, types]) => (
                          <TabsContent key={category} value={category}>
                            <FieldTypeSelector 
                              fieldTypes={types} 
                              onSelectFieldType={handleAddField} 
                            />
                          </TabsContent>
                        ))}
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {validationErrors.fields && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{validationErrors.fields}</AlertDescription>
                  </Alert>
                )}
                
                {fields.length === 0 ? (
                  <div className="border border-dashed rounded-md p-4 text-center text-gray-500">
                    No fields added yet. Click "Add Field" to add your first field.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div 
                        key={field.id}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border"
                      >
                        <div className="text-gray-400">
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Input
                              value={field.name}
                              onChange={(e) => handleFieldChange(field.id, { name: e.target.value })}
                              placeholder="Field name"
                              className="h-8"
                            />
                            <Select 
                              value={field.required ? "true" : "false"}
                              onValueChange={(value) => handleFieldChange(field.id, { required: value === "true" })}
                            >
                              <SelectTrigger className="w-28 h-8">
                                <SelectValue placeholder="Required?" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Required</SelectItem>
                                <SelectItem value="false">Optional</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="mt-2 text-xs text-gray-500 flex items-center">
                            <span className="uppercase px-1.5 py-0.5 bg-gray-200 rounded text-gray-600 mr-2">
                              {field.type}
                            </span>
                            Field #{index + 1}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:text-red-500"
                          onClick={() => handleRemoveField(field.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
          
          <DrawerFooter className="border-t pt-4">
            <div className="flex justify-between w-full">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button onClick={handleSaveComponent}>
                {initialData ? "Update Component" : "Create Component"}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
