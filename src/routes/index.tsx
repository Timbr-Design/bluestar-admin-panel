/* eslint-disable */
import { Route, Routes } from "react-router-dom";
import { RouteName } from "../constants/routes";

//Page Components
import Availability from "../pages/Availability";
import Dashboard from "../pages/Dashboard";
import DriversAttendancePayroll from "../pages/DriversAttendancePayroll";
import Database from "../pages/Database";
import Bookings from "../pages/Bookings";
import Billings from "../pages/Billings";
import CreateBilling from "../pages/Billings/Create";
import VehicleExpense from "../pages/VehicleExpense";
import SingleBookings from "../pages/Bookings/SingleBookingDuties";
import AllDuties from "../pages/Duties";
import Settings from "../pages/Settings";
import VehicleTrackerPage from "../pages/VehicleTracker";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={RouteName.HOME} element={<Dashboard />} />
      <Route path={`${RouteName.DATABASE}/:tabId`} element={<Database />} />
      <Route path={`${RouteName.DATABASE}/:tabId/:id`} element={<Database />} />
      <Route path={RouteName.BOOKINGS} element={<Bookings />} />
      <Route
        path={`${RouteName.BOOKINGS}/:bookingId`}
        element={<SingleBookings />}
      />
      <Route path={RouteName.BILLINGS} element={<Billings />} />
      <Route path={RouteName.CREATE_INVOICE} element={<CreateBilling />} />
      <Route path={RouteName.CREATE_RECEIPT} element={<CreateBilling />} />
      {/* <Route
        path={`${RouteName.DUTIES}/:bookingId`}
        element={<SingleBookings />}
      /> */}
      <Route path={`${RouteName.DUTIES}`} element={<AllDuties />} />
      <Route
        path={`${RouteName.VEHICLE_TRACKER}`}
        element={<VehicleTrackerPage />}
      />
      <Route path={RouteName.AVAILABILITY} element={<Availability />} />
      <Route path={RouteName.VEHICLE_EXPENSE} element={<VehicleExpense />} />
      <Route path={RouteName.DRIVERS} element={<DriversAttendancePayroll />} />
      <Route path={`${RouteName.SETTINGS}`} element={<Settings />} />
    </Routes>
  );
};

export default AppRoutes;
