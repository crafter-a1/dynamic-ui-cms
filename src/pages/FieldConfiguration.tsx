import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldTypeSelector } from '@/components/fields/FieldTypeSelector';
import { FieldConfigPanel } from '@/components/fields/FieldConfigPanel';
import { FieldList } from '@/components/fields/FieldList';
import { FieldValidationPanel } from '@/components/fields/FieldValidationPanel';
import { FieldLayoutPanel } from '@/components/fields/FieldLayoutPanel';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFieldsForCollection, createField, deleteField } from '@/services/CollectionService';

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
  const [advancedSettings, setAdvancedSettings] = useState<any>({});
  const [previewMode, setPreviewMode] = useState(false);
  
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
  
  const { data: fields = [], isLoading, error } = useQuery({
    queryKey: ['fields', collectionId],
    queryFn: () => getFieldsForCollection(collectionId!),
    enabled: !!collectionId
  });
  
  const createFieldMutation = useMutation({
    mutationFn: (fieldData: any) => createField(collectionId!, fieldData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setSelectedFieldType(null);
      setSelectedFieldId(null);
      setAdvancedSettings({});
      
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

  const deleteFieldMutation = useMutation({
    mutationFn: (fieldId: string) => deleteField(collectionId!, fieldId),
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
    setSelectedFieldId(fieldId);
    setSelectedFieldType(null);
  };
  
  const handleDeleteField = (fieldId: string) => {
    deleteFieldMutation.mutate(fieldId);
  };

  const handleSaveField = async (fieldData: any) => {
    if (selectedFieldId) {
      toast({
        title: "Field updated",
        description: `The field "${fieldData.name}" has been updated.`,
      });
    } else {
      createFieldMutation.mutate({
        ...fieldData,
        type: selectedFieldType,
        advanced: advancedSettings
      });
    }
  };

  const handleUpdateAdvancedSettings = (settings: any) => {
    setAdvancedSettings(settings);
  };

  const handlePreview = () => {
    setPreviewMode(true);
    
    const previewUrl = `/collections/${collectionId}/preview`;
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "Preview mode",
      description: "Previewing your collection in a new tab",
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
              <FieldValidationPanel 
                fieldType={selectedFieldId ? fields.find(f => f.id === selectedFieldId)?.type || null : null} 
                onUpdate={(data) => {
                  console.log("Validation settings updated:", data);
                }}
              />
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
              <p className="text-gray-500">
                {collectionId ? `Configuring fields for "${collectionId}" collection` : 'Configure fields for your collection'}
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
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="fields" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3 mb-8">
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {renderTabContent()}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
