/* eslint-disable */
import { Route, Routes } from "react-router-dom";
import { RouteName } from "../constants/routes";
import ProtectedRoute from "../components/ProtectedRoute";

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
import LoginPage from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={RouteName.LOGIN} element={<LoginPage />} />
      
      {/* Protected Routes */}
      <Route
        path={RouteName.HOME}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${RouteName.DATABASE}/:tabId`}
        element={
          <ProtectedRoute>
            <Database />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${RouteName.DATABASE}/:tabId/:id`}
        element={
          <ProtectedRoute>
            <Database />
          </ProtectedRoute>
        }
      />
      <Route
        path={RouteName.BOOKINGS}
        element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${RouteName.BOOKINGS}/:bookingId`}
        element={
          <ProtectedRoute>
            <SingleBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path={RouteName.BILLINGS}
        element={
          <ProtectedRoute>
            <Billings />
          </ProtectedRoute>
        }
      />
      <Route
        path={RouteName.CREATE_INVOICE}
        element={
          <ProtectedRoute>
            <CreateBilling />
          </ProtectedRoute>
        }
      />
      <Route
        path={RouteName.CREATE_RECEIPT}
        element={
          <ProtectedRoute>
            <CreateBilling />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${RouteName.DUTIES}`}
        element={
          <ProtectedRoute>
            <AllDuties />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${RouteName.VEHICLE_TRACKER}`}
        element={
          <ProtectedRoute>
            <VehicleTrackerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={RouteName.AVAILABILITY}
        element={
          <ProtectedRoute>
            <Availability />
          </ProtectedRoute>
        }
      />
      <Route
        path={RouteName.VEHICLE_EXPENSE}
        element={
          <ProtectedRoute>
            <VehicleExpense />
          </ProtectedRoute>
        }
      />
      <Route
        path={RouteName.DRIVERS}
        element={
          <ProtectedRoute>
            <DriversAttendancePayroll />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${RouteName.SETTINGS}`}
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
