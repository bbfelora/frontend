'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Plus, Key, Copy, Trash2, Calendar, Activity, AlertCircle } from 'lucide-react'
import { createApiKey, type CreateApiKeyRequest, type ApiKey, getUsageMetrics, type UsageMetrics } from '@/lib/api'
import { useToast } from '@/components/ui/toast'
import { FeloraLogoWithText } from '@/components/ui/felora-logo'
import { CreateApiKeyModal } from '@/components/create-api-key-modal'

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
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null)
  const { addToast } = useToast()

  const orgId = 'demo-org' // In real app, get from user context

  useEffect(() => {
    fetchUsageMetrics()
  }, [])

  const fetchUsageMetrics = async () => {
    try {
      const metrics = await getUsageMetrics(orgId)
      setUsageMetrics(metrics)
    } catch (error) {
      // Mock data for demo
      setUsageMetrics({
        api_requests: {
          current: 7234,
          limit: 10000
        },
        storage_gb: {
          current: 6.7,
          limit: 10
        },
        bandwidth_gb: {
          current: 78.3,
          limit: 100
        }
      })
    }
  }

  const handleKeyCreated = (newKey: ApiKey) => {
    setApiKeys([newKey, ...apiKeys])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addToast('Copied to clipboard!', 'success')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.round((current / limit) * 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-accent'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FeloraLogoWithText size="md" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">demo-org</span>
              <Button variant="outline" asChild>
                <Link href="/account">Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Usage Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {usageMetrics ? (
            <>
              {/* API Requests Usage */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {formatNumber(usageMetrics.api_requests.current)}
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      of {formatNumber(usageMetrics.api_requests.limit)} limit
                    </span>
                    <span className={`font-medium ${getUsageColor(getUsagePercentage(usageMetrics.api_requests.current, usageMetrics.api_requests.limit))}`}>
                      {getUsagePercentage(usageMetrics.api_requests.current, usageMetrics.api_requests.limit)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressBarColor(getUsagePercentage(usageMetrics.api_requests.current, usageMetrics.api_requests.limit))}`}
                      style={{ width: `${Math.min(getUsagePercentage(usageMetrics.api_requests.current, usageMetrics.api_requests.limit), 100)}%` }}
                    ></div>
                  </div>
                  {getUsagePercentage(usageMetrics.api_requests.current, usageMetrics.api_requests.limit) >= 90 && (
                    <div className="flex items-center mt-2 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Approaching limit
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Storage Usage */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Storage</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {usageMetrics.storage_gb.current.toFixed(1)}GB
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      of {usageMetrics.storage_gb.limit}GB limit
                    </span>
                    <span className={`font-medium ${getUsageColor(getUsagePercentage(usageMetrics.storage_gb.current, usageMetrics.storage_gb.limit))}`}>
                      {getUsagePercentage(usageMetrics.storage_gb.current, usageMetrics.storage_gb.limit)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressBarColor(getUsagePercentage(usageMetrics.storage_gb.current, usageMetrics.storage_gb.limit))}`}
                      style={{ width: `${Math.min(getUsagePercentage(usageMetrics.storage_gb.current, usageMetrics.storage_gb.limit), 100)}%` }}
                    ></div>
                  </div>
                  {getUsagePercentage(usageMetrics.storage_gb.current, usageMetrics.storage_gb.limit) >= 90 && (
                    <div className="flex items-center mt-2 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Approaching limit
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bandwidth Usage */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bandwidth</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {usageMetrics.bandwidth_gb.current.toFixed(1)}GB
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      of {usageMetrics.bandwidth_gb.limit}GB limit
                    </span>
                    <span className={`font-medium ${getUsageColor(getUsagePercentage(usageMetrics.bandwidth_gb.current, usageMetrics.bandwidth_gb.limit))}`}>
                      {getUsagePercentage(usageMetrics.bandwidth_gb.current, usageMetrics.bandwidth_gb.limit)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressBarColor(getUsagePercentage(usageMetrics.bandwidth_gb.current, usageMetrics.bandwidth_gb.limit))}`}
                      style={{ width: `${Math.min(getUsagePercentage(usageMetrics.bandwidth_gb.current, usageMetrics.bandwidth_gb.limit), 100)}%` }}
                    ></div>
                  </div>
                  {getUsagePercentage(usageMetrics.bandwidth_gb.current, usageMetrics.bandwidth_gb.limit) >= 90 && (
                    <div className="flex items-center mt-2 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Approaching limit
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            // Loading state
            <>
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="w-full h-2 bg-gray-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* Usage Alert Card */}
        {usageMetrics && (
          usageMetrics.api_requests.current / usageMetrics.api_requests.limit >= 0.8 ||
          usageMetrics.storage_gb.current / usageMetrics.storage_gb.limit >= 0.8 ||
          usageMetrics.bandwidth_gb.current / usageMetrics.bandwidth_gb.limit >= 0.8
        ) && (
          <div className="mb-8">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Usage Alert</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      You're approaching your plan limits. Consider upgrading to avoid service interruption.
                    </p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <Link href="/account">View Plans</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
              <CreateApiKeyModal onKeyCreated={handleKeyCreated} />
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
                                className="bg-accent/10 text-accent text-xs px-2 py-1 rounded"
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