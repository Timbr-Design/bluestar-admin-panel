/* eslint-disable */
import { useEffect, useState } from "react";
import { getVehicle } from "../../../redux/slices/databaseSlice";
import { Typography, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { CarOutlined } from "@ant-design/icons";
import CustomPagination from "../../Common/Pagination";
import styles from "./index.module.scss";

const { Text } = Typography;

interface BookingInfo {
  label: string;
  value: string;
}

interface IAssignVehicle {
  form: any;
  handleSetVehicle: (values: any) => void;
  vehicle: any;
}

const AssignVehicle = ({ form, handleSetVehicle, vehicle }: IAssignVehicle) => {
  const dispatch = useAppDispatch();
  const [selectedVehicle, setSelectedVehicle] = useState({ id: "" });
  const { vehicleList, q, pagination, selectedDutyType, selectedVehicleGroup } =
    useAppSelector((state) => state.database);

  useEffect(() => {
    setSelectedVehicle(vehicle);
  }, [vehicle]);

  const bookingInfo: BookingInfo[] = [
    { label: "Booking ID", value: form.getFieldValue("bookingId") },
    {
      label: "Start Date",
      value: form.getFieldValue("durationDetails")?.start_date
        ? new Date(
            form.getFieldValue("durationDetails").start_date
          ).toLocaleDateString()
        : undefined,
    },
    {
      label: "End Date",
      value: form.getFieldValue("durationDetails")?.end_date
        ? new Date(
            form.getFieldValue("durationDetails").end_date
          ).toLocaleDateString()
        : undefined,
    },
    {
      label: "Garage Start Time",
      value: form.getFieldValue("durationDetails")
        ?.start_from_garage_before_mins
        ? new Date(
            form.getFieldValue("durationDetails").start_from_garage_before_mins
          ).toLocaleTimeString()
        : undefined,
    },
    {
      label: "Reporting Time",
      value: form.getFieldValue("durationDetails")?.reporting_time
        ? new Date(
            form.getFieldValue("durationDetails").reporting_time
          ).toLocaleTimeString()
        : undefined,
    },
    { label: "Duty Type", value: selectedDutyType?.name },
    { label: "Vehicle Group", value: selectedVehicleGroup?.name },
    {
      label: "Reporting Address",
      value: form.getFieldValue("reporting_address"),
    },
    {
      label: "Drop Address",
      value: form.getFieldValue("drop_address"),
    },
  ];

  const getInitials = (name: string) => {
    const names = name?.split(" "); // Split the name by spaces
    const firstInitial = names && names[0]?.charAt(0).toUpperCase(); // Get the first letter of the first name
    const lastInitial = names && names[1]?.charAt(0).toUpperCase(); // Get the first letter of the last name (if exists)

    return firstInitial + (lastInitial || ""); // Combine the initials
  };

  const columns: ColumnsType<any> = [
    {
      title: "Model name",
      dataIndex: "model_name",
      key: "model_name",
      render: (_, record) => (
        <span className={styles["model-name"]}>{record?.model_name}</span>
      ),
    },
    {
      title: "Assigned driver",
      dataIndex: "driverInitials",
      key: "driver",
      render: (_, record) => (
        <div className={styles.driverNameContainer}>
          <div
            className={styles.driverProfile}
          >{`${getInitials(record?.expand?.driver_id?.name)}`}</div>
          <div className={styles.driverName}>
            {record?.expand?.driver_id?.name}
          </div>
        </div>
      ),
    },
    {
      title: "Vehicle number",
      dataIndex: "vehicle_number",
      key: "vehicle_number",
      align: "right",
      render: (text) => (
        <span className={styles["vehicle-number"]}>{text}</span>
      ),
    },
  ];

  const onRowClick = (record: any) => {
    return {
      onClick: () => {
        setSelectedVehicle(record);
        handleSetVehicle(record);
      },
    };
  };

  const rowClassName = (record: any) => {
    return record.id === selectedVehicle?.id
      ? "vehicle-row-selected"
      : "vehicle-row";
  };

  return (
    <div className={styles["duty-details-container"]}>
      <div className={styles["duty-info-section"]}>
        {bookingInfo?.map((item, index) => (
          <div className={styles["duty-info-row"]} key={index}>
            <Text className={styles["duty-info-label"]}>{item.label}</Text>
            <Text className={styles["duty-info-value"]}>{item.value}</Text>
          </div>
        ))}
      </div>

      <div className={styles["vehicles-section"]}>
        <div className={styles["vehicles-header"]}>
          <CarOutlined className={styles["car-icon"]} />
          <div className={styles["vehicles-title-container"]}>
            <Text className={styles["vehicles-title"]}>My Vehicles</Text>
            <Text className={styles["vehicles-subtitle"]}>
              Select from the list of available vehicles to assign to this duty
            </Text>
          </div>
        </div>

        <Table
          className="vehicles-table"
          columns={columns}
          dataSource={
            vehicleList && Array.isArray(vehicleList) ? vehicleList : []
          }
          pagination={false}
          rowClassName={rowClassName}
          onRow={onRowClick}
          // footer={() => (
          //   <CustomPagination
          //     total={pagination?.total ?? 0}
          //     current={pagination?.page ?? 1}
          //     pageSize={pagination.limit ?? 10}
          //     onPageChange={(page: number) => {
          //       dispatch(
          //         getVehicle({
          //           search: q,
          //           page: page,
          //         })
          //       );
          //     }}
          //   />
          // )}
        />
      </div>
    </div>
  );
};

export default AssignVehicle;
