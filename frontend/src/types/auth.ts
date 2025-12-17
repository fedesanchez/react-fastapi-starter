import { z } from 'zod'
import {
  AuthLoginResponseSchema,
  AuthProfileResponseSchema,
} from '@api/schemas/auth'

export type AuthLoginResponse = z.infer<typeof AuthLoginResponseSchema>
export type AuthProfileResponse = z.infer<typeof AuthProfileResponseSchema>
