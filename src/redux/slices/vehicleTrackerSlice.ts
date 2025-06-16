/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getAverageData,
  getExpenseData,
  getFuelsData,
  getLoansData,
} from "../../testData";

interface FetchParams {
  search?: string;
  page?: number;
  limit?: number;
}

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
    page: 1,
    limit: 10,
  },
};

// Utility to handle search + pagination
const applySearchAndPagination = (data: any[], search = "", page = 1, limit = 10) => {
  const lowerSearch = search.toLowerCase();
  const filtered = search
    ? data.filter(
        (item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(lowerSearch)
          )
      )
    : data;

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    total: filtered.length,
    page,
    limit,
    data: paginated,
  };
};

export const getExpenses = createAsyncThunk(
  "vehicleTracker/getExpenses",
  async (params: FetchParams) => {
    return applySearchAndPagination(
      getExpenseData,
      params?.search,
      params?.page || 1,
      params?.limit || 10
    );
  }
);

export const getFuels = createAsyncThunk(
  "vehicleTracker/getFuels",
  async (params: FetchParams) => {
    return applySearchAndPagination(
      getFuelsData,
      params?.search,
      params?.page || 1,
      params?.limit || 10
    );
  }
);

export const getLoans = createAsyncThunk(
  "vehicleTracker/getLoans",
  async (params: FetchParams) => {
    return applySearchAndPagination(
      getLoansData,
      params?.search,
      params?.page || 1,
      params?.limit || 10
    );
  }
);

export const getAverage = createAsyncThunk(
  "vehicleTracker/getAverage",
  async (params: FetchParams) => {
    return applySearchAndPagination(
      getAverageData,
      params?.search,
      params?.page || 1,
      params?.limit || 10
    );
  }
);

export const vehicleTrackerSlice = createSlice({
  name: "vehicleTracker",
  initialState,
  reducers: {
    setVehicleTrackerFilter: (state, action: PayloadAction<Partial<typeof state.filters>>) => {
      const updatedFilters = {
        ...state.filters,
        ...action.payload,
      };

      state.filters = updatedFilters;

      if (action.payload.search !== undefined) {
        state.pagination.page = 1;
      }
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
      // Expenses
      .addCase(getExpenses.pending, (state) => {
        state.vehicleTrackerState.status = "loading";
        state.vehicleTrackerState.loading = true;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.vehicleTrackerState.status = "succeeded";
        state.vehicleTrackerState.loading = false;
        state.vehicleTrackerState.error = "";
        state.expenses = action.payload.data;
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
        state.fuels = action.payload.data;
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

      // Loans
      .addCase(getLoans.pending, (state) => {
        state.vehicleTrackerState.status = "loading";
        state.vehicleTrackerState.loading = true;
      })
      .addCase(getLoans.fulfilled, (state, action) => {
        state.vehicleTrackerState.status = "succeeded";
        state.vehicleTrackerState.loading = false;
        state.vehicleTrackerState.error = "";
        state.loans = action.payload.data;
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

      // Average
      .addCase(getAverage.pending, (state) => {
        state.vehicleTrackerState.status = "loading";
        state.vehicleTrackerState.loading = true;
      })
      .addCase(getAverage.fulfilled, (state, action) => {
        state.vehicleTrackerState.status = "succeeded";
        state.vehicleTrackerState.loading = false;
        state.vehicleTrackerState.error = "";
        state.averages = action.payload.data;
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
