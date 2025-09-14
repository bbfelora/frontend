'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ArrowLeft, LogOut, User, Settings, CreditCard, Receipt, FileText } from 'lucide-react'
import { FeloraLogoWithText } from '@/components/ui/felora-logo'
import { SubscriptionOverview } from '@/components/billing/subscription-overview'
import { PaymentMethodsList } from '@/components/billing/payment-methods-list'
import { PaymentMethodForm } from '@/components/billing/payment-method-form'
import { BillingHistory } from '@/components/billing/billing-history'
import { SubscriptionManagementModal } from '@/components/billing/subscription-management-modal'

export default function Account() {
  const router = useRouter()
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [paymentMethodsRefresh, setPaymentMethodsRefresh] = useState(0)

  const orgId = 'demo-org' // In real app, get from user context

  const handleLogout = () => {
    localStorage.removeItem('jwt')
    router.push('/login')
  }

  const handlePaymentMethodAdded = () => {
    setShowPaymentForm(false)
    setPaymentMethodsRefresh(prev => prev + 1)
  }

  const handleSubscriptionUpdated = () => {
    // This would trigger a refresh of subscription data
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <FeloraLogoWithText size="md" />
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Account Page */}
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account, billing, and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center">
              <Receipt className="w-4 h-4 mr-2" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <p className="text-muted-foreground mt-1">demo@felora.io</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Organization</label>
                    <p className="text-muted-foreground mt-1">Demo Organization</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Account Type</label>
                    <p className="text-muted-foreground mt-1">Demo Account</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Member Since</label>
                    <p className="text-muted-foreground mt-1">January 2024</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Sign Out</p>
                      <p className="text-sm text-muted-foreground">Sign out of your Felora account</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-8">
              {/* Subscription Overview */}
              <SubscriptionOverview 
                orgId={orgId} 
                onUpgrade={() => setShowUpgradeModal(true)} 
              />
              
              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Payment Methods</CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentForm(!showPaymentForm)}
                    >
                      {showPaymentForm ? 'Cancel' : 'Add Payment Method'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showPaymentForm ? (
                    <PaymentMethodForm
                      orgId={orgId}
                      onPaymentMethodAdded={handlePaymentMethodAdded}
                    />
                  ) : (
                    <PaymentMethodsList
                      orgId={orgId}
                      refreshTrigger={paymentMethodsRefresh}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <BillingHistory orgId={orgId} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about your API usage</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <p className="font-medium text-foreground">API Key Alerts</p>
                    <p className="text-sm text-muted-foreground">Notifications for API key expiration</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-foreground">Usage Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when approaching plan limits</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Subscription Management Modal */}
      <SubscriptionManagementModal
        orgId={orgId}
        currentPlanId="starter" // In real app, get from subscription data
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        onSubscriptionUpdated={handleSubscriptionUpdated}
      />
    </div>
  )
}