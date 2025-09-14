'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { Plus, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { createApiKey } from '@/lib/api'

interface CreateApiKeyModalProps {
  onKeyCreated: (apiKey: any) => void
}

export function CreateApiKeyModal({ onKeyCreated }: CreateApiKeyModalProps) {
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scopes: ['artifacts:read'],
    expiresIn: '30' // days
  })
  const { addToast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleScopeChange = (scope: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      scopes: checked 
        ? [...prev.scopes, scope]
        : prev.scopes.filter(s => s !== scope)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      addToast('Please enter a name for your API key', 'error')
      return
    }

    if (formData.scopes.length === 0) {
      addToast('Please select at least one permission', 'error')
      return
    }

    setIsCreating(true)
    try {
      const newKey = await createApiKey({
        name: formData.name,
        description: formData.description,
        orgId: 'demo-org', // In real app, get from user context
        scopes: formData.scopes,
        expiresIn: parseInt(formData.expiresIn)
      })
      
      onKeyCreated(newKey)
      addToast(`API Key "${formData.name}" created successfully!`, 'success')
      
      // Show the actual key in a separate toast
      setTimeout(() => {
        addToast(`Key: ${newKey.key} - Save this key, it won't be shown again!`, 'warning')
      }, 500)
      
      // Reset form and close modal
      setFormData({ name: '', description: '', scopes: ['artifacts:read'], expiresIn: '30' })
      setOpen(false)
    } catch (error) {
      addToast('Failed to create API key. Make sure your Felora backend is running.', 'error')
    } finally {
      setIsCreating(false)
    }
  }

  const availableScopes = [
    { id: 'artifacts:read', label: 'Read Artifacts', description: 'Download and access artifacts' },
    { id: 'artifacts:write', label: 'Write Artifacts', description: 'Upload and manage artifacts' },
    { id: 'analytics:read', label: 'Read Analytics', description: 'View usage statistics and metrics' }
  ]

  const expirationOptions = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
    { value: '365', label: '1 year' },
    { value: '0', label: 'Never expires' }
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl mx-4">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key to access the Felora delivery network. Choose permissions carefully.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-6 px-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Production API Key"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <Label>Permissions *</Label>
              <div className="space-y-3">
                {availableScopes.map((scope) => (
                  <div key={scope.id} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={scope.id}
                      checked={formData.scopes.includes(scope.id)}
                      onChange={(e) => handleScopeChange(scope.id, e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <div className="flex-1">
                      <label htmlFor={scope.id} className="text-sm font-medium cursor-pointer">
                        {scope.label}
                      </label>
                      <p className="text-xs text-muted-foreground">{scope.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expiration */}
            <div className="space-y-2">
              <Label htmlFor="expires">Expiration</Label>
              <select
                id="expires"
                value={formData.expiresIn}
                onChange={(e) => handleInputChange('expiresIn', e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {expirationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Warning */}
            <div className="flex items-start space-x-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-orange-800">
                <p className="font-medium">Important:</p>
                <p>The API key will only be shown once after creation. Make sure to save it securely.</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-accent hover:bg-accent/90"
            >
              {isCreating ? 'Creating...' : 'Create API Key'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}