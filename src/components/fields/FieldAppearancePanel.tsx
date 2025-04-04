
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FormItem, 
  FormLabel, 
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Eye, Code, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface FieldAppearancePanelProps {
  form: UseFormReturn<any, any, undefined>;
  fieldType: string | null;
  initialData?: any;
  onUpdate: (data: any) => void;
}

export function FieldAppearancePanel({ 
  form, 
  fieldType, 
  initialData = {},
  onUpdate 
}: FieldAppearancePanelProps) {
  const [activeTab, setActiveTab] = useState('display');
  const [textAlign, setTextAlign] = useState(initialData?.textAlign || 'left');
  const [labelPosition, setLabelPosition] = useState(initialData?.labelPosition || 'top');
  const [labelWidth, setLabelWidth] = useState(initialData?.labelWidth || 30);
  const [floatLabel, setFloatLabel] = useState(initialData?.floatLabel || false);
  const [filled, setFilled] = useState(initialData?.filled || false);
  const [showBorder, setShowBorder] = useState(initialData?.showBorder !== false);
  const [showBackground, setShowBackground] = useState(initialData?.showBackground || false);
  const [roundedCorners, setRoundedCorners] = useState(initialData?.roundedCorners || 'medium');
  const [fieldSize, setFieldSize] = useState(initialData?.fieldSize || 'medium');
  const [labelSize, setLabelSize] = useState(initialData?.labelSize || 'medium');
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});
  const [previewLabelStyle, setPreviewLabelStyle] = useState<React.CSSProperties>({});
  const [previewInputStyle, setPreviewInputStyle] = useState<React.CSSProperties>({});
  const [customCss, setCustomCss] = useState(initialData?.customCss || '');
  const [selectedVariation, setSelectedVariation] = useState(initialData?.uiVariation || 'default');
  const [isDarkMode, setIsDarkMode] = useState(initialData?.isDarkMode || false);
  const [previewState, setPreviewState] = useState('default');
  
  // Predefined UI variations
  const uiVariations = [
    { id: 'default', name: 'Default', styles: {} },
    { id: 'filled', name: 'Filled', styles: { filled: true, showBorder: false, showBackground: true, roundedCorners: 'small' } },
    { id: 'outlined', name: 'Outlined', styles: { filled: false, showBorder: true, showBackground: false, roundedCorners: 'medium' } },
    { id: 'floating', name: 'Floating Label', styles: { floatLabel: true, filled: true, showBorder: false, roundedCorners: 'none' } },
    { id: 'minimal', name: 'Minimal', styles: { showBorder: false, showBackground: false, roundedCorners: 'large', textAlign: 'center' } },
    { id: 'compact', name: 'Compact', styles: { fieldSize: 'small', labelSize: 'small', roundedCorners: 'small' } },
  ];

  // Update settings when any option changes
  const updateSettings = () => {
    const settings = {
      textAlign,
      labelPosition,
      labelWidth,
      floatLabel,
      filled,
      showBorder,
      showBackground,
      roundedCorners,
      fieldSize,
      labelSize,
      customCss,
      uiVariation: selectedVariation,
      isDarkMode
    };
    
    onUpdate(settings);
    updatePreviewStyles(settings);
  };
  
  // Update preview styles based on settings
  const updatePreviewStyles = (settings: any) => {
    // Label styles
    const labelStyle: React.CSSProperties = {
      fontSize: settings.labelSize === 'small' ? '0.875rem' : 
               settings.labelSize === 'medium' ? '1rem' : '1.125rem',
      marginBottom: settings.labelPosition === 'top' ? '0.5rem' : '0',
      width: settings.labelPosition === 'left' ? `${settings.labelWidth}%` : 'auto',
      textAlign: settings.textAlign as 'left' | 'center' | 'right',
      color: settings.isDarkMode ? '#fff' : '#333',
      fontWeight: settings.labelSize === 'large' ? 600 : 500,
      transition: 'all 0.2s ease'
    };
    
    // Input styles
    const inputStyle: React.CSSProperties = {
      backgroundColor: settings.filled ? (settings.isDarkMode ? '#374151' : '#f1f5f9') : 'transparent',
      border: settings.showBorder ? (settings.isDarkMode ? '1px solid #4b5563' : '1px solid #cbd5e1') : 'none',
      borderRadius: settings.roundedCorners === 'none' ? '0' : 
                   settings.roundedCorners === 'small' ? '0.25rem' : 
                   settings.roundedCorners === 'medium' ? '0.375rem' : '0.5rem',
      padding: settings.fieldSize === 'small' ? '0.375rem 0.5rem' : 
              settings.fieldSize === 'medium' ? '0.5rem 0.75rem' : '0.75rem 1rem',
      fontSize: settings.fieldSize === 'small' ? '0.875rem' : 
               settings.fieldSize === 'medium' ? '1rem' : '1.125rem',
      width: settings.labelPosition === 'left' ? `${100 - settings.labelWidth}%` : '100%',
      color: settings.isDarkMode ? '#e5e7eb' : '#333',
      boxShadow: settings.floatLabel ? (settings.isDarkMode ? '0 1px 2px rgba(0,0,0,0.4)' : '0 1px 2px rgba(0,0,0,0.1)') : 'none',
      transition: 'all 0.2s ease'
    };
    
    // Apply states for preview
    if (previewState === 'hover') {
      inputStyle.borderColor = settings.isDarkMode ? '#6b7280' : '#94a3b8';
      inputStyle.backgroundColor = settings.filled 
        ? (settings.isDarkMode ? '#4b5563' : '#e2e8f0') 
        : (settings.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)');
    } else if (previewState === 'focus') {
      inputStyle.borderColor = settings.isDarkMode ? '#60a5fa' : '#3b82f6';
      inputStyle.boxShadow = `0 0 0 2px ${settings.isDarkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`;
      inputStyle.outline = 'none';
    } else if (previewState === 'disabled') {
      inputStyle.backgroundColor = settings.isDarkMode ? '#1f2937' : '#f8fafc';
      inputStyle.color = settings.isDarkMode ? '#6b7280' : '#94a3b8';
      inputStyle.cursor = 'not-allowed';
      inputStyle.opacity = '0.7';
    } else if (previewState === 'error') {
      inputStyle.borderColor = '#ef4444';
      inputStyle.boxShadow = `0 0 0 2px rgba(239, 68, 68, 0.2)`;
    }
    
    // Container style
    const containerStyle: React.CSSProperties = {
      display: settings.labelPosition === 'left' ? 'flex' : 'block',
      alignItems: settings.labelPosition === 'left' ? 'center' : 'flex-start',
      backgroundColor: settings.isDarkMode ? '#1f2937' : '#ffffff',
      padding: '1rem',
      borderRadius: '0.5rem',
      transition: 'all 0.2s ease'
    };
    
    setPreviewLabelStyle(labelStyle);
    setPreviewInputStyle(inputStyle);
    setPreviewStyle(containerStyle);
  };
  
  // Effect to update preview on initial load
  useEffect(() => {
    updateSettings();
  }, []);
  
  // Handle changes to any setting
  const handleSettingChange = (setting: string, value: any) => {
    switch (setting) {
      case 'textAlign':
        setTextAlign(value);
        break;
      case 'labelPosition':
        setLabelPosition(value);
        break;
      case 'labelWidth':
        setLabelWidth(value);
        break;
      case 'floatLabel':
        setFloatLabel(value);
        break;
      case 'filled':
        setFilled(value);
        break;
      case 'showBorder':
        setShowBorder(value);
        break;
      case 'showBackground':
        setShowBackground(value);
        break;
      case 'roundedCorners':
        setRoundedCorners(value);
        break;
      case 'fieldSize':
        setFieldSize(value);
        break;
      case 'labelSize':
        setLabelSize(value);
        break;
      case 'customCss':
        setCustomCss(value);
        break;
      case 'isDarkMode':
        setIsDarkMode(value);
        break;
      default:
        break;
    }
    
    // Update parent after state changes
    setTimeout(() => {
      updateSettings();
    }, 0);
  };

  // Apply UI variation
  const applyUiVariation = (variationId: string) => {
    const variation = uiVariations.find(v => v.id === variationId);
    if (variation) {
      setSelectedVariation(variationId);
      
      if (variation.styles.filled !== undefined) setFilled(variation.styles.filled);
      if (variation.styles.showBorder !== undefined) setShowBorder(variation.styles.showBorder);
      if (variation.styles.showBackground !== undefined) setShowBackground(variation.styles.showBackground);
      if (variation.styles.roundedCorners !== undefined) setRoundedCorners(variation.styles.roundedCorners);
      if (variation.styles.floatLabel !== undefined) setFloatLabel(variation.styles.floatLabel);
      if (variation.styles.textAlign !== undefined) setTextAlign(variation.styles.textAlign);
      if (variation.styles.fieldSize !== undefined) setFieldSize(variation.styles.fieldSize);
      if (variation.styles.labelSize !== undefined) setLabelSize(variation.styles.labelSize);
      
      setTimeout(() => {
        updateSettings();
      }, 0);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
        </TabsList>
        
        <TabsContent value="display" className="space-y-4">
          <FormItem>
            <FormLabel>UI Variations</FormLabel>
            <FormDescription>
              Choose a predefined style variation for the field
            </FormDescription>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {uiVariations.map((variation) => (
                <Button
                  key={variation.id}
                  type="button"
                  variant={selectedVariation === variation.id ? "default" : "outline"}
                  className={cn(
                    "h-auto py-2 px-3 text-sm font-medium",
                    selectedVariation === variation.id && "border-blue-600"
                  )}
                  onClick={() => applyUiVariation(variation.id)}
                >
                  {variation.name}
                </Button>
              ))}
            </div>
          </FormItem>
          
          <FormItem>
            <FormLabel>Text Alignment</FormLabel>
            <FormControl>
              <div className="flex border rounded-md p-1 gap-1">
                <button
                  type="button"
                  onClick={() => handleSettingChange('textAlign', 'left')}
                  className={cn(
                    "flex-1 py-2 text-center text-sm font-medium rounded-sm",
                    textAlign === 'left' ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
                  )}
                >
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => handleSettingChange('textAlign', 'center')}
                  className={cn(
                    "flex-1 py-2 text-center text-sm font-medium rounded-sm",
                    textAlign === 'center' ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
                  )}
                >
                  Center
                </button>
                <button
                  type="button"
                  onClick={() => handleSettingChange('textAlign', 'right')}
                  className={cn(
                    "flex-1 py-2 text-center text-sm font-medium rounded-sm",
                    textAlign === 'right' ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
                  )}
                >
                  Right
                </button>
              </div>
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Label Position</FormLabel>
            <FormControl>
              <Select
                value={labelPosition}
                onValueChange={(value) => handleSettingChange('labelPosition', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select label position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
          
          {labelPosition === 'left' && (
            <FormItem>
              <FormLabel>Label Width (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="10"
                  max="50"
                  value={labelWidth}
                  onChange={(e) => handleSettingChange('labelWidth', parseInt(e.target.value))}
                  className="w-full"
                />
              </FormControl>
              <FormDescription>
                Percentage of container width for the label
              </FormDescription>
            </FormItem>
          )}
          
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
            <div>
              <FormLabel>Float Label</FormLabel>
              <FormDescription>
                Label floats inside input when focused
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={floatLabel}
                onCheckedChange={(checked) => handleSettingChange('floatLabel', checked)}
              />
            </FormControl>
          </FormItem>
          
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
            <div>
              <FormLabel>Filled Style</FormLabel>
              <FormDescription>
                Use filled style for input fields
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={filled}
                onCheckedChange={(checked) => handleSettingChange('filled', checked)}
              />
            </FormControl>
          </FormItem>
        </TabsContent>
        
        <TabsContent value="spacing" className="space-y-4">
          <FormItem>
            <FormLabel>Field Size</FormLabel>
            <FormControl>
              <Select
                value={fieldSize}
                onValueChange={(value) => handleSettingChange('fieldSize', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Label Size</FormLabel>
            <FormControl>
              <Select
                value={labelSize}
                onValueChange={(value) => handleSettingChange('labelSize', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select label size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Corner Rounding</FormLabel>
            <FormControl>
              <Select
                value={roundedCorners}
                onValueChange={(value) => handleSettingChange('roundedCorners', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select corner style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
          
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
            <div>
              <FormLabel>Show Border</FormLabel>
              <FormDescription>
                Display border around input fields
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={showBorder}
                onCheckedChange={(checked) => handleSettingChange('showBorder', checked)}
              />
            </FormControl>
          </FormItem>
          
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
            <div>
              <FormLabel>Show Background</FormLabel>
              <FormDescription>
                Display background for input fields
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={showBackground}
                onCheckedChange={(checked) => handleSettingChange('showBackground', checked)}
              />
            </FormControl>
          </FormItem>
        </TabsContent>
        
        <TabsContent value="extras" className="space-y-4">
          <FormItem>
            <FormLabel>Custom CSS</FormLabel>
            <FormControl>
              <Textarea
                value={customCss}
                onChange={(e) => handleSettingChange('customCss', e.target.value)}
                placeholder="/* Add your custom CSS here */&#10;.my-field {&#10;  border-color: #3b82f6;&#10;}"
                className="font-mono text-sm h-32"
              />
            </FormControl>
            <FormDescription>
              Add custom CSS to style the field directly
            </FormDescription>
          </FormItem>
          
          {fieldType === 'text' && (
            <>
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
                <div>
                  <FormLabel>Show Character Count</FormLabel>
                  <FormDescription>
                    Display remaining character count
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={form.watch('ui_options.showCharCount') || false}
                    onCheckedChange={(checked) => {
                      form.setValue('ui_options.showCharCount', checked);
                    }}
                  />
                </FormControl>
              </FormItem>
            </>
          )}
          
          {fieldType === 'textarea' && (
            <>
              <FormItem>
                <FormLabel>Textarea Rows</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="2"
                    max="20"
                    value={form.watch('ui_options.rows') || 3}
                    onChange={(e) => {
                      form.setValue('ui_options.rows', parseInt(e.target.value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Number of visible rows in the textarea
                </FormDescription>
              </FormItem>
              
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
                <div>
                  <FormLabel>Auto Resize</FormLabel>
                  <FormDescription>
                    Automatically resize based on content
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={form.watch('ui_options.autoResize') || false}
                    onCheckedChange={(checked) => {
                      form.setValue('ui_options.autoResize', checked);
                    }}
                  />
                </FormControl>
              </FormItem>
            </>
          )}
          
          <FormItem>
            <FormLabel>Custom CSS Class</FormLabel>
            <FormControl>
              <Input
                value={form.watch('ui_options.customClass') || ''}
                onChange={(e) => {
                  form.setValue('ui_options.customClass', e.target.value);
                }}
                placeholder="E.g., my-custom-input"
              />
            </FormControl>
            <FormDescription>
              Add custom CSS classes to the field
            </FormDescription>
          </FormItem>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-6 border rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-3 border-b bg-gray-50">
          <h3 className="text-sm font-medium">Live Preview</h3>
          <div className="flex gap-2">
            <div className="border rounded-md flex">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn("rounded-r-none", previewState === 'default' && "bg-gray-200")}
                onClick={() => setPreviewState('default')}
              >
                Default
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn("rounded-none border-x border-gray-200", previewState === 'hover' && "bg-gray-200")}
                onClick={() => setPreviewState('hover')}
              >
                Hover
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn("rounded-none border-r border-gray-200", previewState === 'focus' && "bg-gray-200")}
                onClick={() => setPreviewState('focus')}
              >
                Focus
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn("rounded-none border-r border-gray-200", previewState === 'disabled' && "bg-gray-200")}
                onClick={() => setPreviewState('disabled')}
              >
                Disabled
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn("rounded-l-none", previewState === 'error' && "bg-gray-200")}
                onClick={() => setPreviewState('error')}
              >
                Error
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={() => handleSettingChange('isDarkMode', !isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <div style={previewStyle}>
            <label 
              className={cn("block", previewState === 'error' && "text-red-500")}
              style={previewLabelStyle}
            >
              Field Label
            </label>
            <input
              type="text"
              className={cn(
                "border",
                previewState === 'disabled' && "cursor-not-allowed opacity-70",
                previewState === 'error' && "border-red-500"
              )}
              placeholder="Field placeholder"
              style={previewInputStyle}
              disabled={previewState === 'disabled'}
            />
            
            {previewState === 'error' && (
              <p className="mt-1 text-xs text-red-500">This field has an error</p>
            )}
            
            {customCss && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <p>Custom CSS Applied</p>
                <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto text-xs">
                  {customCss}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FieldAppearancePanel;
