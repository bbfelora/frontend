import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface ApiKey {
  id: string
  keyId: string
  key?: string // Only returned on creation
  name: string
  scopes: string[]
  createdAt: string
  expiresAt?: string
  state: 'active' | 'revoked'
}

export interface CreateApiKeyRequest {
  name: string
  orgId: string
  projectId?: string
  scopes: string[]
  expiresAt?: string
}

export interface VerifyApiKeyRequest {
  apiKey: string
}

export interface VerifyApiKeyResponse {
  ok: boolean
  orgId?: string
  projectId?: string
  scopes?: string[]
}

// API Functions
export async function createApiKey(data: CreateApiKeyRequest): Promise<ApiKey> {
  const response = await api.post('/v1/apikeys', data)
  return response.data
}

export async function verifyApiKey(apiKey: string): Promise<VerifyApiKeyResponse> {
  const response = await api.post('/v1/apikeys/verify', { apiKey })
  return response.data
}

// Placeholder for future endpoints
export async function listApiKeys(orgId: string): Promise<ApiKey[]> {
  // This would be implemented when you add the list endpoint to your backend
  const response = await api.get(`/v1/orgs/${orgId}/apikeys`)
  return response.data
}

export async function revokeApiKey(keyId: string): Promise<void> {
  // This would be implemented when you add the revoke endpoint to your backend  
  await api.delete(`/v1/apikeys/${keyId}`)
}

// Billing Types
export interface BillingInfo {
  customerId: string
  email: string
  name?: string
  address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  tax_id?: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account'
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
  bank_account?: {
    last4: string
    bank_name: string
  }
  is_default: boolean
}

export interface Subscription {
  id: string
  status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing'
  plan: {
    id: string
    name: string
    price: number
    currency: string
    interval: 'month' | 'year'
    features: string[]
    limits: {
      api_requests: number
      storage_gb: number
      bandwidth_gb: number
    }
  }
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
}

export interface Invoice {
  id: string
  number: string
  status: 'paid' | 'open' | 'draft' | 'uncollectible' | 'void'
  amount_paid: number
  amount_due: number
  currency: string
  created: string
  due_date: string
  hosted_invoice_url: string
  invoice_pdf: string
}

export interface UsageMetrics {
  api_requests: {
    current: number
    limit: number
  }
  storage_gb: {
    current: number
    limit: number
  }
  bandwidth_gb: {
    current: number
    limit: number
  }
}

// Billing API Functions
export async function getBillingInfo(orgId: string): Promise<BillingInfo> {
  const response = await api.get(`/v1/orgs/${orgId}/billing`)
  return response.data
}

export async function updateBillingInfo(orgId: string, data: Partial<BillingInfo>): Promise<BillingInfo> {
  const response = await api.put(`/v1/orgs/${orgId}/billing`, data)
  return response.data
}

export async function getPaymentMethods(orgId: string): Promise<PaymentMethod[]> {
  const response = await api.get(`/v1/orgs/${orgId}/payment-methods`)
  return response.data
}

export async function addPaymentMethod(orgId: string, paymentMethodId: string): Promise<PaymentMethod> {
  const response = await api.post(`/v1/orgs/${orgId}/payment-methods`, { 
    payment_method_id: paymentMethodId 
  })
  return response.data
}

export async function removePaymentMethod(orgId: string, paymentMethodId: string): Promise<void> {
  await api.delete(`/v1/orgs/${orgId}/payment-methods/${paymentMethodId}`)
}

export async function setDefaultPaymentMethod(orgId: string, paymentMethodId: string): Promise<void> {
  await api.put(`/v1/orgs/${orgId}/payment-methods/${paymentMethodId}/default`)
}

export async function getSubscription(orgId: string): Promise<Subscription> {
  const response = await api.get(`/v1/orgs/${orgId}/subscription`)
  return response.data
}

export async function updateSubscription(orgId: string, planId: string): Promise<Subscription> {
  const response = await api.put(`/v1/orgs/${orgId}/subscription`, { plan_id: planId })
  return response.data
}

export async function cancelSubscription(orgId: string, cancelAtPeriodEnd = true): Promise<Subscription> {
  const response = await api.post(`/v1/orgs/${orgId}/subscription/cancel`, { 
    cancel_at_period_end: cancelAtPeriodEnd 
  })
  return response.data
}

export async function getInvoices(orgId: string): Promise<Invoice[]> {
  const response = await api.get(`/v1/orgs/${orgId}/invoices`)
  return response.data
}

export async function getUsageMetrics(orgId: string): Promise<UsageMetrics> {
  const response = await api.get(`/v1/orgs/${orgId}/usage`)
  return response.data
}

export async function createSetupIntent(orgId: string): Promise<{ client_secret: string }> {
  const response = await api.post(`/v1/orgs/${orgId}/setup-intent`)
  return response.data
}