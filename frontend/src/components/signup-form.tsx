import { useState } from "react";
import { signinSchema } from "@/schemas/auth.schema";
import useStore from "@/store/useStore";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import type { LoginFormValues } from "@/types/auth.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const defaultValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "",
  };

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues,
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setError("");

    try {
      const { register } = useStore.getState();
      await register(data);
      navigate("/");
    } catch {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="first_name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="signin-form-first-name">
                        First Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="signin-form-first-name"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="last_name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="signin-form-last-name">
                        Last Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="signin-form-last-name"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="signin-form-email">Email</FieldLabel>
                      <Input
                        {...field}
                        type="email"
                        id="signin-form-email"
                        aria-invalid={fieldState.invalid}
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
                      <FieldLabel htmlFor="signin-form-password">
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        id="signin-form-password"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password_confirm"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="signin-form-confirm-password">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        id="signin-form-confirm-password"
                        aria-invalid={fieldState.invalid}
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
            <CardFooter>
              <Button
                type="submit"
                form="signin-form"
                disabled={loading}
                className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-medium"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </CardFooter>
            <div className="mt-6 text-center">
              <p className="text-zinc-400 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
