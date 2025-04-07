
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { InputTextField } from '@/components/fields/inputs/InputTextField';
import { toast } from '@/hooks/use-toast';

export default function Users() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  
  const handleUpdateProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  // Create properly typed change handlers for each field
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value);
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value);
  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => setBio(e.target.value);

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your profile information here.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputTextField
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={handleFirstNameChange}
              />
              <InputTextField
                id="lastName"
                label="Last Name"
                value={lastName}
                onChange={handleLastNameChange}
              />
            </div>
            <InputTextField
              id="email"
              label="Email"
              value={email}
              onChange={handleEmailChange}
            />
            <InputTextField
              id="username"
              label="Username"
              value={username}
              onChange={handleUsernameChange}
            />
            <InputTextField
              id="phoneNumber"
              label="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              keyFilter="numbers"
            />
            <InputTextField
              id="bio"
              label="Bio"
              value={bio}
              onChange={handleBioChange}
            />
          </CardContent>
          <CardFooter className="flex justify-end items-center">
            <Button onClick={handleUpdateProfile}>
              Update Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
