
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface FieldType {
  id: string;
  name: string;
  description: string;
  group?: string;
}

interface FieldTypeSelectorProps {
  fieldTypes: FieldType[];
  onSelectFieldType: (typeId: string) => void;
  activeCategory?: string;
}

export function FieldTypeSelector({ 
  fieldTypes, 
  onSelectFieldType,
  activeCategory 
}: FieldTypeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter by category first if activeCategory is provided
  const categoryFilteredTypes = activeCategory 
    ? fieldTypes.filter(type => !type.group || type.group === activeCategory)
    : fieldTypes;
  
  // Then filter by search query
  const filteredFieldTypes = searchQuery ? 
    categoryFilteredTypes.filter(type => 
      type.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      type.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) : 
    categoryFilteredTypes;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search field types..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredFieldTypes.length === 0 ? (
        <p className="text-center py-8 text-gray-500">
          No field types match your search. Try a different term.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFieldTypes.map((fieldType) => (
            <Card 
              key={fieldType.id}
              className={cn(
                "cursor-pointer transition-all hover:border-blue-400 hover:shadow-md",
              )}
              onClick={() => onSelectFieldType(fieldType.id)}
            >
              <CardContent className="p-4 flex flex-col">
                <h3 className="font-medium text-base">{fieldType.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{fieldType.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
