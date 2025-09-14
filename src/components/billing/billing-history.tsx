'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Receipt, Calendar } from 'lucide-react'
import { getInvoices, type Invoice } from '@/lib/api'

interface BillingHistoryProps {
  orgId: string
}

export function BillingHistory({ orgId }: BillingHistoryProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [orgId])

  const fetchInvoices = async () => {
    try {
      const invoiceData = await getInvoices(orgId)
      setInvoices(invoiceData)
    } catch (error) {
      // Mock data for demo
      setInvoices([
        {
          id: 'in_1',
          number: 'FLR-0001',
          status: 'paid',
          amount_paid: 2900,
          amount_due: 0,
          currency: 'usd',
          created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          due_date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
          hosted_invoice_url: '#',
          invoice_pdf: '#'
        },
        {
          id: 'in_2',
          number: 'FLR-0002',
          status: 'paid',
          amount_paid: 2900,
          amount_due: 0,
          currency: 'usd',
          created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          due_date: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000).toISOString(),
          hosted_invoice_url: '#',
          invoice_pdf: '#'
        },
        {
          id: 'in_3',
          number: 'FLR-0003',
          status: 'open',
          amount_paid: 0,
          amount_due: 2900,
          currency: 'usd',
          created: new Date().toISOString(),
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          hosted_invoice_url: '#',
          invoice_pdf: '#'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-green-100 text-green-800',
      open: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      uncollectible: 'bg-red-100 text-red-800',
      void: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.draft}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No invoices yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-6 border rounded-lg bg-white">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-base mb-1">{invoice.number}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(invoice.created)}
                    </p>
                  </div>
                </div>

                <div className="text-right mr-6">
                  <p className="font-semibold text-lg">
                    {formatAmount(invoice.amount_paid || invoice.amount_due, invoice.currency)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Due: {formatDate(invoice.due_date)}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(invoice.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(invoice.invoice_pdf, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}