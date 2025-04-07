import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { FieldAdvancedTab } from './FieldAdvancedTab'; 
import { FieldAppearancePanel } from './appearance/FieldAppearancePanel';
import { InputTextField } from './inputs/InputTextField';
import { NumberInputField } from './inputs/NumberInputField';
import { PasswordInputField } from './inputs/PasswordInputField';
import { MaskInputField } from './inputs/MaskInputField';
import { OTPInputField } from './inputs/OTPInputField';
import { AutocompleteInputField } from './inputs/AutocompleteInputField';
import { BlockEditorField } from './inputs/BlockEditorField';
import { WysiwygEditorField } from './inputs/WysiwygEditorField';
import { MarkdownEditorField } from './inputs/MarkdownEditorField';
import { TagsInputField } from './inputs/TagsInputField';
import { SlugInputField } from './inputs/SlugInputField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ValidationSettings } from '@/services/CollectionService';
import { FieldAdvancedPanel } from './FieldAdvancedPanel';

interface AppearanceSettings {
  floatLabel?: boolean;
  filled?: boolean;
  width?: number;
  display_mode?: string;
  showCharCount?: boolean;
  customClass?: string;
  customCss?: string;
  textAlign?: string;
  labelPosition?: string;
  labelWidth?: number;
  showBorder?: boolean;
  showBackground?: boolean;
  roundedCorners?: string;
  fieldSize?: string;
  labelSize?: string;
  uiVariant?: string;
  isDarkMode?: boolean;
}

