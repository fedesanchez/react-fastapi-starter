import { z } from 'zod'
import { LoginFormSchema } from './LoginForm.schema'

export type LoginFormInput = z.infer<typeof LoginFormSchema>
