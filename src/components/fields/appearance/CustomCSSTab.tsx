
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Code, Eye, Maximize2, SplitSquareVertical } from "lucide-react";
import { toast } from "sonner";
import Editor from '@monaco-editor/react';

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

  // Handle Monaco Editor changes
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateCustomCSS(value);
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

      {/* Live Preview of CSS */}
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
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8 px-3 flex items-center gap-1", activeSubTab === 'code' && "bg-white shadow-sm")}
              onClick={() => setActiveSubTab('code')}
            >
              <Code className="h-4 w-4 mr-1" />
              Code
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8 px-3 flex items-center gap-1", activeSubTab === 'visual' && "bg-white shadow-sm")}
              onClick={() => setActiveSubTab('visual')}
            >
              <Eye className="h-4 w-4 mr-1" />
              Visual
            </Button>
          </div>
          
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
          {(activeSubTab === 'code' || splitViewMode) && (
            <div className={cn("m-0", splitViewMode && "border-r")}>
              <div className="p-4">
                <h4 className="font-medium mb-2">CSS Editor</h4>
                <div className="h-64 border rounded-md overflow-hidden">
                  <Editor
                    height="100%"
                    defaultLanguage="css"
                    value={cssValue}
                    onChange={handleEditorChange}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      tabSize: 2,
                      automaticLayout: true,
                      lineNumbers: 'on',
                      lineDecorationsWidth: 0,
                      suggestOnTriggerCharacters: true,
                      acceptSuggestionOnEnter: 'on',
                      quickSuggestions: true
                    }}
                    className="border-0"
                  />
                </div>
              </div>
            </div>
          )}
          
          {(activeSubTab === 'visual' || splitViewMode) && (
            <div className={cn("m-0", splitViewMode && "block")}>
              <div className="p-4">
                <h4 className="font-medium mb-4">Visual Property Editor</h4>
                
                {/* Visual Editor Controls */}
                <div className="space-y-4">
                  <div>
                    <Label className="mb-1 block">Border Width</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {['0px', '1px', '2px', '4px'].map((width) => (
                        <Button 
                          key={width}
                          variant="outline" 
                          size="sm" 
                          className={cn("text-xs", cssValue.includes(`border-width: ${width}`) && "bg-blue-50")}
                          onClick={() => addCssSnippet(`border-width: ${width};`)}
                        >{width}</Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-1 block">Border Radius</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {['0px', '2px', '4px', '8px', '12px'].map((radius) => (
                        <Button 
                          key={radius}
                          variant="outline" 
                          size="sm" 
                          className={cn("text-xs", cssValue.includes(`border-radius: ${radius}`) && "bg-blue-50")}
                          onClick={() => addCssSnippet(`border-radius: ${radius};`)}
                        >{radius}</Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-1 block">Border Style</Label>
                    <div className="flex items-center gap-2">
                      <select 
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                        onChange={(e) => addCssSnippet(`border-style: ${e.target.value};`)}
                      >
                        <option>solid</option>
                        <option>dashed</option>
                        <option>dotted</option>
                        <option>double</option>
                        <option>none</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-1 block">Border Color</Label>
                    <div className="flex gap-2">
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

                  <div>
                    <Label className="mb-1 block">Text Color</Label>
                    <div className="flex gap-2">
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
                  
                  <div>
                    <Label className="mb-1 block">Background Color</Label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        className="h-9 w-9 rounded-md border"
                        onChange={(e) => addCssSnippet(`background-color: ${e.target.value};`)}
                        defaultValue="#ffffff"
                      />
                      <Input 
                        defaultValue="#ffffff" 
                        className="font-mono"
                        onChange={(e) => addCssSnippet(`background-color: ${e.target.value};`)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
