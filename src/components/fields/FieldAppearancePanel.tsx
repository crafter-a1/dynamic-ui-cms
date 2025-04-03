
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface FieldAppearancePanelProps {
  form: UseFormReturn<any>;
  fieldType: string | null;
}

export function FieldAppearancePanel({ form, fieldType }: FieldAppearancePanelProps) {
  const [displayMode, setDisplayMode] = useState("default");
  
  if (!fieldType) {
    return <p className="text-gray-500">Please select a field type first</p>;
  }
  
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="ui_options.placeholder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Placeholder Text</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter placeholder text..." 
                {...field} 
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription>
              Text shown when the field is empty
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="ui_options.help_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Help Text</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter help text..." 
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription>
              Additional instructions displayed below the field
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="ui_options.display_mode"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Display Mode</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={value => {
                  field.onChange(value);
                  setDisplayMode(value);
                }}
                defaultValue={field.value || "default"}
                className="grid grid-cols-3 gap-4"
              >
                <FormItem className="flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer hover:bg-gray-50">
                  <FormControl>
                    <RadioGroupItem value="default" className="sr-only" />
                  </FormControl>
                  <div className={`w-full text-center p-2 ${displayMode === "default" ? "bg-blue-100 text-blue-800 font-medium" : "bg-gray-100"}`}>
                    Default
                  </div>
                  <FormDescription className="text-center text-xs">
                    Standard input field
                  </FormDescription>
                </FormItem>
                <FormItem className="flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer hover:bg-gray-50">
                  <FormControl>
                    <RadioGroupItem value="compact" className="sr-only" />
                  </FormControl>
                  <div className={`w-full text-center p-1 ${displayMode === "compact" ? "bg-blue-100 text-blue-800 font-medium" : "bg-gray-100"}`}>
                    Compact
                  </div>
                  <FormDescription className="text-center text-xs">
                    Smaller input size
                  </FormDescription>
                </FormItem>
                <FormItem className="flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer hover:bg-gray-50">
                  <FormControl>
                    <RadioGroupItem value="expanded" className="sr-only" />
                  </FormControl>
                  <div className={`w-full text-center p-3 ${displayMode === "expanded" ? "bg-blue-100 text-blue-800 font-medium" : "bg-gray-100"}`}>
                    Expanded
                  </div>
                  <FormDescription className="text-center text-xs">
                    Larger input size
                  </FormDescription>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
      
      {fieldType === 'text' || fieldType === 'textarea' ? (
        <>
          <FormField
            control={form.control}
            name="ui_options.showCharCount"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Show Character Count</FormLabel>
                  <FormDescription>
                    Display the number of characters entered
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ui_options.width"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Field Width</FormLabel>
                  <span className="text-sm text-gray-500">{field.value || 100}%</span>
                </div>
                <FormControl>
                  <Slider
                    value={[field.value || 100]}
                    min={25}
                    max={100}
                    step={25}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="my-2"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </FormItem>
            )}
          />
        </>
      ) : null}
      
      <FormField
        control={form.control}
        name="ui_options.hidden_in_forms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Hide in Forms</FormLabel>
              <FormDescription>
                Field won't be visible when creating new content
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Additional appearance settings like custom CSS classes and conditional visibility will be available in future updates.
        </p>
      </div>
    </div>
  );
}
