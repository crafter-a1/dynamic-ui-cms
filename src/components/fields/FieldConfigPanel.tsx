
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
import { FieldValidationPanel } from './FieldValidationPanel';
import { FieldAppearancePanel } from './FieldAppearancePanel';
import { FieldAdvancedPanel } from './FieldAdvancedPanel';

// Define a dynamic schema based on field type
const getFieldSchema = (fieldType: string | null) => {
  const baseSchema = {
    name: z.string().min(2, { message: "Field name must be at least 2 characters" }),
    description: z.string().optional(),
    helpText: z.string().optional(),
    required: z.boolean().default(false),
    ui_options: z.object({
      placeholder: z.string().optional(),
      help_text: z.string().optional(),
      display_mode: z.string().optional(),
      showCharCount: z.boolean().optional(),
      width: z.number().optional(),
      hidden_in_forms: z.boolean().optional(),
    }).optional().default({}),
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
      ui_options: {
        placeholder: '',
        help_text: '',
        display_mode: 'default',
        showCharCount: false,
        width: 100,
        hidden_in_forms: false
      }
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

  const handleUpdateAdvanced = (advancedData: any) => {
    // Forward advanced settings to parent component
    onUpdateAdvanced(advancedData);
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
            <FieldValidationPanel />
          </TabsContent>
          
          <TabsContent value="appearance">
            <FieldAppearancePanel form={form} fieldType={fieldType} />
          </TabsContent>
          
          <TabsContent value="advanced">
            <FieldAdvancedPanel 
              fieldType={fieldType}
              initialData={fieldData?.advanced}
              onSave={handleUpdateAdvanced}
            />
          </TabsContent>
        </Tabs>
        
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
      </form>
    </Form>
  );
}

export default FieldConfigPanel;
