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
  message?: string;
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
  async (body: ILoginRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", body);
      if (response.data.success) {
        const date = new Date();
        const expiry = date.getTime() + 36000 * 10000000000;
        date.setTime(expiry);
        const change = date.toUTCString();
        const { data } = response;
        const { token, user } = data;
        const { fullName, email, role } = user;

        document.cookie = `token=${token};expires=${change};path=/`;
        document.cookie = `fullName=${fullName};expires=${change};path=/`;
        document.cookie = `email=${email};expires=${change};path=/`;
        document.cookie = `role=${role};expires=${change};path=/`;  

        window.location.href = RouteName.HOME;
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Login failed");
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
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
      document.cookie = `fullName=;expires=${change};path=/`;
      document.cookie = `email=;expires=${change};path=/`;
      document.cookie = `role=;expires=${change};path=/`;
      window.location.href = RouteName.LOGIN;
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
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = loginSlice.actions;
export default loginSlice.reducer;
