
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateCalendarField } from '@/components/fields/inputs/DateCalendarField';
import { InputTextField } from '@/components/fields/inputs/InputTextField';
import { NumberInputField } from '@/components/fields/inputs/NumberInputField';
import { SelectButtonField } from '@/components/form-fields/SelectButtonField';
import { useQuery } from '@tanstack/react-query';
import { getFieldsForCollection } from '@/services/CollectionService';
import { adaptFieldsForPreview } from '@/utils/fieldAdapters';

export default function CollectionPreview() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [formData, setFormData] = useState({});
  const [fieldDefinitions, setFieldDefinitions] = useState([]);

  const { data: fields = [], isLoading, error } = useQuery({
    queryKey: ['fields', collectionId],
    queryFn: () => getFieldsForCollection(collectionId!),
    enabled: !!collectionId
  });

  useEffect(() => {
    if (fields) {
      setFieldDefinitions(adaptFieldsForPreview(fields));
      // Initialize form data with default values
      const initialData = fields.reduce((acc, field) => {
        acc[field.api_id] = field.default_value || '';
        return acc;
      }, {});
      setFormData(initialData);
    }
  }, [fields]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  const renderField = (field) => {
    const commonProps = {
      key: field.id,
      id: field.apiId,
      label: field.name,
      value: formData[field.apiId],
      onChange: (value) => handleInputChange(field.apiId, value),
      required: field.required || false,
      helpText: field.helpText || null,
    };

    switch (field.type) {
      case 'text':
        return (
          <InputTextField
            {...commonProps}
            placeholder={field.placeholder || `Enter ${field.name}`}
          />
        );
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            placeholder={field.placeholder || `Enter ${field.name}`}
          />
        );
      case 'number':
        return (
          <NumberInputField
            {...commonProps}
            min={field.min}
            max={field.max}
            placeholder={field.placeholder || `Enter ${field.name}`}
          />
        );
      case 'boolean':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Label htmlFor={field.apiId}>{field.name}</Label>
            <Switch
              id={field.apiId}
              checked={formData[field.apiId] || false}
              onCheckedChange={(checked) => handleInputChange(field.apiId, checked)}
            />
          </div>
        );
      case 'select':
        return (
          <Select key={field.id} onValueChange={(value) => handleInputChange(field.apiId, value)}>
            <SelectTrigger id={field.apiId}>
              <SelectValue placeholder={`Select ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options &&
                field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        );
      case 'selectbutton':
        return (
          <SelectButtonField
            key={field.id}
            id={field.apiId}
            label={field.name}
            options={field.options}
            value={formData[field.apiId] || ''}
            onChange={(value) => handleInputChange(field.apiId, value)}
          />
        );
      case 'date':
        return (
          <DateCalendarField
            key={field.id}
            id={field.id}
            label={field.name}
            value={formData[field.apiId] || null}
            onChange={(date: Date) => {
              handleInputChange(field.apiId, date);
              console.log("Date changed:", date);
            }}
            required={field.required || false}
          />
        );
      default:
        return <div key={field.id}>Unknown field type: {field.type}</div>;
    }
  };

  if (isLoading) {
    return <MainLayout>Loading...</MainLayout>;
  }

  if (error) {
    return <MainLayout>Error: {error.message}</MainLayout>;
  }

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-4">Collection Preview</h1>
        <Card>
          <CardHeader>
            <CardTitle>Data Entry Form</CardTitle>
            <CardDescription>Enter data for the collection fields</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {fieldDefinitions && fieldDefinitions.map((field) => renderField(field))}
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
