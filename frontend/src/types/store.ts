import type { AuthProfileResponse } from "@types/auth";
import type { RegisterFormInput } from "@forms/register/RegisterForm.types";
import type { LoginFormInput } from "@forms/login/LoginForm.types";

export interface StoreState {
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  user: AuthProfileResponse | null;
  isAuthenticated: boolean | null;
  setAccessToken: () => void;
  register: (formData: RegisterFormInput) => void;
  login: (formData: LoginFormInput) => void;
  logout: () => void;
  refreshToken: () => void;
}
