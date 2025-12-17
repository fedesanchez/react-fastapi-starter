import { z } from 'zod'

export const AuthLoginResponseSchema = z.object({
  access_token: z.string().nonempty(),
  token_type: z.string().nonempty(),
})

export const AuthProfileResponseSchema = z.object({
  id: z.number().int(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
})
