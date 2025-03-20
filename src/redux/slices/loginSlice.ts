/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";
import { RouteName } from "../../constants/routes";

interface IUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

interface ILoginResponse {
  success: boolean;
  token: string;
  user: IUser;
}

interface ILoginRequest {
  email: string;
  password: string;
}

interface ILoginState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ILoginState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "login/login",
  async (body: ILoginRequest) => {
    const response = await apiClient.post("/auth/login", body);
    if (response.data.success) {
      // Store token in localStorage
      const date = new Date();
      const expiry = date.getTime() + 36000 * 10000000000;
      date.setTime(expiry);
      const change = date.toUTCString();
      const { data } = response;
      const { token } = data;

      document.cookie = `token=${token};expires=${change};path=/`;

      // Navigate to dashboard
      window.location.href = RouteName.HOME;

      return response.data;
    }
    throw new Error("Login failed");
  }
);

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      const change = new Date(0).toUTCString();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      document.cookie = `token=;expires=${change};path=/`;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<ILoginResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });
  },
});

export const { logout, clearError } = loginSlice.actions;
export default loginSlice.reducer;
