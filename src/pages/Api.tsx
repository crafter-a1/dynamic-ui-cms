
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Key, Globe, Copy, Eye, EyeOff, Lock, CheckCircle, LayoutList, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Sample API keys data
const apiKeys = [
  { 
    id: '1', 
    name: 'Production API Key', 
    key: 'f3j9-d8ha-9dk3-3jd9', 
    created: '2023-05-15',
    lastUsed: '2 hours ago',
    permissions: ['read', 'write']
  },
  { 
    id: '2', 
    name: 'Development API Key', 
    key: 'k3j0-3jf9-d8c0-3j2n', 
    created: '2023-06-10',
    lastUsed: '1 week ago',
    permissions: ['read']
  },
  { 
    id: '3', 
    name: 'Testing API Key', 
    key: 'i2d8-3jd9-k3j0-9dk3', 
    created: '2023-07-22',
    lastUsed: 'Never',
    permissions: ['read', 'write', 'delete']
  }
];

// Sample API endpoints data
const apiEndpoints = [
  {
    id: '1',
    name: '/api/collections',
    method: 'GET',
    description: 'Retrieve all collections',
    authentication: 'Required',
    rateLimit: '100/minute'
  },
  {
    id: '2',
    name: '/api/collections/:id',
    method: 'GET',
    description: 'Retrieve a specific collection',
    authentication: 'Required',
    rateLimit: '100/minute'
  },
  {
    id: '3',
    name: '/api/content/:collection',
    method: 'GET',
    description: 'Retrieve content from a collection',
    authentication: 'Required',
    rateLimit: '200/minute'
  },
  {
    id: '4',
    name: '/api/content/:collection',
    method: 'POST',
    description: 'Create content in a collection',
    authentication: 'Required',
    rateLimit: '50/minute'
  },
  {
    id: '5',
    name: '/api/content/:collection/:id',
    method: 'PUT',
    description: 'Update content in a collection',
    authentication: 'Required',
    rateLimit: '50/minute'
  },
  {
    id: '6',
    name: '/api/public/collections',
    method: 'GET',
    description: 'Public endpoint for collections',
    authentication: 'None',
    rateLimit: '50/minute'
  }
];

export default function Api() {
  const [activeTab, setActiveTab] = useState('keys');
  const [searchQuery, setSearchQuery] = useState('');
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  
  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to clipboard",
    });
  };
  
  // Filter API keys based on search
  const filteredApiKeys = apiKeys.filter(key => 
    key.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter API endpoints based on search
  const filteredEndpoints = apiEndpoints.filter(endpoint => 
    endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">API Management</h1>
            <p className="text-gray-500">Manage your API keys and explore available endpoints</p>
          </div>
          
          <Button className="bg-cms-blue hover:bg-blue-700 mt-4 md:mt-0">
            <Key className="mr-2 h-4 w-4" />
            Generate New API Key
          </Button>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <div className="mb-6">
            <Input
              placeholder={`Search ${activeTab === 'keys' ? 'API keys' : 'endpoints'}...`}
              className="max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <TabsContent value="keys">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead className="w-[300px]">API Key</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApiKeys.length > 0 ? (
                        filteredApiKeys.map((apiKey) => (
                          <TableRow key={apiKey.id}>
                            <TableCell className="font-medium">{apiKey.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">
                                  {showKeys[apiKey.id] ? apiKey.key : '••••-••••-••••-••••'}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-6 w-6" 
                                  onClick={() => toggleKeyVisibility(apiKey.id)}
                                >
                                  {showKeys[apiKey.id] ? (
                                    <EyeOff className="h-3.5 w-3.5" />
                                  ) : (
                                    <Eye className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-6 w-6" 
                                  onClick={() => copyToClipboard(apiKey.key)}
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{apiKey.created}</TableCell>
                            <TableCell>{apiKey.lastUsed}</TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {apiKey.permissions.map((perm, index) => (
                                  <Badge key={index} variant="outline" className="capitalize">
                                    {perm}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600">
                                  Revoke
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No API keys found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="endpoints">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  Explore available API endpoints and their documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Endpoint</TableHead>
                        <TableHead className="w-[80px]">Method</TableHead>
                        <TableHead className="w-[300px]">Description</TableHead>
                        <TableHead>Authentication</TableHead>
                        <TableHead>Rate Limit</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEndpoints.length > 0 ? (
                        filteredEndpoints.map((endpoint) => (
                          <TableRow key={endpoint.id}>
                            <TableCell className="font-mono text-sm">{endpoint.name}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                  endpoint.method === 'POST' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                  endpoint.method === 'PUT' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                                  endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                                  'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                }
                              >
                                {endpoint.method}
                              </Badge>
                            </TableCell>
                            <TableCell>{endpoint.description}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {endpoint.authentication === 'Required' ? (
                                  <>
                                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                                    <span>Required</span>
                                  </>
                                ) : (
                                  <>
                                    <Globe className="h-3.5 w-3.5 text-green-500" />
                                    <span>Public</span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{endpoint.rateLimit}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                Test
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No endpoints found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-cms-blue" />
                    Authentication Settings
                  </CardTitle>
                  <CardDescription>
                    Configure API authentication methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">API Key Authentication</h3>
                      <p className="text-sm text-gray-500">Use API keys for authentication</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">JWT Authentication</h3>
                      <p className="text-sm text-gray-500">Use JWT tokens for authentication</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div>
                      <h3 className="font-medium">OAuth 2.0</h3>
                      <p className="text-sm text-gray-500">Use OAuth for authentication</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-cms-blue" />
                    Rate Limiting
                  </CardTitle>
                  <CardDescription>
                    Configure API rate limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Default Rate Limit</h3>
                      <p className="text-sm text-gray-500">Global limit for all endpoints</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">100/minute</span>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">IP-based Limiting</h3>
                      <p className="text-sm text-gray-500">Limit requests per IP address</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Enabled</span>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div>
                      <h3 className="font-medium">Per-Key Rate Limits</h3>
                      <p className="text-sm text-gray-500">Specific limits for each API key</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LayoutList className="h-5 w-5 text-cms-blue" />
                    API Documentation
                  </CardTitle>
                  <CardDescription>
                    Configure public API documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Public Documentation</h3>
                        <p className="text-sm text-gray-500">Make your API documentation publicly accessible</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <h3 className="font-medium">Swagger UI</h3>
                        <p className="text-sm text-gray-500">Interactive API documentation with Swagger</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Enabled
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <h3 className="font-medium">API Root URL</h3>
                        <p className="text-sm text-gray-500">Base URL for all API endpoints</p>
                      </div>
                      <div className="flex items-center">
                        <span className="font-mono text-sm mr-2">https://api.example.com/v1</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard('https://api.example.com/v1')}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
