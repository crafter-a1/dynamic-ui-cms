
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  FormItem, 
  FormLabel, 
  FormControl,
  FormDescription
} from "@/components/ui/form";

export interface FieldValidationPanelProps {
  fieldType: string | null;
  initialData?: any;
  onUpdate: (data: any) => void;
}

export function FieldValidationPanel({ fieldType, initialData = {}, onUpdate }: FieldValidationPanelProps) {
  const [activeTab, setActiveTab] = useState('rules');
  const [required, setRequired] = useState(initialData.required || false);
  const [minLengthEnabled, setMinLengthEnabled] = useState(initialData.minLengthEnabled || false);
  const [maxLengthEnabled, setMaxLengthEnabled] = useState(initialData.maxLengthEnabled || false);
  const [patternEnabled, setPatternEnabled] = useState(initialData.patternEnabled || false);
  const [customValidationEnabled, setCustomValidationEnabled] = useState(initialData.customValidationEnabled || false);
  const [minLength, setMinLength] = useState(initialData.minLength || 0);
  const [maxLength, setMaxLength] = useState(initialData.maxLength || 100);
  const [pattern, setPattern] = useState(initialData.pattern || '');
  const [customMessage, setCustomMessage] = useState(initialData.customMessage || '');
  const [customValidation, setCustomValidation] = useState(initialData.customValidation || '');
  
  useEffect(() => {
    handleUpdateValidation();
  }, [
    required, minLengthEnabled, maxLengthEnabled, patternEnabled, 
    customValidationEnabled, minLength, maxLength, pattern, customMessage, customValidation
  ]);
  
  const handleUpdateValidation = () => {
    const validationData = {
      required,
      minLengthEnabled,
      maxLengthEnabled,
      patternEnabled,
      customValidationEnabled,
      minLength: parseInt(minLength as any),
      maxLength: parseInt(maxLength as any),
      pattern,
      customMessage,
      customValidation
    };
    
    onUpdate(validationData);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Field Validation Rules</h2>
      <p className="text-gray-500">
        Configure validation rules for your field
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
          <TabsTrigger value="rules" className="data-[state=active]:bg-white">Validation Rules</TabsTrigger>
          <TabsTrigger value="testing" className="data-[state=active]:bg-white">Live Testing</TabsTrigger>
          <TabsTrigger value="accessibility" className="data-[state=active]:bg-white">Accessibility</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rules" className="space-y-4">
          <Card className="border rounded-md">
            <CardContent className="p-0">
              <div className="flex flex-row items-center justify-between space-x-2 p-4 border-b">
                <div>
                  <h3 className="text-base font-medium">Required Field</h3>
                  <p className="text-sm text-gray-500">
                    Make this field mandatory for content creation
                  </p>
                </div>
                <Switch
                  checked={required}
                  onCheckedChange={setRequired}
                />
              </div>

              {fieldType === 'text' && (
                <>
                  <div className="flex flex-row items-center justify-between space-x-2 p-4 border-b">
                    <div>
                      <h3 className="text-base font-medium">Minimum Length</h3>
                      <p className="text-sm text-gray-500">
                        Set a minimum number of characters
                      </p>
                    </div>
                    <Switch
                      checked={minLengthEnabled}
                      onCheckedChange={setMinLengthEnabled}
                    />
                  </div>
                  
                  {minLengthEnabled && (
                    <div className="px-4 py-3 border-b">
                      <Input 
                        type="number" 
                        min="0" 
                        value={minLength}
                        onChange={(e) => setMinLength(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}

                  <div className="flex flex-row items-center justify-between space-x-2 p-4 border-b">
                    <div>
                      <h3 className="text-base font-medium">Maximum Length</h3>
                      <p className="text-sm text-gray-500">
                        Set a maximum number of characters
                      </p>
                    </div>
                    <Switch
                      checked={maxLengthEnabled}
                      onCheckedChange={setMaxLengthEnabled}
                    />
                  </div>

                  {maxLengthEnabled && (
                    <div className="px-4 py-3 border-b">
                      <Input 
                        type="number" 
                        min="1" 
                        value={maxLength}
                        onChange={(e) => setMaxLength(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}

                  <div className="flex flex-row items-center justify-between space-x-2 p-4 border-b">
                    <div>
                      <h3 className="text-base font-medium">Pattern Matching</h3>
                      <p className="text-sm text-gray-500">
                        Validate using a regular expression
                      </p>
                    </div>
                    <Switch
                      checked={patternEnabled}
                      onCheckedChange={setPatternEnabled}
                    />
                  </div>

                  {patternEnabled && (
                    <div className="px-4 py-3 border-b">
                      <Input 
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        placeholder="e.g. ^[a-zA-Z0-9]+$"
                        className="w-full"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="flex flex-row items-center justify-between space-x-2 p-4">
                <div>
                  <h3 className="text-base font-medium">Custom Validation</h3>
                  <p className="text-sm text-gray-500">
                    Create a custom validation rule
                  </p>
                </div>
                <Switch
                  checked={customValidationEnabled}
                  onCheckedChange={setCustomValidationEnabled}
                />
              </div>

              {customValidationEnabled && (
                <div className="px-4 py-3">
                  <Textarea 
                    value={customValidation}
                    onChange={(e) => setCustomValidation(e.target.value)}
                    placeholder="Enter custom validation logic"
                    className="w-full h-24"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use JavaScript to define a validation function
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {(minLengthEnabled || maxLengthEnabled || patternEnabled || customValidationEnabled) && (
            <FormItem>
              <FormLabel>Custom Error Message</FormLabel>
              <FormControl>
                <Textarea 
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter a custom error message to display when validation fails"
                  className="resize-y"
                />
              </FormControl>
            </FormItem>
          )}
        </TabsContent>
        
        <TabsContent value="testing">
          <div className="p-6 bg-gray-50 rounded-md text-center">
            <p className="text-gray-500">Test your validation rules on sample data</p>
            {/* Live testing UI would go here */}
          </div>
        </TabsContent>
        
        <TabsContent value="accessibility">
          <div className="p-6 bg-gray-50 rounded-md text-center">
            <p className="text-gray-500">Configure accessibility settings for this field</p>
            {/* Accessibility UI would go here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FieldValidationPanel;
