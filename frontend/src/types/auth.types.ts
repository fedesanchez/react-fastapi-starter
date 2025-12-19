import { z } from 'zod'
import {
  loginSchema, 
  signinSchema,
  loginResponseSchema,
  profileResponseSchema,
} from '@/schemas/auth.schema'



export type LoginResponse = z.infer<typeof loginResponseSchema>
export type ProfileResponse = z.infer<typeof profileResponseSchema>
export type SigninFormValues = z.infer<typeof signinSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
