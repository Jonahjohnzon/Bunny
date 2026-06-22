// services/auth.ts
import ForumApi from '../ApiCore';

const api = new ForumApi();

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  username: string;
  isBanned: boolean;
  isVerified: boolean;
  avatar : string;
  theme : string
}

export interface AuthResponse {
  success: boolean;
  data: AuthUser;
  token: string;
  message:string;
}

export const AuthService = {
  login: (body: LoginBody) =>
    api.post<AuthResponse>('/auth/login', body),

  register: (body: RegisterBody) =>
    api.post<AuthResponse>('/auth/register', body),

  logout: () =>
    api.post('/auth/logout'),

  me: () =>
    api.get<AuthUser>('/users/me'),
};


