
import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Component } from "@/services/ComponentService";

// Define component schema
const componentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  category: z.string().min(1, "Category is required"),
});

type ComponentFormValues = z.infer<typeof componentSchema>;

interface CreateComponentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Component) => void;
  initialData?: Component;
}

export const CreateComponentDrawer = ({
  open,
  onOpenChange,
  onSave,
  initialData,
}: CreateComponentDrawerProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ComponentFormValues>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
    },
  });

  const onSubmit = async (data: ComponentFormValues) => {
    setIsLoading(true);
    try {
      // Create fields structure based on initialData or empty array
      const fields = initialData?.fields || [];

      // Create the component object
      const component: Component = {
        id: initialData?.id || crypto.randomUUID(),
        name: data.name,
        description: data.description,
        category: data.category,
        fields: fields,
        lastUpdated: new Date().toISOString(),
      };

      // Call the onSave callback with the component data
      onSave(component);
    } catch (error) {
      console.error("Error saving component:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = !!initialData;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader>
          <DrawerTitle>{isEditing ? "Edit Component" : "Create Component"}</DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? "Update your component details below."
              : "Fill out the form below to create a new component."}
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Contact Form" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe what this component does..."
                        className="h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="form">Form</SelectItem>
                        <SelectItem value="commerce">Commerce</SelectItem>
                        <SelectItem value="profile">Profile</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="navigation">Navigation</SelectItem>
                        <SelectItem value="layout">Layout</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DrawerFooter className="px-0">
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                    ? "Update Component"
                    : "Create Component"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
