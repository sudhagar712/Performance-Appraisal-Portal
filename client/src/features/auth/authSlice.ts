import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Load initial state from localStorage
const loadAuthFromStorage = (): AuthState => {
  try {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      return {
        user: parsed.user,
        isAuthenticated: parsed.isAuthenticated || false,
      };
    }
  } catch (error) {
    console.error("Error loading auth from localStorage:", error);
    // Clear corrupted data
    localStorage.removeItem("auth");
  }
  return {
    user: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = loadAuthFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Save to localStorage
      try {
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: action.payload,
            isAuthenticated: true,
          })
        );
      } catch (error) {
        console.error("Error saving auth to localStorage:", error);
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Remove from localStorage
      try {
        localStorage.removeItem("auth");
      } catch (error) {
        console.error("Error removing auth from localStorage:", error);
      }
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
