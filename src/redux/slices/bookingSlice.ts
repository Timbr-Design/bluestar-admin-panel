/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";

// interface IBooking {
//   bookingId?: string;
//   customer?:string
//    bookings?
//   vehicleGroup:
// }
const initialState = {
  isAddEditDrawerOpen: false,
  currentSelectedBooking: {} as any, // as Ibooking later
  bookings: [],
  filters: {
    status: "",
    q: "",
  },
  isEditingBooking: true,
  bookingStates: { status: "idle", loading: false, error: "" },
  pagination: {
    total: 0,
    page: 0,
    limit: 10,
  },
};

export const getBookings = createAsyncThunk(
  "booking/getBookings",
  async (params: any) => {
    // const response = await apiClient.get("/auth/admin/login", { params });
    // return response.data;

    return {
      total: 10,
      page: 1,
      limit: 10,
      data: [
        {
          startDate: "2024-09-15",
          customer: "John Doe",
          passenger: ["Alice Smith", "shadab Ali", "Pratham"],
          vehicleGroup: "SUV",
          dutyType: "Airport Transfer",
          duties: "Pickup from JFK Airport",
          status: "booked",
        },
        {
          startDate: "2024-09-16",
          customer: "Jane Doe",
          passenger: "Bob Johnson",
          vehicleGroup: "Sedan",
          dutyType: "City Tour",
          duties: "Full-day sightseeing",
          status: "on-going",
        },
        {
          startDate: "2024-09-12",
          customer: "Tom White",
          passenger: "Clara White",
          vehicleGroup: "Luxury",
          dutyType: "Business Travel",
          duties: "Office commute",
          status: "completed",
        },
        {
          startDate: "2024-09-10",
          customer: "Samuel Green",
          passenger: ["shadab Ali", "Pratham", "Rachel Green"],
          vehicleGroup: "Van",
          dutyType: "Event Transfer",
          duties: "Wedding transportation",
          status: "billed",
        },
        {
          startDate: "2024-09-17",
          customer: "Nancy Brown",
          passenger: "Michael Brown",
          vehicleGroup: "Mini Van",
          dutyType: "School Pickup",
          duties: "Daily school commute",
          status: "cancelled",
        },
        {
          startDate: "2024-09-20",
          customer: "Alex King",
          passenger: ["Pratham", "shadab Ali", "Emily King"],
          vehicleGroup: "SUV",
          dutyType: "Outstation Trip",
          duties: "Weekend getaway",
          status: "booked",
        },
        {
          startDate: "2024-09-18",
          customer: "Oscar Black",
          passenger: "Sophia Black",
          vehicleGroup: "Sedan",
          dutyType: "City Commute",
          duties: "Office pickup",
          status: "on-going",
        },
        {
          startDate: "2024-09-11",
          customer: "Harry Lewis",
          passenger: "Noah Lewis",
          vehicleGroup: "SUV",
          dutyType: "Family Trip",
          duties: "Airport transfer",
          status: "completed",
        },
        {
          startDate: "2024-09-14",
          customer: "Grace Lee",
          passenger: "Liam Lee",
          vehicleGroup: "Luxury",
          dutyType: "Business Meeting",
          duties: "City transfer",
          status: "billed",
        },
        {
          startDate: "2024-09-19",
          customer: "Ethan Walker",
          passenger: "Lucas Walker",
          vehicleGroup: "Van",
          dutyType: "Event Transfer",
          duties: "Concert transportation",
          status: "cancelled",
        },
      ],
    };
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
  },
  extraReducers: (builder) => {
    builder
      // Create a New Vehicle Group
      .addCase(getBookings.pending, (state) => {
        state.bookingStates.status = "loading";
        state.bookingStates.loading = true;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.bookingStates.status = "succeeded";
        state.bookingStates.loading = false;
        state.bookingStates.error = "";
        state.bookings = action.payload.data as any;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(getBookings.rejected, (state) => {
        state.bookingStates.status = "failed";
        state.bookingStates.loading = false;
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
  setIsEditingBooking,
} = actions;
export default bookingSlice.reducer;
