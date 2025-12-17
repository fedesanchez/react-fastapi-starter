import { z } from 'zod'
import { RegisterFormSchema } from './RegisterForm.schema'

export type RegisterFormInput = z.infer<typeof RegisterFormSchema>
