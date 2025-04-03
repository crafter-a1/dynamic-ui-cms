
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define a dynamic schema based on field type
const getFieldSchema = (fieldType: string | null) => {
  const baseSchema = {
    name: z.string().min(2, { message: "Field name must be at least 2 characters" }),
    description: z.string().optional(),
    helpText: z.string().optional(),
    required: z.boolean().default(false),
  };

  switch (fieldType) {
    case 'text':
      return z.object({
        ...baseSchema,
        defaultValue: z.string().optional(),
        keyFilter: z.enum(['none', 'letters', 'numbers', 'alphanumeric']).optional(),
      });
    case 'number':
      return z.object({
        ...baseSchema,
        defaultValue: z.number().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
      });
    default:
      return z.object(baseSchema);
  }
};

interface FieldConfigPanelProps {
  fieldType: string | null;
  fieldData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  onUpdateAdvanced: (data: any) => void;
}

export function FieldConfigPanel({ 
  fieldType, 
  fieldData, 
  onSave, 
  onCancel, 
  onUpdateAdvanced 
}: FieldConfigPanelProps) {
  const [activeTab, setActiveTab] = useState('general');
  
  const fieldSchema = getFieldSchema(fieldType);
  
  const form = useForm({
    resolver: zodResolver(fieldSchema),
    defaultValues: fieldData || {
      name: '',
      description: '',
      helpText: '',
      required: false,
      defaultValue: undefined,
    }
  });

  const handleSubmit = (values: any) => {
    // Prepare advanced settings
    const advancedSettings = {
      keyFilter: values.keyFilter,
      min: values.min,
      max: values.max,
    };
    
    onUpdateAdvanced(advancedSettings);
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter field name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter field description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="helpText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Help Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Additional help text" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide additional context or guidance for this field
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Required Field</FormLabel>
                      <FormDescription>
                        Make this field mandatory for content creation
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="validation">
            {/* Validation specific fields */}
            <div className="space-y-4">
              {fieldType === 'text' && (
                <FormField
                  control={form.control}
                  name="keyFilter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Filter</FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          className="w-full p-2 border rounded"
                        >
                          <option value="none">No Restriction</option>
                          <option value="letters">Letters Only</option>
                          <option value="numbers">Numbers Only</option>
                          <option value="alphanumeric">Alphanumeric</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Restrict input to specific character types
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="appearance">
            {/* Appearance specific fields */}
            <div className="space-y-4">
              {/* Placeholder for appearance settings */}
              <p className="text-muted-foreground">No appearance settings available for this field type.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            {/* Advanced settings */}
            <div className="space-y-4">
              {fieldType === 'number' && (
                <>
                  <FormField
                    control={form.control}
                    name="min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Minimum allowed value" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Maximum allowed value" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
          </TabsContent>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-4 py-2 text-sm border rounded"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Field
            </button>
          </div>
        </Tabs>
      </form>
    </Form>
  );
}

export default FieldConfigPanel;

