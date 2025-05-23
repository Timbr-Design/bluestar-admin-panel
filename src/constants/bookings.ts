/* eslint-disable */
export const BOOKINGS_TABS = [
  {
    id: 1,
    name: "All",
    type: "",
  },
  { id: 2, name: "Booked", type: "booked" },
  { id: 3, name: "On-Going", type: "onGoing" },
  { id: 4, name: "Completed", type: "completed" },
  { id: 5, name: "Billed", type: "billed" },
  { id: 6, name: "Cancelled", type: "cancelled" },
  { id: 7, name: "Unconfirmed", type: "unconfirmed" },
];

export const BOOKINGS_STATUS = {
  booked: "booked",
  onGoing: "onGoing",
  completed: "completed",
  billed: "billed",
  cancelled: "cancelled",
  unconfirmed: "unconfirmed",
};

export const BOOKINGS_DUTY_TABS = [
  {
    id: 1,
    name: "All",
    type: "",
  },
  { id: 2, name: "Upcoming", type: "upcoming" },
  { id: 3, name: "Alloted", type: "alloted" },
  { id: 4, name: "Dispatched", type: "dispatched" },
  { id: 5, name: "Booked", type: "booked" },
  { id: 6, name: "Completed", type: "completed" },
  { id: 7, name: "Billed", type: "billed" },
  { id: 8, name: "Cancelled", type: "cancelled" },
  { id: 9, name: "Needs attention", type: "needAttention" },
];

export const DUTY_STATUS = {
  upcoming: "upcoming",
  alloted: "alloted",
  dispatched: "dispatched",
  booked: "booked",
  completed: "completed",
  billed: "billed",
  cancelled: "cancelled",
  needAttention: "needAttention",
};

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
