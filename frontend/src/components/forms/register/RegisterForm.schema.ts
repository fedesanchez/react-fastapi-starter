import { z } from 'zod'

export const RegisterFormSchema = z
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
