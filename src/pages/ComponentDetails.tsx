
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Component } from "@/components/components/ComponentsPanel";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateComponentDrawer } from "@/components/components/CreateComponentDrawer";

// Mock data - in a real app this would come from an API or state
const getMockComponent = (id: string): Component | undefined => {
  const components = [
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
  ];
  
  return components.find(component => component.id === id);
};

export default function ComponentDetails() {
  const { componentId } = useParams<{ componentId: string }>();
  const navigate = useNavigate();
  
  const [component, setComponent] = useState<Component | null>(null);
  const [activeTab, setActiveTab] = useState("preview");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  
  useEffect(() => {
    if (componentId) {
      const foundComponent = getMockComponent(componentId);
      if (foundComponent) {
        setComponent(foundComponent);
      } else {
        // Handle component not found
        navigate("/components");
      }
    }
  }, [componentId, navigate]);
  
  const handleDelete = () => {
    // Delete logic would go here
    toast({
      title: "Component deleted",
      description: "The component has been deleted successfully.",
    });
    navigate("/components");
  };
  
  const handleUpdateComponent = (updatedComponent: Component) => {
    setComponent(updatedComponent);
    setEditDrawerOpen(false);
    toast({
      title: "Component updated",
      description: "The component has been updated successfully.",
    });
  };
  
  if (!component) {
    return (
      <MainLayout>
        <div className="p-6 md:p-10 flex justify-center items-center min-h-[60vh]">
          <p>Loading component...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/components")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{component.name}</h1>
                <Badge variant="outline" className="capitalize bg-gray-50">
                  {component.category}
                </Badge>
              </div>
              <p className="text-gray-500">{component.description}</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setEditDrawerOpen(true)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Component Preview</CardTitle>
                <CardDescription>Visual representation of the component</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 border rounded-md bg-gray-50">
                  {/* Here we would render an actual preview of the component */}
                  <div className="text-center py-10">
                    <p className="text-gray-500">Component preview would be rendered here</p>
                    <p className="text-sm text-gray-400 mt-2">For {component.name} with {component.fields.length} fields</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fields">
            <Card>
              <CardHeader>
                <CardTitle>Component Fields</CardTitle>
                <CardDescription>List of fields in this component</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {component.fields.map((field, index) => (
                    <div 
                      key={field.id} 
                      className="p-4 border rounded-md bg-white flex justify-between items-start"
                    >
                      <div>
                        <h3 className="font-medium">{field.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {field.type}
                          </Badge>
                          <Badge 
                            variant={field.required ? "default" : "outline"} 
                            className="text-xs"
                          >
                            {field.required ? "Required" : "Optional"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Field #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Component Usage</CardTitle>
                <CardDescription>How to use this component</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">In Collections</h3>
                    <p className="text-gray-600">
                      To use this component in a collection, go to the collection's field configuration page and click "Add Component".
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Fields Used</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {component.fields.map((field) => (
                        <li key={field.id}>{field.name} ({field.type})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Component</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{component.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <CreateComponentDrawer
          open={editDrawerOpen}
          onOpenChange={setEditDrawerOpen}
          onSave={handleUpdateComponent}
          initialData={component}
        />
      </div>
    </MainLayout>
  );
}
