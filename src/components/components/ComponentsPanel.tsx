import { useState, useEffect } from "react";
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
  FileText,
  PackageOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateComponentDrawer } from "@/components/components/CreateComponentDrawer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    const savedComponents = localStorage.getItem('components');
    if (savedComponents) {
      try {
        setComponents(JSON.parse(savedComponents));
      } catch (e) {
        console.error("Error loading components from localStorage:", e);
        localStorage.removeItem('components'); // Clear invalid data
      }
    }
  }, []);
  
  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || component.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  const categories = ["all", ...new Set(components.map(c => c.category))];
  
  const handleCreateComponent = (component: Component) => {
    if (editingComponent) {
      setComponents(prevComponents => 
        prevComponents.map(c => c.id === component.id ? component : c)
      );
      toast({
        title: "Component updated",
        description: `${component.name} has been updated successfully.`
      });
    } else {
      setComponents(prevComponents => [...prevComponents, component]);
      toast({
        title: "Component created",
        description: `${component.name} has been added to your component library.`
      });
    }
    
    const updatedComponents = editingComponent 
      ? components.map(c => c.id === component.id ? component : c)
      : [...components, component];
      
    localStorage.setItem('components', JSON.stringify(updatedComponents));
    
    setDrawerOpen(false);
    setEditingComponent(null);
  };

  const confirmDeleteComponent = (id: string) => {
    setComponentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteComponent = () => {
    if (!componentToDelete) return;
    
    const updatedComponents = components.filter(c => c.id !== componentToDelete);
    setComponents(updatedComponents);
    
    localStorage.setItem('components', JSON.stringify(updatedComponents));
    
    toast({
      title: "Component deleted",
      description: "The component has been removed from your library.",
      variant: "destructive"
    });
    
    setDeleteDialogOpen(false);
    setComponentToDelete(null);
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
        <div className="text-center py-12 border border-dashed rounded-lg">
          <PackageOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">Your component library is empty</h3>
          <p className="text-gray-500 mt-2 mb-4 max-w-md mx-auto">
            Create reusable components that can be used across your collections to speed up content creation.
          </p>
          <Button
            onClick={() => {
              setEditingComponent(null);
              setDrawerOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Create Your First Component
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
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
              <TabsList className="bg-slate-50">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {filteredComponents.length === 0 ? (
            <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
              <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p>No components found matching your search.</p>
              <p className="text-sm mt-1">Try adjusting your search or category filter.</p>
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
                          onClick={() => confirmDeleteComponent(component.id)}
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
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this component?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the component
              and remove it from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteComponent}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
