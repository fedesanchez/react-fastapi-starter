import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { SubmitHandler } from 'react-hook-form'
import { LoginFormSchema } from './LoginForm.schema'
import type { LoginFormInput } from './LoginForm.types'
import useStore from '@/store/useStore'

export default function LoginForm() {
  const navigate = useNavigate()
  const { login, error } = useStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(LoginFormSchema),
  })

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    try {
      await login(data)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                {...register('grant_type')}
                value="password"
                type="hidden"
              />
              <input {...register('scope')} type="hidden" />
              <input {...register('client_id')} type="hidden" />
              <input {...register('client_secret')} type="hidden" />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  {...register('username')}
                  id="username"
                  autoComplete="email"
                  className="input"
                />
                {errors.username && (
                  <p style={{ color: 'red' }}>{errors.username.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-100"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  {...register('password')}
                  type="password"
                  className="input"
                />
                {errors.password && (
                  <p style={{ color: 'red' }}>{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-submit"
              >
                {isSubmitting ? 'Submitting...' : 'Sign In'}
              </button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Not a member?{' '}
            <a
              href="/auth/register"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Create account
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
