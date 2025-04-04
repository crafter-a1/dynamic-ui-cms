
import { CollectionCard } from './CollectionCard';
import { CollectionListItem } from './CollectionListItem';
import { useIsMobile } from '@/hooks/use-mobile';
import { Collection } from '@/services/CollectionService';

interface CollectionGridProps {
  collections: Collection[];
  viewMode: 'grid' | 'list';
  sortOption: string;
  onCreateNew?: () => void;
}

export function CollectionGrid({ collections, viewMode, sortOption, onCreateNew }: CollectionGridProps) {
  const isMobile = useIsMobile();
  
  // Sort collections based on the selected option
  const sortedCollections = [...collections].sort((a, b) => {
    if (sortOption === 'alphabetical') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'oldest') {
      // This is a simplification - in reality, you'd parse the dates
      return 1; // Just for demo - reverse of 'latest'
    } else {
      // Default to 'latest'
      return -1; // Just for demo - newest first
    }
  });

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
              fields={collection.fields || 0}
              items={collection.items || 0}
              lastUpdated={collection.lastUpdated || collection.updated_at}
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
          fields={collection.fields || 0}
          items={collection.items || 0}
          lastUpdated={collection.lastUpdated || collection.updated_at}
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
