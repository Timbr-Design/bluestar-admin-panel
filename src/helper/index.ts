import { BOOKINGS_DUTY_TABS, BOOKINGS_STATUS, DUTY_STATUS } from "../constants/bookings";

/* eslint-disable */
export const formatEpochToDate = (epoch: number) => {
  const date = new Date(epoch * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export const normalizeBookingStatus = (status: string) => {
  if (!status) return "";

  switch (status.toLowerCase()) {
    case "booked":
      return BOOKINGS_STATUS.booked;
    case "billed":
      return BOOKINGS_STATUS.billed;
    case "unconfirmed":
      return BOOKINGS_STATUS.unconfirmed;
    case "ongoing":
      return BOOKINGS_STATUS.onGoing;
    case "completed":
      return BOOKINGS_STATUS.completed;
    case "cancelled":
      return BOOKINGS_STATUS.cancelled;
    default:
      return status; // fallback if unexpected status
  }
};

export const normalizeBookingDutyStatus = (status: string) => {
  if (!status) return "";
  switch (status) {
    case "Booked":
      return DUTY_STATUS.booked;
    case "Billed":
      return DUTY_STATUS.billed;
    case "Upcoming":
      return DUTY_STATUS.upcoming;
    case "Alloted":
      return DUTY_STATUS.alloted;
    case "Completed":
      return DUTY_STATUS.completed;
    case "Cancelled":
      return DUTY_STATUS.cancelled;
    default:
      return status; // fallback if unexpected status
  }
};