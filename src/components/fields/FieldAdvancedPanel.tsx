
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Code, 
  Database, 
  Zap,
  Settings,
  Link,
  Laptop,
  Info,
  RefreshCw,
  Lock,
  Sparkles
} from "lucide-react";

interface AdvancedSettingsProps {
  fieldType: string | null;
  initialData?: any;
  onSave: (data: any) => void;
}

export function FieldAdvancedPanel({ fieldType, initialData = {}, onSave }: AdvancedSettingsProps) {
  const [activeTab, setActiveTab] = useState("behavior");
  const [dynamicSettings, setDynamicSettings] = useState({
    conditionalDisplay: initialData?.conditionalDisplay || false,
    conditionalRule: initialData?.conditionalRule || "",
    autoFill: initialData?.autoFill || false,
    autoFillSource: initialData?.autoFillSource || "",
    readOnly: initialData?.readOnly || false,
    defaultValueExpr: initialData?.defaultValueExpr || ""
  });
  
  const [integrationSettings, setIntegrationSettings] = useState({
    mappedTo: initialData?.mappedTo || "",
    apiField: initialData?.apiField || "",
    triggerWebhook: initialData?.triggerWebhook || false,
    webhookUrl: initialData?.webhookUrl || ""
  });
  
  const [performanceSettings, setPerformanceSettings] = useState({
    lazyLoad: initialData?.lazyLoad || false,
    virtualScroll: initialData?.virtualScroll || false,
    cacheResults: initialData?.cacheResults || false,
    debounceTime: initialData?.debounceTime || 300
  });
  
  const [customSettings, setCustomSettings] = useState({
    locale: initialData?.locale || "en-US",
    customTemplate: initialData?.customTemplate || "",
    advancedOptions: initialData?.advancedOptions || ""
  });

  const updateDynamicSettings = (field: string, value: any) => {
    setDynamicSettings({
      ...dynamicSettings,
      [field]: value
    });
  };

  const updateIntegrationSettings = (field: string, value: any) => {
    setIntegrationSettings({
      ...integrationSettings,
      [field]: value
    });
  };

  const updatePerformanceSettings = (field: string, value: any) => {
    setPerformanceSettings({
      ...performanceSettings,
      [field]: value
    });
  };

  const updateCustomSettings = (field: string, value: any) => {
    setCustomSettings({
      ...customSettings,
      [field]: value
    });
  };

  const handleSave = () => {
    onSave({
      ...dynamicSettings,
      ...integrationSettings,
      ...performanceSettings,
      ...customSettings
    });
  };

  // Show limited options if field type is not provided
  if (!fieldType) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Please select a field type to view advanced options</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="behavior" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="behavior">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dynamic Behavior</span>
              <span className="sm:hidden">Behavior</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="integration">
            <div className="flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Integration</span>
              <span className="sm:hidden">Connect</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="performance">
            <div className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Performance</span>
              <span className="sm:hidden">Perform</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="custom">
            <div className="flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Customization</span>
              <span className="sm:hidden">Custom</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        {/* Dynamic Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Conditional Display</span>
              </CardTitle>
              <CardDescription>
                Show or hide this field based on other field values
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="conditionalDisplay">Enable Conditional Logic</Label>
                <Switch 
                  id="conditionalDisplay" 
                  checked={dynamicSettings.conditionalDisplay}
                  onCheckedChange={(checked) => updateDynamicSettings("conditionalDisplay", checked)}
                />
              </div>
              
              {dynamicSettings.conditionalDisplay && (
                <div className="space-y-2">
                  <Label htmlFor="conditionalRule">Condition</Label>
                  <Textarea
                    id="conditionalRule"
                    placeholder="Example: {field1} === 'value' || {field2} > 10"
                    value={dynamicSettings.conditionalRule}
                    onChange={(e) => updateDynamicSettings("conditionalRule", e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Use {'{fieldName}'} to reference other fields in the condition
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Dynamic Values</span>
              </CardTitle>
              <CardDescription>
                Configure how this field gets and sets its value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoFill">Enable Auto-Fill</Label>
                <Switch 
                  id="autoFill" 
                  checked={dynamicSettings.autoFill}
                  onCheckedChange={(checked) => updateDynamicSettings("autoFill", checked)}
                />
              </div>
              
              {dynamicSettings.autoFill && (
                <div className="space-y-2">
                  <Label htmlFor="autoFillSource">Data Source</Label>
                  <Select 
                    value={dynamicSettings.autoFillSource} 
                    onValueChange={(value) => updateDynamicSettings("autoFillSource", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a data source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Current User</SelectItem>
                      <SelectItem value="browser">Browser Data</SelectItem>
                      <SelectItem value="query">URL Parameters</SelectItem>
                      <SelectItem value="api">External API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="readOnly">Read-Only Field</Label>
                <Switch 
                  id="readOnly" 
                  checked={dynamicSettings.readOnly}
                  onCheckedChange={(checked) => updateDynamicSettings("readOnly", checked)}
                />
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="defaultValueExpr">Default Value Expression</Label>
                <Textarea
                  id="defaultValueExpr"
                  placeholder="Example: new Date().toISOString()"
                  value={dynamicSettings.defaultValueExpr}
                  onChange={(e) => updateDynamicSettings("defaultValueExpr", e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  JavaScript expression to calculate default value
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Integration Tab */}
        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Data Mapping</span>
              </CardTitle>
              <CardDescription>
                Configure how this field maps to the database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mappedTo">Database Field</Label>
                <Input
                  id="mappedTo"
                  placeholder="e.g., users.profile.first_name"
                  value={integrationSettings.mappedTo}
                  onChange={(e) => updateIntegrationSettings("mappedTo", e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Path to the database field this UI field is mapped to
                </p>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="apiField">API Field Name</Label>
                <Input
                  id="apiField"
                  placeholder="e.g., firstName"
                  value={integrationSettings.apiField}
                  onChange={(e) => updateIntegrationSettings("apiField", e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Field name when sending to or receiving from APIs
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Link className="h-4 w-4" />
                <span>Webhooks</span>
              </CardTitle>
              <CardDescription>
                Trigger external services when this field changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="triggerWebhook">Enable Webhook</Label>
                <Switch 
                  id="triggerWebhook" 
                  checked={integrationSettings.triggerWebhook}
                  onCheckedChange={(checked) => updateIntegrationSettings("triggerWebhook", checked)}
                />
              </div>
              
              {integrationSettings.triggerWebhook && (
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://example.com/webhook"
                    value={integrationSettings.webhookUrl}
                    onChange={(e) => updateIntegrationSettings("webhookUrl", e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Laptop className="h-4 w-4" />
                <span>Optimization Settings</span>
              </CardTitle>
              <CardDescription>
                Configure performance optimizations for this field
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="lazyLoad">Lazy Loading</Label>
                  <p className="text-xs text-gray-500">Load this field only when visible</p>
                </div>
                <Switch 
                  id="lazyLoad" 
                  checked={performanceSettings.lazyLoad}
                  onCheckedChange={(checked) => updatePerformanceSettings("lazyLoad", checked)}
                />
              </div>
              
              {fieldType === 'select' && (
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Label htmlFor="virtualScroll">Virtual Scrolling</Label>
                    <p className="text-xs text-gray-500">For large dropdown lists</p>
                  </div>
                  <Switch 
                    id="virtualScroll" 
                    checked={performanceSettings.virtualScroll}
                    onCheckedChange={(checked) => updatePerformanceSettings("virtualScroll", checked)}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label htmlFor="cacheResults">Cache Results</Label>
                  <p className="text-xs text-gray-500">Store and reuse field data</p>
                </div>
                <Switch 
                  id="cacheResults" 
                  checked={performanceSettings.cacheResults}
                  onCheckedChange={(checked) => updatePerformanceSettings("cacheResults", checked)}
                />
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="debounceTime">
                  Debounce Time (ms)
                </Label>
                <Input
                  id="debounceTime"
                  type="number"
                  min={0}
                  max={5000}
                  value={performanceSettings.debounceTime}
                  onChange={(e) => updatePerformanceSettings("debounceTime", parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500">
                  Delay before triggering validation or other actions (0-5000ms)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Customization Tab */}
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Field Customization</span>
              </CardTitle>
              <CardDescription>
                Advanced customization options for this field
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="locale">Locale</Label>
                <Select 
                  value={customSettings.locale} 
                  onValueChange={(value) => updateCustomSettings("locale", value)}
                >
                  <SelectTrigger id="locale">
                    <SelectValue placeholder="Select locale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="fr-FR">French</SelectItem>
                    <SelectItem value="de-DE">German</SelectItem>
                    <SelectItem value="es-ES">Spanish</SelectItem>
                    <SelectItem value="pt-BR">Portuguese (Brazil)</SelectItem>
                    <SelectItem value="ja-JP">Japanese</SelectItem>
                    <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Localization settings for date formats, number formats, etc.
                </p>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="customTemplate">Custom Template</Label>
                <Textarea
                  id="customTemplate"
                  placeholder="<div class='custom-field'>{content}</div>"
                  value={customSettings.customTemplate}
                  onChange={(e) => updateCustomSettings("customTemplate", e.target.value)}
                  className="font-mono text-sm"
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  HTML template for custom field rendering (use {"{content}"} as placeholder)
                </p>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="advancedOptions">Advanced JSON Options</Label>
                <Textarea
                  id="advancedOptions"
                  placeholder='{"option1": "value", "nested": {"key": "value"}}'
                  value={customSettings.advancedOptions}
                  onChange={(e) => updateCustomSettings("advancedOptions", e.target.value)}
                  className="font-mono text-sm"
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  Additional field options in JSON format
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Alert className="bg-blue-50 border-blue-100">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              <p className="text-sm">
                Custom settings may require additional configuration in your application code to take effect.
                See the <span className="font-medium">Field Extensions API</span> documentation for more details.
              </p>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-6">
          Apply Advanced Settings
        </Button>
      </div>
    </div>
  );
}
