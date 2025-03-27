/* eslint-disable */
import { BOOKINGS_STATUS } from "../../constants/bookings";
import cn from "classnames";
import styles from "./index.module.scss";

interface IBookingsStates {
  status: string;
  isConfirmed?: boolean;
}

const BookingsStates = ({ status, isConfirmed }: IBookingsStates) => {
  return (
    <>
      {(() => {
        switch (status) {
          case BOOKINGS_STATUS.billed:
            return (
              <div className={cn(styles.container, styles.billed)}>
                <div className={cn(styles.dot, styles.billed)}></div>
                <div className={cn(styles.text, styles.billed)}>{"Billed"}</div>
              </div>
            );

          case BOOKINGS_STATUS.booked:
            return (
              <div className={cn(styles.container, styles.booked, { [styles.isConfirmed]: isConfirmed })}>
                <div className={cn(styles.dot, styles.booked, { [styles.isConfirmed]: isConfirmed })}></div>
                <div className={cn(styles.text, styles.booked, { [styles.isConfirmed]: isConfirmed })}>{"Booked"}</div>
              </div>
            );
          case BOOKINGS_STATUS.cancelled:
            return (
              <div className={cn(styles.container, styles.cancelled)}>
                <div className={cn(styles.dot, styles.cancelled)}></div>
                <div className={cn(styles.text, styles.cancelled)}>
                  {"Cancelled"}
                </div>
              </div>
            );
          case BOOKINGS_STATUS.completed:
            return (
              <div className={cn(styles.container, styles.completed)}>
                <div className={cn(styles.dot, styles.completed)}></div>
                <div className={cn(styles.text, styles.completed)}>
                  {"Completed"}
                </div>
              </div>
            );
          case BOOKINGS_STATUS.onGoing:
            return (
              <div className={cn(styles.container, styles["on-going"])}>
                <div className={cn(styles.dot, styles["on-going"])}></div>
                <div className={cn(styles.text, styles["on-going"])}>
                  {"On-going"}
                </div>
              </div>
            );
          case BOOKINGS_STATUS.unconfirmed:
            return (
              <div className={cn(styles.container, styles.unconfirmed)}>
                <div className={cn(styles.dot, styles.unconfirmed)}></div>
                <div className={cn(styles.text, styles.unconfirmed)}>
                  {"Unconfirmed"}
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

export default BookingsStates;
