/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";
import { IBookingResponse } from "../../types/booking";

interface IDutiesState {
  isViewDrawerOpen: boolean;
  duties: IBookingResponse[];
  filters: {
    status: string;
    search: string;
  };
  currentSelectedDuties: IBookingResponse | {};
  dutiesState: {
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

const initialState: IDutiesState = {
  isViewDrawerOpen: false,
  duties: [],
  filters: {
    status: "",
    search: "",
  },
  currentSelectedDuties: {},
  dutiesState: { status: "idle", loading: false, error: "" },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
};

interface IGetDutiesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const getDuties = createAsyncThunk(
  "duties/getDuties",
  async (params: IGetDutiesParams, { dispatch }) => {
    const response = await apiClient.get("/booking/duty", { params });
    if (response.status === 200) {
      dispatch(
        setPagination({
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        })
      );
      return response.data;
    }
  }
);

export const dutiesSlice = createSlice({
  name: "duties",
  initialState,
  reducers: {
    setAttendanceFilter: (state, action: PayloadAction<any | {}>) => {
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
    setCurrentSelectedDuties: (state, action: PayloadAction<IBookingResponse>) => {
      state.currentSelectedDuties = action.payload;
    },
    setPagination: (state, action: PayloadAction<{ total: number; page: number; limit: number }>) => {
      state.pagination = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDuties.pending, (state) => {
        state.dutiesState.status = "loading";
        state.dutiesState.loading = true;
      })
      .addCase(getDuties.fulfilled, (state, action) => {
        state.dutiesState.status = "succeeded";
        state.dutiesState.loading = false;
        state.dutiesState.error = "";
        state.duties = action.payload.data;
      })
      .addCase(getDuties.rejected, (state, action) => {
        state.dutiesState.status = "failed";
        state.dutiesState.loading = false;
        state.dutiesState.error = action.error.message || "Error fetching duties";
      });
  },
});

export const { actions, reducer } = dutiesSlice;
export const {
  setAttendanceFilter,
  setIsViewDrawerClose,
  setIsViewDrawerOpen,
  setCurrentSelectedDuties,
  setPagination,
} = actions;
export default dutiesSlice.reducer;
