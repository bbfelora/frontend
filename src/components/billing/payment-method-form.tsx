'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { createSetupIntent, addPaymentMethod } from '@/lib/api'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface PaymentMethodFormProps {
  orgId: string
  onPaymentMethodAdded: () => void
}

function PaymentMethodFormInner({ orgId, onPaymentMethodAdded }: PaymentMethodFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      // Create setup intent
      const { client_secret } = await createSetupIntent(orgId)

      // Confirm setup intent with the card
      const { error, setupIntent } = await stripe.confirmCardSetup(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
            address: billingDetails.address
          }
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      if (setupIntent && setupIntent.payment_method) {
        // Add payment method to backend
        await addPaymentMethod(orgId, setupIntent.payment_method as string)
        addToast('Payment method added successfully!', 'success')
        onPaymentMethodAdded()
      }
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to add payment method', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={billingDetails.name}
              onChange={(e) => setBillingDetails(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={billingDetails.email}
              onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <Label>Card Information *</Label>
          <div className="mt-2 p-3 border border-input rounded-md">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Billing Address</h4>
          <div>
            <Label htmlFor="line1">Address Line 1 *</Label>
            <Input
              id="line1"
              value={billingDetails.address.line1}
              onChange={(e) => setBillingDetails(prev => ({ 
                ...prev, 
                address: { ...prev.address, line1: e.target.value } 
              }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="line2">Address Line 2</Label>
            <Input
              id="line2"
              value={billingDetails.address.line2}
              onChange={(e) => setBillingDetails(prev => ({ 
                ...prev, 
                address: { ...prev.address, line2: e.target.value } 
              }))}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={billingDetails.address.city}
                onChange={(e) => setBillingDetails(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, city: e.target.value } 
                }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={billingDetails.address.state}
                onChange={(e) => setBillingDetails(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, state: e.target.value } 
                }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="postal_code">ZIP Code *</Label>
              <Input
                id="postal_code"
                value={billingDetails.address.postal_code}
                onChange={(e) => setBillingDetails(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, postal_code: e.target.value } 
                }))}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-accent hover:bg-accent/90"
        disabled={!stripe || isLoading}
      >
        {isLoading ? 'Adding Payment Method...' : 'Add Payment Method'}
      </Button>
    </form>
  )
}

export function PaymentMethodForm({ orgId, onPaymentMethodAdded }: PaymentMethodFormProps) {
  return (
    <div className="max-w-2xl">
      <Elements stripe={stripePromise}>
        <PaymentMethodFormInner orgId={orgId} onPaymentMethodAdded={onPaymentMethodAdded} />
      </Elements>
    </div>
  )
}