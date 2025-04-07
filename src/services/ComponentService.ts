
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ComponentField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  config?: Record<string, any>;
}

export interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: ComponentField[];
  lastUpdated: string;
}

// We'll use the collections table but with a specific structure for components
export async function fetchComponents(): Promise<Component[]> {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('status', 'component') // Use status field to identify components
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(item => {
      // Parse the stored JSON data
      const componentData = item.description ? JSON.parse(item.description) : {};
      
      return {
        id: item.id,
        name: item.title,
        description: componentData.description || '',
        category: componentData.category || 'Other',
        fields: componentData.fields || [],
        lastUpdated: item.updated_at
      };
    });
  } catch (error) {
    console.error('Error fetching components:', error);
    toast({
      title: 'Failed to load components',
      description: 'There was an error loading your components',
      variant: 'destructive'
    });
    return [];
  }
}

export async function createComponent(component: Omit<Component, 'id' | 'lastUpdated'>): Promise<Component> {
  try {
    // Store component-specific data in description as JSON
    const componentData = {
      description: component.description,
      category: component.category,
      fields: component.fields
    };
    
    const { data, error } = await supabase
      .from('collections')
      .insert([{
        title: component.name,
        api_id: `component-${Date.now()}`,
        description: JSON.stringify(componentData),
        status: 'component', // Mark as a component
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Parse the stored JSON data
    const storedComponentData = JSON.parse(data.description || '{}');

    return {
      id: data.id,
      name: data.title,
      description: storedComponentData.description || '',
      category: storedComponentData.category || 'Other',
      fields: storedComponentData.fields || [],
      lastUpdated: data.updated_at
    };
  } catch (error) {
    console.error('Error creating component:', error);
    toast({
      title: 'Failed to create component',
      description: 'There was an error creating your component',
      variant: 'destructive'
    });
    throw error;
  }
}

export async function updateComponent(component: Component): Promise<Component> {
  try {
    // Store component-specific data in description as JSON
    const componentData = {
      description: component.description,
      category: component.category,
      fields: component.fields
    };
    
    const { data, error } = await supabase
      .from('collections')
      .update({
        title: component.name,
        description: JSON.stringify(componentData),
      })
      .eq('id', component.id)
      .eq('status', 'component')
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Parse the stored JSON data
    const storedComponentData = JSON.parse(data.description || '{}');

    return {
      id: data.id,
      name: data.title,
      description: storedComponentData.description || '',
      category: storedComponentData.category || 'Other',
      fields: storedComponentData.fields || [],
      lastUpdated: data.updated_at
    };
  } catch (error) {
    console.error('Error updating component:', error);
    toast({
      title: 'Failed to update component',
      description: 'There was an error updating your component',
      variant: 'destructive'
    });
    throw error;
  }
}

export async function deleteComponent(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id)
      .eq('status', 'component');

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting component:', error);
    toast({
      title: 'Failed to delete component',
      description: 'There was an error deleting your component',
      variant: 'destructive'
    });
    throw error;
  }
}
