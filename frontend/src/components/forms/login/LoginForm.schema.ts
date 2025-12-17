import { z } from 'zod'

export const LoginFormSchema = z.object({
  grant_type: z.string(),
  scope: z.string(),
  client_id: z.string(),
  client_secret: z.string(),
  username: z.string().email('Invalid email format.'),
  password: z.string().min(8, 'Password needs to have at least 8 characters.'),
})
