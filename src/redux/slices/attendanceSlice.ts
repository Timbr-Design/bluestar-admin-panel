/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";

const initialState = {
  isViewDrawerOpen: false,
  isSlipDrawerOpen: false,
  attendance: [],
  filters: {
    status: "",
    q: "",
  },
  currentSelectedLogs: {},
  attendanceState: { status: "idle", loading: false, error: "" },
  pagination: {
    total: 0,
    page: 0,
    limit: 10,
  },
};

export const getAttendance = createAsyncThunk(
  "attendance/getAttendance",
  async (params: any) => {
    console.log(params)
    // const { dates } = params;
    // const response = await apiClient.get("/attendance", {
    //   params: { dates: dates },
    // });
    // return response.data;

    return {
      total: 10,
      page: 1,
      limit: 10,
      data: [
        {
          date: "2024-12-21",
          driversPresent: [
            {
              _id: "67137e98481dc15d450d7774",
              name: "Jitan Sharma",
            },
          ],
        },
        {
          date: "2024-12-22",
          driversPresent: [
            {
              _id: "67137e98381dc15d450d7774",
              name: "Neeraj Sharma",
            },
          ],
        },
        {
          date: "2025-01-02",
          driversPresent: [
            {
              _id: "67137e98381dc15d450d7774",
              name: "Neeraj Sharma",
            },
            {
              _id: "67137e92381dc15d450d7774",
              name: "Munna Kumar",
            },
          ],
        },
        {
          date: "2024-12-26",
          driversPresent: [
            {
              _id: "67137e98381dc15d450d7774",
              name: "Neeraj Sharma",
            },
          ],
        },
        {
          date: "2024-12-23",
          driversPresent: [
            {
              _id: "67137e98481dc15d450d7774",
              name: "Jitan Sharma",
            },
            {
              _id: "66f0380eb39aebd0d42635c9",
              name: "Shadab Ali",
            },
            {
              _id: "67137e92381dc15d450d7774",
              name: "Munna Kumar",
            },
          ],
        },
        {
          date: "2024-12-12",
          driversPresent: [
            {
              _id: "66f0380eb39aebd0d42635c9",
              name: "Shadab Ali",
            },
          ],
        },
      ],
    };
  }
);
export const markAbsent = createAsyncThunk(
  "attendance/markAbsent",
  async (body: any) => {
    const response = await apiClient.post("/attendance/absent", {
      ...body,
    });
    return response.data;
  }
);
export const markPresent = createAsyncThunk(
  "attendance/markPresent",
  async (body: any) => {
    const response = await apiClient.post("/attendance/present", {
      ...body,
    });
    return response.data;
  }
);

export const attendanceSlice = createSlice({
  name: "attendance",
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
    setIsSlipDrawerOpen: (state) => {
      state.isSlipDrawerOpen = true;
    },
    setIsSlipDrawerClose: (state) => {
      state.isSlipDrawerOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAttendance.pending, (state) => {
        state.attendanceState.status = "loading";
        state.attendanceState.loading = true;
      })
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.attendanceState.status = "succeeded";
        state.attendanceState.loading = false;
        state.attendanceState.error = "";
        state.attendance = action.payload.data as any;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(getAttendance.rejected, (state) => {
        state.attendanceState.status = "failed";
        state.attendanceState.loading = false;
        state.attendanceState.error = "Error";
      })
      // markAbsent
      .addCase(markAbsent.pending, (state) => {
        state.attendanceState.status = "loading";
        state.attendanceState.loading = true;
      })
      .addCase(markAbsent.fulfilled, (state, action) => {
        state.attendanceState.status = "succeeded";
        state.attendanceState.loading = false;
        state.attendanceState.error = "";
        state.attendance = [
          {
            date: "2024-12-21",
            driversPresent: [
              {
                _id: "67137e98481dc15d450d7774",
                name: "Jitan Sharma",
              },
            ],
          },
          {
            date: "2024-12-22",
            driversPresent: [
              {
                _id: "67137e98381dc15d450d7774",
                name: "Neeraj Sharma",
              },
            ],
          },
          {
            date: "2025-01-02",
            driversPresent: [
              {
                _id: "67137e98381dc15d450d7774",
                name: "Neeraj Sharma",
              },
              {
                _id: "67137e92381dc15d450d7774",
                name: "Munna Kumar",
              },
            ],
          },
          {
            date: "2024-12-26",
            driversPresent: [
              {
                _id: "67137e98381dc15d450d7774",
                name: "Neeraj Sharma",
              },
            ],
          },
          {
            date: "2024-12-23",
            driversPresent: [
              {
                _id: "67137e98481dc15d450d7774",
                name: "Jitan Sharma",
              },
              {
                _id: "66f0380eb39aebd0d42635c9",
                name: "Shadab Ali",
              },
              {
                _id: "67137e92381dc15d450d7774",
                name: "Munna Kumar",
              },
            ],
          },
          {
            date: "2024-12-12",
            driversPresent: [
              {
                _id: "66f0380eb39aebd0d42635c9",
                name: "Shadab Ali",
              },
            ],
          },
        ];
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(markAbsent.rejected, (state) => {
        state.attendanceState.status = "failed";
        state.attendanceState.loading = false;
        state.attendanceState.error = "Error";
      })
      // markPresent
      .addCase(markPresent.pending, (state) => {
        state.attendanceState.status = "loading";
        state.attendanceState.loading = true;
      })
      .addCase(markPresent.fulfilled, (state, action) => {
        state.attendanceState.status = "succeeded";
        state.attendanceState.loading = false;
        state.attendanceState.error = "";
        state.attendance = [
          {
            date: "2024-12-21",
            driversPresent: [
              {
                _id: "67137e98481dc15d450d7774",
                name: "Jitan Sharma",
              },
            ],
          },
          {
            date: "2024-12-22",
            driversPresent: [
              {
                _id: "67137e98381dc15d450d7774",
                name: "Neeraj Sharma",
              },
            ],
          },
          {
            date: "2025-01-02",
            driversPresent: [
              {
                _id: "67137e98381dc15d450d7774",
                name: "Neeraj Sharma",
              },
              {
                _id: "67137e92381dc15d450d7774",
                name: "Munna Kumar",
              },
            ],
          },
          {
            date: "2024-12-26",
            driversPresent: [
              {
                _id: "67137e98381dc15d450d7774",
                name: "Neeraj Sharma",
              },
            ],
          },
          {
            date: "2024-12-23",
            driversPresent: [
              {
                _id: "67137e98481dc15d450d7774",
                name: "Jitan Sharma",
              },
              {
                _id: "66f0380eb39aebd0d42635c9",
                name: "Shadab Ali",
              },
              {
                _id: "67137e92381dc15d450d7774",
                name: "Munna Kumar",
              },
            ],
          },
          {
            date: "2024-12-12",
            driversPresent: [
              {
                _id: "66f0380eb39aebd0d42635c9",
                name: "Shadab Ali",
              },
            ],
          },
        ];
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(markPresent.rejected, (state) => {
        state.attendanceState.status = "failed";
        state.attendanceState.loading = false;
        state.attendanceState.error = "Error";
      });
  },
});
export const { actions, reducer } = attendanceSlice;
export const {
  setIsSlipDrawerOpen,
  setIsSlipDrawerClose,
  setAttendanceFilter,
  setIsViewDrawerClose,
  setIsViewDrawerOpen,
} = actions;
export default attendanceSlice.reducer;
