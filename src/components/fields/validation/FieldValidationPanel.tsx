import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { Check, X, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export interface FieldValidationPanelProps {
  fieldType: string | null;
  initialData?: any;
  onUpdate: (data: any) => void;
}

export function FieldValidationPanel({ fieldType, initialData = {}, onUpdate }: FieldValidationPanelProps) {
  const [activeTab, setActiveTab] = useState('rules');
  const [required, setRequired] = useState(initialData?.required || false);
  const [minLengthEnabled, setMinLengthEnabled] = useState(initialData?.minLengthEnabled || false);
  const [maxLengthEnabled, setMaxLengthEnabled] = useState(initialData?.maxLengthEnabled || false);
  const [patternEnabled, setPatternEnabled] = useState(initialData?.patternEnabled || false);
  const [customValidationEnabled, setCustomValidationEnabled] = useState(initialData?.customValidationEnabled || false);
  const [minLength, setMinLength] = useState(initialData?.minLength || 0);
  const [maxLength, setMaxLength] = useState(initialData?.maxLength || 100);
  const [pattern, setPattern] = useState(initialData?.pattern || '');
  const [customMessage, setCustomMessage] = useState(initialData?.customMessage || '');
  const [customValidation, setCustomValidation] = useState(initialData?.customValidation || '');

  // Live Testing
  const [testValue, setTestValue] = useState('');
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Accessibility
  const [ariaRequired, setAriaRequired] = useState(initialData?.ariaRequired || false);
  const [ariaDescribedBy, setAriaDescribedBy] = useState(initialData?.ariaDescribedBy || '');
  const [ariaLabel, setAriaLabel] = useState(initialData?.ariaLabel || '');
  const [ariaLabelledBy, setAriaLabelledBy] = useState(initialData?.ariaLabelledBy || '');
  const [ariaInvalid, setAriaInvalid] = useState(initialData?.ariaInvalid || false);
  const [autocomplete, setAutocomplete] = useState(initialData?.autocomplete || '');

  useEffect(() => {
    if (initialData) {
      setRequired(initialData.required || false);
      setMinLengthEnabled(initialData.minLengthEnabled || false);
      setMaxLengthEnabled(initialData.maxLengthEnabled || false);
      setPatternEnabled(initialData.patternEnabled || false);
      setCustomValidationEnabled(initialData.customValidationEnabled || false);
      setMinLength(initialData.minLength || 0);
      setMaxLength(initialData.maxLength || 100);
      setPattern(initialData.pattern || '');
      setCustomMessage(initialData.customMessage || '');
      setCustomValidation(initialData.customValidation || '');
      setAriaRequired(initialData.ariaRequired || false);
      setAriaDescribedBy(initialData.ariaDescribedBy || '');
      setAriaLabel(initialData.ariaLabel || '');
      setAriaLabelledBy(initialData.ariaLabelledBy || '');
      setAriaInvalid(initialData.ariaInvalid || false);
      setAutocomplete(initialData.autocomplete || '');
    }
  }, [initialData]);

  useEffect(() => {
    handleUpdateValidation();
  }, [
    required, minLengthEnabled, maxLengthEnabled, patternEnabled,
    customValidationEnabled, minLength, maxLength, pattern, customMessage, customValidation,
    ariaRequired, ariaDescribedBy, ariaLabel, ariaLabelledBy, ariaInvalid, autocomplete
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
      customValidation,
      ariaRequired,
      ariaDescribedBy,
      ariaLabel,
      ariaLabelledBy,
      ariaInvalid,
      autocomplete
    };

    onUpdate(validationData);
  };

  const testValidation = () => {
    const errors: string[] = [];
    let isValid = true;

    // Test required
    if (required && !testValue.trim()) {
      errors.push("This field is required");
      isValid = false;
    }

    // Test min length
    if (minLengthEnabled && testValue.length < minLength) {
      errors.push(`Value must be at least ${minLength} characters`);
      isValid = false;
    }

    // Test max length
    if (maxLengthEnabled && testValue.length > maxLength) {
      errors.push(`Value cannot exceed ${maxLength} characters`);
      isValid = false;
    }

    // Test pattern
    if (patternEnabled && pattern && !new RegExp(pattern).test(testValue)) {
      errors.push(customMessage || `Value must match pattern: ${pattern}`);
      isValid = false;
    }

    // Test custom validation
    if (customValidationEnabled && customValidation) {
      try {
        // Execute custom validation code safely
        const validateFn = new Function('value', `return (${customValidation})(value)`);
        const customResult = validateFn(testValue);

        if (customResult !== true) {
          errors.push(customMessage || "Failed custom validation");
          isValid = false;
        }
      } catch (error) {
        errors.push(`Error in custom validation: ${error}`);
        isValid = false;
      }
    }

    setValidationResult(isValid ? 'valid' : 'invalid');
    setValidationErrors(errors);
  };

  const renderValidationStatus = () => {
    if (validationResult === null) {
      return null;
    }

    if (validationResult === 'valid') {
      return (
        <Alert className="bg-green-50 border-green-200 mt-4">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Validation Passed</AlertTitle>
          <AlertDescription className="text-green-600">
            The input value passes all validation rules.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="bg-red-50 border-red-200 mt-4">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <AlertTitle className="text-red-700">Validation Failed</AlertTitle>
        <AlertDescription className="text-red-600">
          <ul className="list-disc pl-5 mt-2">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
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

              {fieldType && (
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

              <div className="flex flex-row items-center justify-between space-x-2 p-4 border-b">
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
                    placeholder="(value) => { return value.length > 0; }"
                    className="w-full h-24"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use JavaScript to define a validation function that returns true if valid or false if invalid
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

        <TabsContent value="testing" className="space-y-4">
          <Card className="border rounded-md">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-base font-medium">Test your validation rules</h3>
              <p className="text-sm text-gray-500">Enter test data to see if it passes your validation rules</p>

              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="test-input">Test Input</Label>
                  <Input
                    id="test-input"
                    value={testValue}
                    onChange={(e) => setTestValue(e.target.value)}
                    placeholder="Enter test value..."
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Current Validation Rules:</h4>
                  <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                    {required && (
                      <li>Required field</li>
                    )}
                    {minLengthEnabled && (
                      <li>Minimum length: {minLength} characters</li>
                    )}
                    {maxLengthEnabled && (
                      <li>Maximum length: {maxLength} characters</li>
                    )}
                    {patternEnabled && pattern && (
                      <li>Pattern: {pattern}</li>
                    )}
                    {customValidationEnabled && customValidation && (
                      <li>Custom validation: (custom function)</li>
                    )}
                    {!required && !minLengthEnabled && !maxLengthEnabled && !patternEnabled && !customValidationEnabled && (
                      <li>No validation rules configured</li>
                    )}
                  </ul>
                </div>

                <Button
                  onClick={testValidation}
                  className="w-full"
                  variant="secondary"
                >
                  Test Validation
                </Button>

                {renderValidationStatus()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card className="border rounded-md">
            <CardContent className="p-4 space-y-6">
              <div className="space-y-2">
                <h3 className="text-base font-medium">Accessibility Attributes</h3>
                <p className="text-sm text-gray-500">Configure ARIA attributes for this field</p>
              </div>

              <div className="flex flex-row items-center justify-between space-x-2 border-b pb-4">
                <div>
                  <h3 className="text-sm font-medium">Use aria-required attribute</h3>
                  <p className="text-xs text-gray-500">
                    Explicitly mark this field as required for assistive technologies
                  </p>
                </div>
                <Switch
                  checked={ariaRequired}
                  onCheckedChange={setAriaRequired}
                />
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="aria-describedby">aria-describedby</Label>
                <Input
                  id="aria-describedby"
                  value={ariaDescribedBy}
                  onChange={(e) => setAriaDescribedBy(e.target.value)}
                  placeholder="Element ID that describes this field"
                />
                <p className="text-xs text-gray-500">
                  Links this field to its description for screen readers
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aria-label">aria-label</Label>
                <Input
                  id="aria-label"
                  value={ariaLabel}
                  onChange={(e) => setAriaLabel(e.target.value)}
                  placeholder="Label for this field"
                />
                <p className="text-xs text-gray-500">
                  Provides an accessible name for the field when a visible label isn't available
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aria-labelledby">aria-labelledby</Label>
                <Input
                  id="aria-labelledby"
                  value={ariaLabelledBy}
                  onChange={(e) => setAriaLabelledBy(e.target.value)}
                  placeholder="Element ID that labels this field"
                />
                <p className="text-xs text-gray-500">
                  References the ID of an element that labels this field
                </p>
              </div>

              <div className="flex flex-row items-center justify-between space-x-2 border-t pt-4">
                <div>
                  <h3 className="text-sm font-medium">Use aria-invalid attribute</h3>
                  <p className="text-xs text-gray-500">
                    Indicates that the field has an invalid value
                  </p>
                </div>
                <Switch
                  checked={ariaInvalid}
                  onCheckedChange={setAriaInvalid}
                />
              </div>

              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="autocomplete">HTML autocomplete attribute</Label>
                <Input
                  id="autocomplete"
                  value={autocomplete}
                  onChange={(e) => setAutocomplete(e.target.value)}
                  placeholder="e.g., name, email, tel"
                />
                <p className="text-xs text-gray-500">
                  Helps browsers autofill information correctly (e.g., "name", "email")
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FieldValidationPanel;
