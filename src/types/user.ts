export interface User {
  google_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  createdAt: Date;
}

export interface CreateUserRequest {
  id: string;
  email: string;
  full_name: string;
  avatar?: string;
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface UsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

export interface ErrorResponse {
  success: false;
  error: string;
}