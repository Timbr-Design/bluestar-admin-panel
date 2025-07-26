/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";

interface IVehicleAvailabilityState {
  vehicleAvailability: any[];
  filters: {
    startDate?: number;
    endDate?: number;
  };
  vehicleAvailabilityState: {
    status: "idle" | "loading" | "succeeded" | "failed";
    loading: boolean;
    error: string;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

const initialState: IVehicleAvailabilityState = {
  vehicleAvailability: [],
  filters: {
    startDate: undefined,
    endDate: undefined,
  },
  vehicleAvailabilityState: {
    status: "idle",
    loading: false,
    error: "",
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 30,
  },
};

export const getVehicleAvailability = createAsyncThunk(
  "vehicleAvailability/getVehicleAvailability",
  async (params: any) => {
    const response = await apiClient.get("/database/vehicle/availability", { params });
    if (response.status === 200) {
      return response.data;
    }
  }
);

export const vehicleAvailabilitySlice = createSlice({
  name: "vehicleAvailability",
  initialState,
  reducers: {
    setVehicleAvailabilityFilter: (state, action: PayloadAction<any>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    clearVehicleAvailabilityFilters: (state) => {
      state.filters = {
        startDate: undefined,
        endDate: undefined,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVehicleAvailability.pending, (state) => {
        state.vehicleAvailabilityState.status = "loading";
        state.vehicleAvailabilityState.loading = true;
      })
      .addCase(getVehicleAvailability.fulfilled, (state, action) => {
        state.vehicleAvailabilityState.status = "succeeded";
        state.vehicleAvailabilityState.loading = false;
        state.vehicleAvailabilityState.error = "";
        // console.log(action.payload);
        state.vehicleAvailability = action.payload.vehicles;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(getVehicleAvailability.rejected, (state) => {
        state.vehicleAvailabilityState.status = "failed";
        state.vehicleAvailabilityState.loading = false;
        state.vehicleAvailabilityState.error = "Error fetching vehicle availability";
      });
  },
});

export const { actions, reducer } = vehicleAvailabilitySlice;
export const { setVehicleAvailabilityFilter, clearVehicleAvailabilityFilters } = actions;

export default vehicleAvailabilitySlice.reducer; 