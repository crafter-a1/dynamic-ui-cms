import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema for advanced settings
const advancedSettingsSchema = z.object({
  // Basic input settings
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  
  // Key filter
  keyFilter: z.enum(["none", "numeric", "alpha", "alphanumeric", "custom"]).default("none"),
  keyFilterPattern: z.string().optional(),
  
  // Size
  size: z.enum(["small", "medium", "large"]).default("medium"),
  
  // Help text
  helpText: z.string().optional(),
  
  // Appearance options
  floatLabel: z.boolean().default(false),
  filled: z.boolean().default(false),
  
  // Accessibility
  ariaLabel: z.string().optional(),
  ariaDescribedBy: z.string().optional(),
});

type AdvancedSettingsFormData = z.infer<typeof advancedSettingsSchema>;

interface FieldAdvancedPanelProps {
  fieldType: string | null;
  initialData?: any;
  onSave: (data: any) => void;
}

export function FieldAdvancedPanel({ fieldType, initialData, onSave }: FieldAdvancedPanelProps) {
  // Initialize the form with default values or existing data
  const form = useForm<AdvancedSettingsFormData>({
    resolver: zodResolver(advancedSettingsSchema),
    defaultValues: {
      placeholder: initialData?.placeholder || "",
      defaultValue: initialData?.defaultValue || "",
      keyFilter: initialData?.keyFilter || "none",
      keyFilterPattern: initialData?.keyFilterPattern || "",
      size: initialData?.size || "medium",
      helpText: initialData?.helpText || "",
      floatLabel: initialData?.floatLabel || false,
      filled: initialData?.filled || false,
      ariaLabel: initialData?.ariaLabel || "",
      ariaDescribedBy: initialData?.ariaDescribedBy || "",
    },
  });

  // Submit handler
  const handleSubmit = (data: AdvancedSettingsFormData) => {
    onSave(data);
  };

  // Show different settings based on field type
  const renderFieldTypeSpecificSettings = () => {
    switch (fieldType) {
      case 'text':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter placeholder text" />
                    </FormControl>
                    <FormDescription>
                      Text shown when the field is empty
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="defaultValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Value</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter default value" />
                    </FormControl>
                    <FormDescription>
                      Initial value when the form loads
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <SelectValue placeholder="Select filter type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="numeric">Numbers only</SelectItem>
                        <SelectItem value="alpha">Letters only</SelectItem>
                        <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                        <SelectItem value="custom">Custom pattern</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Restrict what characters can be entered
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              {form.watch("keyFilter") === "custom" && (
                <FormField
                  control={form.control}
                  name="keyFilterPattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Pattern</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter regex pattern" />
                      </FormControl>
                      <FormDescription>
                        Regular expression for allowed characters
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Control the size of the input field
                  </FormDescription>
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
                    <Textarea 
                      {...field} 
                      placeholder="Enter help text to display below the field" 
                      rows={2}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional information to help users complete the field
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="floatLabel"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                    <div>
                      <FormLabel>Float Label</FormLabel>
                      <FormDescription>
                        Label floats when field is focused or filled
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
                name="filled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                    <div>
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
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-base font-medium mb-4">Accessibility</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ariaLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ARIA Label</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Accessible name for screen readers" />
                      </FormControl>
                      <FormDescription>
                        Used by screen readers if no visible label is present
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ariaDescribedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ARIA DescribedBy</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ID of element that describes this field" />
                      </FormControl>
                      <FormDescription>
                        References an element that describes this input
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
        
      case 'number':
        return (
          <>
            {/* Include text field common settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter placeholder text" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="defaultValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Value</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Enter default value" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Additional fields specific to number type would go here */}
            {/* For brevity, we'll reuse most of the text field settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="floatLabel"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                    <div>
                      <FormLabel>Float Label</FormLabel>
                      <FormDescription>
                        Label floats when field is focused or filled
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
                name="filled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                    <div>
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
            </div>

            {/* Rest of the settings would be similar to text field */}
          </>
        );
        
      case 'textarea':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter placeholder text" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="defaultValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Value</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter default value" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Additional textarea-specific settings would go here */}
            {/* For brevity, we'll reuse most of the text field settings */}
          </>
        );
      
      default:
        return (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              {fieldType 
                ? `Advanced settings for ${fieldType} fields are not yet implemented.` 
                : "Select a field type to configure advanced settings."}
            </p>
          </div>
        );
    }
  };

  return (
    <Card className="border-none shadow-none">
      <Form {...form}>
        <form onChange={form.handleSubmit(handleSubmit)} className="space-y-6">
          {renderFieldTypeSpecificSettings()}
        </form>
      </Form>
    </Card>
  );
}

export default FieldAdvancedPanel;
