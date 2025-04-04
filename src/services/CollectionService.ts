
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface Collection {
  id: string;
  title: string;
  api_id: string;
  description: string;
  icon: string;
  icon_color: string;
  status: string;
  created_at: string;
  updated_at: string;
  settings?: any;
  permissions?: any;
  iconColor: string;
  fields?: number; // Changed from any[] to number to match the CollectionGrid.tsx interface
  items?: number;  // Added to match the CollectionGrid.tsx interface
  lastUpdated?: string;
}

export interface CollectionFormData {
  name: string;
  apiId: string;
  description?: string;
  status?: 'published' | 'draft';
  settings?: Json;
  permissions?: string[];
}

export async function fetchCollections(): Promise<Collection[]> {
  try {
    const { data: collectionsData, error: collectionsError } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });

    if (collectionsError) {
      throw collectionsError;
    }

    const fieldCounts: Record<string, number> = {};
    for (const collection of collectionsData || []) {
      const { count, error } = await supabase
        .from('fields')
        .select('*', { count: 'exact', head: false })
        .eq('collection_id', collection.id);
      
      if (error) {
        console.error("Error counting fields:", error);
      } else {
        fieldCounts[collection.id] = count || 0;
      }
    }

    const contentCounts: Record<string, number> = {};
    for (const collection of collectionsData || []) {
      const { count, error } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: false })
        .eq('collection_id', collection.id);
      
      if (error) {
        console.error("Error counting content items:", error);
      } else {
        contentCounts[collection.id] = count || 0;
      }
    }

    return (collectionsData || []).map((collection) => {
      // Handle settings and permissions safely
      const collectionWithOptionalProps = collection as any; // Type assertion to access optional properties
      const settingsValue = collectionWithOptionalProps.settings ?? {};
      const permissionsValue = collectionWithOptionalProps.permissions ?? [];
      
      return {
        id: collection.id,
        title: collection.title,
        api_id: collection.api_id,
        description: collection.description || '',
        icon: collection.icon || 'C',
        icon_color: collection.icon_color || 'blue',
        iconColor: collection.icon_color || 'blue',
        status: collection.status,
        created_at: collection.created_at,
        updated_at: collection.updated_at,
        lastUpdated: collection.updated_at,
        settings: settingsValue,
        permissions: permissionsValue,
        fields: fieldCounts[collection.id] || 0,  // Use the field count as a number
        items: contentCounts[collection.id] || 0  // Use the content count as a number
      };
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

export interface CreateCollectionParams {
  name: string;
  apiId: string;
  description?: string;
  status?: 'published' | 'draft';
  settings?: Json;
  permissions?: string[];
}

export async function createCollection(params: CreateCollectionParams): Promise<Collection> {
  try {
    const { name, apiId, description = '', status = 'published', settings = {}, permissions = [] } = params;
    
    const insertObj = { 
      title: name, 
      api_id: apiId, 
      description, 
      status,
      icon: 'C',
      icon_color: 'blue'
    };
    
    const { data: newCollection, error } = await supabase
      .from('collections')
      .insert([insertObj])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!newCollection) {
      throw new Error('Failed to create collection - no data returned');
    }

    // Handle settings and permissions safely
    const collectionWithOptionalProps = newCollection as any; // Type assertion to access optional properties
    const newCollectionSettings = collectionWithOptionalProps.settings ?? {};
    const newCollectionPermissions = collectionWithOptionalProps.permissions ?? [];

    return {
      id: newCollection.id,
      title: newCollection.title,
      api_id: newCollection.api_id,
      description: newCollection.description || '',
      icon: newCollection.icon || 'C',
      icon_color: newCollection.icon_color || 'blue',
      iconColor: newCollection.icon_color || 'blue',
      status: newCollection.status,
      created_at: newCollection.created_at,
      updated_at: newCollection.updated_at,
      lastUpdated: newCollection.updated_at,
      settings: newCollectionSettings,
      permissions: newCollectionPermissions,
      fields: 0, // New collection has no fields initially
      items: 0   // New collection has no items initially
    };
  } catch (error: any) {
    console.error('Error creating collection:', error);
    toast({
      title: 'Failed to create collection',
      description: error.message,
      variant: 'destructive'
    });
    throw error;
  }
}

export interface ContentItem {
  id: string;
  collection_id: string;
  data: any;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
  user_id?: string;
  is_published?: boolean;
  api_id?: string;
  api_id_plural?: string;
}

export async function getContentItems(collectionId: string): Promise<ContentItem[]> {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('collection_id', collectionId);

    if (error) {
      throw error;
    }

    return (data || []).map(item => ({
      ...item,
      status: item.status as 'published' | 'draft'
    }));
  } catch (error) {
    console.error('Error fetching content items:', error);
    throw error;
  }
}

