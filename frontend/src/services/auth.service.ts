import { Api } from '@/services/Api'
import ApiError from "@/errors/ApiError"
import ValidationError from "@/errors/ValidationError"
import type { LoginResponse, ProfileResponse, SigninFormValues, LoginFormValues} from '@/types/auth'
import {
  loginResponseSchema,
  profileResponseSchema,
} from '@/schemas/auth.schema'
import type { FetchOptions } from '@/types/api'

/**
 * Creates a new user.
 *
 * @param data - The data for the new user.
 * @returns Promise<void> - Se resuelve sin valor si el registro es exitoso (código 201).
 * @throws {Error} Si hay un error durante el proceso de creación.
 */
export const registerUser = async (data: SigninFormValues): Promise<void> => {
  await Api.post('/api/v1/auth/register', data)
}

/**
 * Get user info.
 *
 * @returns Promise<ProfileResponse> - Se resuelve sin valor si el registro es exitoso (código 201).
 * @throws {Error} If any error.
 */
export const getUserData = async (): Promise<ProfileResponse> => {
  const data = await Api.get('/api/v1/users/me')
  const validatedData = profileResponseSchema.parse(data)
  return validatedData
}

/**
 * Login a user.
 *
 * @param data - User credentials.
 * @returns Promise<LoginResponse>
 * @throws {Error} If any error during authentication.
 */
export const authenticateUser = async (
  body: LoginFormValues,
): Promise<LoginResponse> => {
  const toUrlEncoded = (data: Record<string, any>): string => {
    return new URLSearchParams(
      Object.keys(data).reduce(
        (acc, key) => {
          acc[key] = String(data[key])
          return acc
        },
        {} as Record<string, string>,
      ),
    ).toString()
  }
  const options: FetchOptions = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: toUrlEncoded(body),
  }

  try {
    const url = Api.buildUrl('/api/v1/auth/login')
    const response = await fetch(url, options)
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const defaultMessage = `API Error: ${response.status} (${response.statusText})`
      const errorMessage = errorData?.detail
        ? typeof errorData.detail === 'string'
          ? errorData.detail
          : defaultMessage
        : defaultMessage

      throw new ApiError(response.status, errorData, errorMessage)
    }
    const json = await response.json().catch(() => null)
    const validatedData = loginResponseSchema.parse(json)
    return validatedData
  } catch (error) {
    throw error
  }
}

/**
 * Logout user.
 *
 * @returns Promise<void> -
 * @throws {Error} If any error.
 */
export const logoutUser = async (): Promise<void> => {
  await Api.post('/api/v1/auth/logout')
}

/**
 * Refresh access token
 * @returns Promise<>
 * @throws {Error}
 */
export const refreshAccessToken = async (): Promise<LoginResponse> => {
  const url = Api.buildUrl('/api/v1/auth/refresh-token')
  const response = await fetch(url, { method: 'POST', credentials: 'include' })
  if (response.ok) {
    return response.json()
  } else {
    throw 'Unable to refresh-token.'
  }
}
