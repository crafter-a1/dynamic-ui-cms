
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface ThemeTabProps {
  settings: any;
  onUpdate: (settings: any) => void;
}

export function ThemeTab({ settings, onUpdate }: ThemeTabProps) {
  const themes = [
    {
      id: 'classic',
      name: 'Classic',
      description: 'Professional styling',
      previewLight: (
        <div className="border rounded p-2 w-full bg-white text-black">
          <span className="text-sm">Sample text</span>
        </div>
      ),
      previewDark: (
        <div className="border border-gray-700 rounded p-2 w-full bg-gray-800 text-white">
          <span className="text-sm">Sample text</span>
        </div>
      )
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design',
      previewLight: (
        <div className="border-0 shadow-sm rounded p-2 w-full bg-white text-black">
          <span className="text-sm">Sample text</span>
        </div>
      ),
      previewDark: (
        <div className="border-0 shadow-md rounded p-2 w-full bg-black text-white">
          <span className="text-sm">Sample text</span>
        </div>
      )
    },
    {
      id: 'playful',
      name: 'Playful',
      description: 'Engaging design',
      previewLight: (
        <div className="border-2 border-orange-500 rounded-full p-2 w-full bg-white text-black">
          <span className="text-sm">Sample text</span>
        </div>
      ),
      previewDark: (
        <div className="border-2 border-orange-400 rounded-full p-2 w-full bg-gray-800 text-white">
          <span className="text-sm">Sample text</span>
        </div>
      )
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean experience',
      previewLight: (
        <div className="border-b p-2 w-full bg-white text-black">
          <span className="text-sm">Sample text</span>
        </div>
      ),
      previewDark: (
        <div className="border-b border-gray-700 p-2 w-full bg-gray-900 text-white">
          <span className="text-sm">Sample text</span>
        </div>
      )
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Business-oriented',
      previewLight: (
        <div className="border rounded-sm p-2 w-full bg-white text-black shadow-sm">
          <span className="text-sm">Sample text</span>
        </div>
      ),
      previewDark: (
        <div className="border border-gray-600 rounded-sm p-2 w-full bg-gray-800 text-white shadow-sm">
          <span className="text-sm">Sample text</span>
        </div>
      )
    }
  ];
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Theme Selection</h3>
        <RadioGroup
          value={settings.theme || 'classic'}
          onValueChange={(value) => onUpdate({ theme: value })}
          className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4"
        >
          {themes.map((theme) => (
            <div key={theme.id} className="relative">
              <RadioGroupItem
                value={theme.id}
                id={`theme-${theme.id}`}
                className="sr-only"
              />
              <Label
                htmlFor={`theme-${theme.id}`}
                className={cn(
                  "cursor-pointer flex flex-col h-full border rounded-md p-4 hover:border-primary transition-colors",
                  settings.theme === theme.id && "border-2 border-primary"
                )}
              >
                <span className="font-medium mb-3">{theme.name}</span>
                
                <div className="space-y-3 mb-3">
                  {theme.previewLight}
                  {theme.previewDark}
                </div>
                
                <span className="text-xs text-gray-500 mb-2">{theme.description}</span>
                
                <div className="flex justify-between mt-auto">
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2">Light</Button>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2 bg-gray-900 text-white hover:bg-gray-800">Dark</Button>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-base">Theme Configuration</h4>
          <div>
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex gap-2 mt-1">
              <div 
                className="h-10 w-10 rounded-md border cursor-pointer"
                style={{ backgroundColor: settings.colors?.focus || '#3b82f6' }}
                onClick={() => {
                  // Open color picker
                }}
              />
              <Input 
                id="primary-color"
                value={settings.colors?.focus || '#3b82f6'} 
                className="font-mono"
                readOnly
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="typography">Typography</Label>
            <Select 
              defaultValue="system"
              onValueChange={(value) => onUpdate({ typography: value })}
            >
              <SelectTrigger id="typography">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System UI</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="sans">Sans-serif</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-base">Advanced Theme Settings</h4>
          <div>
            <Label htmlFor="focus-effect">Focus State Effect</Label>
            <Select 
              defaultValue="border"
              onValueChange={(value) => onUpdate({ focusEffect: value })}
            >
              <SelectTrigger id="focus-effect">
                <SelectValue placeholder="Select focus effect" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="border">Border Highlight</SelectItem>
                <SelectItem value="glow">Glow Effect</SelectItem>
                <SelectItem value="shadow">Shadow Effect</SelectItem>
                <SelectItem value="background">Background Change</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="input-text-style">Input Text Style</Label>
            <Select 
              defaultValue="regular"
              onValueChange={(value) => onUpdate({ textStyle: value })}
            >
              <SelectTrigger id="input-text-style">
                <SelectValue placeholder="Select text style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="italic">Italic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="label-position">Label Position</Label>
            <Select 
              defaultValue="top"
              onValueChange={(value) => onUpdate({ labelPosition: value })}
            >
              <SelectTrigger id="label-position">
                <SelectValue placeholder="Select label position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Above Input</SelectItem>
                <SelectItem value="left">Left of Input</SelectItem>
                <SelectItem value="floating">Floating</SelectItem>
                <SelectItem value="inside">Inside Input</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="transition-speed">Transition Speed</Label>
            <Select 
              defaultValue="medium"
              onValueChange={(value) => onUpdate({ transitionSpeed: value })}
            >
              <SelectTrigger id="transition-speed">
                <SelectValue placeholder="Select transition speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="slow">Slow (0.5s)</SelectItem>
                <SelectItem value="medium">Medium (0.3s)</SelectItem>
                <SelectItem value="fast">Fast (0.1s)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
          <div>
            <FormLabel>Apply theme to all form elements</FormLabel>
            <FormDescription>
              Use these settings for all fields in the form
            </FormDescription>
          </div>
          <Switch 
            checked={settings.applyToAll || false}
            onCheckedChange={(checked) => onUpdate({ applyToAll: checked })}
          />
        </FormItem>
      </div>
      
      <div className="flex space-x-3">
        <Button 
          variant="outline"
          onClick={() => {
            // Save as new theme
            console.log("Save as new theme", settings);
          }}
        >
          Save as New Theme
        </Button>
        <Button 
          onClick={() => {
            // Set as default theme
            console.log("Set as default theme", settings);
          }}
        >
          Set as Default
        </Button>
      </div>
    </div>
  );
}
