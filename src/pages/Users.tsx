
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputTextField } from '@/components/fields/inputs/InputTextField';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function Users() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: 'defaultUser',
    password: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Simple validation rules
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Phone number must have 10 digits';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would submit the form data here
      toast({
        title: "User created successfully",
        description: `Created user ${formData.firstName} ${formData.lastName}`,
      });
    } else {
      toast({
        title: "Form validation failed",
        description: "Please check the form for errors",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>Create a new user account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputTextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  invalid={!!errors.firstName}
                  errorMessage={errors.firstName}
                  required
                />
                
                <InputTextField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  invalid={!!errors.lastName}
                  errorMessage={errors.lastName}
                  required
                />
              </div>
              
              <InputTextField
                id="email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                invalid={!!errors.email}
                errorMessage={errors.email}
                required
                helpText="We'll never share your email with anyone"
              />
              
              <InputTextField
                id="phone"
                name="phone"
                label="Phone Number"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleInputChange}
                keyFilter="numeric"
                invalid={!!errors.phone}
                errorMessage={errors.phone}
                helpText="Format: 1234567890"
              />
              
              <InputTextField
                id="username"
                name="username"
                label="Username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleInputChange}
                filled
                floatLabel
                helpText="Username must be unique"
              />
              
              <InputTextField
                id="password"
                name="password"
                label="Password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                invalid={!!errors.password}
                errorMessage={errors.password}
                required
                helpText="At least 8 characters"
              />
              
              <div className="pt-4">
                <Button type="submit" className="w-full md:w-auto">
                  Create User
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
