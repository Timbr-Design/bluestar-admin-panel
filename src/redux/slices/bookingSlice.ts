/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";
import { notification } from "antd";
import pb from "../../utils/configurePocketbase";

const initialState = {
  isAddEditDrawerOpen: false,
  currentSelectedBooking: {} as any, // as Ibooking later
  bookings: [],
  filters: {
    status: "",
    search: "",
  },
  isEditingBooking: false,
  bookingStates: {
    status: "idle",
    loading: false,
    error: "",
    loadingById: false,
  },
  pagination: {
    total: 0,
    page: 0,
    limit: 10,
  },
};

export const getBookings = createAsyncThunk(
  "booking/getBookings",
  async (params: any) => {
    const filters: string[] = [];

    if (params.search) {
      filters.push(
        `(booked_by_name ~ "${params.search}" || booking_id ~ "${params.search}" || booked_by_number ~ "${params.search}")`
      );
    }

    if (params.status) {
      filters.push(`booking_status ~ "${params.status}"`);
    }

    if (params.start_date && params.end_date) {
      filters.push(
        `(start_date <= "${params.end_date}" && end_date >= "${params.start_date}")`
      );
    }

    const filterString = filters.join(" && ");

    const record = await pb.collection("bookings").getList(1, 50, {
      expand:
        "vehicle_group_id,customer_id,duty_type_id,driver_id,vehicle_id,billed_customer_id",
      filter: filterString,
    });

    if (record) {
      const bookingIds = record.items.map((b) => b.id);

      let duties: any[] = [];
      if (bookingIds.length) {
        const dutyFilter = bookingIds
          .map((id) => `booking_id = "${id}"`)
          .join(" || ");

        const dutiesResult = await pb.collection("booking_duty").getFullList({
          filter: dutyFilter,
        });

        duties = dutiesResult;
      }
      const bookingsWithDuties = record.items.map((b) => {
        const bookingDuties = duties.filter((d) => d.booking_id === b.id);

        const completed = bookingDuties.filter(
          (d) => d.status?.toLowerCase() === "Completed"
        ).length;

        const total = bookingDuties.length;

        return {
          ...b,
          dutyStats: {
            completed,
            total,
          },
        };
      });

      return bookingsWithDuties;
    }

    return record.items;
  }
);
export const getSingleBookings = createAsyncThunk(
  "booking/getSingleBookings",
  async (params: any) => {
    const response = await apiClient.get("/booking", { params });

    return response.data;
  }
);
export const deleteBooking = createAsyncThunk(
  "booking/deleteBooking",
  async (params: any, { dispatch, getState }: any) => {
    const { booking } = getState();
    // const response = await apiClient.delete(`/booking/${params.id}`);
    const record = await pb.collection("bookings").delete(params.id);
    if (record) {
      dispatch(clearCurrentSelectedBooking());
      notification.success({
        message: "Success",
        description: "Booking deleted successfully",
      });
      const payload = {
        bookings: booking?.bookings?.filter(
          (each: any) => each.id !== params.id
        ),
      };

      dispatch(setBookings(payload));
    }
  }
);
export const addNewBooking = createAsyncThunk(
  "booking/addNewBooking",
  async (body: any, { dispatch }: any) => {
    // const response = await apiClient.post("/booking", body);
    const record = await pb.collection("bookings").create(body);

    if (record) {
      dispatch(clearCurrentSelectedBooking());
      notification.success({
        message: "Success",
        description: "New Booking added successfully",
      });
      dispatch(setIsAddEditDrawerClose());
      dispatch(getBookings({ page: 1, search: "", limit: 10 }));
      return record;
    }
  }
);
export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async ({ body, id }: any, { dispatch }: any) => {
    // const response = await apiClient.put(`/booking/${id}`, body);
    const record = await pb.collection("bookings").update(id, body);

    if (record) {
      dispatch(clearCurrentSelectedBooking());
      notification.success({
        message: "Success",
        description: "Booking updated successfully",
      });
      dispatch(setIsAddEditDrawerClose());
      dispatch(getBookings({ page: "1", search: "", limit: 10 }));

      return record;
    }
  }
);
export const getBookingById = createAsyncThunk(
  "booking/getBookingById",
  async (params: any) => {
    const { id } = params;
    const record = await pb.collection("bookings").getOne(id, {
      expand:
        "customer_id,duty_type_id,vehicle_group_id,driver_id,vehicle_id,billed_customer_id",
    });
    if (record) {
      return record;
    }
  }
);
export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingFilter: (state, action: PayloadAction<any | {}>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setBookings: (state, action: PayloadAction<any | {}>) => {
      return {
        ...state,
        bookings: action?.payload?.bookings,
      };
    },
    setIsAddEditDrawerOpen: (state) => {
      state.isAddEditDrawerOpen = true;
    },
    setIsEditingBooking: (state, action: PayloadAction<boolean>) => {
      state.isEditingBooking = action.payload;
    },
    setIsAddEditDrawerClose: (state) => {
      state.isAddEditDrawerOpen = false;
    },
    setCurrentSelectedBooking: (state, action: PayloadAction<any | {}>) => {
      state.currentSelectedBooking = action.payload;
    },
    clearCurrentSelectedBooking: (state) => {
      state.currentSelectedBooking = {} as any;
    },
  },
  extraReducers: (builder) => {
    builder
      // get bookings
      .addCase(getBookings.pending, (state) => {
        state.bookingStates.status = "loading";
        state.bookingStates.loading = true;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.bookingStates.status = "succeeded";
        state.bookingStates.loading = false;
        state.bookingStates.error = "";
        state.bookings = action.payload;
        // state.pagination = {
        //   total: action.payload.total,
        //   page: action.payload.page,
        //   limit: action.payload.limit,
        // };
      })
      .addCase(getBookings.rejected, (state) => {
        state.bookingStates.status = "failed";
        state.bookingStates.loading = false;
        state.bookingStates.error = "Error";
      })
      // single booking
      .addCase(getSingleBookings.pending, (state) => {
        state.bookingStates.status = "loading";
        state.bookingStates.loading = true;
      })
      .addCase(getSingleBookings.fulfilled, (state, action) => {
        state.bookingStates.status = "succeeded";
        state.bookingStates.loading = false;
        state.bookingStates.error = "";
        state.bookings = action.payload?.data as any;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(getSingleBookings.rejected, (state) => {
        state.bookingStates.status = "failed";
        state.bookingStates.loading = false;
        state.bookingStates.error = "Error";
      })
      // add new bookimg

      .addCase(addNewBooking.pending, (state) => {
        state.bookingStates.status = "loading";
        state.bookingStates.loading = true;
        state.bookingStates.error = "";
      })
      .addCase(addNewBooking.fulfilled, (state) => {
        state.bookingStates.status = "succeeded";
        state.bookingStates.loading = false;
        state.bookingStates.error = "";
      })
      .addCase(addNewBooking.rejected, (state) => {
        state.bookingStates.status = "failed";
        state.bookingStates.loading = false;
        state.bookingStates.error = "Error";
      })
      // get booking by id
      .addCase(getBookingById.pending, (state) => {
        state.bookingStates.status = "loading";
        state.bookingStates.loadingById = true;
        state.bookingStates.error = "";
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.bookingStates.status = "succeeded";
        state.bookingStates.loadingById = false;
        state.bookingStates.error = "";
        state.currentSelectedBooking = action.payload;
      })
      .addCase(getBookingById.rejected, (state) => {
        state.bookingStates.status = "failed";
        state.bookingStates.loadingById = false;
        state.bookingStates.error = "Error";
      });
  },
});
export const { actions, reducer } = bookingSlice;
export const {
  setIsAddEditDrawerOpen,
  setIsAddEditDrawerClose,
  setCurrentSelectedBooking,
  setBookingFilter,
  setBookings,
  setIsEditingBooking,
  clearCurrentSelectedBooking,
} = actions;
export default bookingSlice.reducer;
