import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { adaptCollectionFormData } from "@/utils/formAdapters";
import { createCollection } from "@/services/CollectionService";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Collection name must be at least 2 characters.",
  }),
  apiId: z.string().min(2, {
    message: "API ID must be at least 2 characters.",
  }).regex(/^[a-z0-9_-]+$/, {
    message: "API ID can only contain lowercase letters, numbers, underscores, and hyphens.",
  }),
  description: z.string().optional(),
});

export function CollectionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      apiId: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      // Use the adapter to ensure compatibility with the service
      const adaptedData = adaptCollectionFormData(values);
      const collection = await createCollection(adaptedData);
      
      toast({
        title: "Collection created",
        description: `${values.name} has been created successfully.`,
      });
      
      // Navigate to the collection detail page
      navigate(`/collections/${collection.id}`);
    } catch (error) {
      console.error("Failed to create collection:", error);
      toast({
        title: "Failed to create collection",
        description: "There was an error creating your collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Auto-generate API ID from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    
    // Only auto-generate if user hasn't manually edited the API ID
    if (!form.getValues("apiId") || form.getValues("apiId") === form.getValues("name").toLowerCase().replace(/\s+/g, "_")) {
      const apiId = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_-]/g, "");
      form.setValue("apiId", apiId);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. Blog Posts" 
                  {...field} 
                  onChange={handleNameChange}
                />
              </FormControl>
              <FormDescription>
                This is the display name for your collection.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="apiId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g. blog_posts" {...field} />
              </FormControl>
              <FormDescription>
                Used in API requests and as a reference in code. Cannot be changed later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the purpose of this collection"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief explanation of what this collection will be used for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Collection"}
        </Button>
      </form>
    </Form>
  );
}
