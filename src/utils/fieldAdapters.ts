
import { Field } from "@/services/CollectionService";

// Adapts field data from the API format to the format needed for the preview component
export const adaptFieldsForPreview = (fields: Field[]) => {
  return fields.map(field => ({
    id: field.id,
    apiId: field.api_id,
    name: field.name,
    type: field.type,
    label: field.name,
    description: field.description,
    placeholder: field.placeholder || `Enter ${field.name}`,
    defaultValue: field.default_value,
    validation: field.validation,
    options: field.options,
    required: field.required,
    helpText: field.description,
    min: field.config?.min,
    max: field.config?.max,
    customCSS: field.config?.customCSS || '',
    appearance: field.config?.appearance || {}
  }));
};

// Adapts component fields to collection fields
export const adaptComponentToFields = (component: any) => {
  return component.fields.map((field: any) => ({
    id: field.id,
    api_id: field.id.replace(/-/g, '_'),
    name: field.name,
    type: field.type,
    description: '',
    placeholder: `Enter ${field.name}`,
    default_value: '',
    options: [],
    required: field.required,
    config: field.config || {},
    validation: {},
  }));
};
