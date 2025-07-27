/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getAverageData,
  getExpenseData,
  getFuelsData,
  getLoansData,
} from "../../testData";
import apiClient from "../../utils/configureAxios";

const initialState = {
  isViewDrawerOpen: false,
  expenses: [],
  fuels: [],
  loans: [],
  averages: [],
  filters: {
    status: "",
    search: "",
    currentTab: "expense",
  },
  vehicleTrackerState: { status: "idle", loading: false, error: "" },
  pagination: {
    total: 0,
    page: 0,
    limit: 10,
  },
};

export const getExpenses = createAsyncThunk(
  "vehicleTracker",async (params: any) => {
    const response = await apiClient.get("/vehicle-tracker/expense",{params});
    return response.data.data;
  }
  // async (params: any) => {

    
  //   // const response = await apiClient.get("/auth/admin/login", { params });
  //   // return response.data;

  //   return {
  //     total: 10,
  //     page: 1,
  //     limit: 10,
  //     data: getExpenseData, // replace with rea; later
  //   };
  // }
);
export const getFuels = createAsyncThunk(
  "vehicle-tracker/fuel",
  async (params: any) => {
    const response = await apiClient.get("/vehicle-tracker/fuel/", { params });
    console.log(response)
    return response.data.data;

    // return {
    //   total: 10,
    //   page: 1,
    //   limit: 10,
    //   data: getFuelsData,
    // };
  }
);
export const getLoans = createAsyncThunk(
  "vehicleTracker/getLoans",
  async (params: any) => {
    // const response = await apiClient.get("/auth/admin/login", { params });
    // return response.data;

    return {
      total: 10,
      page: 1,
      limit: 10,
      data: getLoansData,
    };
  }
);
export const getAverage = createAsyncThunk(
  "vehicleTracker/getAverage",
  async (params: any) => {
    // const response = await apiClient.get("/auth/admin/login", { params });
    // return response.data;

    return {
      total: 10,
      page: 1,
      limit: 10,
      data: getAverageData,
    };
  }
);

export const vehicleTrackerSlice = createSlice({
  name: "vehicleTracker",
  initialState,
  reducers: {
    setVehicleTrackerFilter: (state, action: PayloadAction<any | {}>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setIsViewDrawerOpen: (state) => {
      state.isViewDrawerOpen = true;
    },

    setIsViewDrawerClose: (state) => {
      state.isViewDrawerOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //expenses
      .addCase(getExpenses.pending, (state) => {
        state.vehicleTrackerState.status = "loading";
        state.vehicleTrackerState.loading = true;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.vehicleTrackerState.status = "succeeded";
        state.vehicleTrackerState.loading = false;
        state.vehicleTrackerState.error = "";
        state.expenses = action.payload.data as any;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(getExpenses.rejected, (state) => {
        state.vehicleTrackerState.status = "failed";
        state.vehicleTrackerState.loading = false;
        state.vehicleTrackerState.error = "Error";
      })
      // Fuels
      .addCase(getFuels.pending, (state) => {
        state.vehicleTrackerState.status = "loading";
        state.vehicleTrackerState.loading = true;
      })
      .addCase(getFuels.fulfilled, (state, action) => {
        state.vehicleTrackerState.status = "succeeded";
        state.vehicleTrackerState.loading = false;
        state.vehicleTrackerState.error = "";
        state.fuels = action.payload.data as any;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(getFuels.rejected, (state) => {
        state.vehicleTrackerState.status = "failed";
        state.vehicleTrackerState.loading = false;
        state.vehicleTrackerState.error = "Error";
      })
      // getLoans
      .addCase(getLoans.pending, (state) => {
        state.vehicleTrackerState.status = "loading";
        state.vehicleTrackerState.loading = true;
      })
      .addCase(getLoans.fulfilled, (state, action) => {
        state.vehicleTrackerState.status = "succeeded";
        state.vehicleTrackerState.loading = false;
        state.vehicleTrackerState.error = "";
        state.loans = action.payload.data as any;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(getLoans.rejected, (state) => {
        state.vehicleTrackerState.status = "failed";
        state.vehicleTrackerState.loading = false;
        state.vehicleTrackerState.error = "Error";
      })
      // getAverage
      .addCase(getAverage.pending, (state) => {
        state.vehicleTrackerState.status = "loading";
        state.vehicleTrackerState.loading = true;
      })
      .addCase(getAverage.fulfilled, (state, action) => {
        state.vehicleTrackerState.status = "succeeded";
        state.vehicleTrackerState.loading = false;
        state.vehicleTrackerState.error = "";
        state.averages = action.payload.data as any;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(getAverage.rejected, (state) => {
        state.vehicleTrackerState.status = "failed";
        state.vehicleTrackerState.loading = false;
        state.vehicleTrackerState.error = "Error";
      });
  },
});
export const { actions, reducer } = vehicleTrackerSlice;
export const {
  setVehicleTrackerFilter,
  setIsViewDrawerClose,
  setIsViewDrawerOpen,
} = actions;
export default vehicleTrackerSlice.reducer;
