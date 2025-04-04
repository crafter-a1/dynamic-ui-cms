import { useState } from 'react';
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adaptCollectionFormData, adaptNumberFieldSettings } from '@/utils/formAdapters';
import { CollectionFormData } from '@/services/CollectionService';
import { Plus, Trash2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Collection name must be at least 2 characters.",
  }),
  apiId: z.string().min(2, {
    message: "API ID must be at least 2 characters.",
  }).regex(/^[a-z0-9-]+$/, {
    message: "API ID can only contain lowercase letters, numbers, and hyphens.",
  }),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  fields: z.array(
    z.object({
      name: z.string().min(1, "Field name is required"),
      apiId: z.string().min(1, "Field API ID is required"),
      type: z.string().min(1, "Field type is required"),
      required: z.boolean().default(false),
      settings: z.any().optional(),
    })
  ).optional().default([]),
});

interface NewCollectionFormProps {
  onCollectionCreated: (data: CollectionFormData) => void;
  onClose: () => void;
}

export function NewCollectionForm({ onCollectionCreated, onClose }: NewCollectionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      apiId: "",
      description: "",
      status: "draft",
      fields: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const adaptedData = adaptCollectionFormData(values);
      onCollectionCreated(adaptedData);
    } catch (error) {
      console.error("Failed to create collection:", error);
      setIsSubmitting(false);
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    
    if (!form.getValues("apiId")) {
      const apiId = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      form.setValue("apiId", apiId);
    }
  };

  const generateApiId = () => {
    const name = form.getValues("name");
    if (name) {
      const apiId = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      form.setValue("apiId", apiId);
    }
  };
  
  const handleAddField = () => {
    append({
      name: "New Field",
      apiId: "new-field",
      type: "text",
      required: false,
      settings: {},
    });
  };

  const handleFieldNameChange = (index: number, value: string) => {
    form.setValue(`fields.${index}.name`, value);
    
    if (!form.getValues(`fields.${index}.apiId`)) {
      const apiId = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      form.setValue(`fields.${index}.apiId`, apiId);
    }
  };

  const availableLocales = [
    { label: 'English (US)', value: 'en-US' },
    { label: 'English (UK)', value: 'en-GB' },
    { label: 'French', value: 'fr-FR' },
    { label: 'German', value: 'de-DE' },
    { label: 'Spanish', value: 'es-ES' },
    { label: 'Japanese', value: 'ja-JP' },
    { label: 'Chinese', value: 'zh-CN' },
  ];

  const availableCurrencies = [
    { label: 'US Dollar ($)', value: 'USD' },
    { label: 'Euro (€)', value: 'EUR' },
    { label: 'British Pound (£)', value: 'GBP' },
    { label: 'Japanese Yen (¥)', value: 'JPY' },
    { label: 'Canadian Dollar (C$)', value: 'CAD' },
    { label: 'Australian Dollar (A$)', value: 'AUD' },
    { label: 'Swiss Franc (CHF)', value: 'CHF' },
    { label: 'Indian Rupee (₹)', value: 'INR' },
    { label: 'Chinese Yuan (¥)', value: 'CNY' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter collection name" 
                      {...field} 
                      onChange={handleNameChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>API ID <span className="text-red-500">*</span></FormLabel>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-6"
                      onClick={generateApiId}
                    >
                      Generate from name
                    </Button>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="Enter API ID (e.g., blog-posts)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This ID will be used in API endpoints and code
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the purpose of this collection"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of what this collection is used for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set the visibility status of this collection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="fields" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Configure Fields</h3>
              <Button 
                type="button" 
                onClick={handleAddField} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Field
              </Button>
            </div>
            
            {fields.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-md bg-gray-50">
                <p className="text-gray-500 mb-4">No fields added yet</p>
                <Button 
                  type="button" 
                  onClick={handleAddField} 
                  variant="secondary"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Field
                </Button>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full space-y-4">
                {fields.map((field, index) => (
                  <AccordionItem key={field.id} value={`field-${index}`} className="border rounded-md p-1">
                    <div className="flex items-center justify-between">
                      <AccordionTrigger className="hover:no-underline py-2">
                        <span className="font-medium">{form.watch(`fields.${index}.name`)}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({form.watch(`fields.${index}.type`)})
                        </span>
                      </AccordionTrigger>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 mr-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <AccordionContent className="px-2 pt-2 pb-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`fields.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Field Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    onChange={(e) => handleFieldNameChange(index, e.target.value)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`fields.${index}.apiId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>API ID</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`fields.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Field Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select field type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="textarea">Textarea</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="boolean">Boolean</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="select">Select</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`fields.${index}.required`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3 mt-6">
                                <FormLabel>Required</FormLabel>
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
                        
                        {form.watch(`fields.${index}.type`) === 'number' && (
                          <div className="border rounded-md p-4 space-y-4 mt-2">
                            <h4 className="text-sm font-medium">Number Field Settings</h4>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`fields.${index}.settings.min`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Min Value</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        {...field} 
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`fields.${index}.settings.max`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Max Value</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        {...field} 
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`fields.${index}.settings.step`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Step</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        {...field} 
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                                        placeholder="1"
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Increment/decrement step value
                                    </FormDescription>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`fields.${index}.settings.defaultValue`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Default Value</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        {...field} 
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        placeholder="0"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`fields.${index}.settings.prefix`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Prefix</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="e.g. $" />
                                    </FormControl>
                                    <FormDescription>
                                      Text shown before the number
                                    </FormDescription>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`fields.${index}.settings.suffix`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Suffix</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="e.g. kg" />
                                    </FormControl>
                                    <FormDescription>
                                      Text shown after the number
                                    </FormDescription>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`fields.${index}.settings.locale`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Locale</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value || "en-US"}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select locale" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {availableLocales.map(locale => (
                                          <SelectItem key={locale.value} value={locale.value}>
                                            {locale.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      Localization for number formatting
                                    </FormDescription>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`fields.${index}.settings.currency`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value || ""}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select currency (optional)" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        {availableCurrencies.map(currency => (
                                          <SelectItem key={currency.value} value={currency.value}>
                                            {currency.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      Format as currency (optional)
                                    </FormDescription>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name={`fields.${index}.settings.showButtons`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
                                  <div>
                                    <FormLabel>Show Increment/Decrement Buttons</FormLabel>
                                    <FormDescription>Display buttons to adjust the value</FormDescription>
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
                            
                            {form.watch(`fields.${index}.settings.showButtons`) && (
                              <FormField
                                control={form.control}
                                name={`fields.${index}.settings.buttonLayout`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Button Layout</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value || "horizontal"}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select button layout" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="horizontal">Horizontal</SelectItem>
                                        <SelectItem value="vertical">Vertical</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      Arrangement of increment/decrement buttons
                                    </FormDescription>
                                  </FormItem>
                                )}
                              />
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`fields.${index}.settings.floatLabel`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
                                    <div>
                                      <FormLabel>Float Label</FormLabel>
                                      <FormDescription>Label floats when field is focused</FormDescription>
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
                                name={`fields.${index}.settings.filled`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
                                    <div>
                                      <FormLabel>Filled Style</FormLabel>
                                      <FormDescription>Use filled background style</FormDescription>
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
                            
                            <FormField
                              control={form.control}
                              name={`fields.${index}.settings.accessibilityLabel`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Accessibility Label</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="e.g. Enter product price"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Label for screen readers (ARIA)
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                        
                        {form.watch(`fields.${index}.type`) === 'date' && (
                          <div className="border rounded-md p-4 space-y-4 mt-2">
                            <h4 className="text-sm font-medium">Date Field Settings</h4>
                            
                            <FormField
                              control={form.control}
                              name={`fields.${index}.settings.dateFormat`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date Format</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value || "yyyy-MM-dd"}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select date format" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                                      <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                                      <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                                      <SelectItem value="dd-MMM-yyyy">dd-MMM-yyyy</SelectItem>
                                      <SelectItem value="MMMM d, yyyy">MMMM d, yyyy</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`fields.${index}.settings.allowRangeSelection`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
                                    <FormLabel>Allow Range Selection</FormLabel>
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
                                name={`fields.${index}.settings.includeTimePicker`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
                                    <FormLabel>Include Time Picker</FormLabel>
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
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Collection"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default NewCollectionForm;
