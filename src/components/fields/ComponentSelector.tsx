
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ComponentSelectorProps {
  onSelectComponent: (component: any) => void;
  onCancel: () => void;
}

// Sample component templates
const componentTemplates = [
  {
    id: 'user-profile',
    name: 'User Profile',
    description: 'Basic user profile fields',
    fields: [
      { name: 'First Name', type: 'text', required: true },
      { name: 'Last Name', type: 'text', required: true },
      { name: 'Email', type: 'text', required: true },
      { name: 'Avatar', type: 'image', required: false },
      { name: 'Bio', type: 'textarea', required: false },
    ]
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Standard blog post fields',
    fields: [
      { name: 'Title', type: 'text', required: true },
      { name: 'Slug', type: 'slug', required: true },
      { name: 'Featured Image', type: 'image', required: false },
      { name: 'Content', type: 'wysiwyg', required: true },
      { name: 'Categories', type: 'relation', required: false },
      { name: 'Tags', type: 'tags', required: false },
      { name: 'Published Date', type: 'date', required: true },
    ]
  },
  {
    id: 'product',
    name: 'Product',
    description: 'E-commerce product fields',
    fields: [
      { name: 'Product Name', type: 'text', required: true },
      { name: 'SKU', type: 'text', required: true },
      { name: 'Price', type: 'number', required: true },
      { name: 'Description', type: 'wysiwyg', required: true },
      { name: 'Images', type: 'files', required: false },
      { name: 'Stock', type: 'number', required: true },
      { name: 'Categories', type: 'relation', required: false },
    ]
  }
];

export function ComponentSelector({ onSelectComponent, onCancel }: ComponentSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredComponents = componentTemplates.filter(component => 
    component.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    component.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search components..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {filteredComponents.map((component) => (
            <div 
              key={component.id}
              className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors"
              onClick={() => onSelectComponent(component)}
            >
              <h3 className="font-medium text-base">{component.name}</h3>
              <p className="text-sm text-muted-foreground">{component.description}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {component.fields.length} fields included
              </div>
            </div>
          ))}
          
          {filteredComponents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No components found matching "{searchQuery}"
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default ComponentSelector;
