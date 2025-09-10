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