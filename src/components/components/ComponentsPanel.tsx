
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ComponentType = {
  id: string;
  name: string;
  description: string;
  category?: string;
};

// Define component categories and types
const componentTypes: Record<string, ComponentType[]> = {
  "Input": [
    { id: "text", name: "Input Text", description: "Basic text input field" },
    { id: "textarea", name: "Input Text Area", description: "Multi-line text input" },
    { id: "password", name: "Password", description: "Secure password input with toggle" },
    { id: "number", name: "Input Number", description: "Numeric input with formatting" },
    { id: "mask", name: "Input Mask", description: "Input with formatting mask" },
    { id: "group", name: "Input Group", description: "Group multiple inputs together" },
    { id: "otp", name: "Input OTP", description: "One-time password input" },
    { id: "autocomplete", name: "Autocomplete", description: "Input with suggestions" },
  ],
  
  "Selection": [
    { id: "dropdown", name: "Dropdown Field", description: "Select from a dropdown list" },
    { id: "multiselect", name: "MultiSelect", description: "Select multiple options" },
    { id: "selectbutton", name: "Select Button", description: "Button-style option selector" },
    { id: "listbox", name: "List Box", description: "Scrollable selection list" },
    { id: "treeselect", name: "Tree Select", description: "Hierarchical selection component" },
    { id: "mention", name: "Mention Box", description: "Text input with @mentions" },
  ],
  
  "Toggle": [
    { id: "checkbox", name: "Checkbox", description: "Standard checkbox input" },
    { id: "tristatecheck", name: "Tri-State Checkbox", description: "Checkbox with three states" },
    { id: "multistatecheck", name: "Multi-State Checkbox", description: "Checkbox with multiple states" },
    { id: "switch", name: "Input Switch", description: "Toggle switch component" },
    { id: "togglebutton", name: "Toggle Button", description: "Button with toggle state" },
    { id: "radio", name: "Radio Button", description: "Single-selection radio buttons" },
  ],
  
  "Advanced": [
    { id: "slider", name: "Slider", description: "Range selector with draggable handle" },
    { id: "calendar", name: "Calendar", description: "Date picker with calendar UI" },
    { id: "colorpicker", name: "Color Picker", description: "Visual color selection tool" },
    { id: "rating", name: "Rating", description: "Star-based rating selector" },
    { id: "repeater", name: "Repeater", description: "Repeatable group of fields" },
    { id: "map", name: "Map", description: "Geographic map component" },
  ],
  
  "Media": [
    { id: "image", name: "Image", description: "Image upload component" },
    { id: "file", name: "File", description: "File upload component" },
    { id: "media", name: "Media Gallery", description: "Multiple media file management" },
  ],
  
  "Text": [
    { id: "code", name: "Code", description: "Code snippet with syntax highlighting" },
    { id: "quote", name: "Quote", description: "Blockquote with citation" },
    { id: "list", name: "List", description: "Ordered or unordered list" },
    { id: "markdown", name: "Markdown", description: "Markdown content editor" },
    { id: "wysiwyg", name: "WYSIWYG Editor", description: "Rich text editor" },
    { id: "blockeditor", name: "Block Editor", description: "Block-based content editor" },
  ],
  
  "Layout": [
    { id: "divider", name: "Divider", description: "Visual separator between content" },
    { id: "accordion", name: "Accordion", description: "Collapsible content sections" },
    { id: "tabs", name: "Tabs", description: "Content organized in tabs" },
    { id: "modal", name: "Modal", description: "Popup dialog content" },
  ],
  
  "Relational": [
    { id: "relationOne", name: "One-to-Many", description: "Relation to multiple items" },
    { id: "relationMany", name: "Many-to-Many", description: "Bidirectional relations" },
    { id: "treeView", name: "Tree View", description: "Hierarchical data display" },
  ]
};

const categories = Object.keys(componentTypes);

export function ComponentsPanel() {
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Component Library</h2>
          <p className="text-gray-500">Create and manage reusable content components</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Component
        </Button>
      </div>

      {components.length === 0 && !isCreating ? (
        <Alert variant="info" className="bg-blue-50 border-blue-100">
          <Info className="h-5 w-5 text-blue-500" />
          <AlertDescription className="text-blue-700">
            No components created yet. Click "Add Component" to create your first reusable component.
          </AlertDescription>
        </Alert>
      ) : isCreating ? (
        <div className="space-y-4">
          <h3 className="font-medium">Select Component Type</h3>
          
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-4 flex flex-wrap h-auto">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="h-9">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {componentTypes[category].map((type) => (
                    <Card 
                      key={type.id}
                      className={cn(
                        "cursor-pointer transition-all hover:border-blue-400 hover:shadow-md",
                      )}
                      onClick={() => {
                        setComponents([...components, type]);
                        setIsCreating(false);
                      }}
                    >
                      <CardContent className="p-4 flex flex-col">
                        <h3 className="font-medium text-base">{type.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-medium">Your Components</h3>
          <div className="space-y-2">
            {components.map((component, index) => (
              <div 
                key={`${component.id}-${index}`}
                className="flex justify-between items-center p-3 rounded-md border border-gray-100 hover:border-gray-200 hover:bg-gray-50"
              >
                <div>
                  <h4 className="font-medium">{component.name}</h4>
                  <p className="text-sm text-gray-500">{component.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
