
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Layers, FileText, PackageOpen } from "lucide-react";
import { Component } from "./ComponentsPanel";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ComponentSelectorProps {
  onSelectComponent: (component: Component) => void;
  onCancel: () => void;
}

export function ComponentSelector({ onSelectComponent, onCancel }: ComponentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  useEffect(() => {
    // Load components from localStorage
    const savedComponents = localStorage.getItem('components');
    if (savedComponents) {
      try {
        setComponents(JSON.parse(savedComponents));
      } catch (e) {
        console.error("Error loading components from localStorage:", e);
      }
    }
  }, []);
  
  const filteredComponents = components.filter(component => {
    const matchesSearch = 
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || component.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const categories = ["all", ...Array.from(new Set(components.map(c => c.category)))];
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-shrink-0">
          <TabsList className="bg-slate-50">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="h-80 pr-4">
        {components.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <PackageOpen className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p className="font-medium text-gray-700">No components available</p>
            <p className="text-xs text-gray-500 mt-1">Create components in the Component Library first</p>
          </div>
        ) : filteredComponents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p>No components found matching your search.</p>
            <p className="text-sm mt-1">Try adjusting your search or filter.</p>
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
                <CardContent className="p-4">
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
