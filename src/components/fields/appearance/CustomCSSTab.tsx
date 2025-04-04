
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Code, Eye, Maximize2, SplitSquareVertical } from "lucide-react";
import { toast } from "sonner";

interface CustomCSSTabProps {
  settings: any;
  onUpdate: (settings: any) => void;
}

export function CustomCSSTab({ settings, onUpdate }: CustomCSSTabProps) {
  const [activeSubTab, setActiveSubTab] = useState('code');
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [splitViewMode, setSplitViewMode] = useState(false);
  const [cssValue, setCssValue] = useState(settings.customCSS || '');
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});
  const [fieldPreview, setFieldPreview] = useState<any>({
    style: {},
    state: 'default'
  });
  
  const [cssSnippets] = useState([
    { name: 'Focus Glow Effect', css: 'box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);' },
    { name: 'Smooth Hover Transition', css: 'transition: all 0.2s ease-in-out;' },
    { name: 'Material Design Ripple', css: 'position: relative; overflow: hidden;' },
    { name: 'Subtle Inner Shadow', css: 'box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);' },
    { name: 'Modern Border Radius', css: 'border-radius: 8px;' },
  ]);
  
  useEffect(() => {
    // Apply initial CSS from settings
    setCssValue(settings.customCSS || '');
    applyCustomCSS(settings.customCSS || '');
  }, [settings.customCSS]);
  
  const updateCustomCSS = (css: string) => {
    setCssValue(css);
    applyCustomCSS(css);
    onUpdate({ customCSS: css });
  };
  
  const addCssSnippet = (snippet: string) => {
    const currentCSS = cssValue || '';
    const updatedCSS = currentCSS + (currentCSS ? '\n' : '') + snippet;
    updateCustomCSS(updatedCSS);
  };
  
  const formatCSS = () => {
    try {
      // Simple CSS formatter
      const formattedCSS = cssValue
        .split(';')
        .filter((line: string) => line.trim() !== '')
        .map((line: string) => `${line.trim()};`)
        .join('\n');
      
      updateCustomCSS(formattedCSS);
      toast.success("CSS formatted successfully");
    } catch (e) {
      console.error('Error formatting CSS:', e);
      toast.error("Error formatting CSS");
    }
  };
  
  const resetCSS = () => {
    updateCustomCSS('');
    toast.success("CSS reset to default");
  };

  const handlePreviewStateChange = (state: string) => {
    setFieldPreview(prev => ({
      ...prev,
      state
    }));
  };

  const saveAsSnippet = () => {
    toast.success("Snippet saved successfully");
  };

  const applyCustomCSS = (css: string) => {
    try {
      // Convert CSS string to style object
      const cssObj: any = {};
      const cssProperties = css.split(';').filter(prop => prop.trim() !== '');
      
      cssProperties.forEach(property => {
        const [key, value] = property.split(':').map(part => part.trim());
        if (key && value) {
          // Convert kebab-case to camelCase
          const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          cssObj[camelKey] = value;
        }
      });
      
      setPreviewStyle(cssObj);
    } catch (error) {
      console.error('Error applying CSS:', error);
      toast.error("Invalid CSS");
    }
  };

  const validateCSS = () => {
    // Simple validation - in a real implementation, this would be more robust
    try {
      const testElement = document.createElement('div');
      testElement.style.cssText = cssValue;
      toast.success("CSS is valid");
      return true;
    } catch (e) {
      console.error('Invalid CSS:', e);
      toast.error("Invalid CSS");
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Preview</h3>
        <div className="flex items-center space-x-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("rounded-r-none", fieldPreview.state === 'default' && "bg-gray-200")}
              onClick={() => handlePreviewStateChange('default')}
            >
              Default
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("rounded-none border-x border-gray-200", fieldPreview.state === 'hover' && "bg-gray-200")}
              onClick={() => handlePreviewStateChange('hover')}
            >
              Hover
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("rounded-none border-r border-gray-200", fieldPreview.state === 'focus' && "bg-gray-200")}
              onClick={() => handlePreviewStateChange('focus')}
            >
              Focus
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("rounded-none border-r border-gray-200", fieldPreview.state === 'disabled' && "bg-gray-200")}
              onClick={() => handlePreviewStateChange('disabled')}
            >
              Disabled
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("rounded-l-none", fieldPreview.state === 'error' && "bg-gray-200")}
              onClick={() => handlePreviewStateChange('error')}
            >
              Error
            </Button>
          </div>
        </div>
      </div>

      <Card className="border rounded-md overflow-hidden">
        <CardContent className="p-6">
          <div className="mb-6">
            <Label className="block mb-2">Field Label</Label>
            <div 
              className={cn(
                "border rounded-md px-4 py-2 w-full", 
                fieldPreview.state === 'error' && "border-red-500",
                fieldPreview.state === 'focus' && "ring-2 ring-blue-500 ring-opacity-50",
                fieldPreview.state === 'disabled' && "bg-gray-100 opacity-70"
              )}
              style={previewStyle}
            >
              <Input 
                placeholder="Field placeholder" 
                className="border-0 p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={fieldPreview.state === 'disabled'}
              />
            </div>
            {fieldPreview.state === 'error' && (
              <p className="text-sm text-red-500 mt-1">This field has an error</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Custom CSS</h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={formatCSS}
          >
            Format Code
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={resetCSS}
          >
            Reset to Default
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b flex justify-between items-center">
          <Tabs defaultValue="code" value={activeSubTab} onValueChange={setActiveSubTab}>
            <TabsList>
              <TabsTrigger value="code" className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                Code
              </TabsTrigger>
              <TabsTrigger value="visual" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                Visual
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost"
              className="h-8 px-3 flex items-center gap-1"
              onClick={() => setSplitViewMode(!splitViewMode)}
            >
              <SplitSquareVertical className="h-4 w-4" />
              Split View
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              className="h-8 px-3 flex items-center gap-1"
              onClick={() => setFullScreenMode(!fullScreenMode)}
            >
              <Maximize2 className="h-4 w-4" />
              Full Screen
            </Button>
          </div>
        </div>
        
        <div className={cn("grid", splitViewMode ? "grid-cols-2" : "grid-cols-1")}>
          <TabsContent value="code" className={cn("m-0", splitViewMode && "border-r")}>
            <div className="p-4">
              <h4 className="font-medium mb-2">CSS Editor</h4>
              <div className="relative">
                <div className="absolute top-0 left-0 w-8 bg-gray-100 dark:bg-gray-800 h-full border-r flex flex-col">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="text-xs text-gray-500 text-right px-2 py-1">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <textarea
                  className="font-mono text-sm w-full h-64 p-2 pl-10 bg-white dark:bg-gray-900 border-0 resize-none focus:outline-none focus:ring-0"
                  value={cssValue}
                  onChange={(e) => updateCustomCSS(e.target.value)}
                  placeholder=".custom-input {
  border-color: #0066cc;
  border-width: 2px;
  border-radius: 4px;
  padding: 8px 12px;
  background-color: #ffffff;
  color: #333333;
  font-size: 15px;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="visual" className={cn("m-0", splitViewMode && "block")}>
            <div className="p-4">
              <h4 className="font-medium mb-4">Visual Property Editor</h4>
              
              <Tabs defaultValue="border">
                <TabsList className="w-full grid grid-cols-4 mb-4">
                  <TabsTrigger value="border">Border</TabsTrigger>
                  <TabsTrigger value="spacing">Spacing</TabsTrigger>
                  <TabsTrigger value="shadow">Shadow</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                </TabsList>
                
                <TabsContent value="border" className="space-y-4">
                  <div>
                    <Label>Border Width</Label>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => addCssSnippet('border-width: 0px;')}
                      >0px</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => addCssSnippet('border-width: 1px;')}
                      >1px</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs bg-blue-50"
                        onClick={() => addCssSnippet('border-width: 2px;')}
                      >2px</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => addCssSnippet('border-width: 4px;')}
                      >4px</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Border Radius</Label>
                    <div className="grid grid-cols-5 gap-2 mt-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => addCssSnippet('border-radius: 0px;')}
                      >0px</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => addCssSnippet('border-radius: 2px;')}
                      >2px</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => addCssSnippet('border-radius: 4px;')}
                      >4px</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs bg-blue-50"
                        onClick={() => addCssSnippet('border-radius: 8px;')}
                      >8px</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => addCssSnippet('border-radius: 12px;')}
                      >12px</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Border Style</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <select 
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={(e) => addCssSnippet(`border-style: ${e.target.value};`)}
                      >
                        <option>Solid</option>
                        <option>Dashed</option>
                        <option>Dotted</option>
                        <option>Double</option>
                        <option>None</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Border Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input 
                        type="color" 
                        className="h-9 w-9 rounded-md border"
                        onChange={(e) => addCssSnippet(`border-color: ${e.target.value};`)}
                        defaultValue="#0066cc"
                      />
                      <Input 
                        defaultValue="#0066cc" 
                        className="font-mono"
                        onChange={(e) => addCssSnippet(`border-color: ${e.target.value};`)}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="spacing" className="space-y-4">
                  <div>
                    <Label>Padding</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label className="text-xs mb-1 block">Horizontal</Label>
                        <Input 
                          type="range" 
                          min="0" 
                          max="30" 
                          defaultValue="8"
                          onChange={(e) => addCssSnippet(`padding-left: ${e.target.value}px; padding-right: ${e.target.value}px;`)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Vertical</Label>
                        <Input 
                          type="range" 
                          min="0" 
                          max="30" 
                          defaultValue="8"
                          onChange={(e) => addCssSnippet(`padding-top: ${e.target.value}px; padding-bottom: ${e.target.value}px;`)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Margin</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label className="text-xs mb-1 block">Horizontal</Label>
                        <Input 
                          type="range" 
                          min="0" 
                          max="30" 
                          defaultValue="0"
                          onChange={(e) => addCssSnippet(`margin-left: ${e.target.value}px; margin-right: ${e.target.value}px;`)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Vertical</Label>
                        <Input 
                          type="range" 
                          min="0" 
                          max="30" 
                          defaultValue="0"
                          onChange={(e) => addCssSnippet(`margin-top: ${e.target.value}px; margin-bottom: ${e.target.value}px;`)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="shadow" className="space-y-4">
                  <div>
                    <Label>Box Shadow</Label>
                    <div className="space-y-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => addCssSnippet('box-shadow: none;')}
                      >
                        None
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => addCssSnippet('box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);')}
                      >
                        Small
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs bg-blue-50"
                        onClick={() => addCssSnippet('box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);')}
                      >
                        Medium
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => addCssSnippet('box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);')}
                      >
                        Large
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => addCssSnippet('box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);')}
                      >
                        Inner Shadow
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="typography" className="space-y-4">
                  <div>
                    <Label>Font Size</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => addCssSnippet('font-size: 12px;')}
                      >Small</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs bg-blue-50"
                        onClick={() => addCssSnippet('font-size: 14px;')}
                      >Medium</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => addCssSnippet('font-size: 16px;')}
                      >Large</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Font Weight</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => addCssSnippet('font-weight: 400;')}
                      >Normal</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs bg-blue-50"
                        onClick={() => addCssSnippet('font-weight: 500;')}
                      >Medium</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => addCssSnippet('font-weight: 700;')}
                      >Bold</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Text Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input 
                        type="color" 
                        className="h-9 w-9 rounded-md border"
                        onChange={(e) => addCssSnippet(`color: ${e.target.value};`)}
                        defaultValue="#333333"
                      />
                      <Input 
                        defaultValue="#333333" 
                        className="font-mono"
                        onChange={(e) => addCssSnippet(`color: ${e.target.value};`)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 border-t pt-4">
                <h4 className="font-medium mb-2">Visualization</h4>
                <div className="border border-dashed rounded-md p-4 flex justify-center items-center">
                  <div className="relative w-32 h-12 flex-shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center border-2 border-blue-600 rounded-md bg-white shadow-sm" style={previewStyle}>
                      <span className="text-sm">CONTENT</span>
                    </div>
                    <div className="absolute -top-6 w-full text-center">
                      <span className="text-xs text-gray-500">0px</span>
                    </div>
                    <div className="absolute -bottom-6 w-full text-center">
                      <span className="text-xs text-gray-500">0px</span>
                    </div>
                    <div className="absolute -left-6 h-full flex items-center">
                      <span className="text-xs text-gray-500">8px</span>
                    </div>
                    <div className="absolute -right-6 h-full flex items-center">
                      <span className="text-xs text-gray-500">8px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
        
        <div className="border-t p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium mb-2">CSS Snippets</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {cssSnippets.map((snippet, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => addCssSnippet(snippet.css)}
                  >
                    {snippet.name}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-blue-600"
                  onClick={saveAsSnippet}
                >
                  + Save Current as Snippet
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="auto-complete" className="text-xs">Auto-Complete</Label>
              <Switch id="auto-complete" />
            </div>
          </div>
          
          {cssValue && (
            <div className="flex items-center text-xs mt-2 text-amber-500">
              <span className="mr-1">⚠️</span> Warning: Consider using a variable for consistent colors across the theme.
            </div>
          )}
        </div>
        
        <div className="border-t p-4 bg-gray-50 dark:bg-gray-800 flex justify-end space-x-2">
          <Button 
            variant="outline"
            onClick={validateCSS}
          >
            Validate
          </Button>
          <Button
            onClick={() => onUpdate({ customCSS: cssValue })}
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
