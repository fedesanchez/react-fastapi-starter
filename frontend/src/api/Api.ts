import type { FetchParams, FetchOptions } from '@/types/api'
import useStore from '@/store/useStore'

export class ApiError extends Error {
  public status: number
  public details: any

  constructor(status: number, details: any, message?: string) {
    super(message || `API Error: ${status}`)
    this.status = status
    this.details = details
    this.name = 'ApiError'
  }
}

export class Api {
  /**
   * Builds a URL with the provided parameters.
   * @param {string} url - The base URL.
   * @param {FetchParams} params - The query string parameters object.
   * @returns {string} - The complete URL with query string parameters.
   */
  static buildUrl(url: string, params: FetchParams = {}): string {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

    const stringParams = Object.keys(params).reduce(
      (acc, key) => {
        const value = params[key]
        acc[key] = String(value)
        return acc
      },
      {} as Record<string, string>,
    )

    const queryString = new URLSearchParams(stringParams).toString()
    return `${API_BASE_URL}${url}?${queryString}`
  }

  private static async parseError(response: Response) {
    const data = await response.json().catch(() => null)
    const defaultMessage = `API Error: ${response.status} (${response.statusText})`
    const message =
      data?.detail && typeof data.detail === 'string'
        ? data.detail
        : defaultMessage
    return new ApiError(response.status, data, message)
  }

  /**
   * Prevent concurrent refresh requests
   */
  private static refreshingPromise: Promise<void> | null = null

  /**
   * Performs a refresh-token call and updates the store with new access token
   */
  private static async doRefresh(): Promise<void> {
    if (Api.refreshingPromise) return Api.refreshingPromise

    Api.refreshingPromise = (async () => {
      try {
        const url = Api.buildUrl('/api/v1/auth/refresh-token')
        const res = await fetch(url, { method: 'POST', credentials: 'include' })
        if (!res.ok) {
          // clear auth state on failed refresh
          useStore.setState({
            accessToken: null,
            isAuthenticated: false,
            user: null,
          })
          throw await Api.parseError(res)
        }
        const json = await res.json().catch(() => null)
        const newAccessToken = json?.access_token ?? null
        if (!newAccessToken) {
          useStore.setState({
            accessToken: null,
            isAuthenticated: false,
            user: null,
          })
          throw new ApiError(
            500,
            json,
            'Refresh endpoint returned no access token',
          )
        }
        // store the new token
        useStore.setState({
          accessToken: newAccessToken,
          isAuthenticated: true,
        })
      } finally {
        Api.refreshingPromise = null
      }
    })()

    return Api.refreshingPromise
  }

  /**
   * Makes the requests
   * @param {string} path request URL
   * @param {object} params query string parameters
   * @param {object} options fetch options
   * @returns *
   */
  static async _doFetch<TResponse>(
    path: string,
    params: FetchParams = {},
    options: FetchOptions = {},
    retried: boolean = false,
  ): Promise<TResponse> {
    options.credentials = options.credentials ?? 'include'
    const { accessToken } = useStore.getState()

    if (accessToken)
      options.headers = {
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      }

    try {
      const url = Api.buildUrl(path, params)
      let response = await fetch(url, options)

      if (response.status === 401 && !retried) {
        await Api.doRefresh()
        const refreshedToken = useStore.getState().accessToken
        options.headers = {
          ...(options.headers ?? {}),
          ...(refreshedToken
            ? { Authorization: `Bearer ${refreshedToken}` }
            : {}),
        }
        response = await fetch(url, options)
      }

      if (!response.ok) {
        throw await Api.parseError(response)
      }

      if (response.status === 204) return null as unknown as TResponse

      return (await response.json().catch(() => null)) as TResponse
    } catch (error) {
      throw error
    }
  }

  // ---- METHODS -----

  static get<TResponse>(
    path: string,
    params: FetchParams = {},
  ): Promise<TResponse> {
    const options: FetchOptions = { method: 'GET' }
    return this._doFetch(path, params, options)
  }

  static post<TResponse, TBody>(
    path: string,
    body: TBody,
    params: FetchParams = {},
  ) {
    const isForm = body instanceof FormData || typeof body === 'string'
    const headers = isForm ? {} : { 'Content-Type': 'application/json' }
    const options: FetchOptions = {
      method: 'POST',
      headers,
      body: isForm ? (body as any) : JSON.stringify(body),
    }
    return Api._doFetch<TResponse>(path, params, options)
  }

  static async put<TResponse, TBody>(
    path: string,
    body: TBody,
    params: FetchParams = {},
  ): Promise<TResponse> {
    const options: FetchOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }

    return this._doFetch<TResponse>(path, params, options)
  }

  static async delete<TResponse>(
    path: string,
    params: FetchParams = {},
  ): Promise<TResponse> {
    const options: FetchOptions = {
      method: 'DELETE',
    }
    return this._doFetch<TResponse>(path, params, options)
  }
}

export default Api
