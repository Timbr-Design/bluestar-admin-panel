/* eslint-disable */
import { useState } from "react";
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
}

const AssignVehicle = ({ form }: IAssignVehicle) => {
  const dispatch = useAppDispatch();
  const [selectedVehicle, setSelectedVehicle] = useState({ _id: "" });
  const { vehicleList, q, pagination } = useAppSelector(
    (state) => state.database
  );

  console.log(form, "form");

  const bookingInfo: BookingInfo[] = [
    { label: "Duty ID", value: form.getFieldValue("dutyTypeId") },
    { label: "Start Date", value: new Date(form.getFieldValue("durationDetails").startDate).toLocaleDateString() },
    { label: "End Date", value: new Date(form.getFieldValue("durationDetails").endDate).toLocaleDateString() },
    { label: "Garage Start Time", value: "10:00" },
    { label: "Reporting Time", value: new Date(form.getFieldValue("durationDetails").reportingTime).toLocaleTimeString() },
    { label: "City", value: "Mumbai" },
    { label: "Duty Type", value: form.getFieldValue("dutyTypeId") },
    { label: "Vehicle Group", value: form.getFieldValue("vehicleGroupId")},
    {
      label: "Reporting Address",
      value: form.getFieldValue("reportingAddress"),
    },
    {
      label: "Drop Address",
      value: form.getFieldValue("dropAddress"),
    },]

  const getInitials = (name: string) => {
    const names = name.split(" "); // Split the name by spaces
    const firstInitial = names[0]?.charAt(0).toUpperCase(); // Get the first letter of the first name
    const lastInitial = names[1]?.charAt(0).toUpperCase(); // Get the first letter of the last name (if exists)

    return firstInitial + (lastInitial || ""); // Combine the initials
  };

  const columns: ColumnsType<any> = [
    {
      title: "Model name",
      dataIndex: "model",
      key: "model",
      render: (_, record) => (
        <span className={styles["model-name"]}>{record?.modelName}</span>
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
          >{`${getInitials(record?.driver?.name)}`}</div>
          <div className={styles.driverName}>{record?.driver?.name}</div>
        </div>
      ),
    },
    {
      title: "Vehicle number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
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
      },
    };
  };

  const rowClassName = (record: any) => {
    return record._id === selectedVehicle?._id
      ? "vehicle-row-selected"
      : "vehicle-row";
  };

  return (
    <div className={styles["duty-details-container"]}>
      <div className={styles["duty-info-section"]}>
        {bookingInfo.map((item, index) => (
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
          dataSource={vehicleList?.data}
          pagination={false}
          rowClassName={rowClassName}
          onRow={onRowClick}
          footer={() => (
            <CustomPagination
              total={pagination?.total ?? 0}
              current={pagination?.page ?? 1}
              pageSize={pagination.limit ?? 10}
              onPageChange={(page: number) => {
                dispatch(
                  getVehicle({
                    search: q,
                    page: page,
                  })
                );
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default AssignVehicle;
