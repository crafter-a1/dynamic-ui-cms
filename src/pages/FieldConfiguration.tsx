
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectionService, ValidationSettings, CollectionField } from '@/services/CollectionService';
import { FieldConfigPanel } from '@/components/fields/FieldConfigPanel';
import { MainLayout } from '@/components/layout/MainLayout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { FieldTypeSelector } from '@/components/fields/FieldTypeSelector';
import { CollectionPreviewForm } from '@/components/collection-preview/CollectionPreviewForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { FieldList } from '@/components/fields/FieldList';
import {
  FileJson,
  Settings2,
  View,
  ArrowLeft,
  Eye,
  Save,
  Plus,
  Trash2,
  FileType,
  X
} from 'lucide-react';
import { FieldAppearancePanel } from '@/components/fields/appearance/FieldAppearancePanel';
import { FieldValidationPanel } from '@/components/fields/FieldValidationPanel';
import { FieldAdvancedPanel } from '@/components/fields/FieldAdvancedPanel';
import { FieldLayoutPanel } from '@/components/fields/FieldLayoutPanel';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { JSONEditorField } from '@/components/fields/inputs/JSONEditorField';
import { ComponentSelector } from '@/components/fields/ComponentSelector';

// Define the Field type that will be used in this component
interface Field extends CollectionField {
  required: boolean; // Make required non-optional to satisfy the Field type
}

