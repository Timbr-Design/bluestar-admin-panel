/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";
import { notification } from "antd";
import { addNewBooking } from "./bookingSlice";
import pb from "../../utils/configurePocketbase";

const initialState = {
  isAddEditDrawerOpen: false,
  currentSelectedBookingDuties: {} as any, // as Ibooking later
  data: [],
  filters: {
    status: undefined,
    search: "",
    startDate: undefined,
    endDate: undefined,
  },
  isEditingBookingDuties: true,
  isAllotingDuties: false,
  bookingDashboardView: {} as any,
  bookingDutiesStates: { status: "idle", loading: false, error: "" },
  pagination: {
    total: 0,
    page: 0,
    limit: 10,
  },
};
export const addNewBookingDuties = createAsyncThunk(
  "bookingsDuties/addNewBookingDuties",
  async (body: any, { dispatch, getState }: any) => {
    // const response = await apiClient.post("/duty", body);

    const record = await pb.collection("booking_duty").create(body);
    const { bookingDuties } = getState();
    const { filters } = bookingDuties;
    if (record) {
      dispatch(setCurrentSelectedBookingDuties({}));
      dispatch(setIsAddEditDrawerClose());
      notification.success({
        message: "Success",
        description: "New Booking duties added successfully",
      });
      dispatch(getBookingsDuties({ ...filters }));
      return record;
    }
  }
);
export const updateBookingDuties = createAsyncThunk(
  "bookingsDuties/updateBookingDuties",
  async (body: any, { dispatch, getState }: any) => {
    const { bookingDuties } = getState();
    const { filters } = bookingDuties;
    const record = await pb
      .collection("booking_duty")
      .update(body.id, body.data);

    if (record) {
      dispatch(setCurrentSelectedBookingDuties({}));
      dispatch(setIsAddEditDrawerClose());
      dispatch(getBookingsDuties({ bookingId: body.bookingId, ...filters }));
      return record;
    }
  }
);
export const getBookingsDuties = createAsyncThunk(
  "bookingsDuties/getBookingsDuties",
  async (params: any, { dispatch }: any) => {
    const { bookingId } = params;
    const filters: string[] = [];

    // Always filter by bookingId
    if (bookingId) filters.push(`booking_id = "${bookingId}"`);

    if (params.start_date && params.end_date) {
      if (params.start_date && params.end_date) {
        filters.push(
          `(start_date <= "${params.end_date}" && end_date >= "${params.start_date}")`
        );
      }
    }

    // Apply search filter (if provided)
    if (params.search) {
      filters.push(`(booking_id ~ "${params.search}")`);
    }

    if (params.status) {
      filters.push(`status = "${params.status}"`);
    }

    const filterString = filters.join(" && ");

    const resultList = await pb.collection("booking_duty").getList(1, 50, {
      filter: filterString,
      expand:
        "vehicle_group_id,duty_type_id,driver_id,booking_id,billed_customer_id,vehicle_id",
    });

    // const resultList = await pb.collection("booking_duty").getList(1, 50, {
    //   filter: `booking_id ~ "${bookingId}"`,
    //   expand: "vehicle_group_id,duty_type_id,driver_id",
    // });

    // const record = await pb
    //   .collection("bookings_dashboard_view")
    //   .getOne(bookingId, {
    //     expand: "customer_id",
    //   });
    // if (record) {
    //   const cleaned = {
    //     ...record,
    //     expand: {
    //       customer_id: record?.expand?.customer_id
    //         ? {
    //             id: record.expand.customer_id.id,
    //             name: record.expand.customer_id.name,
    //           }
    //         : null,
    //     },
    //   };
    //   dispatch(setBookingDashboardView(cleaned));
    // }

    if (resultList) {
      return resultList.items;
    }
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
    setBookingDashboardView: (state, action: PayloadAction<any | {}>) => {
      return {
        ...state,
        bookingDashboardView: action?.payload,
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
    setIsAllotingDuties: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isAllotingDuties: action.payload,
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
        state.data = action.payload as any;
        // state.pagination = {
        //   total: action.payload.total,
        //   page: action.payload.page,
        //   limit: action.payload.limit,
        // };
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
  setIsAllotingDuties,
  setBookingDashboardView,
} = actions;
export default bookingDutiesSlice.reducer;
