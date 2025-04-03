
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ComponentsPanel } from '@/components/components/ComponentsPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FieldLayoutPanel } from '@/components/fields/FieldLayoutPanel';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { NumberInputField } from '@/components/fields/inputs/NumberInputField';

export default function Components() {
  const [activeTab, setActiveTab] = useState('components');
  const [numberValue, setNumberValue] = useState<number | null>(1000);

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">Components</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="components">UI Components</TabsTrigger>
            <TabsTrigger value="fields">Field Types</TabsTrigger>
            <TabsTrigger value="number">Number Input</TabsTrigger>
          </TabsList>
          
          <TabsContent value="components">
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <ComponentsPanel />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fields">
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <FieldLayoutPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="number">
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Number Input Field</h2>
                  <p className="text-gray-500">Explore the different configurations available for number input fields</p>
                  
                  <Alert variant="info" className="bg-blue-50 border-blue-100">
                    <Info className="h-5 w-5 text-blue-500" />
                    <AlertDescription className="text-blue-700">
                      These examples show all available number input features that can be used in your collections.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-3">1. Basic Number</h3>
                        <NumberInputField 
                          value={numberValue} 
                          onChange={setNumberValue}
                          label="Basic Number Input"
                        />
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-3">2. Localized Numbers</h3>
                        <NumberInputField 
                          value={numberValue} 
                          onChange={setNumberValue}
                          label="US Format"
                          locale="en-US"
                        />
                        <div className="mt-4">
                          <NumberInputField 
                            value={numberValue} 
                            onChange={setNumberValue}
                            label="German Format"
                            locale="de-DE"
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-3">3. Currency</h3>
                        <NumberInputField 
                          value={numberValue} 
                          onChange={setNumberValue}
                          label="USD Currency"
                          locale="en-US"
                          currency="USD"
                        />
                        <div className="mt-4">
                          <NumberInputField 
                            value={numberValue} 
                            onChange={setNumberValue}
                            label="EUR Currency"
                            locale="de-DE"
                            currency="EUR"
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-3">4. Prefix & Suffix</h3>
                        <NumberInputField 
                          value={numberValue} 
                          onChange={setNumberValue}
                          label="With Prefix"
                          prefix="$"
                        />
                        <div className="mt-4">
                          <NumberInputField 
                            value={numberValue} 
                            onChange={setNumberValue}
                            label="With Suffix"
                            suffix=" units"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-3">5. Buttons (Horizontal)</h3>
                        <NumberInputField 
                          value={numberValue} 
                          onChange={setNumberValue}
                          label="Increment/Decrement"
                          showButtons
                          buttonLayout="horizontal"
                        />
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-3">6. Buttons (Vertical)</h3>
                        <NumberInputField 
                          value={numberValue} 
                          onChange={setNumberValue}
                          label="Vertical Layout"
                          showButtons
                          buttonLayout="vertical"
                        />
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-3">7. Float Label & Filled Style</h3>
                        <NumberInputField 
                          value={numberValue} 
                          onChange={setNumberValue}
                          label="Float Label"
                          floatLabel
                        />
                        <div className="mt-4">
                          <NumberInputField 
                            value={numberValue} 
                            onChange={setNumberValue}
                            label="Filled Style"
                            filled
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-3">8. States</h3>
                        <NumberInputField 
                          value={numberValue} 
                          onChange={setNumberValue}
                          label="Invalid State"
                          invalid
                        />
                        <div className="mt-4">
                          <NumberInputField 
                            value={numberValue} 
                            onChange={setNumberValue}
                            label="Disabled State"
                            disabled
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-3">9. Accessibility</h3>
                        <NumberInputField 
                          value={numberValue} 
                          onChange={setNumberValue}
                          label="With Accessibility Features"
                          aria-label="Numeric value with accessibility support"
                          placeholder="Enter a number with enhanced accessibility"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
