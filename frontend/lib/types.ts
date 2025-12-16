// API Response Types
export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
}

// User Types
export interface UserRole {
  id: string;
  name: 'user' | 'admin' | 'instructor';
}

export interface User {
  id: string;
  email: string;
  username: string;
  role?: UserRole;
}

// Auth Types
export interface AuthResponse {
  authenticated: boolean;
  user?: User;
  payload?: User;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Difficulty Types
export interface Difficulty {
  id: number;
  name: string;
  description?: string;
}

// Lab Types
export interface Lab {
  id: string;
  uuid: string;
  name: string;
  description?: string;
  difficulty?: Difficulty;
  createdAt: string;
  updatedAt: string;
}

// Stats Types
export interface LabStats {
  totalLabs: number;
  completedLabs: number;
  inProgressLabs: number;
}

export interface UserStats {
  totalUsers: number;
}

// Session Types
export interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
}
