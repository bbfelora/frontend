'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Plus, Key, Copy, Trash2, Calendar, Activity } from 'lucide-react'
import { createApiKey, type CreateApiKeyRequest, type ApiKey } from '@/lib/api'

// Mock data for demonstration
const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    keyId: 'flr_live_a1b2c3d4',
    name: 'Production API Key',
    scopes: ['artifacts:read'],
    createdAt: '2025-01-15T10:30:00Z',
    state: 'active'
  },
  {
    id: '2', 
    keyId: 'flr_live_e5f6g7h8',
    name: 'Development Key',
    scopes: ['artifacts:read', 'artifacts:write'],
    createdAt: '2025-01-10T14:20:00Z',
    state: 'active'
  }
]

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return
    
    setIsCreating(true)
    try {
      const newKey = await createApiKey({
        name: newKeyName,
        orgId: 'demo-org', // In real app, get from user context
        scopes: ['artifacts:read']
      })
      
      setApiKeys([newKey, ...apiKeys])
      setNewKeyName('')
      alert(`API Key created!\n\nKey: ${newKey.key}\n\nPlease save this key - it won't be shown again.`)
    } catch (error) {
      alert('Failed to create API key. Make sure your Felora backend is running.')
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Felora Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">demo-org</span>
              <Button variant="outline">Account</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active API Keys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiKeys.length}</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">
                +2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* API Keys Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for accessing the Felora delivery network
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="API Key name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button 
                  onClick={handleCreateKey}
                  disabled={isCreating || !newKeyName.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isCreating ? 'Creating...' : 'Create Key'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{apiKey.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          apiKey.state === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {apiKey.state}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Key ID</label>
                          <div className="flex items-center space-x-2">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                              {apiKey.keyId}...
                            </code>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.keyId)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700">Scopes</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {apiKey.scopes.map((scope) => (
                              <span 
                                key={scope}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {scope}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Created {formatDate(apiKey.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        View Usage
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {apiKeys.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Key className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No API keys yet. Create your first key to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}