/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";
import { notification } from "antd";
import { addNewBooking } from "./bookingSlice";

const initialState = {
  isAddEditDrawerOpen: false,
  currentSelectedBookingDuties: {} as any, // as Ibooking later
  data: [],
  filters: {
    status: undefined,
    search: undefined,
    startDate: undefined,
    endDate: undefined,
  },
  isEditingBookingDuties: true,
  bookingDutiesStates: { status: "idle", loading: false, error: "" },
  pagination: {
    total: 0,
    page: 0,
    limit: 10,
  },
};
export const addNewBookingDuties = createAsyncThunk(
  "bookingsDuties/addNewBookingDuties",
  async (body: any, { dispatch }: any) => {
    const response = await apiClient.post("/duty", body);
    if (response.status === 201) {
      dispatch(setCurrentSelectedBookingDuties({}));
      notification.success({
        message: "Success",
        description: "New Booking duties added successfully",
      });
      console.log("CLOSE");
      // dispatch(setIsAddEditDrawerClose());
      dispatch(getBookingsDuties({}));
      return response.data;
    }
  }
);
export const updateBookingDuties = createAsyncThunk(
  "bookingsDuties/updateBookingDuties",
  async (body: any, { dispatch }: any) => {
    const response = await apiClient.patch(`/duty/${body.id}`, body);
    if (response.status === 200) {
      dispatch(setCurrentSelectedBookingDuties({}));
      notification.success({
        message: "Success",
        description: "update booking duties successfully",
      });
      console.log("CLOSE");
      dispatch(setIsAddEditDrawerClose());
      dispatch(getBookingsDuties({}));
      return response.data;
    }
  }
);
export const getBookingsDuties = createAsyncThunk(
  "bookingsDuties/getBookingsDuties",
  async (params: any) => {
    const response = await apiClient.get("/duty", { params });
    return response.data;
  }
);
export const getSingleBookingDuties = createAsyncThunk(
  "bookingsDuties/getSingleBookingDuties",
  async (params: any) => {
    const response = await apiClient.get("/bookingsDuties", { params });
    return response.data;
  }
);
export const deleteBookingDuties = createAsyncThunk(
  "bookingsDuties/deleteBookingDuties",
  async (params: any, { dispatch, getState }: any) => {
    const { bookingsDuties } = getState();
    const response = await apiClient.delete(`/bookingsDuties/${params.id}`);
    if (response.status === 200) {
      dispatch(setCurrentSelectedBookingDuties({}));
      notification.success({
        message: "Success",
        description: "bookingsDuties Duties deleted successfully",
      });
      const payload = {
        data: bookingsDuties?.data?.filter(
          (each: any) => each._id !== params.id
        ),
      };

      dispatch(setBookingDuties(payload));
    }
  }
);

export const bookingDutiesSlice = createSlice({
  name: "bookingDuties",
  initialState,
  reducers: {
    setBookingDutiesFilter: (state, action: PayloadAction<any | {}>) => {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    },
    setBookingDuties: (state, action: PayloadAction<any | {}>) => {
      return {
        ...state,
        data: action?.payload?.data,
      };
    },
    setIsAddEditDrawerOpen: (state) => {
      return { ...state, isAddEditDrawerOpen: true };
    },
    setIsEditingBookingDuties: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isEditingBookingDuties: action.payload,
      };
    },
    setIsAddEditDrawerClose: (state) => {
      return { ...state, isAddEditDrawerOpen: false };
    },
    setCurrentSelectedBookingDuties: (
      state,
      action: PayloadAction<any | {}>
    ) => {
      return {
        ...state,
        currentSelectedBookingDuties: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // get bookingsDuties
      .addCase(getBookingsDuties.pending, (state) => {
        state.bookingDutiesStates.status = "loading";
        state.bookingDutiesStates.loading = true;
      })
      .addCase(getBookingsDuties.fulfilled, (state, action) => {
        state.bookingDutiesStates.status = "succeeded";
        state.bookingDutiesStates.loading = false;
        state.bookingDutiesStates.error = "";
        state.data = action.payload?.data as any;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(getBookingsDuties.rejected, (state) => {
        state.bookingDutiesStates.status = "failed";
        state.bookingDutiesStates.loading = false;
        state.bookingDutiesStates.error = "Error";
      })
      // single bookingsDuties
      .addCase(getSingleBookingDuties.pending, (state) => {
        state.bookingDutiesStates.status = "loading";
        state.bookingDutiesStates.loading = true;
      })
      .addCase(getSingleBookingDuties.fulfilled, (state, action) => {
        state.bookingDutiesStates.status = "succeeded";
        state.bookingDutiesStates.loading = false;
        state.bookingDutiesStates.error = "";
        state.data = action.payload?.data as any;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(getSingleBookingDuties.rejected, (state) => {
        state.bookingDutiesStates.status = "failed";
        state.bookingDutiesStates.loading = false;
        state.bookingDutiesStates.error = "Error";
      })
      // add new bookimg

      .addCase(addNewBooking.pending, (state) => {
        state.bookingDutiesStates.status = "loading";
        state.bookingDutiesStates.loading = true;
        state.bookingDutiesStates.error = "";
      })
      .addCase(addNewBooking.fulfilled, (state) => {
        state.bookingDutiesStates.status = "succeeded";
        state.bookingDutiesStates.loading = false;
        state.bookingDutiesStates.error = "";
      })
      .addCase(addNewBooking.rejected, (state) => {
        state.bookingDutiesStates.status = "failed";
        state.bookingDutiesStates.loading = false;
        state.bookingDutiesStates.error = "Error";
      });
  },
});

export const { actions, reducer } = bookingDutiesSlice;
export const {
  setIsAddEditDrawerOpen,
  setIsAddEditDrawerClose,
  setCurrentSelectedBookingDuties,
  setBookingDutiesFilter,
  setBookingDuties,
  setIsEditingBookingDuties,
} = actions;
export default bookingDutiesSlice.reducer;
