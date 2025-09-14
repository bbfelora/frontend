'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, CreditCard, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { getSubscription, cancelSubscription, type Subscription } from '@/lib/api'

interface SubscriptionOverviewProps {
  orgId: string
  onUpgrade: () => void
}

export function SubscriptionOverview({ orgId, onUpgrade }: SubscriptionOverviewProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCanceling, setIsCanceling] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    fetchSubscription()
  }, [orgId])

  const fetchSubscription = async () => {
    try {
      const sub = await getSubscription(orgId)
      setSubscription(sub)
    } catch (error) {
      // Mock data for demo
      setSubscription({
        id: 'sub_demo',
        status: 'active',
        plan: {
          id: 'starter',
          name: 'Starter Plan',
          price: 29,
          currency: 'usd',
          interval: 'month',
          features: [
            '10,000 API requests/month',
            '10GB storage',
            '100GB bandwidth',
            'Basic support'
          ],
          limits: {
            api_requests: 10000,
            storage_gb: 10,
            bandwidth_gb: 100
          }
        },
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!subscription) return
    
    setIsCanceling(true)
    try {
      const updated = await cancelSubscription(orgId)
      setSubscription(updated)
      addToast('Subscription will be canceled at the end of the current period', 'success')
    } catch (error) {
      addToast('Failed to cancel subscription', 'error')
    } finally {
      setIsCanceling(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      canceled: 'bg-red-100 text-red-800',
      past_due: 'bg-yellow-100 text-yellow-800',
      trialing: 'bg-blue-100 text-blue-800',
      incomplete: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.incomplete}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-muted-foreground mb-4">No active subscription</p>
            <Button onClick={onUpgrade} className="bg-accent hover:bg-accent/90">
              Choose a Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center space-x-3">
              <span>{subscription.plan.name}</span>
              {getStatusBadge(subscription.status)}
            </CardTitle>
            <p className="text-muted-foreground">
              ${subscription.plan.price}/{subscription.plan.interval}
            </p>
          </div>
          <Button variant="outline" onClick={onUpgrade}>
            Change Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {subscription.cancel_at_period_end && (
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Subscription Ending</p>
              <p>Your subscription will end on {formatDate(subscription.current_period_end)}</p>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-medium mb-3">Plan Features</h4>
          <ul className="space-y-2">
            {subscription.plan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Current period</p>
            <p className="font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Next billing</p>
            <p className="font-medium">
              {subscription.cancel_at_period_end 
                ? 'Not scheduled' 
                : formatDate(subscription.current_period_end)
              }
            </p>
          </div>
        </div>

        {subscription.status === 'active' && !subscription.cancel_at_period_end && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isCanceling}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}