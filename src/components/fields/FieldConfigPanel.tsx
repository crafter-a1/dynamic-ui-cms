
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FieldAppearancePanel } from "./FieldAppearancePanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Base schema for all field types
const baseFieldSchema = z.object({
  name: z.string().min(2, {
    message: "Field name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  required: z.boolean().default(false),
  ui_options: z.object({
    placeholder: z.string().optional(),
    help_text: z.string().optional(),
    display_mode: z.string().optional(),
    showCharCount: z.boolean().optional(),
    width: z.number().optional(),
    hidden_in_forms: z.boolean().optional(),
  }).optional().default({}),
});

// Text field specific schema
const textFieldSchema = baseFieldSchema.extend({
  settings: z.object({
    minLength: z.number().int().min(0).optional(),
    maxLength: z.number().int().min(0).optional(),
    placeholder: z.string().optional(),
    defaultValue: z.string().optional(),
  }),
});

// Number field specific schema
const numberFieldSchema = baseFieldSchema.extend({
  settings: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    defaultValue: z.number().optional(),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
    locale: z.string().optional(),
    currency: z.string().optional(),
    showButtons: z.boolean().optional(),
    buttonLayout: z.enum(["horizontal", "vertical"]).optional(),
    floatLabel: z.boolean().optional(),
    filled: z.boolean().optional(),
    accessibilityLabel: z.string().optional(),
  }),
});

// Date field specific schema
const dateFieldSchema = baseFieldSchema.extend({
  settings: z.object({
    dateFormat: z.string().optional(),
    minDate: z.string().optional(),
    maxDate: z.string().optional(),
    defaultToday: z.boolean().optional(),
    locale: z.string().optional(),
    allowMultipleSelection: z.boolean().optional(),
    allowRangeSelection: z.boolean().optional(),
    showButtonBar: z.boolean().optional(),
    includeTimePicker: z.boolean().optional(),
    monthPickerOnly: z.boolean().optional(),
    yearPickerOnly: z.boolean().optional(),
    showMultipleMonths: z.boolean().optional(),
    inlineMode: z.boolean().optional(),
    filledStyle: z.boolean().optional(),
    floatingLabel: z.boolean().optional(),
  }),
});

// Boolean field specific schema
const booleanFieldSchema = baseFieldSchema.extend({
  settings: z.object({
    defaultValue: z.boolean().optional(),
    labelTrue: z.string().optional(),
    labelFalse: z.string().optional(),
  }),
});

// Select field specific schema
const selectFieldSchema = baseFieldSchema.extend({
  settings: z.object({
    options: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).min(1),
    multiple: z.boolean().optional(),
    defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
  }),
});

// Helper function to get the appropriate schema based on field type
const getSchemaForFieldType = (fieldType: string | null) => {
  switch (fieldType) {
    case 'text':
    case 'textarea':
      return textFieldSchema;
    case 'number':
      return numberFieldSchema;
    case 'date':
      return dateFieldSchema;
    case 'boolean':
      return booleanFieldSchema;
    case 'select':
      return selectFieldSchema;
    // Add more field type schemas as needed
    default:
      return baseFieldSchema;
  }
};

interface FieldConfigPanelProps {
  fieldType: string | null;
  fieldData?: any; // Existing field data for editing
  onSave: (fieldData: any) => void;
  onCancel: () => void;
}

