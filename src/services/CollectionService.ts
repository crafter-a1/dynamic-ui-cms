import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { normalizeAppearanceSettings, validateUIVariant } from '@/utils/inputAdapters';

export interface ValidationSettings {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  email?: boolean;
  url?: boolean;
  unique?: boolean;
  message?: string;
  maxTags?: number;
  [key: string]: any;
}

export interface AppearanceSettings {
  uiVariant?: "standard" | "material" | "pill" | "borderless" | "underlined";
  textAlign?: string;
  labelPosition?: string;
  labelWidth?: number;
  floatLabel?: boolean;
  filled?: boolean;
  showBorder?: boolean;
  showBackground?: boolean;
  roundedCorners?: string;
  fieldSize?: string;
  labelSize?: string;
  customClass?: string;
  customCss?: string;
  colors?: Record<string, string>;
  isDarkMode?: boolean;
  responsive?: {
    mobile?: Record<string, any>;
    tablet?: Record<string, any>;
    desktop?: Record<string, any>;
  };
  [key: string]: any;
}

export interface Collection {
  id: string;
  title: string;
  apiId: string;
  description?: string;
  status: string;
  fields?: any[];
  createdAt: string;
  updatedAt: string;
  icon?: string;
  iconColor?: string;
  items?: number;
  lastUpdated?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CollectionFormData {
  name: string;
  apiId: string;
  description?: string;
  status?: string;
  settings?: Record<string, any>;
}

export interface CollectionField {
  id: string;
  name: string;
  apiId: string;
  type: string;
  description?: string;
  required: boolean;
  settings?: {
    validation?: ValidationSettings;
    appearance?: AppearanceSettings;
    advanced?: Record<string, any>;
    ui_options?: Record<string, any>;
    helpText?: string;
    [key: string]: any;
  };
  validation?: ValidationSettings;
  appearance?: AppearanceSettings;
  advanced?: Record<string, any>;
  ui_options?: Record<string, any>;
  helpText?: string;
  sort_order?: number;
  collection_id?: string;
}

const mapSupabaseCollection = (collection: Database['public']['Tables']['collections']['Row']): Collection => {
  return {
    id: collection.id,
    title: collection.title,
    apiId: collection.api_id,
    description: collection.description || undefined,
    status: collection.status,
    createdAt: collection.created_at,
    updatedAt: collection.updated_at,
    icon: collection.icon || 'file',
    iconColor: collection.icon_color || 'gray',
    items: 0,
    lastUpdated: collection.updated_at,
    created_at: collection.created_at,
    updated_at: collection.updated_at
  };
};

const mapSupabaseField = (field: Database['public']['Tables']['fields']['Row']): CollectionField => {
  const settings = field.settings as Record<string, any> || {};

  // Debug logging for field mapping
  console.log(`Mapping field ${field.name} from database:`, {
    fieldId: field.id,
    fieldName: field.name,
    fieldType: field.type,
    settings
  });

  // Log appearance settings specifically
  if (settings.appearance) {
    console.log(`Appearance settings for field ${field.name}:`, JSON.stringify(settings.appearance, null, 2));
  }
  
  // Ensure appearance settings are properly normalized
  if (settings.appearance) {
    settings.appearance = normalizeAppearanceSettings(settings.appearance);
  }

  return {
    id: field.id,
    name: field.name,
    apiId: field.api_id,
    type: field.type,
    description: field.description || undefined,
    required: field.required || false,
    settings: settings,
    sort_order: field.sort_order || 0,
    collection_id: field.collection_id || undefined,
  };
};

// Helper function for deep merging of objects
const deepMerge = (target: any, source: any): any => {
  if (!source) return target;
  if (!target) return { ...source };
  
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

// Helper to check if value is an object
const isObject = (item: any): boolean => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

export const CollectionService = {
  getFieldsForCollection: async (collectionId: string): Promise<CollectionField[]> => {
    try {
      const { data: fields, error } = await supabase
        .from('fields')
        .select('*')
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching fields:', error);
        throw error;
      }

      return fields.map(mapSupabaseField);
    } catch (error) {
      console.error('Failed to fetch fields:', error);
      return [];
    }
  },

  createField: async (collectionId: string, fieldData: Partial<CollectionField>): Promise<CollectionField> => {
    try {
      // First get the highest sort_order to add the new field at the bottom
      const { data: existingFields, error: countError } = await supabase
        .from('fields')
        .select('sort_order')
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: false })
        .limit(1);

      // Get the highest sort_order or use 0 if no fields exist
      const highestSortOrder = existingFields && existingFields.length > 0
        ? (existingFields[0].sort_order || 0) + 1
        : 0;

      const { apiId, ...restData } = fieldData;

      // Ensure we have a settings object
      const settings: Record<string, any> = { ...(fieldData.settings || {}) };

      // Move any properties that should be inside settings to the proper location
      if ('validation' in fieldData) {
        settings.validation = fieldData.validation;
        delete (restData as any).validation;
      }

      if ('appearance' in fieldData) {
        settings.appearance = fieldData.appearance;
        delete (restData as any).appearance;
      }

      if ('advanced' in fieldData) {
        settings.advanced = fieldData.advanced;
        delete (restData as any).advanced;
      }

      if ('helpText' in fieldData) {
        settings.helpText = fieldData.helpText;
        delete (restData as any).helpText;
      }

      if ('ui_options' in fieldData) {
        settings.ui_options = fieldData.ui_options;
        delete (restData as any).ui_options;
      }

      const field = {
        name: fieldData.name || 'New Field',
        api_id: apiId || fieldData.name?.toLowerCase().replace(/\s+/g, '_') || 'new_field',
        type: fieldData.type || 'text',
        collection_id: collectionId,
        description: fieldData.description || null,
        required: fieldData.required || false,
        settings: settings,
        sort_order: highestSortOrder, // Place the new field at the bottom
      };

      const { data, error } = await supabase
        .from('fields')
        .insert([field])
        .select()
        .single();

      if (error) {
        console.error('Error creating field:', error);
        throw error;
      }

      return mapSupabaseField(data);
    } catch (error) {
      console.error('Failed to create field:', error);
      throw error;
    }
  },

  updateField: async (collectionId: string, fieldId: string, fieldData: Partial<CollectionField>): Promise<CollectionField> => {
    try {
      const updateData: any = {};

      // Map basic field properties
      if (fieldData.name) updateData.name = fieldData.name;
      if (fieldData.apiId) updateData.api_id = fieldData.apiId;
      if (fieldData.type) updateData.type = fieldData.type;
      if (fieldData.description !== undefined) updateData.description = fieldData.description;
      if (fieldData.required !== undefined) updateData.required = fieldData.required;
      if (fieldData.sort_order !== undefined) updateData.sort_order = fieldData.sort_order;

      // Get current field data to properly merge with updates
      const { data: currentField, error: getCurrentError } = await supabase
        .from('fields')
        .select('settings')
        .eq('id', fieldId)
        .single();

      if (getCurrentError) {
        console.error('Error retrieving current field data:', getCurrentError);
        throw getCurrentError;
      }

      // Create a deep copy of the current settings
      const currentSettings = (currentField?.settings as Record<string, any>) || {};
      
      // Log current settings for debugging
      console.log('[updateField] Current settings before merging:', JSON.stringify(currentSettings, null, 2));
      console.log('[updateField] New data to merge:', JSON.stringify(fieldData, null, 2));
      
      // Initialize settings to update with deep copy of current settings
      let settingsToUpdate: Record<string, any> = JSON.parse(JSON.stringify(currentSettings));

      // Check if direct settings object is provided
      if (fieldData.settings) {
        console.log('[updateField] Merging provided settings object:', JSON.stringify(fieldData.settings, null, 2));
        settingsToUpdate = deepMerge(settingsToUpdate, fieldData.settings);
      }

      // Handle UI options
      if (fieldData.settings?.ui_options || fieldData.ui_options) {
        const newUiOptions = fieldData.settings?.ui_options || fieldData.ui_options || {};
        settingsToUpdate.ui_options = deepMerge(settingsToUpdate.ui_options || {}, newUiOptions);
      }

      // Handle help text
      if (fieldData.settings?.helpText !== undefined || fieldData.helpText !== undefined) {
        settingsToUpdate.helpText = fieldData.settings?.helpText ?? fieldData.helpText;
      }

      // Handle validation settings with deep merge
      if (fieldData.settings?.validation || fieldData.validation) {
        const newValidation = fieldData.settings?.validation || fieldData.validation || {};
        settingsToUpdate.validation = deepMerge(settingsToUpdate.validation || {}, newValidation);
      }

      // Handle appearance settings with deep merge
      if (fieldData.settings?.appearance || fieldData.appearance) {
        const newAppearance = fieldData.settings?.appearance || fieldData.appearance || {};
        
        // Log the appearance settings we're about to merge
        console.log('[updateField] Current appearance:', JSON.stringify(settingsToUpdate.appearance || {}, null, 2));
        console.log('[updateField] New appearance to merge:', JSON.stringify(newAppearance, null, 2));
        
        // Use deep merge to preserve all existing values not explicitly overwritten
        settingsToUpdate.appearance = deepMerge(settingsToUpdate.appearance || {}, newAppearance);
        
        // Ensure UI variant is properly set
        if (newAppearance.uiVariant) {
          settingsToUpdate.appearance.uiVariant = validateUIVariant(newAppearance.uiVariant);
        }
        
        // Log the final merged appearance settings
        console.log('[updateField] Merged appearance result:', JSON.stringify(settingsToUpdate.appearance, null, 2));
      }

      // Handle advanced settings with deep merge
      if (fieldData.settings?.advanced || fieldData.advanced) {
        const newAdvanced = fieldData.settings?.advanced || fieldData.advanced || {};
        settingsToUpdate.advanced = deepMerge(settingsToUpdate.advanced || {}, newAdvanced);
      }

      // Set the updated settings
      updateData.settings = settingsToUpdate;
      
      // Log the final settings structure being saved
      console.log('[updateField] Final settings structure being saved:', JSON.stringify(updateData.settings, null, 2));

      // Update the field in the database
      const { data, error } = await supabase
        .from('fields')
        .update(updateData)
        .eq('id', fieldId)
        .select()
        .single();

      if (error) {
        console.error('Error updating field:', error);
        throw error;
      }

      // Map the database response to our field model
      const mappedField = mapSupabaseField(data);
      
      // Log the mapped field for debugging
      console.log('[updateField] Updated field after mapping:', JSON.stringify(mappedField, null, 2));
      
      return mappedField;
    } catch (error) {
      console.error('Failed to update field:', error);
      throw error;
    }
  },

  deleteField: async (collectionId: string, fieldId: string): Promise<{ success: boolean }> => {
    try {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', fieldId);

      if (error) {
        console.error('Error deleting field:', error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to delete field:', error);
      return { success: false };
    }
  },

  updateFieldOrder: async (collectionId: string, fieldOrders: { id: string, sort_order: number }[]): Promise<boolean> => {
    try {
      // Update each field's sort_order in sequence
      for (const field of fieldOrders) {
        const { error } = await supabase
          .from('fields')
          .update({ sort_order: field.sort_order })
          .eq('id', field.id)
          .eq('collection_id', collectionId);

        if (error) {
          console.error(`Error updating field order for ${field.id}:`, error);
          throw error;
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to update field order:', error);
      return false;
    }
  },

  fetchCollections: async (): Promise<Collection[]> => {
    try {
      const { data: collections, error } = await supabase
        .from('collections')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching collections:', error);
        throw error;
      }

      const mappedCollections = collections.map(mapSupabaseCollection);

      for (const collection of mappedCollections) {
        try {
          const { count: fieldCount, error: fieldsError } = await supabase
            .from('fields')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);

          if (!fieldsError) {
            collection.fields = new Array(fieldCount || 0);
          }

          const { count: itemCount, error: itemsError } = await supabase
            .from('content_items')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);

          if (!itemsError) {
            collection.items = itemCount || 0;
          }
        } catch (countError) {
          console.error(`Error counting related data for collection ${collection.id}:`, countError);
        }
      }

      return mappedCollections;
    } catch (error) {
      console.error('Failed to fetch collections:', error);

      return [
        {
          id: 'col1',
          title: 'Blog Posts',
          apiId: 'blog_posts',
          description: 'Collection of blog posts',
          status: 'published',
          fields: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          icon: 'file-text',
          iconColor: 'blue',
          items: 5,
          lastUpdated: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'col2',
          title: 'Products',
          apiId: 'products',
          description: 'Collection of products',
          status: 'published',
          fields: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          icon: 'shopping-bag',
          iconColor: 'green',
          items: 12,
          lastUpdated: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  },

  createCollection: async (collectionData: CollectionFormData): Promise<Collection> => {
    try {
      const newCollection = {
        title: collectionData.name,
        api_id: collectionData.apiId,
        description: collectionData.description || null,
        status: collectionData.status || 'draft',
        icon: 'file',
        icon_color: 'gray',
      };

      const { data, error } = await supabase
        .from('collections')
        .insert([newCollection])
        .select()
        .single();

      if (error) {
        console.error('Error creating collection:', error);
        throw error;
      }

      return mapSupabaseCollection(data);
    } catch (error) {
      console.error('Failed to create collection:', error);

      return {
        id: `col-${Date.now()}`,
        title: collectionData.name,
        apiId: collectionData.apiId,
        description: collectionData.description,
        status: collectionData.status || 'draft',
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        icon: 'file',
        iconColor: 'gray',
        items: 0,
        lastUpdated: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  },

  getContentItems: async (collectionId: string): Promise<any[]> => {
    try {
      const { data: contentItems, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('collection_id', collectionId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching content items:', error);
        throw error;
      }

      return contentItems;
    } catch (error) {
      console.error('Failed to fetch content items:', error);

      return [
        {
          id: `item-${Date.now()}-1`,
          collection_id: collectionId,
          data: { title: 'Test Item 1' },
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: `item-${Date.now()}-2`,
          collection_id: collectionId,
          data: { title: 'Test Item 2' },
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  }
};

export const {
  getFieldsForCollection,
  createField,
  updateField,
  deleteField,
  updateFieldOrder,
  fetchCollections,
  createCollection,
  getContentItems
} = CollectionService;
