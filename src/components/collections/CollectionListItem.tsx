
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface CollectionListItemProps {
  id: string;
  title: string;
  fields: number;
  items?: number;
  lastUpdated: string;
  icon?: string;
  iconColor?: string;
  status?: 'published' | 'draft';
}

export function CollectionListItem({ 
  id,
  title, 
  fields, 
  items = 0,
  lastUpdated, 
  icon = 'C',
  iconColor = 'blue',
  status = 'published'
}: CollectionListItemProps) {
  
  return (
    <div className="grid grid-cols-12 items-center p-4 hover:bg-gray-50">
      <div className="col-span-5 flex items-center">
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mr-3 text-white text-sm font-semibold"
          style={{ backgroundColor: iconColor === 'blue' ? '#0067ff' : iconColor === 'green' ? '#22c55e' : iconColor === 'orange' ? '#f97316' : iconColor === 'purple' ? '#8b5cf6' : iconColor === 'teal' ? '#14b8a6' : '#0067ff' }}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{title}</span>
          <div className="flex items-center mt-1">
            <Badge
              variant={status === 'published' ? 'default' : 'outline'}
              className={`text-xs ${status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-gray-100 text-gray-800 hover:bg-gray-100'}`}
            >
              {status}
            </Badge>
          </div>
        </div>
      </div>
      <div className="col-span-2 text-center">
        <span className="text-gray-600">{fields}</span>
      </div>
      <div className="col-span-2 text-center">
        <span className="text-gray-600">{items}</span>
      </div>
      <div className="col-span-2">
        <span className="text-gray-600 text-sm">{lastUpdated}</span>
      </div>
      <div className="col-span-1 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/collections/${id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/collections/${id}/fields`}>Configure Fields</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/content?collection=${id}`}>View Content</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
