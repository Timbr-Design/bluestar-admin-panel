/* eslint-disable */
import attendanceSlice from "./slices/attendanceSlice";
import authSlice from "./slices/authSlice";
import bookingSlice from "./slices/bookingSlice";
import databaseSlice from "./slices/databaseSlice";
import { configureStore } from "@reduxjs/toolkit";
import dutiesSlice from "./slices/dutiesSlice";
import vehicleTrackerSlice from "./slices/vehicleTrackerSlice";
import bookingDutiesSlice from "./slices/bookingDutiesSlice";
import billingSlice from "./slices/billingSlice";
import loginSlice from "./slices/loginSlice";
import companySlice from "./slices/companySlice";
import teamMemberReducer from './slices/teamMemberSlice';
import invoiceSlice from "./slices/invoiceSlice";
import vehicleAvailabilitySlice from "./slices/vehicleAvailabilitySlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    database: databaseSlice,
    booking: bookingSlice,
    attendance: attendanceSlice,
    duties: dutiesSlice,
    vehicleTracker: vehicleTrackerSlice,
    bookingDuties: bookingDutiesSlice,
    billing: billingSlice,
    login: loginSlice,
    company: companySlice,
    teamMember: teamMemberReducer,
    invoice: invoiceSlice,
    vehicleAvailability: vehicleAvailabilitySlice,
  },
});

export default store;
