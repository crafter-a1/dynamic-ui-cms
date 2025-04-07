
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlugInputFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  sourceValue?: string;
  prefix?: string;
  suffix?: string;
}

export function SlugInputField({
  id,
  label,
  value = '',
  onChange,
  placeholder = 'url-friendly-slug',
  required = false,
  helpText,
  className,
  sourceValue = '',
  prefix = '',
  suffix = ''
}: SlugInputFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Function to convert any text to a URL-friendly slug
  const createSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };
  
  // Auto-generate slug from source value when not being edited manually
  useEffect(() => {
    if (!isEditing && sourceValue && !value) {
      const newSlug = createSlug(sourceValue);
      onChange(newSlug);
    }
  }, [sourceValue, isEditing, value, onChange]);
  
  const generateSlugFromSource = () => {
    if (sourceValue) {
      const newSlug = createSlug(sourceValue);
      onChange(newSlug);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-muted-foreground text-sm">
            {prefix}
          </span>
        )}
        
        <Input
          id={id}
          value={value}
          onChange={(e) => {
            const newValue = createSlug(e.target.value);
            onChange(newValue);
            setIsEditing(true);
          }}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          placeholder={placeholder}
          required={required}
          className={cn(
            prefix && "pl-[calc(0.75rem+var(--prefix-width))]",
            suffix && "pr-[calc(0.75rem+var(--suffix-width))]",
          )}
          style={{
            '--prefix-width': `${prefix.length}ch`,
            '--suffix-width': `${suffix.length}ch`,
          } as React.CSSProperties}
          aria-describedby={helpText ? `${id}-description` : undefined}
        />
        
        {suffix && (
          <span className="absolute right-3 text-muted-foreground text-sm">
            {suffix}
          </span>
        )}
        
        {sourceValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 h-7 w-7 p-0"
            onClick={generateSlugFromSource}
            title="Generate slug from source"
          >
            <RefreshCw size={16} />
          </Button>
        )}
      </div>
      
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default SlugInputField;
