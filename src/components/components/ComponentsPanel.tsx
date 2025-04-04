
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Info, 
  Layout, 
  Plus, 
  Search, 
  Trash2, 
  PanelRight, 
  Layers, 
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateComponentDrawer } from "@/components/components/CreateComponentDrawer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export type Component = {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: ComponentField[];
  lastUpdated: string;
}

export type ComponentField = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  config?: Record<string, any>;
}

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
  const navigate = useNavigate();
  const [components, setComponents] = useState<Component[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  
  // Filter components based on search and category
  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || component.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  const categories = ["all", ...new Set(components.map(c => c.category))];
  
  const handleCreateComponent = (component: Component) => {
    if (editingComponent) {
      // Update existing component
      setComponents(prevComponents => 
        prevComponents.map(c => c.id === component.id ? component : c)
      );
      toast({
        title: "Component updated",
        description: `${component.name} has been updated successfully.`
      });
    } else {
      // Create new component
      setComponents(prevComponents => [...prevComponents, component]);
      toast({
        title: "Component created",
        description: `${component.name} has been added to your component library.`
      });
    }
    setDrawerOpen(false);
    setEditingComponent(null);
  };

  const handleDeleteComponent = (id: string) => {
    setComponents(prevComponents => prevComponents.filter(c => c.id !== id));
    toast({
      title: "Component deleted",
      description: "The component has been removed from your library.",
      variant: "destructive"
    });
  };
  
  const handleEditComponent = (component: Component) => {
    setEditingComponent(component);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Component Library</h2>
          <p className="text-gray-500">Create and manage reusable content components</p>
        </div>
        <Button
          onClick={() => {
            setEditingComponent(null);
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Component
        </Button>
      </div>
      
      {components.length === 0 ? (
        <Alert variant="info" className="bg-blue-50 border-blue-100">
          <Info className="h-5 w-5 text-blue-500" />
          <AlertDescription className="text-blue-700">
            No components created yet. Click "Add Component" to create your first reusable component.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search components..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-shrink-0">
              <TabsList>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {filteredComponents.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No components found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComponents.map((component) => (
                <Card 
                  key={component.id}
                  className="overflow-hidden hover:border-gray-300 transition-colors"
                >
                  <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-500" />
                  <CardContent className="p-4 pt-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-base">{component.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{component.description}</p>
                      </div>
                      <Badge variant="outline" className="capitalize bg-gray-50">
                        {component.category}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <Layers className="h-3 w-3 mr-1" /> 
                      <span>{component.fields.length} fields</span>
                      <span className="mx-2">•</span>
                      <FileText className="h-3 w-3 mr-1" />
                      <span>Last updated {component.lastUpdated}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => handleEditComponent(component)}
                      >
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => navigate(`/components/${component.id}`)}
                        >
                          <PanelRight className="h-3 w-3 mr-1" /> Preview
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteComponent(component.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <CreateComponentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSave={handleCreateComponent}
        initialData={editingComponent}
      />
    </div>
  );
}
