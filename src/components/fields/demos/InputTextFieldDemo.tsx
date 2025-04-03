
import React, { useState } from "react";
import { InputTextField } from "../inputs/InputTextField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function InputTextFieldDemo() {
  const [basicValue, setBasicValue] = useState("");
  const [filteredValue, setFilteredValue] = useState("");
  const [floatValue, setFloatValue] = useState("");
  const [filledValue, setFilledValue] = useState("Pre-filled content");
  const [invalidValue, setInvalidValue] = useState("Invalid input");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Text Field Examples</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="states">States</TabsTrigger>
            <TabsTrigger value="size">Sizes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Standard Input</h3>
                <InputTextField
                  id="basic-input"
                  label="Name"
                  placeholder="Enter your name"
                  value={basicValue}
                  onChange={(e) => setBasicValue(e.target.value)}
                  helpText="Please enter your full name"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Key Filter (Numbers Only)</h3>
                <InputTextField
                  id="filtered-input"
                  label="Phone Number"
                  placeholder="Enter numbers only"
                  value={filteredValue}
                  onChange={(e) => setFilteredValue(e.target.value)}
                  keyFilter="numeric"
                  helpText="Only numeric characters are allowed"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Float Label</h3>
                <InputTextField
                  id="float-input"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={floatValue}
                  onChange={(e) => setFloatValue(e.target.value)}
                  floatLabel
                  helpText="Label floats when the field is focused or has content"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">With Help Text</h3>
                <InputTextField
                  id="help-text-input"
                  label="Username"
                  placeholder="Choose a username"
                  helpText="Username must be 3-20 characters long and contain only letters, numbers, and underscores"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="states">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Filled Input</h3>
                <InputTextField
                  id="filled-input"
                  label="Bio"
                  value={filledValue}
                  onChange={(e) => setFilledValue(e.target.value)}
                  filled
                  helpText="This input comes pre-filled with content"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Invalid Input</h3>
                <InputTextField
                  id="invalid-input"
                  label="Password"
                  type="password"
                  value={invalidValue}
                  onChange={(e) => setInvalidValue(e.target.value)}
                  invalid
                  errorMessage="Password must be at least 8 characters long"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Disabled Input</h3>
                <InputTextField
                  id="disabled-input"
                  label="Read-only Field"
                  value="This field cannot be edited"
                  disabled
                  helpText="This input is disabled and cannot be modified"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Required Input</h3>
                <InputTextField
                  id="required-input"
                  label="Required Field"
                  placeholder="This field is required"
                  required
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="size">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Small Input</h3>
                <InputTextField
                  id="small-input"
                  label="Small Input"
                  placeholder="Small size input"
                  size="small"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Medium Input (Default)</h3>
                <InputTextField
                  id="medium-input"
                  label="Medium Input"
                  placeholder="Medium size input"
                  size="medium"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Large Input</h3>
                <InputTextField
                  id="large-input"
                  label="Large Input"
                  placeholder="Large size input"
                  size="large"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default InputTextFieldDemo;
