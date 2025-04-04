
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Layers, FileText } from "lucide-react";
import { Component } from "./ComponentsPanel";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for demonstration - in a real app this would come from an API or state
const mockComponents: Component[] = [
  {
    id: "1",
    name: "Contact Form",
    description: "Standard contact form with name, email, and message",
    category: "form",
    fields: [
      { id: "f1", name: "Full Name", type: "text", required: true },
      { id: "f2", name: "Email", type: "text", required: true },
      { id: "f3", name: "Message", type: "textarea", required: true }
    ],
    lastUpdated: "Apr 2, 2025"
  },
  {
    id: "2",
    name: "Product Card",
    description: "Display product with image, title, price, and description",
    category: "commerce",
    fields: [
      { id: "f4", name: "Product Title", type: "text", required: true },
      { id: "f5", name: "Price", type: "number", required: true },
      { id: "f6", name: "Description", type: "textarea", required: false },
      { id: "f7", name: "Product Image", type: "image", required: true }
    ],
    lastUpdated: "Mar 31, 2025"
  },
  {
    id: "3",
    name: "Address Details",
    description: "Complete address fields for shipping or billing",
    category: "form",
    fields: [
      { id: "f8", name: "Street", type: "text", required: true },
      { id: "f9", name: "City", type: "text", required: true },
      { id: "f10", name: "State/Province", type: "text", required: true },
      { id: "f11", name: "Postal Code", type: "text", required: true },
      { id: "f12", name: "Country", type: "select", required: true }
    ],
    lastUpdated: "Apr 1, 2025"
  },
  {
    id: "4",
    name: "Media Gallery",
    description: "Collection of media items with title and captions",
    category: "media",
    fields: [
      { id: "f13", name: "Gallery Title", type: "text", required: true },
      { id: "f14", name: "Media Items", type: "file", required: true },
      { id: "f15", name: "Caption", type: "text", required: false }
    ],
    lastUpdated: "Mar 30, 2025"
  }
];

interface ComponentSelectorProps {
  onSelectComponent: (component: Component) => void;
  onCancel: () => void;
}

export function ComponentSelector({ onSelectComponent, onCancel }: ComponentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  
  const filteredComponents = mockComponents.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <ScrollArea className="h-96 pr-4">
        {filteredComponents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No components found matching your search.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComponents.map((component) => (
              <Card
                key={component.id}
                className={`overflow-hidden cursor-pointer transition-all ${
                  selectedComponent?.id === component.id
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "hover:border-gray-300"
                }`}
                onClick={() => setSelectedComponent(component)}
              >
                <CardContent className="p-4 flex justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-base">{component.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{component.description}</p>
                      </div>
                      <Badge variant="outline" className="capitalize bg-gray-50">
                        {component.category}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <Layers className="h-3 w-3 mr-1" />
                      <span>{component.fields.length} fields</span>
                      <span className="mx-2">•</span>
                      <FileText className="h-3 w-3 mr-1" />
                      <span>Last updated {component.lastUpdated}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => selectedComponent && onSelectComponent(selectedComponent)}
          disabled={!selectedComponent}
        >
          Add Component
        </Button>
      </div>
    </div>
  );
}