const fieldTypes = {
  'Text & Numbers': [
    { id: 'text', name: 'Input', description: 'Single line text field' },
    { id: 'textarea', name: 'Textarea', description: 'Multi-line text field' },
    { id: 'number', name: 'Number', description: 'Numeric field with validation and formatting' },
    { id: 'password', name: 'Password', description: 'Secure password input with toggle' },
    { id: 'mask', name: 'Input Mask', description: 'Input with formatting mask' },
    { id: 'otp', name: 'Input OTP', description: 'One-time password input' },
    { id: 'autocomplete', name: 'Autocomplete Input', description: 'Input with suggestions' },
    { id: 'blockeditor', name: 'Block Editor', description: 'Rich text block editor' },
    { id: 'code', name: 'Code', description: 'Code snippet with syntax highlighting' },
    { id: 'wysiwyg', name: 'WYSIWYG', description: 'What you see is what you get editor' },
    { id: 'markdown', name: 'Markdown', description: 'Markdown text editor' },
    { id: 'tags', name: 'Tags', description: 'Input for multiple tags or keywords' },
    { id: 'list', name: 'List', description: 'Ordered or unordered list' },
    { id: 'slug', name: 'Slug', description: 'URL-friendly version of a name' },
    { id: 'seo', name: 'SEO Interface', description: 'Search engine optimization fields' },
    { id: 'translation', name: 'Translation', description: 'Multilingual content editor' },
  ],
  'Selection': [
    { id: 'select', name: 'Dropdown', description: 'Single selection dropdown' },
    { id: 'multiselect', name: 'Dropdown (Multiple)', description: 'Multiple selection dropdown' },
    { id: 'toggle', name: 'Toggle', description: 'On/Off toggle switch' },
    { id: 'boolean', name: 'Boolean', description: 'True/False toggle field' },
    { id: 'checkbox', name: 'Checkboxes', description: 'Multiple checkbox options' },
    { id: 'tristatecheck', name: 'Tri-State Checkbox', description: 'Checkbox with three states' },
    { id: 'multistatecheck', name: 'Multi-State Checkbox', description: 'Checkbox with multiple states' },
    { id: 'radio', name: 'Radio Buttons', description: 'Single selection radio options' },
    { id: 'selectbutton', name: 'Select Button', description: 'Button-style option selector' },
    { id: 'treeselect', name: 'Checkboxes (Tree)', description: 'Hierarchical checkbox selection' },
    { id: 'listbox', name: 'List Box', description: 'Scrollable selection list' },
    { id: 'mention', name: 'Mention Box', description: 'Text input with @mentions' },
    { id: 'date', name: 'Date/Calendar', description: 'Advanced date and time picker' },
    { id: 'color', name: 'Color', description: 'Color picker field' },
    { id: 'colorpicker', name: 'Color Picker', description: 'Advanced color selection tool' },
    { id: 'icon', name: 'Icon', description: 'Icon selection from a library' },
    { id: 'radioCards', name: 'Radio Cards', description: 'Visual card-based radio selection' },
    { id: 'checkboxCards', name: 'Checkbox Cards', description: 'Visual card-based checkbox selection' },
  ],
  'Relational': [
    { id: 'relation', name: 'Relation', description: 'Relationship to another collection' },
    { id: 'file', name: 'File', description: 'Single file upload field' },
    { id: 'image', name: 'Image', description: 'Image upload and preview' },
    { id: 'files', name: 'Files', description: 'Multiple file uploads' },
    { id: 'media', name: 'Media', description: 'Image, video, or document upload' },
    { id: 'manyToMany', name: 'Many to Many', description: 'Many-to-many relationship' },
    { id: 'oneToMany', name: 'One to Many', description: 'One-to-many relationship' },
    { id: 'manyToOne', name: 'Many to One', description: 'Many-to-one relationship' },
    { id: 'treeView', name: 'Tree View', description: 'Hierarchical tree relationship view' },
    { id: 'translations', name: 'Translations', description: 'Multi-language content fields' },
    { id: 'builder', name: 'Builder (M2A)', description: 'Advanced modular content builder' },
    { id: 'collectionItem', name: 'Collection Item Dropdown', description: 'Select items from another collection' },
  ],
  'Advanced': [
    { id: 'json', name: 'JSON', description: 'Structured JSON data field' },
    { id: 'map', name: 'Map', description: 'Geographic map selection' },
    { id: 'repeater', name: 'Repeater', description: 'Repeatable group of fields' },
    { id: 'inlineRepeater', name: 'Inline Repeater', description: 'Inline repeatable fields' },
    { id: 'rating', name: 'Rating', description: 'Star-based rating selector' },
    { id: 'slider', name: 'Slider', description: 'Range slider input' },
    { id: 'hash', name: 'Hash', description: 'Secure hash field with encryption' },
  ],
  'Presentation': [
    { id: 'divider', name: 'Divider', description: 'Visual separator between fields' },
    { id: 'buttonLinks', name: 'Button Links', description: 'Clickable button links' },
    { id: 'notice', name: 'Notice', description: 'Information or warning message' },
    { id: 'modal', name: 'Modal', description: 'Dialog popup trigger' },
    { id: 'builderButton', name: 'Builder (M2A) Button Group', description: 'Button group for builder interface' },
    { id: 'superHeader', name: 'Super Header', description: 'Prominent section header' },
  ],
  'Groups': [
    { id: 'accordion', name: 'Accordion', description: 'Collapsible content sections' },
    { id: 'detailGroup', name: 'Detail Group', description: 'Grouped details with labels' },
    { id: 'rawGroup', name: 'Raw Group', description: 'Custom group without styling' },
    { id: 'modal', name: 'Modal', description: 'Popup dialog content group' },
    { id: 'tabGroup', name: 'Tab Group', description: 'Content organized in tabs' },
  ],
};

const flatFieldTypes = Object.entries(fieldTypes).flatMap(([category, types]) =>
  types.map(type => ({ ...type, group: category }))
);

