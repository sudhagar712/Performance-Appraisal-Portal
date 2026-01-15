import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager';
  managerId?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

// ............................................. Login API .............................................
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

// ............................................. Logout API .............................................
export const logout = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>('/auth/logout');
  return response.data;
};

// ............................................. Get current user API .............................................
export const getCurrentUser = async (): Promise<{ success: boolean; user: User }> => {
  const response = await api.get<{ success: boolean; user: User }>('/auth/me');
  return response.data;
};

