
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface TagsInputFieldProps {
  id: string;
  label?: string;
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  maxTags?: number;
}

export function TagsInputField({
  id,
  label,
  value = [],
  onChange,
  placeholder = 'Add tags...',
  required = false,
  helpText,
  className,
  maxTags = 10
}: TagsInputFieldProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const trimmedInput = inputValue.trim();
    
    // Add tag on Enter or comma
    if ((e.key === 'Enter' || e.key === ',') && trimmedInput) {
      e.preventDefault();
      
      if (value.includes(trimmedInput)) {
        // Tag already exists
        setInputValue('');
        return;
      }
      
      if (value.length >= maxTags) {
        // Maximum tags reached
        return;
      }
      
      const newTags = [...value, trimmedInput];
      onChange(newTags);
      setInputValue('');
    }
    
    // Remove last tag on Backspace if input is empty
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      const newTags = value.slice(0, -1);
      onChange(newTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter(tag => tag !== tagToRemove);
    onChange(newTags);
    inputRef.current?.focus();
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div 
        className={cn(
          "flex flex-wrap gap-2 p-2 bg-background border border-input rounded-md focus-within:ring-1 focus-within:ring-ring",
          value.length === 0 && "min-h-10"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            variant="secondary"
            className="flex items-center gap-1 text-sm px-2 py-1"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              aria-label={`Remove ${tag}`}
              className="h-4 w-4 rounded-full hover:bg-muted-foreground/20 flex items-center justify-center"
            >
              <X size={12} />
            </button>
          </Badge>
        ))}
        
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7"
          aria-describedby={helpText ? `${id}-description` : undefined}
          disabled={value.length >= maxTags}
        />
      </div>
      
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
      
      {maxTags && (
        <p className="text-muted-foreground text-xs">
          {value.length} of {maxTags} tags used
        </p>
      )}
    </div>
  );
}

export default TagsInputField;
