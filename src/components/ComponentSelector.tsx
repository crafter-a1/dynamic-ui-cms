import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Layers, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchComponents, Component } from "@/services/ComponentService";

interface ComponentSelectorProps {
  onSelectComponent: (component: Component) => void;
  onCancel: () => void;
}

export function ComponentSelector({ onSelectComponent, onCancel }: ComponentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: components = [], isLoading, error } = useQuery({
    queryKey: ['components'],
    queryFn: fetchComponents
  });
  
  const filteredComponents = components.filter(component => 
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    component.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-500">Loading components...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          There was an error loading your components. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search components..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
          autoFocus
        />
      </div>
      
      {filteredComponents.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
          <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
          <p>No components found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-1">
          {filteredComponents.map((component) => (
            <Card 
              key={component.id}
              className="overflow-hidden hover:border-primary/50 hover:bg-accent/50 transition cursor-pointer"
              onClick={() => onSelectComponent(component)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-base">{component.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{component.description}</p>
                  </div>
                  <Badge variant="outline" className="capitalize bg-gray-50">
                    {component.category}
                  </Badge>
                </div>
                
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <Layers className="h-3 w-3 mr-1" /> 
                  <span>{component.fields.length} fields</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
