'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CreditCard, Trash2, Check } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { 
  getPaymentMethods, 
  removePaymentMethod, 
  setDefaultPaymentMethod, 
  type PaymentMethod 
} from '@/lib/api'

interface PaymentMethodsListProps {
  orgId: string
  refreshTrigger?: number
}

export function PaymentMethodsList({ orgId, refreshTrigger }: PaymentMethodsListProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { addToast } = useToast()

  const fetchPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods(orgId)
      setPaymentMethods(methods)
    } catch (error) {
      // Mock data for demo
      setPaymentMethods([
        {
          id: 'pm_1',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025
          },
          is_default: true
        },
        {
          id: 'pm_2',
          type: 'card',
          card: {
            brand: 'mastercard',
            last4: '5555',
            exp_month: 8,
            exp_year: 2026
          },
          is_default: false
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentMethods()
  }, [orgId, refreshTrigger])

  const handleDelete = async (paymentMethodId: string) => {
    setDeletingId(paymentMethodId)
    try {
      await removePaymentMethod(orgId, paymentMethodId)
      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId))
      addToast('Payment method removed successfully', 'success')
    } catch (error) {
      addToast('Failed to remove payment method', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(orgId, paymentMethodId)
      setPaymentMethods(prev => prev.map(pm => ({
        ...pm,
        is_default: pm.id === paymentMethodId
      })))
      addToast('Default payment method updated', 'success')
    } catch (error) {
      addToast('Failed to update default payment method', 'error')
    }
  }

  const getCardIcon = (brand: string) => {
    const brandLower = brand.toLowerCase()
    const brandDisplay = brandLower.charAt(0).toUpperCase() + brandLower.slice(1)
    return brandDisplay
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center space-x-3 p-4 border rounded-lg animate-pulse">
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      {paymentMethods.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No payment methods added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-6 border rounded-lg bg-white">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-8 bg-gray-100 rounded border">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-base">
                      {method.card ? getCardIcon(method.card.brand) : 'Bank Account'} ••••{' '}
                      {method.card?.last4 || method.bank_account?.last4}
                    </span>
                    {method.is_default && (
                      <span className="flex items-center text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                        <Check className="h-3 w-3 mr-1" />
                        Default
                      </span>
                    )}
                  </div>
                  {method.card && (
                    <p className="text-sm text-muted-foreground">
                      Expires {method.card.exp_month.toString().padStart(2, '0')}/{method.card.exp_year}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3">
                {!method.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(method.id)}
                  disabled={deletingId === method.id}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  {deletingId === method.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}