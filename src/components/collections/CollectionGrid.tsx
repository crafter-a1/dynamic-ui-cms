import { CollectionCard } from './CollectionCard';
import { CollectionListItem } from './CollectionListItem';
import { useIsMobile } from '@/hooks/use-mobile';
import { Collection } from '@/services/CollectionService';
import { Skeleton } from '@/components/ui/skeleton';

interface CollectionGridProps {
  collections: Collection[];
  viewMode: 'grid' | 'list';
  sortOption: string;
  onCreateNew?: () => void;
  isLoading?: boolean;
}

export function CollectionGrid({ collections, viewMode, sortOption, onCreateNew, isLoading = false }: CollectionGridProps) {
  const isMobile = useIsMobile();
  
  // Sort collections based on the selected option
  const sortedCollections = [...collections].sort((a, b) => {
    if (sortOption === 'alphabetical') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'oldest') {
      return new Date(a.createdAt || a.created_at || 0).getTime() - new Date(b.createdAt || b.created_at || 0).getTime();
    } else {
      // Default to 'latest'
      return new Date(b.updatedAt || b.updated_at || 0).getTime() - new Date(a.updatedAt || a.updated_at || 0).getTime();
    }
  });

  // Loading states
  if (isLoading) {
    if (viewMode === 'list') {
      return (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden overflow-x-auto">
          <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-100 text-sm font-medium text-gray-500">
            <div className="col-span-5">Name</div>
            <div className="col-span-2 text-center">Fields</div>
            <div className="col-span-2 text-center">Entries</div>
            <div className="col-span-2">Last Updated</div>
            <div className="col-span-1"></div>
          </div>
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="grid grid-cols-12 p-4">
                <div className="col-span-5"><Skeleton className="h-6 w-4/5" /></div>
                <div className="col-span-2 text-center"><Skeleton className="h-6 w-8 mx-auto" /></div>
                <div className="col-span-2 text-center"><Skeleton className="h-6 w-8 mx-auto" /></div>
                <div className="col-span-2"><Skeleton className="h-6 w-24" /></div>
                <div className="col-span-1"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-lg border border-gray-200 p-4 h-[180px]">
            <div className="flex items-center space-x-3 mb-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex justify-between mt-auto">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
        
        {/* Create Collection Card still visible during loading */}
        <div 
          className="bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 min-h-[180px] hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={onCreateNew}
        >
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <span className="text-xl text-gray-400">+</span>
          </div>
          <p className="text-gray-600 text-sm">Create Collection</p>
        </div>
      </div>
    );
  }

  if (collections.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-500">No collections found</h3>
        <p className="text-gray-400 mt-2">Create your first collection to get started</p>
        <div 
          className="mt-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 mx-auto max-w-sm hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={onCreateNew}
        >
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <span className="text-xl text-gray-400">+</span>
          </div>
          <p className="text-gray-600 text-sm">Create Collection</p>
        </div>
      </div>
    );
  }
  
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden overflow-x-auto">
        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-100 text-sm font-medium text-gray-500">
          <div className="col-span-5">Name</div>
          <div className="col-span-2 text-center">Fields</div>
          <div className="col-span-2 text-center">Entries</div>
          <div className="col-span-2">Last Updated</div>
          <div className="col-span-1"></div>
        </div>
        <div className="divide-y divide-gray-100">
          {sortedCollections.map((collection) => (
            <CollectionListItem
              key={collection.id}
              id={collection.id}
              title={collection.title}
              icon={collection.icon}
              iconColor={collection.iconColor}
              fields={collection.fields?.length || 0}
              items={collection.items || 0}
              lastUpdated={collection.lastUpdated || collection.updatedAt || collection.updated_at}
              status={(collection.status as "published" | "draft") || "draft"}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sortedCollections.map((collection) => (
        <CollectionCard
          key={collection.id}
          id={collection.id}
          title={collection.title}
          icon={collection.icon}
          iconColor={collection.iconColor}
          fields={collection.fields?.length || 0}
          items={collection.items || 0}
          lastUpdated={collection.lastUpdated || collection.updatedAt || collection.updated_at}
          status={(collection.status as "published" | "draft") || "draft"}
        />
      ))}
      
      <div 
        className="bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 min-h-[180px] hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={onCreateNew}
      >
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <span className="text-xl text-gray-400">+</span>
        </div>
        <p className="text-gray-600 text-sm">Create Collection</p>
      </div>
    </div>
  );
}
