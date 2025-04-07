
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HashInputFieldProps {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string | null;
  className?: string;
  disabled?: boolean;
  error?: string;
  maxTags?: number;
  suggestions?: string[];
}

export const HashInputField = ({
  id,
  label,
  value = [],
  onChange,
  placeholder = "Add a tag...",
  required = false,
  helpText = null,
  className,
  disabled = false,
  error,
  maxTags,
  suggestions = []
}: HashInputFieldProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const filteredSuggestions = inputValue
    ? suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) && 
        !value.includes(suggestion)
      )
    : [];

  const addTag = (tag: string) => {
    tag = tag.trim();
    if (!tag) return;
    
    // Remove # prefix if exists
    const cleanTag = tag.startsWith('#') ? tag.substring(1) : tag;
    
    if (cleanTag && !value.includes(cleanTag)) {
      if (!maxTags || value.length < maxTags) {
        onChange([...value, cleanTag]);
        setInputValue('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {maxTags && (
          <span className="text-xs text-muted-foreground">
            {value.length}/{maxTags}
          </span>
        )}
      </div>

      <div 
        className={cn(
          "flex flex-wrap items-center gap-1 p-2 border rounded-md focus-within:ring-1 focus-within:ring-ring focus-within:border-input",
          error && "border-red-500 focus-within:ring-red-500",
          disabled && "opacity-50 bg-muted"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <div 
            key={index} 
            className="flex items-center bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-sm"
          >
            <span className="mr-1">#</span>
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="ml-1 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(!!inputValue)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled || (maxTags !== undefined && value.length >= maxTags)}
          className="flex-1 min-w-[120px] bg-transparent border-0 focus:outline-none focus:ring-0 p-0.5 text-sm"
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full max-w-xs bg-white border rounded-md shadow-lg mt-1 py-1">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm"
            >
              #{suggestion}
            </div>
          ))}
        </div>
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

export default HashInputField;
