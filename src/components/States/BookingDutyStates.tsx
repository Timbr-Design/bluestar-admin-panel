/* eslint-disable */
import { BOOKINGS_STATUS, DUTY_STATUS } from "../../constants/bookings";
import cn from "classnames";
import styles from "./index.module.scss";

interface IBookingsStates {
  status: string;
  isConfirmed?: boolean;
}

const BookingDutyStates = ({ status, isConfirmed }: IBookingsStates) => {
  return (
    <>
      {(() => {
        switch (status) {
          case "Billed":
            return (
              <div className={cn(styles.container, styles.billed)}>
                <div className={cn(styles.dot, styles.billed)}></div>
                <div className={cn(styles.text, styles.billed)}>{"Billed"}</div>
              </div>
            );
          case "Booked":
            return (
              <div
                className={cn(styles.container, styles.booked, {
                  [styles.isConfirmed]: isConfirmed,
                })}
              >
                <div
                  className={cn(styles.dot, styles.booked, {
                    [styles.isConfirmed]: isConfirmed,
                  })}
                ></div>
                <div
                  className={cn(styles.text, styles.booked, {
                    [styles.isConfirmed]: isConfirmed,
                  })}
                >
                  {"Booked"}
                </div>
              </div>
            );
          case "Cancelled":
            return (
              <div className={cn(styles.container, styles.cancelled)}>
                <div className={cn(styles.dot, styles.cancelled)}></div>
                <div className={cn(styles.text, styles.cancelled)}>
                  {"Cancelled"}
                </div>
              </div>
            );
          case "Completed":
            return (
              <div className={cn(styles.container, styles.completed)}>
                <div className={cn(styles.dot, styles.completed)}></div>
                <div className={cn(styles.text, styles.completed)}>
                  {"Completed"}
                </div>
              </div>
            );
          case "Unconfirmed":
            return (
              <div className={cn(styles.container, styles.unconfirmed)}>
                <div className={cn(styles.dot, styles.unconfirmed)}></div>
                <div className={cn(styles.text, styles.unconfirmed)}>
                  {"Unconfirmed"}
                </div>
              </div>
            );
          case "Upcoming":
            return (
              <div className={cn(styles.container, styles.completed)}>
                <div className={cn(styles.dot, styles.completed)}></div>
                <div className={cn(styles.text, styles.completed)}>
                  {"Upcoming"}
                </div>
              </div>
            );
          case "Dispatched":
            return (
              <div className={cn(styles.container, styles.completed)}>
                <div className={cn(styles.dot, styles.completed)}></div>
                <div className={cn(styles.text, styles.completed)}>
                  {"Upcoming"}
                </div>
              </div>
            );
          case "Needs Attention":
            return (
              <div className={cn(styles.container, styles.completed)}>
                <div className={cn(styles.dot, styles.completed)}></div>
                <div className={cn(styles.text, styles.completed)}>
                  {"Needs attention"}
                </div>
              </div>
            );
          case "Alloted":
            return (
              <div className={cn(styles.container, styles.allotted)}>
                <div className={cn(styles.dot, styles.allotted)}></div>
                <div className={cn(styles.text, styles.allotted)}>
                  {"Alloted"}
                </div>
              </div>
            );
          default:
            return null;
        }
      })()}
    </>
  );
};

export default BookingDutyStates;
