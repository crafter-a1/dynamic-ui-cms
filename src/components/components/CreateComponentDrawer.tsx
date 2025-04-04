
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
import { Plus, X, GripVertical, AlertCircle, Settings2, Copy, Check, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Component, ComponentField } from "./ComponentsPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { adaptFieldsForPreview } from "@/utils/fieldAdapters";
import { FieldTypeSelector } from "@/components/fields/FieldTypeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

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
  const [previewMode, setPreviewMode] = useState(false);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [fieldSettingsId, setFieldSettingsId] = useState<string | null>(null);
  
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
    setPreviewMode(false);
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
    
    toast({
      title: "Field added",
      description: `${fieldTypeInfo.name} field has been added to your component`,
    });
  };
  
  const handleRemoveField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    toast({
      title: "Field removed",
      description: "The field has been removed from your component",
    });
  };
  
  const handleFieldChange = (id: string, updates: Partial<ComponentField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };
  
  const handleSaveComponent = () => {
    if (!validateForm()) return;
    
    // Ensure field names are unique within the component
    const fieldNames = fields.map(f => f.name.trim().toLowerCase());
    const hasDuplicates = fieldNames.length !== new Set(fieldNames).size;
    
    if (hasDuplicates) {
      setValidationErrors({
        ...validationErrors,
        fields: "Component cannot have duplicate field names"
      });
      return;
    }
    
    const newComponent: Component = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      description,
      category,
      fields,
      lastUpdated: new Date().toLocaleDateString()
    };
    
    // Store component in local storage to persist it
    const existingComponents = JSON.parse(localStorage.getItem('components') || '[]');
    const existingIndex = existingComponents.findIndex((c: Component) => c.id === newComponent.id);
    
    if (existingIndex >= 0) {
      existingComponents[existingIndex] = newComponent;
    } else {
      existingComponents.push(newComponent);
    }
    
    localStorage.setItem('components', JSON.stringify(existingComponents));
    
    onSave(newComponent);
    resetForm();
    
    toast({
      title: initialData ? "Component updated" : "Component created",
      description: initialData 
        ? `${newComponent.name} has been updated successfully` 
        : `${newComponent.name} has been added to your component library`,
    });
  };

  const duplicateField = (field: ComponentField) => {
    const newField = {
      ...field,
      id: crypto.randomUUID(),
      name: `${field.name} (copy)`
    };
    setFields([...fields, newField]);
    toast({
      title: "Field duplicated",
      description: "A copy of the field has been created"
    });
  };
  
  const moveField = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = fields[dragIndex];
    const newFields = [...fields];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, draggedItem);
    setFields(newFields);
  };
  
  const moveFieldUp = (index: number) => {
    if (index > 0) {
      moveField(index, index - 1);
    }
  };
  
  const moveFieldDown = (index: number) => {
    if (index < fields.length - 1) {
      moveField(index, index + 1);
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="text-xl flex justify-between items-center">
              <span>{initialData ? "Edit Component" : "Create New Component"}</span>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="text-xs"
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Edit Mode" : "Preview"}
              </Button>
            </DrawerTitle>
          </DrawerHeader>
          
          <ScrollArea className="flex-1 p-6">
            {previewMode ? (
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-gray-50">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">{name || "Component Name"}</h2>
                    <p className="text-gray-500">{description || "Component description"}</p>
                    <Badge variant="outline" className="mt-2 capitalize">{category}</Badge>
                  </div>

                  <div className="space-y-4 mt-6">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 bg-white border rounded-md shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{field.name}</h3>
                          <Badge variant={field.required ? "default" : "outline"} className="text-xs">
                            {field.required ? "Required" : "Optional"}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="uppercase px-1.5 py-0.5 bg-gray-100 rounded mr-2">
                            {field.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
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
                      <div className="mb-2">
                        <Plus className="h-12 w-12 mx-auto text-gray-300" />
                      </div>
                      <p className="text-sm">No fields added yet. Click "Add Field" to add your first field.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setAddingField(true)}
                        className="mt-3"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Field
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {fields.map((field, index) => (
                        <div 
                          key={field.id}
                          className={cn(
                            "flex items-center gap-2 p-3 bg-gray-50 rounded-md border transition-all",
                            draggedField === field.id && "border-blue-500 opacity-50",
                            fieldSettingsId === field.id && "ring-2 ring-blue-200"
                          )}
                          draggable="true"
                          onDragStart={() => setDraggedField(field.id)}
                          onDragEnd={() => setDraggedField(null)}
                        >
                          <div className="text-gray-400 cursor-move">
                            <GripVertical className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                              <Input
                                value={field.name}
                                onChange={(e) => handleFieldChange(field.id, { name: e.target.value })}
                                placeholder="Field name"
                                className="h-8 md:flex-1"
                              />
                              <Select 
                                value={field.required ? "true" : "false"}
                                onValueChange={(value) => handleFieldChange(field.id, { required: value === "true" })}
                              >
                                <SelectTrigger className="w-32 h-8 shrink-0">
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
                          <div className="flex gap-1">
                            <div className="flex flex-col md:flex-row gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-500"
                                onClick={() => moveFieldUp(index)}
                                disabled={index === 0}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-500"
                                onClick={() => moveFieldDown(index)}
                                disabled={index === fields.length - 1}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </div>
                            <Popover
                              open={fieldSettingsId === field.id}
                              onOpenChange={(open) => setFieldSettingsId(open ? field.id : null)}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-500"
                                >
                                  <Settings2 className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56 p-2" side="left">
                                <div className="space-y-2">
                                  <div className="font-medium text-sm px-2 py-1">
                                    Field Options
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-sm"
                                    onClick={() => duplicateField(field)}
                                  >
                                    <Copy className="h-3.5 w-3.5 mr-2" />
                                    Duplicate Field
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleRemoveField(field.id)}
                                  >
                                    <X className="h-3.5 w-3.5 mr-2" />
                                    Remove Field
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-500 hover:text-red-500"
                              onClick={() => handleRemoveField(field.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
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
