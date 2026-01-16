export type Role = "employee" | "manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  managerId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface MeResponse {
  success: boolean;
  user: User;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}
