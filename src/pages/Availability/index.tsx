/* eslint-disable */
import cn from "classnames";
import { Input, DatePicker } from "antd";
import AvailablityTable from "../../components/AvailablityTable";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { getVehicleAvailability, setVehicleAvailabilityFilter } from "../../redux/slices/vehicleAvailabilitySlice";
import dayjs from "dayjs";

const Availability = () => {
  const { RangePicker } = DatePicker;
  const dispatch = useAppDispatch();
  const { vehicleAvailability, vehicleAvailabilityState, pagination } = useAppSelector((state: any) => state.vehicleAvailability);

  useEffect(() => {
    // Initial fetch with default parameters
    dispatch(getVehicleAvailability({
      page: pagination.page,
      limit: pagination.limit
    }) as any);

  }, [dispatch, pagination.page, pagination.limit]);

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      const [startDate, endDate] = dates;
      dispatch(setVehicleAvailabilityFilter({
        startDate: startDate?.valueOf(),
        endDate: endDate?.valueOf()
      }));
      dispatch(getVehicleAvailability({
        page: pagination.page,
        limit: pagination.limit,
        startDate: startDate?.valueOf(),
        endDate: endDate?.valueOf()
      }) as any);
    }
  };

  const handleClear = () => {
    dispatch(setVehicleAvailabilityFilter({
      startDate: undefined,
      endDate: undefined
    }));
    dispatch(getVehicleAvailability({
      page: pagination.page,
      limit: pagination.limit
    }) as any);
  };

  return (
    <div className={cn("container", styles.container)}>
      <div className={styles.headingContainer}>
        <div className={styles.heading}>Vehicle Availability</div>
        <div className={styles.text}>
          View your vehicles and their drivers availability here
        </div>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.searchContainer}>
          <Input
            prefix={<SearchOutlined />}
            defaultValue={""}
            className={styles.inputContainer}
            placeholder="Search by vehicle or driver"
          />
          <div
            className="flex"
            style={{
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <RangePicker onChange={handleDateRangeChange} />
            <button className={styles.clearText} onClick={handleClear}>Clear</button>
          </div>
        </div>
        <div className={styles.tableContainer}>
          <AvailablityTable 
            data={vehicleAvailability}
            loading={vehicleAvailabilityState.loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Availability;
