'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Check, Zap } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { updateSubscription } from '@/lib/api'

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  description: string
  features: string[]
  limits: {
    api_requests: number
    storage_gb: number
    bandwidth_gb: number
  }
  popular?: boolean
}

interface SubscriptionManagementModalProps {
  orgId: string
  currentPlanId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubscriptionUpdated: () => void
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    currency: 'usd',
    interval: 'month',
    description: 'Perfect for small teams and projects',
    features: [
      '10,000 API requests/month',
      '10GB storage',
      '100GB bandwidth',
      'Basic support',
      'Standard uptime (99.5%)'
    ],
    limits: {
      api_requests: 10000,
      storage_gb: 10,
      bandwidth_gb: 100
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    currency: 'usd',
    interval: 'month',
    description: 'For growing businesses with higher demands',
    features: [
      '100,000 API requests/month',
      '50GB storage',
      '500GB bandwidth',
      'Priority support',
      'Enhanced uptime (99.9%)',
      'Advanced analytics',
      'Custom CDN rules'
    ],
    limits: {
      api_requests: 100000,
      storage_gb: 50,
      bandwidth_gb: 500
    },
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    currency: 'usd',
    interval: 'month',
    description: 'For enterprise-scale applications',
    features: [
      '1,000,000 API requests/month',
      '500GB storage',
      '5TB bandwidth',
      '24/7 dedicated support',
      'Premium uptime (99.99%)',
      'Advanced analytics',
      'Custom CDN rules',
      'White-label options',
      'SLA guarantee'
    ],
    limits: {
      api_requests: 1000000,
      storage_gb: 500,
      bandwidth_gb: 5000
    }
  }
]

export function SubscriptionManagementModal({ 
  orgId, 
  currentPlanId, 
  open, 
  onOpenChange, 
  onSubscriptionUpdated 
}: SubscriptionManagementModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(currentPlanId || 'starter')
  const [isUpdating, setIsUpdating] = useState(false)
  const { addToast } = useToast()

  const handleUpdateSubscription = async () => {
    if (selectedPlanId === currentPlanId) {
      onOpenChange(false)
      return
    }

    setIsUpdating(true)
    try {
      await updateSubscription(orgId, selectedPlanId)
      addToast('Subscription updated successfully!', 'success')
      onSubscriptionUpdated()
      onOpenChange(false)
    } catch (error) {
      addToast('Failed to update subscription', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const formatPrice = (price: number, currency: string, interval: string) => {
    return `$${price}/${interval}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${num / 1000000}M`
    } else if (num >= 1000) {
      return `${num / 1000}K`
    }
    return num.toString()
  }

  const selectedPlan = plans.find(p => p.id === selectedPlanId)
  const currentPlan = plans.find(p => p.id === currentPlanId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl mx-4">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select the plan that best fits your needs. You can change or cancel anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-lg border p-6 cursor-pointer transition-all ${
                selectedPlanId === plan.id
                  ? 'border-accent ring-2 ring-accent ring-opacity-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${plan.popular ? 'ring-2 ring-accent ring-opacity-20' : ''}`}
              onClick={() => setSelectedPlanId(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground">
                    <Zap className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {plan.id === currentPlanId && (
                <div className="absolute -top-2 right-4">
                  <Badge variant="outline">Current Plan</Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>API Requests</span>
                    <span className="font-medium">{formatNumber(plan.limits.api_requests)}/month</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span className="font-medium">{plan.limits.storage_gb}GB</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Bandwidth</span>
                    <span className="font-medium">{formatNumber(plan.limits.bandwidth_gb)}GB</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPlanId === plan.id
                    ? 'border-accent bg-accent'
                    : 'border-gray-300'
                }`}>
                  {selectedPlanId === plan.id && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPlan && selectedPlan.id !== currentPlanId && (
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <p className="text-sm">
              <strong>Plan Change Summary:</strong> You're switching from{' '}
              {currentPlan ? `${currentPlan.name} (${formatPrice(currentPlan.price, currentPlan.currency, currentPlan.interval)})` : 'your current plan'} to{' '}
              {selectedPlan.name} ({formatPrice(selectedPlan.price, selectedPlan.currency, selectedPlan.interval)}).
              The change will take effect immediately and you'll be prorated for the difference.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateSubscription}
            disabled={isUpdating || selectedPlanId === currentPlanId}
            className="bg-accent hover:bg-accent/90"
          >
            {isUpdating ? 'Updating...' : selectedPlanId === currentPlanId ? 'Current Plan' : 'Update Subscription'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}