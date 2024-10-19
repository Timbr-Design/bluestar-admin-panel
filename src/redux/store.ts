/* eslint-disable */
import attendanceSlice from "./slices/attendanceSlice";
import authSlice from "./slices/authSlice";
import bookingSlice from "./slices/bookingSlice";
import databaseSlice from "./slices/databaseSlice";
import { configureStore } from "@reduxjs/toolkit";
import dutiesSlice from "./slices/dutiesSlice";
import vehicleTrackerSlice from "./slices/vehicleTrackerSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    database: databaseSlice,
    booking: bookingSlice,
    attendance: attendanceSlice,
    duties: dutiesSlice,
    vehicleTracker: vehicleTrackerSlice,
  },
});

export default store;
