
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckIcon } from 'lucide-react';

interface AutocompleteOption {
  label: string;
  value: string;
}

interface AutocompleteInputFieldProps {
  id: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  options?: AutocompleteOption[];
  className?: string;
  floatLabel?: boolean;
  filled?: boolean;
}

export function AutocompleteInputField({
  id,
  label,
  value = '',
  onChange,
  placeholder = '',
  required = false,
  helpText,
  options = [],
  className,
  floatLabel = false,
  filled = false
}: AutocompleteInputFieldProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>(options);
  
  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options based on input value
  useEffect(() => {
    if (inputValue) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [inputValue, options]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setOpen(true);
    onChange(newValue);
  };

  // Handle option selection
  const handleSelect = (selectedValue: string) => {
    const option = options.find(opt => opt.value === selectedValue);
    if (option) {
      setInputValue(option.label);
      onChange(option.value);
      setOpen(false);
    }
  };

  return (
    <div className={cn('relative space-y-1', className)}>
      {label && (
        <Label 
          htmlFor={id}
          className={cn(
            "text-sm font-medium",
            floatLabel && inputValue ? "absolute top-0 left-3 -translate-y-1/2 bg-background px-1 text-xs z-10" : ""
          )}
        >
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <Input
              type="text"
              id={id}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              required={required}
              className={cn(
                filled && "bg-gray-100",
                floatLabel && "pt-4"
              )}
              onClick={() => setOpen(true)}
              aria-describedby={helpText ? `${id}-description` : undefined}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command>
            <CommandList>
              {filteredOptions.length === 0 ? (
                <CommandEmpty>No results found</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredOptions.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelect}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <CheckIcon 
                        className={cn(
                          "h-4 w-4 opacity-0",
                          option.value === value && "opacity-100"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {helpText && (
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default AutocompleteInputField;