export default function FieldConfiguration() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedFieldType, setSelectedFieldType] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('fields');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [appearanceSettings, setAppearanceSettings] = useState<any>({});
  const [advancedSettings, setAdvancedSettings] = useState<any>({});
  const [validationSettings, setValidationSettings] = useState<ValidationSettings>({});
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [componentSelectorOpen, setComponentSelectorOpen] = useState(false);
  const [jsonPreviewOpen, setJsonPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!collectionId) {
      navigate('/collections');
    }
  }, [collectionId, navigate]);

  useEffect(() => {
    if (!activeCategory && Object.keys(fieldTypes).length > 0) {
      setActiveCategory(Object.keys(fieldTypes)[0]);
    }
  }, [activeCategory]);

  const { data: collectionFields = [], isLoading, error } = useQuery({
    queryKey: ['fields', collectionId],
    queryFn: () => CollectionService.getFieldsForCollection(collectionId!),
    enabled: !!collectionId
  });

  // Convert CollectionField[] to Field[] ensuring required is set
  const fields: Field[] = collectionFields.map(field => ({
    ...field,
    required: field.required || false,
  }));

  const createFieldMutation = useMutation({
    mutationFn: (fieldData: any) => CollectionService.createField(collectionId!, fieldData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setSelectedFieldType(null);
      setSelectedFieldId(null);
      setAdvancedSettings({});
      setValidationSettings({});

      toast({
        title: "Field created",
        description: "Your field has been successfully created",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating field",
        description: "There was an error creating your field. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating field:", error);
    }
  });

  const updateFieldMutation = useMutation({
    mutationFn: ({ fieldId, fieldData }: { fieldId: string, fieldData: any }) =>
      CollectionService.updateField(collectionId!, fieldId, fieldData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });

      toast({
        title: "Field updated",
        description: "Your field has been successfully updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating field",
        description: "There was an error updating your field. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating field:", error);
    }
  });

  const deleteFieldMutation = useMutation({
    mutationFn: (fieldId: string) => CollectionService.deleteField(collectionId!, fieldId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setSelectedFieldId(null);

      toast({
        title: "Field deleted",
        description: "Your field has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting field",
        description: "There was an error deleting your field. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting field:", error);
    }
  });

  const selectFieldType = (typeId: string) => {
    setSelectedFieldType(typeId);
    setSelectedFieldId(null);
  };

  const selectField = (fieldId: string) => {
    const selectedField = fields.find(f => f.id === fieldId);
    console.log('Selected field:', selectedField);

    setSelectedFieldId(fieldId);
    setSelectedFieldType(null);

    if (selectedField && selectedField.validation) {
      setValidationSettings(selectedField.validation);
    } else {
      setValidationSettings({});
    }

    if (selectedField && selectedField.advanced) {
      setAdvancedSettings(selectedField.advanced);
    } else {
      setAdvancedSettings({});
    }

    if (selectedField && selectedField.appearance) {
      setAppearanceSettings(selectedField.appearance);
    } else {
      setAppearanceSettings({});
    }
  };

  const handleDeleteField = (fieldId: string) => {
    deleteFieldMutation.mutate(fieldId);
  };

  const handleSaveField = async (fieldData: any) => {
    setIsSaving(true);

    try {
      if (selectedFieldId) {
        await updateFieldMutation.mutateAsync({
          fieldId: selectedFieldId,
          fieldData: {
            ...fieldData,
            type: fields.find(f => f.id === selectedFieldId)?.type,
            appearance: appearanceSettings,
            validation: validationSettings,
            advanced: advancedSettings
          }
        });
      } else {
        await createFieldMutation.mutateAsync({
          ...fieldData,
          type: selectedFieldType,
          appearance: appearanceSettings,
          validation: validationSettings,
          advanced: advancedSettings
        });
      }

      setSelectedFieldId(null);
      setSelectedFieldType(null);
    } catch (error) {
      console.error('Error saving field:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateAppearanceSettings = (settings: any) => {
    console.log('Updating appearance settings:', JSON.stringify(settings, null, 2));
    setAppearanceSettings(settings);

    if (selectedFieldId) {
      const selectedField = fields.find(f => f.id === selectedFieldId);
      if (selectedField) {
        console.log('Saving appearance settings to database for field:', selectedField.name);
        console.log('UI Variant being saved:', settings.uiVariant);

        updateFieldMutation.mutate({
          fieldId: selectedFieldId,
          fieldData: {
            ...selectedField,
            appearance: settings
          }
        });
      }
    }
  };

  const handleUpdateAdvancedSettings = (settings: any) => {
    console.log('Updating advanced settings:', settings);
    setAdvancedSettings(settings);

    if (selectedFieldId) {
      const selectedField = fields.find(f => f.id === selectedFieldId);
      if (selectedField) {
        updateFieldMutation.mutate({
          fieldId: selectedFieldId,
          fieldData: {
            ...selectedField,
            advanced: settings
          }
        });
      }
    }
  };

  const handleUpdateValidationSettings = (settings: ValidationSettings) => {
    console.log('Updating validation settings in main component:', settings);
    setValidationSettings(settings);

    if (selectedFieldId) {
      const selectedField = fields.find(f => f.id === selectedFieldId);
      if (selectedField) {
        updateFieldMutation.mutate({
          fieldId: selectedFieldId,
          fieldData: {
            ...selectedField,
            validation: settings,
            required: settings.required || false
          }
        });
      }
    }
  };

  const handlePreview = () => {
    console.log('Opening preview with fields:', fields.map(field => ({
      id: field.id,
      name: field.name,
      type: field.type,
      appearance: field.appearance || (field.settings?.appearance) || {}
    })));
    setPreviewDialogOpen(true);
  };

  const handlePreviewSave = (formData: Record<string, any>) => {
    setPreviewData(formData);
    setJsonPreviewOpen(true);
    toast({
      title: "Preview data saved",
      description: "Your content has been captured for preview.",
    });
  };

  const addComponentFields = (componentId: string, componentFields: any[]) => {
    const fieldsToAdd = componentFields.map(field => ({
      name: field.name,
      type: field.type,
      description: '',
      placeholder: `Enter ${field.name}`,
      required: field.required,
      config: field.config || {},
    }));

    fieldsToAdd.forEach(fieldData => {
      createFieldMutation.mutate(fieldData);
    });

    toast({
      title: "Component added",
      description: `Added ${fieldsToAdd.length} fields from the component to your collection.`,
    });
  };

  const handleSaveAllChanges = () => {
    toast({
      title: "Changes saved",
      description: "All your field configuration changes have been saved.",
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'fields':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  Fields
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setComponentSelectorOpen(true)}
                      className="h-8 gap-1"
                    >
                      <FileType className="h-4 w-4" />
                      Add Component
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedFieldId(null);
                        setSelectedFieldType(null);
                      }}
                      className="h-8 gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Field
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  All fields defined for this collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center py-4 text-gray-500">Loading fields...</p>
                ) : error ? (
                  <p className="text-center py-4 text-red-500">Error loading fields</p>
                ) : (
                  <FieldList
                    fields={fields}
                    onSelectField={selectField}
                    onDeleteField={handleDeleteField}
                    selectedFieldId={selectedFieldId}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-2">
              {!selectedFieldType && !selectedFieldId ? (
                <>
                  <CardHeader>
                    <CardTitle className="text-lg">Field Types</CardTitle>
                    <CardDescription>
                      Select a field type to add to your collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <Tabs value={activeCategory || Object.keys(fieldTypes)[0]} onValueChange={setActiveCategory}>
                        <TabsList className="mb-4 flex flex-wrap h-auto">
                          {Object.keys(fieldTypes).map((category) => (
                            <TabsTrigger key={category} value={category} className="h-9">
                              {category}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {Object.entries(fieldTypes).map(([category, types]) => (
                          <TabsContent key={category} value={category}>
                            <FieldTypeSelector
                              fieldTypes={types}
                              onSelectFieldType={selectFieldType}
                            />
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {selectedFieldId ? 'Edit Field' : 'New Field'}
                      </CardTitle>
                      <CardDescription>
                        {selectedFieldId
                          ? 'Modify the field properties'
                          : `Configure your new ${flatFieldTypes.find(t => t.id === selectedFieldType)?.name} field`
                        }
                      </CardDescription>
                    </div>
                    {selectedFieldId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this field?")) {
                            handleDeleteField(selectedFieldId);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Field
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <FieldConfigPanel
                      fieldType={selectedFieldType || (selectedFieldId ? fields.find(f => f.id === selectedFieldId)?.type : null)}
                      fieldData={selectedFieldId ? fields.find(f => f.id === selectedFieldId) : undefined}
                      onSave={handleSaveField}
                      onCancel={() => {
                        setSelectedFieldId(null);
                        setSelectedFieldType(null);
                      }}
                      onUpdateAdvanced={handleUpdateAdvancedSettings}
                    />
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        );
      case 'validation':
        return (
          <Card>
            <CardContent className="pt-6">
              {selectedFieldId ? (
                <FieldValidationPanel
                  fieldType={fields.find(f => f.id === selectedFieldId)?.type || null}
                  initialData={fields.find(f => f.id === selectedFieldId)?.validation || {}}
                  onUpdate={handleUpdateValidationSettings}
                />
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-xl font-semibold mb-2">No Field Selected</h3>
                  <p className="text-gray-500 mb-6">Please select a field from the list to configure its validation rules</p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('fields')}
                  >
                    Back to Fields
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'appearance':
        return (
          <Card>
            <CardContent className="pt-6">
              {selectedFieldId ? (
                <FieldAppearancePanel
                  fieldType={fields.find(f => f.id === selectedFieldId)?.type || null}
                  initialData={fields.find(f => f.id === selectedFieldId)?.appearance || {}}
                  onSave={handleUpdateAppearanceSettings}
                />
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-xl font-semibold mb-2">No Field Selected</h3>
                  <p className="text-gray-500 mb-6">Please select a field from the list to configure its appearance</p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('fields')}
                  >
                    Back to Fields
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'advanced':
        return (
          <Card>
            <CardContent className="pt-6">
              {selectedFieldId ? (
                <FieldAdvancedPanel
                  fieldType={fields.find(f => f.id === selectedFieldId)?.type || null}
                  initialData={fields.find(f => f.id === selectedFieldId)?.advanced || {}}
                  onSave={handleUpdateAdvancedSettings}
                />
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-xl font-semibold mb-2">No Field Selected</h3>
                  <p className="text-gray-500 mb-6">Please select a field from the list to configure its advanced settings</p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('fields')}
                  >
                    Back to Fields
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'layout':
        return (
          <Card>
            <CardContent className="pt-6">
              <FieldLayoutPanel />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/collections')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold mb-1">Field Configuration</h1>
              <p className="text-sm text-gray-500">
                Configuring fields for "{collectionId}" collection
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                if (selectedFieldId) {
                  const selectedField = fields.find(f => f.id === selectedFieldId);
                  if (selectedField) {
                    updateFieldMutation.mutate({
                      fieldId: selectedFieldId,
                      fieldData: {
                        ...selectedField,
                        appearance: appearanceSettings,
                        validation: validationSettings,
                        advanced: advancedSettings
                      }
                    });
                  }
                }
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="fields">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-center">
                    Fields
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setComponentSelectorOpen(true)}
                        className="h-8 gap-1"
                      >
                        <FileType className="h-4 w-4" />
                        Add Component
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedFieldId(null);
                          setSelectedFieldType(null);
                        }}
                        className="h-8 gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Add Field
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    All fields defined for this collection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-center py-4 text-gray-500">Loading fields...</p>
                  ) : error ? (
                    <p className="text-center py-4 text-red-500">Error loading fields</p>
                  ) : (
                    <FieldList
                      fields={fields}
                      onSelectField={selectField}
                      onDeleteField={handleDeleteField}
                      selectedFieldId={selectedFieldId}
                      collectionId={collectionId}
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-1 lg:col-span-2">
                {!selectedFieldType && !selectedFieldId ? (
                  <>
                    <CardHeader>
                      <CardTitle className="text-lg">Field Types</CardTitle>
                      <CardDescription>
                        Select a field type to add to your collection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <Tabs value={activeCategory || Object.keys(fieldTypes)[0]} onValueChange={setActiveCategory}>
                          <TabsList className="mb-4 flex flex-wrap h-auto">
                            {Object.keys(fieldTypes).map((category) => (
                              <TabsTrigger key={category} value={category} className="h-9">
                                {category}
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          {Object.entries(fieldTypes).map(([category, types]) => (
                            <TabsContent key={category} value={category}>
                              <FieldTypeSelector
                                fieldTypes={types}
                                onSelectFieldType={selectFieldType}
                              />
                            </TabsContent>
                          ))}
                        </Tabs>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {selectedFieldId ? 'Edit Field' : 'New Field'}
                        </CardTitle>
                        <CardDescription>
                          {selectedFieldId
                            ? 'Modify the field properties'
                            : `Configure your new ${flatFieldTypes.find(t => t.id === selectedFieldType)?.name} field`
                          }
                        </CardDescription>
                      </div>
                      {selectedFieldId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this field?")) {
                              handleDeleteField(selectedFieldId);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Field
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      <FieldConfigPanel
                        fieldType={selectedFieldType || (selectedFieldId ? fields.find(f => f.id === selectedFieldId)?.type : null)}
                        fieldData={selectedFieldId ? fields.find(f => f.id === selectedFieldId) : undefined}
                        onSave={handleSaveField}
                        onCancel={() => {
                          setSelectedFieldId(null);
                          setSelectedFieldType(null);
                        }}
                        onUpdateAdvanced={handleUpdateAdvancedSettings}
                      />
                    </CardContent>
                  </>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="validation">
            <Card>
              <CardContent className="pt-6">
                {selectedFieldId ? (
                  <FieldValidationPanel
                    fieldType={fields.find(f => f.id === selectedFieldId)?.type || null}
                    initialData={fields.find(f => f.id === selectedFieldId)?.validation || {}}
                    onUpdate={handleUpdateValidationSettings}
                  />
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-xl font-semibold mb-2">No Field Selected</h3>
                    <p className="text-gray-500 mb-6">Please select a field from the list to configure its validation rules</p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('fields')}
                    >
                      Back to Fields
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardContent className="pt-6">
                {selectedFieldId ? (
                  <FieldAdvancedPanel
                    fieldType={fields.find(f => f.id === selectedFieldId)?.type || null}
                    initialData={fields.find(f => f.id === selectedFieldId)?.advanced || {}}
                    onSave={handleUpdateAdvancedSettings}
                  />
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-xl font-semibold mb-2">No Field Selected</h3>
                    <p className="text-gray-500 mb-6">Please select a field from the list to configure its advanced settings</p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('fields')}
                    >
                      Back to Fields
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={componentSelectorOpen} onOpenChange={setComponentSelectorOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Add Component</DialogTitle>
              <DialogDescription>
                Select a component to add its fields to your collection
              </DialogDescription>
            </DialogHeader>

            <ComponentSelector
              onSelectComponent={(component) => {
                addComponentFields(component.id, component.fields);
                setComponentSelectorOpen(false);
              }}
              onCancel={() => setComponentSelectorOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl font-bold">Collection Preview</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewDialogOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DialogDescription>
                Fill in the fields to preview how the content will look
              </DialogDescription>
            </DialogHeader>

            <CollectionPreviewForm
              collectionId={collectionId || ''}
              fields={fields.map(field => {
                // Extract appearance settings
                const appearance = field.appearance || (field.settings?.appearance) || {};
                console.log(`Preview: Field ${field.name} appearance settings:`, JSON.stringify(appearance, null, 2));

                // Create a new field object with appearance settings
                return {
                  ...field,
                  appearance: appearance
                };
              })}
              isLoading={isLoading}
              error={error}
              onPreviewSave={handlePreviewSave}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={jsonPreviewOpen} onOpenChange={setJsonPreviewOpen}>
          <AlertDialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Preview Data JSON</AlertDialogTitle>
              <AlertDialogDescription>
                This is how your data will be structured in the database
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="py-4">
              <JSONEditorField
                id="jsonPreview"
                value={previewData}
                onChange={() => {}}
                rows={15}
                helpText="This is a read-only preview of your data structure"
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setJsonPreviewOpen(false)}>Close</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(previewData, null, 2));
                  toast({
                    title: "Copied to clipboard",
                    description: "JSON data has been copied to your clipboard",
                  });
                }}
              >
                Copy JSON
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
