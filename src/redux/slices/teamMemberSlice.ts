import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";
import { notification } from 'antd';

export type Role = 'owner' | 'admin' | 'managers' | 'staff';

interface ITeamMember {
  _id?: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address?: string | null;
  notes?: string | null;
  role: Role;
  isActive?: boolean
}

interface ITeamMemberState {
  teamMembers: ITeamMember[];
  currentTeamMember: ITeamMember | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

interface IGetTeamMembersResponse {
  data: ITeamMember[];
  total: number;
  page: number;
  limit: number;
}

const initialState: ITeamMemberState = {
  teamMembers: [],
  currentTeamMember: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// Get Team Members
export const getTeamMembers = createAsyncThunk(
  "teamMember/getTeamMembers",
  async (params: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IGetTeamMembersResponse>("/users", { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch team members");
    }
  }
);

// Get Team Member by ID
export const getTeamMemberById = createAsyncThunk(
  "teamMember/getTeamMemberById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch team member");
    }
  }
);

// Create Team Member
export const createTeamMember = createAsyncThunk(
  "teamMember/createTeamMember",
  async (teamMemberData: Omit<ITeamMember, "_id" | "createdAt" | "updatedAt" | "isActive">, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/users", teamMemberData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create team member");
    }
  }
);

// Update Team Member
export const updateTeamMember = createAsyncThunk(
  "teamMember/updateTeamMember",
  async ({ id, teamMemberData }: { id: string; teamMemberData: Partial<ITeamMember> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/user/${id}`, teamMemberData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update team member");
    }
  }
);

// Delete Team Member
export const deleteTeamMember = createAsyncThunk(
  "teamMember/deleteTeamMember",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/user/${id}`);
      if (response.status === 200) {
        return id;
      }
      return rejectWithValue("Failed to delete team member");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete team member");
    }
  }
);

const teamMemberSlice = createSlice({
  name: "teamMember",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTeamMember: (state) => {
      state.currentTeamMember = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Team Members
      .addCase(getTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
        };
        state.error = null;
      })
      .addCase(getTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        notification.error({
          message: 'Error',
        });
      })
      // Get Team Member by ID
      .addCase(getTeamMemberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeamMemberById.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload.data, "action.payload.data");

        state.currentTeamMember = action.payload.data;
        state.error = null;
      })
      .addCase(getTeamMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Team Member
      .addCase(createTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers.push(action.payload.data);
        state.error = null;
        notification.success({
          message: 'Success',
          description: 'Team member added successfully',
        });
      })
      .addCase(createTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        notification.error({
          message: 'Error',
        });
      })
      // Update Team Member
      .addCase(updateTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.teamMembers.findIndex(member => member._id === action.payload.data._id);
        if (index !== -1) {
          state.teamMembers[index] = action.payload.data;
        }
        if (state.currentTeamMember?._id === action.payload.data._id) {
          state.currentTeamMember = action.payload.data;
        }
        state.error = null;
        notification.success({
          message: 'Success',
          description: 'Team member updated successfully',
        });
      })
      .addCase(updateTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        notification.error({
          message: 'Error',
        });
      })
      // Delete Team Member
      .addCase(deleteTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers = state.teamMembers.filter(member => member._id !== action.payload);
        if (state.currentTeamMember?._id === action.payload) {
          state.currentTeamMember = null;
        }
        state.error = null;
        notification.success({
          message: 'Success',
          description: 'Team member deleted successfully',
        });
      })
      .addCase(deleteTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        notification.error({
          message: 'Error',
        });
      });
  },
});

export const { clearError, clearCurrentTeamMember } = teamMemberSlice.actions;
export default teamMemberSlice.reducer; 