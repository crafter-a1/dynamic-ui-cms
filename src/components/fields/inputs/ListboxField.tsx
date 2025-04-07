
import React, { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export interface ListboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ListboxFieldProps {
  id: string;
  label: string;
  options: ListboxOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string | null;
  className?: string;
  disabled?: boolean;
  error?: string;
  multiSelect?: boolean;
  searchable?: boolean;
}

export const ListboxField = ({
  id,
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  required = false,
  helpText = null,
  className,
  disabled = false,
  error,
  multiSelect = false,
  searchable = false
}: ListboxFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const listboxRef = useRef<HTMLDivElement>(null);
  
  const filteredOptions = searchTerm 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (optionValue: string) => {
    if (multiSelect) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(optionValue)
        ? currentValue.filter(v => v !== optionValue)
        : [...currentValue, optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multiSelect ? [] : '');
  };

  const getSelectedLabel = () => {
    if (multiSelect) {
      const selectedCount = Array.isArray(value) ? value.length : 0;
      if (selectedCount === 0) return placeholder;
      if (selectedCount === 1) {
        const selectedOption = options.find(o => o.value === value[0]);
        return selectedOption ? selectedOption.label : placeholder;
      }
      return `${selectedCount} items selected`;
    } else {
      const selectedOption = options.find(o => o.value === value);
      return selectedOption ? selectedOption.label : placeholder;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listboxRef.current && !listboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("space-y-2", className)} ref={listboxRef}>
      <div className="flex justify-between items-center">
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between",
            error && "border-red-500 focus:ring-red-500",
            value && !multiSelect && "font-medium"
          )}
        >
          <span className="truncate text-left">{getSelectedLabel()}</span>
          <div className="flex items-center space-x-1">
            {value && (value === '' || (Array.isArray(value) && value.length === 0) ? null : (
              <X
                className="h-4 w-4 text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              />
            ))}
            {isOpen ? (
              <ChevronUp className="h-4 w-4 opacity-50" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-50" />
            )}
          </div>
        </Button>

        {isOpen && (
          <div className="absolute z-10 w-full rounded-md border bg-white shadow-lg mt-1 max-h-60 overflow-auto">
            {searchable && (
              <div className="p-2 border-b">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8"
                  autoFocus
                />
              </div>
            )}
            <ul
              className="py-1"
              role="listbox"
              aria-labelledby={id}
            >
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-500">No options found</li>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = multiSelect
                    ? Array.isArray(value) && value.includes(option.value)
                    : value === option.value;
                    
                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      className={cn(
                        "px-3 py-2 flex items-center",
                        isSelected ? "bg-primary-50 text-primary" : "hover:bg-gray-100",
                        option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      )}
                    >
                      {multiSelect ? (
                        <div className="flex items-center space-x-2 w-full">
                          <Checkbox checked={isSelected} />
                          <span className="text-sm">{option.label}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm">{option.label}</span>
                          {isSelected && <Check className="h-4 w-4" />}
                        </div>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
      
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default ListboxField;
