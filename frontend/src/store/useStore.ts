import { create } from 'zustand'
import type { StoreState } from '@/types/store'

import type { LoginFormInput } from '@/components/forms/login/LoginFormInput'
import type { RegisterFormInput } from '@/components/forms/register/RegisterFormInput'
import {
  registerUser,
  authenticateUser,
  logoutUser,
  getUserData,
  refreshAccessToken,
} from '@/api/auth.api'
import { ApiError } from '@/api/Api'

const initialState: StoreState = {
  loading: false,
  error: null,
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setAccessToken: async (token?: string | null) => {},
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  refreshToken: async () => {},
}

const useStore = create<StoreState>((set, get) => ({
  ...initialState,

  setAccessToken: (token?: string | null) => {
    set({ accessToken: token ?? null, isAuthenticated: !!token })
  },

  setUserData: async () => {
    const user = await getUserData()
    set({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
    })
  },

  register: async (formData: RegisterFormInput) => {
    set({ loading: true, error: null })
    try {
      await registerUser(formData)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unexpected error'
      set({
        error: message,
      })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  login: async (formData: LoginFormInput) => {
    set({ loading: true, error: null })
    try {
      const resp = await authenticateUser(formData)
      const access = resp?.access_token ?? resp?.accessToken ?? null
      if (access) {
        set({ accessToken: access, isAuthenticated: true })
      }
      get().setUserData()
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unexpected error'
      set({
        error: message,
      })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    try {
      await logoutUser() // server clears refresh cookie
    } catch {
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      })
    }
  },

  refreshToken: async () => {
    set({ loading: true, error: null })
    try {
      const tokens = await refreshAccessToken()
      const access_token = tokens?.access_token ?? tokens?.accessToken ?? null
      if (access_token) {
        set({ accessToken: access_token, isAuthenticated: true })
        get().setUserData()
      }
    } catch (err) {
      get().logout()
      throw err
    } finally {
      set({ loading: false })
    }
  },
}))

export default useStore
