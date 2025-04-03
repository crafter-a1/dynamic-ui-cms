
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, SlidersHorizontal, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { fetchCollections, getContentItems } from '@/services/CollectionService';
import { toast } from '@/hooks/use-toast';

export default function Content() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const collectionParam = queryParams.get('collection');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(collectionParam || 'all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [contentItems, setContentItems] = useState<any[]>([]);
  
  // Fetch collections
  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections
  });
  
  // Create a list of collections for the dropdown
  const collectionOptions = [
    { id: 'all', name: 'All Collections' },
    ...collections.map(c => ({ id: c.id, name: c.title }))
  ];
  
  // Fetch content items when selected collection changes
  useEffect(() => {
    const fetchContent = async () => {
      if (selectedCollection && selectedCollection !== 'all') {
        try {
          const items = await getContentItems(selectedCollection);
          setContentItems(items);
        } catch (error) {
          console.error('Error fetching content:', error);
          toast({
            title: "Error fetching content",
            description: "Please try again later",
            variant: "destructive",
          });
        }
      } else {
        setContentItems([]);
      }
    };
    
    fetchContent();
  }, [selectedCollection]);
  
  // Update URL when collection selection changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (selectedCollection !== 'all') {
      params.set('collection', selectedCollection);
    } else {
      params.delete('collection');
    }
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  }, [selectedCollection, navigate, location.pathname]);
  
  // Filter content based on search, collection and status
  const filteredContent = contentItems.filter(entry => {
    const data = entry.data || {};
    const matchesSearch = (data.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || entry.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Content</h1>
            <p className="text-gray-500">Manage and publish your content entries</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-cms-blue hover:bg-blue-700 mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Create Content
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Content</DialogTitle>
                <DialogDescription>
                  Select a collection to create new content
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Select defaultValue={selectedCollection !== 'all' ? selectedCollection : undefined}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collectionOptions.filter(c => c.id !== 'all').map(collection => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex justify-end">
                  <Button className="bg-cms-blue hover:bg-blue-700">
                    Continue
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search content..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Collection" />
              </SelectTrigger>
              <SelectContent>
                {collectionOptions.map(collection => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Sort</span>
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.length > 0 ? (
                filteredContent.map((entry) => {
                  const data = entry.data || {};
                  const collection = collections.find(c => c.id === selectedCollection);
                  const collectionName = collection ? collection.title : selectedCollection;
                  
                  // Format dates
                  const createdDate = new Date(entry.created_at);
                  const updatedDate = new Date(entry.updated_at);
                  const createdAtFormatted = createdDate.toLocaleDateString();
                  const updatedAtFormatted = updatedDate.toLocaleDateString();
                  
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{data.title || 'Untitled'}</TableCell>
                      <TableCell>{collectionName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={entry.status === 'published' ? 'default' : 'outline'}
                          className={`${entry.status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-gray-100 text-gray-800 hover:bg-gray-100'}`}
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{createdAtFormatted}</TableCell>
                      <TableCell>{updatedAtFormatted}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {selectedCollection === 'all'
                      ? 'Please select a specific collection to view content'
                      : 'No content entries found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
