
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DetailItem {
  label: string;
  value: React.ReactNode;
}

interface DetailGroupFieldProps {
  id: string;
  title: string;
  description?: string;
  items: DetailItem[];
  className?: string;
  maxHeight?: number | string;
  bordered?: boolean;
  labelWidth?: string | number;
  collapsible?: boolean;
  initiallyExpanded?: boolean;
}

export const DetailGroupField = ({
  id,
  title,
  description,
  items = [],
  className,
  maxHeight,
  bordered = true,
  labelWidth = "40%",
  collapsible = false,
  initiallyExpanded = true
}: DetailGroupFieldProps) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  const toggleExpanded = () => {
    if (collapsible) {
      setExpanded(!expanded);
    }
  };

  return (
    <div 
      id={id} 
      className={cn("w-full", className)}
    >
      <Card className={cn(
        "overflow-hidden",
        !bordered && "border-0 shadow-none"
      )}>
        <div 
          className={cn(
            "bg-muted/50 px-4 py-3 flex items-center justify-between",
            collapsible && "cursor-pointer"
          )}
          onClick={toggleExpanded}
        >
          <div>
            <h3 className="font-medium text-sm">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          
          {collapsible && (
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        
        {expanded && (
          <div 
            className="divide-y" 
            style={maxHeight ? { 
              maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
              overflowY: 'auto'
            } : {}}
          >
            {items.length === 0 ? (
              <div className="p-4 text-sm text-center text-muted-foreground">
                No details available
              </div>
            ) : (
              items.map((item, index) => (
                <div key={index} className="flex p-3">
                  <div 
                    className="text-sm font-medium text-muted-foreground pr-3"
                    style={{ width: labelWidth }}
                  >
                    {item.label}
                  </div>
                  <div className="text-sm flex-1">
                    {item.value}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DetailGroupField;
