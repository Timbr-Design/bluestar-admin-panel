/* eslint-disable */
import { Table, TableProps, Dropdown } from "antd";
import cn from "classnames";
import { AVAILABLITY_TABLE } from "../../constants/availability";
import styles from "./index.module.scss";

interface IBooking {
  bookingId: string;
  user: string;
}

interface IDate {
  bookings: IBooking[];
  date: string;
}

interface IAvailability {
  key: string;
  vehicle: { name: string; licensePlate: string };
  dates: any[];
}

interface AvailablityTableProps {
  data: IAvailability[];
  loading: boolean;
}

const AvailablityTable = ({ data, loading }: AvailablityTableProps) => {
  // Extract unique dates from the data
  const dates = data?.reduce((acc: string[], item) => {
    item.dates.forEach(date => {
      if (!acc.includes(date.date)) {
        acc.push(date.date);
      }
    });
    return acc;
  }, []).sort((a, b) => {
    // Sort dates in ascending order
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  const columns: TableProps<IAvailability>["columns"] = [
    {
      title: "Vehicle",
      key: "vehicle",
      fixed: "left",
      width: 200,
      className: "available-header",
      render: (record: IAvailability) => {
        return (
          <div className={styles.vehicle}>
            <div className={styles.name}>{record?.vehicle?.name}</div>
            <div className={styles.licensePlate}>
              {record?.vehicle?.licensePlate}
            </div>
          </div>
        );
      },
    },
    // Dynamically create columns based on the dates
    ...dates?.map((date) => ({
      title: date,
      key: date,
      width: 200,
      className: "available-date",
      render: (record: IAvailability) => {
        // Find the booking info for the specific date
        const dateInfo = record.dates.find((d) => d.date === date);

        if (!dateInfo || dateInfo.bookings.length === 0) {
          return ""; // No bookings on this date
        }

        return dateInfo?.bookings?.map((booking, index) => (
          <div
            key={index}
            className={cn(styles.bookingConatiner, {
              [styles.connect]:
                dateInfo.bookings[index]?.bookingId ===
                dateInfo.bookings[index + 1]?.bookingId,
            })}
            aria-describedby={`${index}`}
          >
            <div className={styles.booking}>
              <div className={styles.hash} aria-describedby={`${index}`}>
                {dateInfo.bookings[index]?.bookingId ===
                dateInfo.bookings[index + 1]?.bookingId
                  ? ""
                  : "#"}
              </div>
              <div className={styles.bookingText}>
                {dateInfo.bookings[index]?.bookingId ===
                dateInfo.bookings[index + 1]?.bookingId
                  ? ""
                  : `${booking.bookingId}`}
              </div>
            </div>
            <div className={styles.text}>
              {dateInfo.bookings[index]?.bookingId ===
              dateInfo.bookings[index + 1]?.bookingId
                ? ""
                : `${booking.user}`}
            </div>
          </div>
        ));
      },
    })),
  ];

  return (
    <Table
      bordered
      rowClassName={styles.rowstyles}
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{
        x: "max-content", // Horizontal scroll for wide tables
      }}
      pagination={false}
    />
  );
};

export default AvailablityTable;
