import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, SlidersHorizontal, Plus, Grid, List, X, FileType } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NewCollectionForm } from '@/components/collections/NewCollectionForm';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { fetchCollections, createCollection, Collection } from '@/services/CollectionService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

export default function Collections() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState('latest');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  const { data: collections = [], isLoading, error } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
  
  const createCollectionMutation = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create collection",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handleCollectionCreated = async (formData: any) => {
    createCollectionMutation.mutate({
      name: formData.name,
      apiId: formData.apiId,
      description: formData.description,
      status: formData.status || 'published',
      settings: formData.settings
    });
    
    toast({
      title: "Collection created",
      description: `Successfully created ${formData.name} collection`,
    });
  };

  const filteredCollections = collections.filter(collection => 
    collection.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-full overflow-x-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Collections</h1>
            <p className="text-gray-500 text-sm">Manage your content structure and data models</p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Link to="/fields-showcase">
              <Button variant="outline" className="flex items-center gap-2">
                <FileType className="h-4 w-4" />
                Field Components
              </Button>
            </Link>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Collection
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] p-6 overflow-y-auto max-h-[90vh]">
                <DialogTitle className="text-2xl font-bold">Create Collection</DialogTitle>
                <DialogDescription className="text-gray-500 text-sm">
                  Define a new content structure for your CMS
                </DialogDescription>
                <NewCollectionForm 
                  onCollectionCreated={handleCollectionCreated} 
                  onClose={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search collections..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2 h-10 text-sm">
              <Filter className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : ""}>Filter</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 h-10 text-sm">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className={isMobile ? "sr-only" : ""}>
                    {!isMobile && "Sort: "}
                    {sortOption === 'latest' ? 'Latest' : sortOption === 'oldest' ? 'Oldest' : 'A-Z'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
                  <DropdownMenuRadioItem value="latest">Latest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="alphabetical">Alphabetical</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-blue-600 text-white h-10 w-10' : 'text-gray-500 h-10 w-10'}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-blue-600 text-white h-10 w-10' : 'text-gray-500 h-10 w-10'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading collections. Please try again.</p>
          </div>
        ) : (
          <div className="pb-6">
            <CollectionGrid 
              collections={filteredCollections} 
              viewMode={viewMode}
              sortOption={sortOption}
              onCreateNew={() => setIsDialogOpen(true)}
              isLoading={isLoading}
            />
          </div>
        )}
        
        {!isLoading && filteredCollections.length === 0 && searchQuery === '' && (
          <div className="text-center my-8">
            <p className="text-gray-500 mb-4">No collections found. Create your first collection to get started.</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Collection
            </Button>
          </div>
        )}
        
        {!isLoading && filteredCollections.length === 0 && searchQuery !== '' && (
          <div className="text-center my-8">
            <p className="text-gray-500">No collections matching "{searchQuery}"</p>
            <Button 
              variant="ghost" 
              onClick={() => setSearchQuery('')}
              className="mt-2"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