interface AdvancedSettings {
  showButtons?: boolean;
  buttonLayout?: 'horizontal' | 'vertical';
  prefix?: string;
  suffix?: string;
  currency?: string;
  locale?: string;
  mask?: string;
  customData?: Record<string, any>;
}

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
    case 'password':
      return z.object({
        ...baseSchema,
        showToggle: z.boolean().optional().default(true),
      });
    case 'mask':
      return z.object({
        ...baseSchema,
        mask: z.string().optional(),
      });
    case 'otp':
      return z.object({
        ...baseSchema,
        length: z.number().min(4).max(12).optional().default(6),
      });
    case 'tags':
      return z.object({
        ...baseSchema,
        maxTags: z.number().optional().default(10),
      });
    case 'slug':
      return z.object({
        ...baseSchema,
        prefix: z.string().optional(),
        suffix: z.string().optional(),
      });
    case 'markdown':
    case 'textarea':
      return z.object({
        ...baseSchema,
        rows: z.number().optional().default(8),
      });
    case 'blockeditor':
    case 'wysiwyg':
      return z.object({
        ...baseSchema,
        minHeight: z.string().optional().default('200px'),
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
  const [validationSettings, setValidationSettings] = useState<ValidationSettings>({});
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({});
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({});
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (fieldData) {
      setValidationSettings(fieldData.validation || {});
      setAppearanceSettings(fieldData.appearance || {});
      setAdvancedSettings(fieldData.advanced || {});
    }
  }, [fieldData]);
  
  const fieldSchema = getFieldSchema(fieldType);
  
  const form = useForm({
    resolver: zodResolver(fieldSchema),
    defaultValues: fieldData || {
      name: '',
      description: '',
      helpText: '',
      required: false,
      defaultValue: fieldType === 'number' ? 0 : '',
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

  useEffect(() => {
    if (fieldData) {
      form.reset({
        ...fieldData,
        name: fieldData.name || '',
        description: fieldData.description || '',
        helpText: fieldData.helpText || '',
        required: fieldData.required || false,
        ui_options: fieldData.ui_options || {
          placeholder: '',
          help_text: '',
          display_mode: 'default',
          showCharCount: false,
          width: 100,
          hidden_in_forms: false
        }
      });
    }
  }, [fieldData, form]);

  const handleSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      const combinedData = {
        ...values,
        validation: validationSettings,
        appearance: appearanceSettings,
        advanced: advancedSettings,
      };
      
      await onSave(combinedData);
      
      toast({
        title: fieldData ? 'Field updated' : 'Field created',
        description: `Field "${values.name}" has been ${fieldData ? 'updated' : 'created'} successfully`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving field:', error);
      
      toast({
        title: 'Error saving field',
        description: 'There was a problem saving the field. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateValidation = (data: ValidationSettings) => {
    console.log('Validation settings updated:', data);
    setValidationSettings(data);
    
    if (data.required !== undefined && form.getValues('required') !== data.required) {
      form.setValue('required', data.required);
    }
  };

  const handleUpdateAppearance = (data: AppearanceSettings) => {
    console.log('Appearance settings updated:', data);
    setAppearanceSettings(data);
  };

  const handleUpdateAdvanced = (data: AdvancedSettings) => {
    console.log('Advanced settings updated:', data);
    setAdvancedSettings(data);
    onUpdateAdvanced(data);
  };

  const renderFieldPreview = () => {
    const fieldName = form.watch('name') || "Field Label";
    const placeholder = form.watch('ui_options.placeholder') || "Enter value...";
    const helpText = form.watch('helpText');
    const defaultValue = form.watch('defaultValue') || '';

    switch (fieldType) {
      case 'text':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <InputTextField
              id="preview-field"
              label={fieldName}
              placeholder={placeholder}
              helpText={helpText}
              keyFilter={form.watch('keyFilter') || "none"}
              floatLabel={appearanceSettings?.floatLabel || false}
              filled={appearanceSettings?.filled || false}
              value={defaultValue}
              onChange={() => {}} // Preview only, no changes needed
            />
          </div>
        );
      case 'number':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <NumberInputField
              id="preview-number"
              value={0}
              onChange={() => {}}
              label={fieldName}
              min={form.watch('min')}
              max={form.watch('max')}
              placeholder={placeholder}
              floatLabel={appearanceSettings?.floatLabel || false}
              filled={appearanceSettings?.filled || false}
              showButtons={advancedSettings?.showButtons || false}
              buttonLayout={advancedSettings?.buttonLayout || "horizontal"}
              prefix={advancedSettings?.prefix || ""}
              suffix={advancedSettings?.suffix || ""}
            />
          </div>
        );
      case 'password':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <PasswordInputField
              id="preview-password"
              value=""
              onChange={() => {}}
              label={fieldName}
              placeholder={placeholder}
              floatLabel={appearanceSettings?.floatLabel || false}
              filled={appearanceSettings?.filled || false}
              helpText={helpText}
            />
          </div>
        );
      case 'mask':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <MaskInputField
              id="preview-mask"
              value=""
              onChange={() => {}}
              label={fieldName}
              placeholder={placeholder}
              mask={advancedSettings?.mask || ''}
              floatLabel={appearanceSettings?.floatLabel || false}
              filled={appearanceSettings?.filled || false}
              helpText={helpText}
            />
          </div>
        );
      case 'otp':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <OTPInputField
              id="preview-otp"
              value=""
              onChange={() => {}}
              label={fieldName}
              length={form.watch('length') || 6}
              helpText={helpText}
            />
          </div>
        );
      case 'autocomplete':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <AutocompleteInputField
              id="preview-autocomplete"
              value=""
              onChange={() => {}}
              label={fieldName}
              placeholder={placeholder}
              options={[
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' }
              ]}
              floatLabel={appearanceSettings?.floatLabel || false}
              filled={appearanceSettings?.filled || false}
              helpText={helpText}
            />
          </div>
        );
      case 'blockeditor':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <BlockEditorField
              id="preview-blockeditor"
              value=""
              onChange={() => {}}
              label={fieldName}
              placeholder={placeholder}
              helpText={helpText}
              minHeight="100px"
            />
          </div>
        );
      case 'wysiwyg':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <WysiwygEditorField
              id="preview-wysiwyg"
              value=""
              onChange={() => {}}
              label={fieldName}
              placeholder={placeholder}
              helpText={helpText}
              minHeight="100px"
            />
          </div>
        );
      case 'markdown':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <MarkdownEditorField
              id="preview-markdown"
              value=""
              onChange={() => {}}
              label={fieldName}
              placeholder={placeholder}
              helpText={helpText}
              rows={4}
            />
          </div>
        );
      case 'tags':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <TagsInputField
              id="preview-tags"
              value={[]}
              onChange={() => {}}
              label={fieldName}
              placeholder={placeholder}
              helpText={helpText}
              maxTags={form.watch('maxTags') || 10}
            />
          </div>
        );
      case 'slug':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <SlugInputField
              id="preview-slug"
              value=""
              onChange={() => {}}
              label={fieldName}
              placeholder={placeholder}
              helpText={helpText}
              prefix={form.watch('prefix') || ''}
              suffix={form.watch('suffix') || ''}
            />
          </div>
        );
      case 'textarea':
        return (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Field Preview:</h3>
            <div className="space-y-2">
              <Label htmlFor="preview-textarea">{fieldName}</Label>
              <Textarea
                id="preview-textarea"
                placeholder={placeholder}
                rows={form.watch('rows') || 5}
              />
              {helpText && (
                <p className="text-muted-foreground text-xs">{helpText}</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderFieldTypeSpecificOptions = () => {
    switch (fieldType) {
      case 'text':
        return (
          <FormField
            control={form.control}
            name="keyFilter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Filter</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select key filter" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="letters">Letters only</SelectItem>
                    <SelectItem value="numbers">Numbers only</SelectItem>
                    <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Restrict input to specific character types
                </FormDescription>
              </FormItem>
            )}
          />
        );
      case 'number':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
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
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case 'otp':
        return (
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP Length</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={4}
                    max={12}
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Number of digits in the OTP input (4-12)
                </FormDescription>
              </FormItem>
            )}
          />
        );
      case 'tags':
        return (
          <FormField
            control={form.control}
            name="maxTags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Tags</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={1}
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of tags allowed
                </FormDescription>
              </FormItem>
            )}
          />
        );
      case 'slug':
        return (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prefix</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. /blog/"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Text to display before the slug
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="suffix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suffix</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. .html"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Text to display after the slug
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        );
      case 'markdown':
      case 'textarea':
        return (
          <FormField
            control={form.control}
            name="rows"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Rows</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={3}
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Initial height of the text area
                </FormDescription>
              </FormItem>
            )}
          />
        );
      case 'blockeditor':
      case 'wysiwyg':
        return (
          <FormField
            control={form.control}
            name="minHeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Height</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. 200px"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Minimum height of the editor (CSS value)
                </FormDescription>
              </FormItem>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Label</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The label displayed to users
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="apiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API ID</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value || form.watch('name')?.toLowerCase().replace(/\s+/g, '_')} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                    <FormDescription>
                      Identifier used in the API
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Internal description of this field
                  </FormDescription>
                  <FormMessage />
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
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Displayed below the field to assist users
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ui_options.placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placeholder</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Placeholder text shown when field is empty
                  </FormDescription>
                  <FormMessage />
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
                      Users must complete this field to submit the form
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ui_options.hidden_in_forms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Hidden Field</FormLabel>
                    <FormDescription>
                      Field will not be visible in the form
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {renderFieldTypeSpecificOptions()}
            
            {renderFieldPreview()}
          </TabsContent>
          
          <TabsContent value="validation">
            <FieldValidationPanel 
              fieldType={fieldType} 
              initialData={validationSettings}
              onUpdate={handleUpdateValidation}
            />
          </TabsContent>
          
          <TabsContent value="appearance">
            <FieldAppearancePanel
              fieldType={fieldType}
              initialData={appearanceSettings}
              onSave={handleUpdateAppearance}
            />
          </TabsContent>
          
          <TabsContent value="advanced">
            <FieldAdvancedPanel
              fieldType={fieldType}
              initialData={advancedSettings}
              onSave={handleUpdateAdvanced}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? 'Saving...' : (fieldData ? 'Update Field' : 'Create Field')}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default FieldConfigPanel;
