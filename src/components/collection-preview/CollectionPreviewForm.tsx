import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SaveIcon, FileJson, Copy, Code, AlertCircle } from 'lucide-react';
import { FieldRenderer } from './FieldRenderer';
import { toast } from '@/hooks/use-toast';
import { adaptFieldsForPreview } from '@/utils/fieldAdapters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import JSONEditorField from '@/components/fields/inputs/JSONEditorField';

interface CollectionPreviewFormProps {
  collectionId: string;
  fields: any[];
  isLoading: boolean;
  error: any;
  onPreviewSave?: (formData: Record<string, any>) => void;
}

export function CollectionPreviewForm({
  collectionId,
  fields,
  isLoading,
  error,
  onPreviewSave
}: CollectionPreviewFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldDefinitions, setFieldDefinitions] = useState<any[]>([]);
  const [titleField, setTitleField] = useState<string | null>(null);
  const [jsonViewOpen, setJsonViewOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (fields && fields.length > 0) {
      console.log("Original fields for preview:", JSON.stringify(fields, null, 2));

      // Make sure each field has proper appearance settings
      const fieldsWithAppearance = fields.map(field => {
        // Ensure appearance settings exist
        if (!field.appearance) {
          console.log(`Field ${field.name} has no appearance settings, initializing with defaults`);
          field.appearance = { uiVariant: 'standard' };
        }
        
        console.log(`Field ${field.name} appearance settings:`, JSON.stringify(field.appearance, null, 2));
        return field;
      });

      setFieldDefinitions(fieldsWithAppearance);

      const initialData = fields.reduce((acc: Record<string, any>, field: any) => {
        // For number fields, initialize with null instead of empty string
        if (field.type === 'number') {
          acc[field.apiId] = field.default_value !== undefined ? field.default_value : null;
        } else {
          acc[field.apiId] = field.default_value || '';
        }
        return acc;
      }, {});
      setFormData(initialData);

      const firstTextField = fields.find((f: any) => f.type === 'text');
      if (firstTextField) {
        setTitleField(firstTextField.apiId);
      }
    }
  }, [fields]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value,
    }));

    // Clear errors for this field when the value changes
    if (errors[fieldId]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldId];
        return newErrors;
      });
    }

    // Log changes for debugging
    console.log(`Field ${fieldId} changed to:`, value);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {};
    let isValid = true;

    // Validate each field based on its validation settings
    fieldDefinitions.forEach(field => {
      const fieldId = field.id || field.apiId || field.name;
      const value = formData[fieldId];
      const fieldErrors: string[] = [];

      // Required validation
      if (field.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push('This field is required');
        isValid = false;
      }

      // Skip other validations if the field is empty and not required
      if (value === undefined || value === null || value === '') {
        if (fieldErrors.length > 0) {
          newErrors[fieldId] = fieldErrors;
        }
        return;
      }

      // Min length validation
      if (field.validation?.minLengthEnabled && field.validation?.minLength && typeof value === 'string' && value.length < field.validation.minLength) {
        fieldErrors.push(`Value must be at least ${field.validation.minLength} characters`);
        isValid = false;
      }

      // Max length validation
      if (field.validation?.maxLengthEnabled && field.validation?.maxLength && typeof value === 'string' && value.length > field.validation.maxLength) {
        fieldErrors.push(`Value cannot exceed ${field.validation.maxLength} characters`);
        isValid = false;
      }

      // Pattern validation
      if (field.validation?.patternEnabled && field.validation?.pattern && typeof value === 'string') {
        try {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(value)) {
            fieldErrors.push(field.validation.message || `Value must match pattern: ${field.validation.pattern}`);
            isValid = false;
          }
        } catch (error) {
          console.error(`Invalid regex pattern: ${field.validation.pattern}`, error);
        }
      }

      // Custom validation
      if (field.validation?.customValidationEnabled && field.validation?.customValidation && typeof value !== 'undefined') {
        try {
          // Execute custom validation code safely
          const validateFn = new Function('value', `return (${field.validation.customValidation})(value)`);
          const customResult = validateFn(value);

          if (customResult !== true) {
            fieldErrors.push(field.validation.message || 'Failed custom validation');
            isValid = false;
          }
        } catch (error) {
          console.error(`Error in custom validation for field ${fieldId}:`, error);
          fieldErrors.push(`Error in custom validation: ${error}`);
          isValid = false;
        }
      }

      if (fieldErrors.length > 0) {
        newErrors[fieldId] = fieldErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate the form before submitting
    const isValid = validateForm();

    if (isValid) {
      console.log('Form data submitted:', formData);

      // If onPreviewSave is provided, call it with the form data
      if (onPreviewSave) {
        onPreviewSave(formData);
      } else {
        toast({
          title: "Data saved",
          description: "Your content has been successfully saved.",
        });
      }
    } else {
      console.log('Form validation failed:', errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive"
      });
    }

    setIsSubmitting(false);
  };

  // Render validation errors summary if there are any
  const renderValidationErrors = () => {
    const errorCount = Object.keys(errors).length;

    if (errorCount === 0) return null;

    return (
      <Alert className="bg-red-50 border-red-200 mb-4">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <AlertTitle className="text-red-700">Validation Errors</AlertTitle>
        <AlertDescription className="text-red-600">
          Please fix the following {errorCount} {errorCount === 1 ? 'error' : 'errors'} before submitting.
        </AlertDescription>
      </Alert>
    );
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="px-4 py-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="px-4 py-6">
          <div className="p-4 text-center text-red-500 border border-red-200 rounded-lg bg-red-50">
            <h3 className="font-medium">Error loading preview</h3>
            <p className="mt-2 text-sm">{(error as Error).message}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!fields || fields.length === 0) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="px-4 py-6">
          <div className="p-4 text-center">
            <p className="text-gray-500">No fields found for this collection.</p>
            <p className="text-sm mt-2 text-gray-400">Add some fields to the collection to preview content creation.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-none">
        <CardContent className="px-0">
          <form onSubmit={(e) => {
            e.preventDefault();
            setIsSubmitting(true);

            // Validate the form before submitting
            const isValid = validateForm();

            if (isValid) {
              console.log('Form data submitted:', formData);

              // If onPreviewSave is provided, call it with the form data
              if (onPreviewSave) {
                onPreviewSave(formData);
              } else {
                toast({
                  title: "Data saved",
                  description: "Your content has been successfully saved.",
                });
              }
            } else {
              console.log('Form validation failed:', errors);
              toast({
                title: "Validation Error",
                description: "Please fix the errors in the form before submitting.",
                variant: "destructive"
              });
            }

            setIsSubmitting(false);
          }} className="space-y-2">
            {Object.keys(errors).length > 0 && (
              <Alert className="bg-red-50 border-red-200 mb-4">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-700">Validation Errors</AlertTitle>
                <AlertDescription className="text-red-600">
                  Please fix the following {Object.keys(errors).length} {Object.keys(errors).length === 1 ? 'error' : 'errors'} before submitting.
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-6">
              {fieldDefinitions.map((field) => (
                <FieldRenderer
                  key={field.id}
                  field={field}
                  formData={formData}
                  titleField={titleField || ""}
                  onInputChange={(fieldId, value) => {
                    setFormData(prevData => ({
                      ...prevData,
                      [fieldId]: value,
                    }));

                    // Clear errors for this field when the value changes
                    if (errors[fieldId]) {
                      setErrors(prevErrors => {
                        const newErrors = { ...prevErrors };
                        delete newErrors[fieldId];
                        return newErrors;
                      });
                    }

                    // Log changes for debugging
                    console.log(`Field ${fieldId} changed to:`, value);
                  }}
                  errors={errors}
                />
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {Object.keys(formData).length} fields in this collection
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setJsonViewOpen(true)}
                >
                  <Code className="mr-2 h-4 w-4" />
                  View JSON
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
                    toast({
                      title: "Copied to clipboard",
                      description: "JSON data has been copied to your clipboard",
                    });
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy JSON
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Validating...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="mr-2 h-4 w-4" />
                      Save Preview
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={jsonViewOpen} onOpenChange={setJsonViewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Collection JSON Preview</DialogTitle>
            <DialogDescription>
              This is how your data will be structured in the database
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <JSONEditorField
              id="jsonPreview"
              value={formData}
              onChange={() => {}}
              rows={15}
              helpText="This is a read-only preview of your data structure"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
                toast({
                  title: "Copied to clipboard",
                  description: "JSON data has been copied to your clipboard",
                });
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy JSON
            </Button>
            <Button onClick={() => setJsonViewOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