export function FieldConfigPanel({ fieldType, fieldData, onSave, onCancel }: FieldConfigPanelProps) {
  const [activeTab, setActiveTab] = useState("general");
  
  // Default values based on field type
  const getDefaultValues = () => {
    const baseDefaults = {
      name: "",
      description: "",
      required: false,
      ui_options: {
        placeholder: "",
        help_text: "",
        display_mode: "default",
        showCharCount: false,
        width: 100,
        hidden_in_forms: false,
      }
    };

    switch(fieldType) {
      case 'text':
      case 'textarea':
        return {
          ...baseDefaults,
          settings: {
            minLength: 0,
            maxLength: 100,
            placeholder: "",
            defaultValue: "",
          }
        };
      case 'number':
        return {
          ...baseDefaults,
          settings: {
            min: 0,
            max: 100,
            step: 1,
            defaultValue: 0,
            prefix: "",
            suffix: "",
            locale: "en-US",
            currency: "",
            showButtons: false,
            buttonLayout: "horizontal",
            floatLabel: false,
            filled: false,
            accessibilityLabel: "",
          }
        };
      case 'date':
        return {
          ...baseDefaults,
          settings: {
            dateFormat: "yyyy-MM-dd",
            minDate: "",
            maxDate: "",
            defaultToday: false,
            locale: "en-US",
            allowMultipleSelection: false,
            allowRangeSelection: false,
            showButtonBar: false,
            includeTimePicker: false,
            monthPickerOnly: false,
            yearPickerOnly: false,
            showMultipleMonths: false,
            inlineMode: false,
            filledStyle: false,
            floatingLabel: false,
          }
        };
      case 'boolean':
        return {
          ...baseDefaults,
          settings: {
            defaultValue: false,
            labelTrue: "Yes",
            labelFalse: "No",
          }
        };
      case 'select':
        return {
          ...baseDefaults,
          settings: {
            options: [{ label: "Option 1", value: "option1" }],
            multiple: false,
            defaultValue: "",
          }
        };
      default:
        return baseDefaults;
    }
  };
  
  // Set up form with the appropriate schema based on field type
  const form = useForm<any>({
    resolver: zodResolver(getSchemaForFieldType(fieldType)),
    defaultValues: fieldData || getDefaultValues(),
  });

  const handleSubmit = (data: any) => {
    onSave(data);
  };

  const renderSpecificSettings = () => {
    if (!fieldType) return null;

    switch (fieldType) {
      case 'text':
      case 'textarea':
        return (
          <>
            <FormField
              control={form.control}
              name="settings.minLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Length</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      value={field.value || 0}
                    />
                  </FormControl>
                  <FormDescription>
                    The minimum number of characters allowed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.maxLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Length</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      value={field.value || 100}
                    />
                  </FormControl>
                  <FormDescription>
                    The maximum number of characters allowed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placeholder</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Text shown when the field is empty
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.defaultValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Value</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Pre-filled value when creating new content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      case 'number':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="settings.min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="settings.max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="settings.step"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Step</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>
                    The increment/decrement step value
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="settings.defaultValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Value</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Initial value when creating new content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4 mt-6">
              <h3 className="text-base font-medium mb-4">Display Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="settings.prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefix</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. $, €" />
                      </FormControl>
                      <FormDescription>
                        Text or symbol to display before the number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.suffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suffix</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. kg, %" />
                      </FormControl>
                      <FormDescription>
                        Text or symbol to display after the number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="settings.locale"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Locale</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select locale" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="en-GB">English (UK)</SelectItem>
                          <SelectItem value="fr-FR">French</SelectItem>
                          <SelectItem value="de-DE">German</SelectItem>
                          <SelectItem value="ja-JP">Japanese</SelectItem>
                          <SelectItem value="zh-CN">Chinese</SelectItem>
                          <SelectItem value="es-ES">Spanish</SelectItem>
                          <SelectItem value="pt-BR">Portuguese (Brazil)</SelectItem>
                          <SelectItem value="ar-SA">Arabic</SelectItem>
                          <SelectItem value="hi-IN">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      The locale to use for number formatting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="settings.currency"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="GBP">British Pound (£)</SelectItem>
                          <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                          <SelectItem value="CNY">Chinese Yuan (¥)</SelectItem>
                          <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="CAD">Canadian Dollar (CA$)</SelectItem>
                          <SelectItem value="AUD">Australian Dollar (A$)</SelectItem>
                          <SelectItem value="BRL">Brazilian Real (R$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Format the number as currency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-4 mt-6">
              <h3 className="text-base font-medium mb-4">Button Configuration</h3>
              
              <FormField
                control={form.control}
                name="settings.showButtons"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Show Buttons</FormLabel>
                      <FormDescription>
                        Display increment/decrement buttons
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

              {form.watch("settings.showButtons") && (
                <FormField
                  control={form.control}
                  name="settings.buttonLayout"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Button Layout</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="horizontal" />
                            </FormControl>
                            <FormLabel className="font-normal">Horizontal</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="vertical" />
                            </FormControl>
                            <FormLabel className="font-normal">Vertical</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Layout orientation for the buttons
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="border-t pt-4 mt-6">
              <h3 className="text-base font-medium mb-4">Accessibility</h3>
              
              <FormField
                control={form.control}
                name="settings.accessibilityLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accessibility Label</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Enter product price" />
                    </FormControl>
                    <FormDescription>
                      Custom label for screen readers (ARIA label)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
      
      case 'date':
        return (
          <>
            <FormField
              control={form.control}
              name="settings.dateFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Format</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                        <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                        <SelectItem value="dd-MMM-yyyy">dd-MMM-yyyy</SelectItem>
                        <SelectItem value="MMMM d, yyyy">MMMM d, yyyy</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Format for displaying and storing dates
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.locale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locale</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select locale" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                        <SelectItem value="de-DE">German</SelectItem>
                        <SelectItem value="ja-JP">Japanese</SelectItem>
                        <SelectItem value="zh-CN">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    The locale to use for date formatting
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.defaultToday"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Default to Today</FormLabel>
                    <FormDescription>
                      Use current date as default value
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

            <FormField
              control={form.control}
              name="settings.allowMultipleSelection"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Allow Multiple Selection</FormLabel>
                    <FormDescription>
                      Enable selection of multiple individual dates
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          // Disable range selection if multiple selection is enabled
                          form.setValue("settings.allowRangeSelection", false);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="settings.allowRangeSelection"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Allow Range Selection</FormLabel>
                    <FormDescription>
                      Enable selection of a date range
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          // Disable multiple selection if range selection is enabled
                          form.setValue("settings.allowMultipleSelection", false);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="settings.showButtonBar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Show Button Bar</FormLabel>
                    <FormDescription>
                      Display "Today" and "Clear" buttons
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

            <FormField
              control={form.control}
              name="settings.includeTimePicker"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Include Time Picker</FormLabel>
                    <FormDescription>
                      Allow time selection along with date
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

            <FormField
              control={form.control}
              name="settings.monthPickerOnly"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Month Picker Only</FormLabel>
                    <FormDescription>
                      Allow only month selection
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          // Disable year picker if month picker is enabled
                          form.setValue("settings.yearPickerOnly", false);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="settings.yearPickerOnly"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Year Picker Only</FormLabel>
                    <FormDescription>
                      Allow only year selection
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          // Disable month picker if year picker is enabled
                          form.setValue("settings.monthPickerOnly", false);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="settings.showMultipleMonths"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Show Multiple Months</FormLabel>
                    <FormDescription>
                      Display two months side by side
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

            <FormField
              control={form.control}
              name="settings.inlineMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Inline Mode</FormLabel>
                    <FormDescription>
                      Always visible calendar without input box
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
          </>
        );
      
      case 'boolean':
        return (
          <>
            <FormField
              control={form.control}
              name="settings.defaultValue"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Default Value</FormLabel>
                    <FormDescription>
                      Initial state of the boolean field
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
            
            <FormField
              control={form.control}
              name="settings.labelTrue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>True Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Label for the true/on state
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settings.labelFalse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>False Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Label for the false/off state
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      // Add more field type specific settings as needed
      
      default:
        return <p className="text-gray-500">No specific settings for this field type</p>;
    }
  };

  const renderAppearanceSettings = () => {
    if (!fieldType) return null;

    switch (fieldType) {
      case 'number':
        return (
          <>
            <div className="space-y-6">
              <Alert variant="info" className="bg-blue-50 border-blue-100 mb-6">
                <Info className="h-5 w-5 text-blue-500" />
                <AlertDescription className="text-blue-700">
                  Configure the visual appearance of your number field.
                </AlertDescription>
              </Alert>

              <FormField
                control={form.control}
                name="settings.floatLabel"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Float Label</FormLabel>
                      <FormDescription>
                        Label floats above the input when focused or filled
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

              <FormField
                control={form.control}
                name="settings.filled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Filled Style</FormLabel>
                      <FormDescription>
                        Use filled background style for the input
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

              <FormField
                control={form.control}
                name="ui_options.placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Enter a number..." />
                    </FormControl>
                    <FormDescription>
                      Text displayed when the field is empty
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ui_options.width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Width (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="25" 
                        max="100" 
                        step="25" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 100)}
                      />
                    </FormControl>
                    <FormDescription>
                      Width of the field as percentage of container
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case 'date':
        // Display date-specific appearance settings
        return <FieldAppearancePanel form={form} fieldType={fieldType} />;
      default:
        return <FieldAppearancePanel form={form} fieldType={fieldType} />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter field name..." {...field} />
                  </FormControl>
                  <FormDescription>
                    The display name for this field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter description..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Help text explaining this field's purpose
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
          </TabsContent>
          
          <TabsContent value="validation" className="space-y-4">
            {fieldType ? renderSpecificSettings() : (
              <p className="text-gray-500">Please select a field type first</p>
            )}
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            {fieldType ? renderAppearanceSettings() : (
              <p className="text-gray-500">Please select a field type first</p>
            )}
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            {fieldType === 'number' && (
              <div className="space-y-4">
                <Alert variant="info" className="bg-blue-50 border-blue-100 mb-6">
                  <Info className="h-5 w-5 text-blue-500" />
                  <AlertDescription className="text-blue-700">
                    Configure advanced settings for the number field.
                  </AlertDescription>
                </Alert>
              
                <FormField
                  control={form.control}
                  name="ui_options.hidden_in_forms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Hide in Forms</FormLabel>
                        <FormDescription>
                          Hide this field in content creation forms
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
                
                <FormField
                  control={form.control}
                  name="ui_options.help_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Help Text</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter help text..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Additional guidance text that appears below the field
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {fieldType !== 'number' && (
              <p className="text-gray-500">Advanced settings will be added soon</p>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Save Field
          </Button>
        </div>
      </form>
    </Form>
  );
}
