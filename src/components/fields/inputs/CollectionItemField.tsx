
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, MoreVertical, Search, X, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export interface CollectionItem {
  id: string;
  [key: string]: any;
}

interface CollectionItemFieldProps {
  id: string;
  label: string;
  collection: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  items: CollectionItem[];
  displayField?: string;
  searchFields?: string[];
  multiple?: boolean;
  required?: boolean;
  helpText?: string | null;
  className?: string;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  maxItems?: number;
}

export const CollectionItemField = ({
  id,
  label,
  collection,
  value,
  onChange,
  items = [],
  displayField = 'title',
  searchFields = ['title'],
  multiple = false,
  required = false,
  helpText = null,
  className,
  disabled = false,
  error,
  placeholder = 'Select items',
  maxItems
}: CollectionItemFieldProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);

  const selectedIds = Array.isArray(value) ? value : value ? [value] : [];
  const selectedItems = items.filter(item => selectedIds.includes(item.id));
  
  const filteredItems = searchTerm
    ? items.filter(item => 
        searchFields.some(field => 
          item[field] && 
          item[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : items;

  const handleSelect = (itemId: string) => {
    if (multiple) {
      const newValue = selectedIds.includes(itemId)
        ? selectedIds.filter(id => id !== itemId)
        : [...selectedIds, itemId];
      
      onChange(newValue);
    } else {
      onChange(itemId);
      setIsSelecting(false);
    }
  };

  const handleRemove = (itemId: string) => {
    if (multiple) {
      onChange(selectedIds.filter(id => id !== itemId));
    } else {
      onChange('');
    }
  };

  const canAddMore = !maxItems || selectedIds.length < maxItems;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {maxItems && (
          <span className="text-xs text-muted-foreground">
            {selectedIds.length}/{maxItems}
          </span>
        )}
      </div>
      
      {selectedItems.length > 0 && (
        <div className="space-y-2 mb-2">
          {selectedItems.map(item => (
            <Card
              key={item.id}
              className="p-3 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-xs">{item[displayField]?.charAt(0)}</span>
                </div>
                <span className="text-sm">{item[displayField]}</span>
              </div>
              
              {!disabled && (
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500" onClick={() => handleRemove(item.id)}>
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      
      {(!multiple || (multiple && canAddMore)) && (
        isSelecting ? (
          <Card className="overflow-hidden">
            <div className="p-2 border-b bg-muted/30 flex items-center">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${collection} items...`}
                className="border-0 bg-transparent focus-visible:ring-0 p-0 text-sm h-6"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsSelecting(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="p-4 text-sm text-center text-muted-foreground">
                  No items found
                </div>
              ) : (
                filteredItems.map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "p-3 flex items-center cursor-pointer hover:bg-muted/30",
                        isSelected && "bg-primary-50"
                      )}
                      onClick={() => handleSelect(item.id)}
                    >
                      {multiple ? (
                        <Checkbox
                          checked={isSelected}
                          className="mr-3"
                          onCheckedChange={() => handleSelect(item.id)}
                        />
                      ) : (
                        isSelected && (
                          <Check className="h-4 w-4 text-primary mr-3" />
                        )
                      )}
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-xs">{item[displayField]?.charAt(0)}</span>
                        </div>
                        <span className="text-sm">{item[displayField]}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-muted-foreground"
            disabled={disabled}
            onClick={() => setIsSelecting(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {selectedItems.length === 0 ? placeholder : `Add ${multiple ? 'more' : 'another'} ${collection}`}
          </Button>
        )
      )}
      
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CollectionItemField;
