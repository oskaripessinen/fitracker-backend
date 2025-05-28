import { User } from './user';

export interface LoginRequest {
  token: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}


export interface SupabaseJWTPayload {
  sub: string;
  email: string;
  email_confirmed_at?: string;
  user_metadata?: {
    full_name?: string;
    given_name?: string;
    family_name?: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}