
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ComponentsPanel } from '@/components/ComponentsPanel';
import { fetchCollections } from '@/services/CollectionService';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ComponentsPage: React.FC = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        setIsLoading(true);
        const collectionsData = await fetchCollections();
        setCollections(collectionsData);
      } catch (error) {
        console.error("Error loading collections:", error);
        toast({
          title: "Error loading collections",
          description: "There was a problem retrieving your collections.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, []);

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <ComponentsPanel collections={collections} />
        )}
      </div>
    </MainLayout>
  );
};

export default ComponentsPage;
