
import React, { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as icons from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';

type IconName = keyof typeof icons;

interface IconOption {
  name: IconName;
  category: string;
}

interface IconSelectFieldProps {
  id: string;
  label: string;
  value: IconName | null;
  onChange: (value: IconName | null) => void;
  required?: boolean;
  helpText?: string | null;
  className?: string;
  disabled?: boolean;
  error?: string;
}

// Create icon categories
const categories = {
  "Common": ["Home", "Search", "Settings", "User", "Mail", "Calendar", "Bell", "Heart", "Star"],
  "Actions": ["Check", "X", "Plus", "Minus", "Edit", "Trash", "Download", "Upload", "Send"],
  "Arrows": ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ChevronUp", "ChevronDown", "ChevronLeft", "ChevronRight"],
  "Media": ["Image", "Video", "Music", "Play", "Pause", "Volume", "Mic", "Camera", "Film"],
  "Interface": ["Menu", "MoreVertical", "MoreHorizontal", "ExternalLink", "Link", "Eye", "EyeOff", "Layers", "Layout"]
};

// Create an array of icon options categorized
const iconOptions: IconOption[] = Object.entries(categories).flatMap(
  ([category, names]) => names.map(name => ({ 
    name: name as IconName,
    category
  }))
);

export const IconSelectField = ({
  id,
  label,
  value,
  onChange,
  required = false,
  helpText = null,
  className,
  disabled = false,
  error
}: IconSelectFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>("Common");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter icons based on search term
  const filteredIcons = searchTerm
    ? iconOptions.filter(icon => 
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : iconOptions.filter(icon => icon.category === activeCategory);

  const handleSelect = (iconName: IconName) => {
    onChange(iconName);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Render the selected icon
  const renderSelectedIcon = () => {
    if (!value) return null;
    
    const IconComponent = icons[value] as LucideIcon;
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
    <div className={cn("space-y-2", className)} ref={dropdownRef}>
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
            error && "border-red-500 focus:ring-red-500"
          )}
        >
          <div className="flex items-center space-x-2">
            {value ? (
              <>
                <span className="flex items-center justify-center w-5 h-5 text-primary">
                  {renderSelectedIcon()}
                </span>
                <span className="truncate text-left">{value}</span>
              </>
            ) : (
              <span className="truncate text-left text-muted-foreground">Select an icon</span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {value && (
              <X
                className="h-4 w-4 text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              />
            )}
            {isOpen ? (
              <ChevronUp className="h-4 w-4 opacity-50" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-50" />
            )}
          </div>
        </Button>

        {isOpen && (
          <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-[350px] overflow-auto">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9"
                  autoFocus
                />
              </div>
            </div>
            
            {!searchTerm && (
              <Tabs 
                defaultValue={activeCategory}
                value={activeCategory} 
                onValueChange={setActiveCategory}
                className="w-full"
              >
                <TabsList className="w-full flex flex-wrap p-1 h-auto">
                  {Object.keys(categories).map(category => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="flex-1 h-7 text-xs py-1.5"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
            
            <div className="p-2 grid grid-cols-6 gap-1">
              {filteredIcons.length === 0 ? (
                <div className="col-span-6 text-center py-4 text-muted-foreground">
                  No icons found
                </div>
              ) : (
                filteredIcons.map(icon => {
                  const IconComponent = icons[icon.name] as LucideIcon;
                  const isSelected = value === icon.name;
                  
                  return IconComponent ? (
                    <Button
                      key={icon.name}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-10 w-10 rounded",
                        isSelected && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => handleSelect(icon.name)}
                      title={icon.name}
                    >
                      <IconComponent className="h-5 w-5" />
                    </Button>
                  ) : null;
                })
              )}
            </div>
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

export default IconSelectField;