export interface Field {
  id: string;
  name: string;
  api_id: string;
  type: string;
  collection_id: string;
  label?: string;
  description?: string;
  placeholder?: string;
  default_value?: any;
  validation?: any;
  options?: any;
  is_hidden?: boolean;
  position?: number;
  required: boolean;
  ui_options?: any;
  config?: any;
  order?: number;
}

export interface FieldSettings {
  default_value?: any;
  validation?: any;
  options?: any;
  is_hidden?: boolean;
  ui_options?: any;
  [key: string]: any;
}

export async function getFieldsForCollection(collectionId: string): Promise<Field[]> {
  try {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('collection_id', collectionId)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return (data || []).map(field => {
      const settings = field.settings as FieldSettings || {};
      
      return {
        id: field.id,
        name: field.name,
        api_id: field.api_id,
        type: field.type,
        collection_id: field.collection_id,
        description: field.description || '',
        label: field.name,
        placeholder: '',
        default_value: settings.default_value || null,
        validation: settings.validation || null,
        options: settings.options || null,
        is_hidden: settings.is_hidden || false,
        position: field.sort_order || 0,
        required: field.required || false,
        ui_options: settings.ui_options || null,
        config: field.settings || {},
        order: field.sort_order || 0
      };
    });
  } catch (error) {
    console.error('Error fetching fields:', error);
    throw error;
  }
}

export async function createField(collectionId: string, fieldData: any): Promise<Field> {
  try {
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .single();

    if (collectionError || !collection) {
      throw new Error(`Collection with ID ${collectionId} not found`);
    }

    const fieldSettings: FieldSettings = {
      default_value: fieldData.default_value || null,
      validation: fieldData.validation || null,
      options: fieldData.options || null,
      is_hidden: fieldData.is_hidden || false,
      ui_options: fieldData.ui_options || null
    };

    const { data: field, error } = await supabase
      .from('fields')
      .insert([
        {
          collection_id: collectionId,
          name: fieldData.name,
          api_id: fieldData.api_id || fieldData.name.toLowerCase().replace(/\s+/g, '_'),
          type: fieldData.type,
          description: fieldData.description || '',
          required: fieldData.required || false,
          sort_order: fieldData.position || 0,
          settings: fieldSettings
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!field) {
      throw new Error('Failed to create field - no data returned');
    }

    return {
      id: field.id,
      name: field.name,
      api_id: field.api_id,
      type: field.type,
      collection_id: field.collection_id,
      description: field.description || '',
      label: field.name,
      placeholder: '',
      default_value: fieldSettings.default_value,
      validation: fieldSettings.validation,
      options: fieldSettings.options,
      is_hidden: fieldSettings.is_hidden,
      position: field.sort_order || 0,
      required: field.required || false,
      ui_options: fieldSettings.ui_options,
      config: field.settings || {},
      order: field.sort_order || 0
    };
  } catch (error: any) {
    console.error('Error creating field:', error);
    throw error;
  }
}

export const deleteField = async (collectionId: string, fieldId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`Deleting field ${fieldId} from collection ${collectionId}`);
  
  return Promise.resolve();
};
