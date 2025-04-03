
import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { NumberInputField } from "./inputs/NumberInputField";
import { DateCalendarField } from "./inputs/DateCalendarField";

export function FieldLayoutPanel() {
  const [numberValue, setNumberValue] = useState<number | null>(1000);
  const [dateValue, setDateValue] = useState<Date | null>(new Date());
  const [activeTab, setActiveTab] = useState("number");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Form Layout</h2>
      <p className="text-gray-500">See previews of available field types and their configurations</p>
      
      <Alert variant="info" className="bg-blue-50 border-blue-100">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertDescription className="text-blue-700">
          This panel allows you to preview different field types and their configurations.
          Select a field type from the tabs below to explore available options.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="number">Number</TabsTrigger>
          <TabsTrigger value="date">Date/Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="number" className="space-y-6">
          <h3 className="text-lg font-medium">Number Field Examples</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-3">Basic Number</h4>
                <NumberInputField 
                  value={numberValue} 
                  onChange={setNumberValue}
                  label="Basic Number"
                />
              </div>
              
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-3">Locale & Currency</h4>
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
                <h4 className="text-sm font-medium mb-3">Prefix & Suffix</h4>
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
            
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-3">Buttons</h4>
                <NumberInputField 
                  value={numberValue} 
                  onChange={setNumberValue}
                  label="Horizontal Buttons"
                  showButtons
                  buttonLayout="horizontal"
                />
                <div className="mt-4">
                  <NumberInputField 
                    value={numberValue} 
                    onChange={setNumberValue}
                    label="Vertical Buttons"
                    showButtons
                    buttonLayout="vertical"
                  />
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-3">Styling Options</h4>
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
                <h4 className="text-sm font-medium mb-3">States</h4>
                <NumberInputField 
                  value={numberValue} 
                  onChange={setNumberValue}
                  label="Invalid"
                  invalid
                />
                <div className="mt-4">
                  <NumberInputField 
                    value={numberValue} 
                    onChange={setNumberValue}
                    label="Disabled"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="date" className="space-y-6">
          <h3 className="text-lg font-medium">Date/Calendar Field Examples</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-3">Basic Calendar</h4>
                <DateCalendarField 
                  value={dateValue} 
                  onChange={setDateValue}
                  label="Basic Date Picker"
                />
              </div>
              
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-3">Date Formats</h4>
                <DateCalendarField 
                  value={dateValue} 
                  onChange={setDateValue}
                  label="MM/dd/yyyy"
                  dateFormat="MM/dd/yyyy"
                />
                <div className="mt-4">
                  <DateCalendarField 
                    value={dateValue} 
                    onChange={setDateValue}
                    label="dd-MMM-yyyy"
                    dateFormat="dd-MMM-yyyy"
                  />
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-3">Selection Types</h4>
                <DateCalendarField 
                  value={dateValue} 
                  onChange={setDateValue}
                  label="Multiple Selection"
                  allowMultipleSelection
                />
                <div className="mt-4">
                  <DateCalendarField 
                    value={dateValue} 
                    onChange={setDateValue}
                    label="Range Selection"
                    allowRangeSelection
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-3">Special Pickers</h4>
                <DateCalendarField 
                  value={dateValue} 
                  onChange={setDateValue}
                  label="Month Picker"
                  monthPickerOnly
                />
                <div className="mt-4">
                  <DateCalendarField 
                    value={dateValue} 
                    onChange={setDateValue}
                    label="Year Picker"
                    yearPickerOnly
                  />
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-3">Advanced Features</h4>
                <DateCalendarField 
                  value={dateValue} 
                  onChange={setDateValue}
                  label="With Button Bar"
                  showButtonBar
                />
                <div className="mt-4">
                  <DateCalendarField 
                    value={dateValue} 
                    onChange={setDateValue}
                    label="With Time Picker"
                    includeTimePicker
                  />
                </div>
                <div className="mt-4">
                  <DateCalendarField 
                    value={dateValue} 
                    onChange={setDateValue}
                    label="Multiple Months"
                    showMultipleMonths
                  />
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-3">States & Styles</h4>
                <DateCalendarField 
                  value={dateValue} 
                  onChange={setDateValue}
                  label="Float Label"
                  floatingLabel
                />
                <div className="mt-4">
                  <DateCalendarField 
                    value={dateValue} 
                    onChange={setDateValue}
                    label="Invalid"
                    invalid
                  />
                </div>
                <div className="mt-4">
                  <DateCalendarField 
                    value={dateValue} 
                    onChange={setDateValue}
                    label="Disabled"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-md mt-4">
            <h4 className="text-sm font-medium mb-3">Inline Mode</h4>
            <Label className="text-sm font-medium mb-2 block">Inline Calendar</Label>
            <DateCalendarField 
              value={dateValue} 
              onChange={setDateValue}
              inlineMode
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
