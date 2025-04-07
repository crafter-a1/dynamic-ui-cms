
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, Grip, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export interface TreeItem {
  id: string;
  label: string;
  children?: TreeItem[];
  disabled?: boolean;
}

interface TreeViewFieldProps {
  id: string;
  label: string;
  items: TreeItem[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  required?: boolean;
  helpText?: string | null;
  className?: string;
  dragEnabled?: boolean;
}

export const TreeViewField = ({
  id,
  label,
  items = [],
  selectedIds = [],
  onChange,
  multiSelect = true,
  required = false,
  helpText = null,
  className,
  dragEnabled = false
}: TreeViewFieldProps) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  
  const toggleExpanded = (itemId: string) => {
    setExpandedIds(prevIds => 
      prevIds.includes(itemId)
        ? prevIds.filter(id => id !== itemId)
        : [...prevIds, itemId]
    );
  };
  
  const toggleSelection = (itemId: string) => {
    if (multiSelect) {
      onChange(
        selectedIds.includes(itemId)
          ? selectedIds.filter(id => id !== itemId)
          : [...selectedIds, itemId]
      );
    } else {
      onChange([itemId]);
    }
  };
  
  const isExpanded = (itemId: string) => expandedIds.includes(itemId);
  const isSelected = (itemId: string) => selectedIds.includes(itemId);
  
  const hasChildren = (item: TreeItem) => item.children && item.children.length > 0;
  
  const renderTreeItems = (items: TreeItem[], level = 0) => {
    return items.map(item => (
      <React.Fragment key={item.id}>
        <div 
          className={cn(
            "flex items-center py-1.5 px-2 hover:bg-gray-50 rounded-sm",
            isSelected(item.id) && "bg-primary-50 text-primary font-medium",
            item.disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{ paddingLeft: `${(level * 12) + 8}px` }}
        >
          {dragEnabled && (
            <Grip className="h-4 w-4 mr-1 text-muted-foreground cursor-grab" />
          )}
          
          <div className="mr-1 w-5 flex-shrink-0">
            {hasChildren(item) ? (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 p-0"
                onClick={() => toggleExpanded(item.id)}
              >
                {isExpanded(item.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : null}
          </div>
          
          {multiSelect && (
            <Checkbox
              id={`tree-${item.id}`}
              checked={isSelected(item.id)}
              onCheckedChange={() => !item.disabled && toggleSelection(item.id)}
              disabled={item.disabled}
              className="mr-2"
            />
          )}
          
          <div 
            className={cn(
              "flex-1 text-sm cursor-pointer",
              item.disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
            onClick={() => !item.disabled && toggleSelection(item.id)}
          >
            {item.label}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {hasChildren(item) && isExpanded(item.id) && (
          <div className="ml-5 border-l border-gray-200 pl-2">
            {renderTreeItems(item.children!, level + 1)}
          </div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      
      <Card className="overflow-hidden">
        <div className="bg-slate-50 px-3 py-2 border-b text-sm font-medium">
          Hierarchical Structure
        </div>
        <div className="p-1 max-h-60 overflow-auto">
          {items.length === 0 ? (
            <div className="p-4 text-sm text-center text-muted-foreground">
              No items available
            </div>
          ) : (
            renderTreeItems(items)
          )}
        </div>
      </Card>
      
      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};

export default TreeViewField;
