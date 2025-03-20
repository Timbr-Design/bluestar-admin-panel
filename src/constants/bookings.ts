/* eslint-disable */
export const BOOKINGS_TABS = [
  {
    id: 1,
    name: "All",
    type: undefined,
  },
  { id: 2, name: "Booked", type: "booked" },
  { id: 3, name: "On-Going", type: "on-going" },
  { id: 4, name: "Completed", type: "completed" },
  { id: 5, name: "Billed", type: "billed" },
  { id: 6, name: "Cancelled", type: "cancelled" },
];

export const BOOKINGS_STATUS = {
  booked: "booked",
  "on-going": "on-going",
  completed: "completed",
  billed: "billed",
  cancelled: "cancelled",
  dispatched: "dispatched",
  allotted: "allotted",
};

export const BOOKINGS_DUTY_TABS = [
  {
    id: 1,
    name: "All",
    type: "",
  },
  { id: 2, name: "Upcoming", type: "Upcoming" },
  { id: 2, name: "Alloted", type: "Alloted" },
  { id: 2, name: "Dispatched", type: "Dispatched" },
  { id: 3, name: "Booked", type: "Booked" },
  { id: 4, name: "Completed", type: "Completed" },
  { id: 5, name: "Billed", type: "Billed" },
  { id: 6, name: "Cancelled", type: "Cancelled" },
  { id: 7, name: "Needs attention", type: "Needs attention" },
];

export const BOOKINGS_TABLE = [
  { title: "Start date", dataIndex: "start_date" },
  { title: "Customer", dataIndex: "customer" },
  { title: "Passenger", dataIndex: "passenger" },
  { title: "Vehicle group", dataIndex: "vehicle_group" },
  { title: "Duty type", dataIndex: "duty_type" },
  { title: "Duties", dataIndex: "duties" },
  { title: "Status", dataIndex: "status" },
  { title: "", dataIndex: "action" },
];
