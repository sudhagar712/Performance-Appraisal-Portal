import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Types
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

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface CurrentUserResponse {
  success: boolean;
  user: User;
}

// Base query with credentials
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  credentials: 'include', // Important for cookies
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Base query with error handling
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  
  // Handle 401 errors
  if (result.error && result.error.status === 401) {
    // Clear auth state
    api.dispatch(authApi.util.resetApiState());
    // Redirect to login if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  
  return result;
};

// .................................Create API slice...............................
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth'],
  endpoints: (builder) => ({
    // .................................Login mutation...............................
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Auth'],
    }),


    // ..........................Logout mutation............................
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Auth'],
    }),

    //............................ Get current user query.....................
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});



export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
} = authApi;

