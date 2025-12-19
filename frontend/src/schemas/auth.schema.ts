import { z } from 'zod'

export const profileResponseSchema = z.object({
  id: z.number().int(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
})

export const loginSchema = z.object({
  grant_type: z.string(),
  scope: z.string(),
  client_id: z.string(),
  client_secret: z.string(),
  username: z.string().email('Invalid email format.'),
  password: z.string().min(8, 'Password needs to have at least 8 characters.'),
})

export const signinSchema = z
  .object({
    first_name: z
      .string()
      .min(3, 'First Name needs to have at least 3 characters.')
      .max(20, 'First name cannot exceed 20 characters.'),

    last_name: z
      .string()
      .min(3, 'Last name needs to have at least 3 characters.')
      .max(20, 'Last name cannot exceed 20 characters.'),

    email: z.string().email('Invalid email format.'),

    password: z
      .string()
      .min(8, 'Password needs to have at least 8 characters.')
      .regex(/[A-Z]/, 'The password must contain at least one capital letter.')
      .regex(/[0-9]/, 'The password must contain at least one number.'),
    password_confirm: z.string().min(8), //
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Passwords dont match.',
    path: ['password_confirm'],
  })

export const loginResponseSchema = z.object({
  access_token: z.string().nonempty(),
  token_type: z.string().nonempty(),
})



