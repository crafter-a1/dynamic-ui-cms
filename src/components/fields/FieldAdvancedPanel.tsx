
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FieldAdvancedPanelProps {
  fieldType: string | null;
  initialData?: any; 
  onSave: (data: any) => void;
}

export function FieldAdvancedPanel({ fieldType, initialData = {}, onSave }: FieldAdvancedPanelProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [showButtons, setShowButtons] = useState(initialData?.showButtons || false);
  const [buttonLayout, setButtonLayout] = useState(initialData?.buttonLayout || 'horizontal');
  const [prefix, setPrefix] = useState(initialData?.prefix || '');
  const [suffix, setSuffix] = useState(initialData?.suffix || '');
  const [currency, setCurrency] = useState(initialData?.currency || 'USD');
  const [locale, setLocale] = useState(initialData?.locale || 'en-US');
  const [mask, setMask] = useState(initialData?.mask || '');
  const [customData, setCustomData] = useState(initialData?.customData ? JSON.stringify(initialData.customData, null, 2) : '{}');
  const [jsonError, setJsonError] = useState<string | null>(null);
  
  useEffect(() => {
    if (initialData) {
      setShowButtons(initialData.showButtons || false);
      setButtonLayout(initialData.buttonLayout || 'horizontal');
      setPrefix(initialData.prefix || '');
      setSuffix(initialData.suffix || '');
      setCurrency(initialData.currency || 'USD');
      setLocale(initialData.locale || 'en-US');
      setMask(initialData.mask || '');
      setCustomData(initialData.customData ? JSON.stringify(initialData.customData, null, 2) : '{}');
    }
  }, [initialData]);
  
  useEffect(() => {
    handleSave();
  }, [
    showButtons, 
    buttonLayout, 
    prefix, 
    suffix, 
    currency, 
    locale, 
    mask
  ]);
  
  const handleSave = () => {
    // Parse the custom data
    let parsedCustomData = {};
    try {
      parsedCustomData = JSON.parse(customData);
      setJsonError(null);
    } catch (error) {
      setJsonError('Invalid JSON format');
      // Still proceed with saving other changes
    }
    
    const advancedData = {
      showButtons,
      buttonLayout,
      prefix,
      suffix,
      currency,
      locale,
      mask,
      customData: parsedCustomData
    };
    
    onSave(advancedData);
  };
  
  const handleCustomDataChange = (value: string) => {
    setCustomData(value);
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (error) {
      setJsonError('Invalid JSON format');
    }
  };
  
  const renderFieldSpecificOptions = () => {
    switch (fieldType) {
      case 'number':
        return (
          <div className="space-y-4">
            <div className="flex flex-row items-center justify-between space-x-2">
              <div>
                <h3 className="text-base font-medium">Show Increment/Decrement Buttons</h3>
                <p className="text-sm text-gray-500">
                  Display buttons to increase or decrease the number value
                </p>
              </div>
              <Switch
                checked={showButtons}
                onCheckedChange={setShowButtons}
              />
            </div>
            
            {showButtons && (
              <div className="space-y-2">
                <Label htmlFor="buttonLayout">Button Layout</Label>
                <Select
                  value={buttonLayout}
                  onValueChange={setButtonLayout}
                >
                  <SelectTrigger id="buttonLayout">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horizontal">Horizontal (Left/Right)</SelectItem>
                    <SelectItem value="vertical">Vertical (Up/Down)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prefix">Prefix</Label>
                <Input 
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g. $"
                />
                <p className="text-xs text-gray-500">
                  Text to display before the value
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="suffix">Suffix</Label>
                <Input 
                  id="suffix"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="e.g. kg"
                />
                <p className="text-xs text-gray-500">
                  Text to display after the value
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={currency}
                  onValueChange={setCurrency}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="locale">Locale</Label>
                <Select
                  value={locale}
                  onValueChange={setLocale}
                >
                  <SelectTrigger id="locale">
                    <SelectValue placeholder="Select locale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="fr-FR">French</SelectItem>
                    <SelectItem value="de-DE">German</SelectItem>
                    <SelectItem value="ja-JP">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case 'mask':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mask">Input Mask</Label>
              <Input 
                id="mask"
                value={mask}
                onChange={(e) => setMask(e.target.value)}
                placeholder="e.g. 999-999-9999"
              />
              <p className="text-xs text-gray-500">
                9: numeric, a: alphabetical, *: alphanumeric
              </p>
            </div>
          </div>
        );
    
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Advanced Settings</h2>
      <p className="text-gray-500">
        Configure advanced options for your field
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="customData">Custom Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {renderFieldSpecificOptions()}
              
              {!renderFieldSpecificOptions() && (
                <p className="text-center text-gray-500 py-4">
                  No advanced settings available for this field type
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customData">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customData">Custom Data (JSON)</Label>
                <Textarea 
                  id="customData"
                  value={customData}
                  onChange={(e) => handleCustomDataChange(e.target.value)}
                  className="font-mono text-sm h-60"
                />
                
                {jsonError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {jsonError}
                    </AlertDescription>
                  </Alert>
                )}
                
                <p className="text-xs text-gray-500">
                  Add custom properties as JSON that will be saved with the field
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
