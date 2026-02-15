// Authentication Service
import { apiClient } from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
  confirmPassword: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    localStorage.setItem('authToken', response.data.token)
    return response.data
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials)
    localStorage.setItem('authToken', response.data.token)
    return response.data
  },

  async logout(): Promise<void> {
    localStorage.removeItem('authToken')
  },

  getToken(): string | null {
    return localStorage.getItem('authToken')
  },
}
