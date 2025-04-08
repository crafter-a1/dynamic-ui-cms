
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { CollectionPreviewForm } from '@/components/collection-preview/CollectionPreviewForm';
import { toast } from '@/hooks/use-toast';
import { adaptFieldsForPreview } from '@/utils/fieldAdapters';
import { getFieldsForCollection } from '@/services/CollectionService';

export default function CollectionPreview() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const [fields, setFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handleBackClick = () => {
    navigate(`/collections/${collectionId}/fields`);
  };

  // Fetch collection fields with their appearance settings
  useEffect(() => {
    const fetchCollectionFields = async () => {
      if (!collectionId) return;

      setIsLoading(true);
      try {
        console.log(`[CollectionPreview] Fetching fields for collection ${collectionId}...`);
        
        // Fetch fields from the database using our service
        const fetchedFields = await getFieldsForCollection(collectionId);
        console.log("[CollectionPreview] Raw fields fetched from database:", JSON.stringify(fetchedFields, null, 2));
        
        // Some additional debugging to track appearance data
        console.log("[CollectionPreview] Checking appearance settings in raw fields:");
        fetchedFields.forEach((field: any) => {
          console.log(`Field ${field.fieldName || field.name} appearance data:`, JSON.stringify(field.settings?.appearance || field.appearance || {}, null, 2));
          
          // Special logging for UI variant which is critical
          const uiVariant = field.settings?.appearance?.uiVariant || field.appearance?.uiVariant || "standard";
          console.log(`Field ${field.fieldName || field.name} UI variant:`, uiVariant);
        });
        
        // Process fields to ensure consistent structure with field-specific settings
        console.log("[CollectionPreview] Adapting fields for preview...");
        const adaptedFields = adaptFieldsForPreview(fetchedFields);
        console.log("[CollectionPreview] Adapted fields for preview:", JSON.stringify(adaptedFields, null, 2));
        
        // Verify appearance settings for each field
        adaptedFields.forEach(field => {
          // Log each styling property that might affect the field's appearance
          console.log(`[CollectionPreview] Field ${field.name} appearance settings:`, JSON.stringify(field.appearance, null, 2));
          
          if (!field.appearance || Object.keys(field.appearance).length === 0) {
            console.warn(`[CollectionPreview] WARNING: No appearance settings found for field ${field.name}`);
          } else {
            console.log(`[CollectionPreview] Field ${field.name} UI variant:`, field.appearance.uiVariant);
            if (field.appearance.colors) {
              console.log(`[CollectionPreview] Field ${field.name} colors:`, field.appearance.colors);
            }
          }
        });
        
        setFields(adaptedFields);
      } catch (err) {
        console.error("[CollectionPreview] Error loading collection fields:", err);
        setError(err instanceof Error ? err : new Error('Failed to load collection fields'));
        toast({
          title: "Error loading collection",
          description: "There was a problem loading the collection fields",
          variant: "destructive"
        });
        
        // Fallback to localStorage if database fetch fails
        try {
          const storedFields = localStorage.getItem(`collection_${collectionId}_fields`);
          if (storedFields) {
            const parsedFields = JSON.parse(storedFields);
            console.log("[CollectionPreview] Falling back to stored fields from localStorage:", parsedFields);
            
            const adaptedFields = adaptFieldsForPreview(parsedFields);
            setFields(adaptedFields);
          }
        } catch (storageErr) {
          console.error("[CollectionPreview] Error loading from localStorage:", storageErr);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionFields();
  }, [collectionId]);

  const handleSavePreview = (formData: Record<string, any>) => {
    toast({
      title: "Preview data saved",
      description: "Your preview data has been saved successfully",
    });
    
    // In a real app, you might want to save this data to your backend
    console.log("[CollectionPreview] Preview form data saved:", formData);
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline"
            onClick={handleBackClick}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Fields
          </Button>
          <h1 className="text-2xl font-bold">Collection Preview</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <CollectionPreviewForm
                collectionId={collectionId || ""}
                fields={fields}
                isLoading={false}
                error={error}
                onPreviewSave={handleSavePreview}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
