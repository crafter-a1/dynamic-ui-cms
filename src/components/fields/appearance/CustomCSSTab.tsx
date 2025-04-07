
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Eye, Maximize2, Save, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface CustomCSSTabProps {
  settings: any;
  onUpdate: (settings: any) => void;
}

interface CSSSnippet {
  id: string;
  name: string;
  value: string;
}

export function CustomCSSTab({ settings, onUpdate }: CustomCSSTabProps) {
  const [cssMode, setCssMode] = useState<'code' | 'visual'>('code');
  const [isSplitView, setIsSplitView] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [customCSS, setCustomCSS] = useState(settings.customCSS || '');
  
  // For the new save snippet functionality
  const [savedSnippets, setSavedSnippets] = useState<CSSSnippet[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSnippetName, setNewSnippetName] = useState('');
  
  // Load saved snippets from localStorage on component mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('cssSnippets');
      if (savedItems) {
        setSavedSnippets(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error('Error loading saved CSS snippets:', error);
    }
  }, []);
  
  // Update localStorage when snippets change
  useEffect(() => {
    try {
      localStorage.setItem('cssSnippets', JSON.stringify(savedSnippets));
    } catch (error) {
      console.error('Error saving CSS snippets:', error);
    }
  }, [savedSnippets]);
  
  const defaultCssSnippets = [
    {
      id: 'focus-glow',
      name: "Focus Glow Effect",
      value: `box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);\noutline: none;`
    },
    {
      id: 'hover-transition',
      name: "Smooth Hover Transition",
      value: `transition: all 0.2s ease-in-out;\n`
    },
    {
      id: 'material-ripple',
      name: "Material Design Ripple",
      value: `position: relative;\noverflow: hidden;\n&::after {\n  content: '';\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 5px;\n  height: 5px;\n  background: rgba(255, 255, 255, 0.5);\n  opacity: 0;\n  border-radius: 100%;\n  transform: scale(1, 1) translate(-50%);\n  transform-origin: 50% 50%;\n}\n&:focus:not(:active)::after {\n  animation: ripple 1s ease-out;\n}\n@keyframes ripple {\n  0% {\n    transform: scale(0, 0);\n    opacity: 1;\n  }\n  20% {\n    transform: scale(25, 25);\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n    transform: scale(40, 40);\n  }\n}`
    },
    {
      id: 'inner-shadow',
      name: "Subtle Inner Shadow",
      value: `box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);`
    },
    {
      id: 'modern-radius',
      name: "Modern Border Radius",
      value: `border-radius: 0.5rem;\noverflow: hidden;`
    }
  ];
  
  const handleApplySnippet = (snippetValue: string) => {
    const newCSS = customCSS + (customCSS ? '\n' : '') + snippetValue;
    setCustomCSS(newCSS);
    handleCustomCSSChange(newCSS);
  };
  
  const handleCustomCSSChange = (value: string) => {
    setCustomCSS(value);
    onUpdate({
      ...settings,
      customCSS: value
    });
  };
  
  const handleFormatCode = () => {
    try {
      // Basic CSS formatting (simple version)
      const formattedCSS = customCSS
        .replace(/\s*{\s*/g, ' {\n  ')
        .replace(/\s*;\s*/g, ';\n  ')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/\n\s*\n/g, '\n');
        
      setCustomCSS(formattedCSS);
      handleCustomCSSChange(formattedCSS);
      
      toast({
        title: "CSS Formatted",
        description: "Your CSS has been formatted successfully"
      });
    } catch (error) {
      console.error('Error formatting CSS:', error);
      toast({
        title: "Error Formatting CSS",
        description: "There was a problem formatting your CSS",
        variant: "destructive"
      });
    }
  };
  
  const handleResetCSS = () => {
    setCustomCSS('');
    handleCustomCSSChange('');
    toast({
      title: "CSS Reset",
      description: "Your CSS has been reset to default"
    });
  };
  
  const saveCurrentAsSnippet = () => {
    if (!customCSS.trim()) {
      toast({
        title: "Cannot Save Empty Snippet",
        description: "Please add some CSS before saving a snippet",
        variant: "destructive"
      });
      return;
    }
    
    setIsDialogOpen(true);
  };
  
  const handleSaveSnippet = () => {
    if (!newSnippetName.trim()) {
      toast({
        title: "Snippet Name Required",
        description: "Please provide a name for your snippet",
        variant: "destructive"
      });
      return;
    }
    
    const newSnippet: CSSSnippet = {
      id: `snippet-${Date.now()}`,
      name: newSnippetName,
      value: customCSS
    };
    
    setSavedSnippets([...savedSnippets, newSnippet]);
    setIsDialogOpen(false);
    setNewSnippetName('');
    
    toast({
      title: "Snippet Saved",
      description: `Your snippet "${newSnippetName}" has been saved`
    });
  };
  
  const handleDeleteSnippet = (id: string) => {
    setSavedSnippets(savedSnippets.filter(snippet => snippet.id !== id));
    toast({
      title: "Snippet Deleted",
      description: "Your CSS snippet has been deleted"
    });
  };
  
  // Combine default and user snippets for display
  const allSnippets = [...defaultCssSnippets, ...savedSnippets];
  
  return (
    <div className={`space-y-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Custom CSS</h3>
          <p className="text-sm text-gray-500">
            Add custom CSS to style your field
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleFormatCode}
          >
            Format Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleResetCSS}
          >
            Reset to Default
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between border rounded-t-md p-2 bg-gray-50 dark:bg-gray-800">
        <Tabs value={cssMode} onValueChange={(value: string) => setCssMode(value as 'code' | 'visual')}>
          <TabsList className="grid w-60 grid-cols-2">
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visual
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsSplitView(!isSplitView)}
          >
            <div className="flex flex-col items-center justify-center h-4 w-4">
              <div className="h-1.5 w-3.5 bg-current mb-0.5"></div>
              <div className="h-1.5 w-3.5 bg-current"></div>
            </div>
            <span className="sr-only">Split View</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsFullScreen(!isFullScreen)}
          >
            <Maximize2 className="h-4 w-4" />
            <span className="sr-only">Full Screen</span>
          </Button>
        </div>
      </div>
      
      <div className="border rounded-b-md">
        <div className="border-b p-2 bg-gray-50 dark:bg-gray-800">
          <h4 className="text-sm font-medium">CSS Editor</h4>
        </div>
        <div className={isSplitView ? "grid grid-cols-2" : ""}>
          <div className="p-0 relative">
            <div className="absolute left-0 top-0 p-1 text-xs text-gray-400 w-6 text-right select-none">
              {Array.from({ length: customCSS.split('\n').length || 1 }).map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
              ))}
            </div>
            <textarea
              value={customCSS}
              onChange={(e) => handleCustomCSSChange(e.target.value)}
              className="font-mono text-sm w-full h-80 p-1 pl-8 border-0 focus:ring-0 resize-none"
              placeholder="/* Add your custom CSS here */
.my-field {
  border-color: #3b82f6;
  background-color: #f8fafc;
}
.my-field:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}"
            />
          </div>
          
          {isSplitView && (
            <div className="border-l p-4">
              <h4 className="text-sm font-medium mb-3">Preview</h4>
              <div className="border rounded p-3">
                <div className="mb-2 text-sm font-medium">Field Label</div>
                <div 
                  className="border rounded p-2 my-field" 
                  style={{ ...cssStringToObject(customCSS) }}
                >
                  Field content
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-medium">CSS Snippets</h4>
        <div className="flex flex-wrap gap-2">
          {allSnippets.map((snippet) => (
            <div key={snippet.id} className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApplySnippet(snippet.value)}
                className="rounded-r-none"
              >
                {snippet.name}
              </Button>
              {savedSnippets.some(s => s.id === snippet.id) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-l-none border-l-0 px-2 text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteSnippet(snippet.id)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="border-dashed flex items-center gap-1"
            onClick={saveCurrentAsSnippet}
          >
            <Save className="h-3 w-3" /> Save Current as Snippet
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button
          onClick={() => {
            // Validate CSS before applying
            try {
              onUpdate({
                ...settings,
                customCSS: customCSS
              });
              
              toast({
                title: "CSS Applied",
                description: "Your custom CSS has been applied to the field"
              });
            } catch (error) {
              console.error('Error applying CSS changes:', error);
              toast({
                title: "Error Applying CSS",
                description: "There was a problem applying your CSS changes",
                variant: "destructive"
              });
            }
          }}
        >
          Apply Changes
        </Button>
      </div>
      
      {/* Save Snippet Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save CSS Snippet</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="snippetName" className="text-sm font-medium">
              Snippet Name
            </label>
            <Input
              id="snippetName"
              value={newSnippetName}
              onChange={(e) => setNewSnippetName(e.target.value)}
              placeholder="Enter a name for your snippet"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSnippet}>Save Snippet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to convert CSS string to object (simple version)
function cssStringToObject(cssString: string): React.CSSProperties {
  const cssObj: Record<string, string> = {};
  
  try {
    // Extract properties
    const properties = cssString.match(/[^{}]+(?=\s*\{[^}]*\})/g);
    const values = cssString.match(/\{([^}]+)\}/g);
    
    if (!properties || !values || properties.length === 0) return cssObj;
    
    // Get the first selector's properties
    const styleValues = values[0].replace(/[{}]/g, '').trim();
    
    // Split into individual rules
    const rules = styleValues.split(';');
    
    rules.forEach(rule => {
      const [property, value] = rule.split(':').map(s => s.trim());
      if (property && value) {
        // Convert kebab-case to camelCase
        const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        cssObj[camelProperty] = value;
      }
    });
  } catch (e) {
    console.error('Error parsing CSS:', e);
  }
  
  return cssObj as React.CSSProperties;
}
