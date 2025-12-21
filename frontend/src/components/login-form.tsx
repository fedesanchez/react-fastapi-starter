
import { useState, useEffect } from "react"
import useStore from "@/store/useStore"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {Link, useNavigate } from "react-router-dom"
import { loginSchema } from "@/schemas/auth.schema"
import type { LoginFormValues } from "@/types/auth.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
} from "@/components/ui/input-group"

export default function LoginForm() {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const defaultValues = {
        grant_type: 'password',
        scope: '',
        client_id: '',
        client_secret: '',
        username: '',
        password: '',
  };
  const [error, setError] = useState<string>("")
  
  const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues
  })
  
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true)
    setError("")

    try {      
      const { login } = useStore.getState()
      await login(data)
      navigate("/")
    } catch {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-zinc-400">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
              
              <FieldGroup>
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-form-username">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="login-form-username"
                        aria-invalid={fieldState.invalid}
                        placeholder="me@example.com"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-form-password">
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        id="login-form-password"
                        aria-invalid={fieldState.invalid}
                        placeholder=""
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
                  
            </form>
            <div className="mt-6">
              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Field>

              <Button
                type="submit"
                disabled={loading}
                form="login-form"
                className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-medium"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

            <div className="mt-6 text-center">
              <p className="text-zinc-400 text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/auth/signup" className="text-white hover:underline font-medium">
                  Create one
                </Link>
              </p>
            </div>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
