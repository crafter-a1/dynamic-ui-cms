
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { CollectionPreviewForm } from '@/components/collection-preview/CollectionPreviewForm';
import { toast } from '@/hooks/use-toast';
import { adaptFieldsForPreview } from '@/utils/fieldAdapters';

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
        // Simulate fetching fields from API
        // In a real app, this would be an API call to get fields with their configurations
        const storedFields = localStorage.getItem(`collection_${collectionId}_fields`);
        
        if (storedFields) {
          try {
            const parsedFields = JSON.parse(storedFields);
            console.log("Loaded raw fields from storage:", parsedFields);
            
            // Process fields to ensure consistent structure
            const adaptedFields = adaptFieldsForPreview(parsedFields);
            console.log("Adapted fields for preview:", adaptedFields);
            
            // Log UI variants for debugging
            adaptedFields.forEach(field => {
              console.log(`Preview: Field ${field.name} appearance settings:`, JSON.stringify(field.appearance || {}, null, 2));
            });
            
            setFields(adaptedFields);
          } catch (parseError) {
            console.error("Error parsing stored fields:", parseError);
            setError(parseError instanceof Error ? parseError : new Error('Failed to parse stored fields'));
          }
        } else {
          console.log("No stored fields found for collection:", collectionId);
          // If no stored fields, we could fetch from a default source
          setFields([]);
        }
      } catch (err) {
        console.error("Error loading collection fields:", err);
        setError(err instanceof Error ? err : new Error('Failed to load collection fields'));
        toast({
          title: "Error loading collection",
          description: "There was a problem loading the collection fields",
          variant: "destructive"
        });
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
    console.log("Preview form data saved:", formData);
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
