/* eslint-disable */
import { useState, useEffect } from "react";
import CustomPagination from "../../Common/Pagination";
import { getDrivers } from "../../../redux/slices/databaseSlice";
import { Table } from "antd";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import type { ColumnsType } from "antd/es/table";
import styles from "./index.module.scss";

interface ContactData {
  key: string;
  name: string;
  phoneNumber: string;
}

interface IAssignDriver {
  handleSetDriver: (values: any) => void;
  driver: any;
}

const AssignDriver = ({ handleSetDriver, driver }: IAssignDriver) => {
  const [selectedDriver, setSelectedDriver] = useState({ _id: "" });
  const dispatch = useAppDispatch();
  const { driverList, driverStates, deleteDriverStates, q, pagination } =
    useAppSelector((state) => state.database);

  useEffect(() => {
    dispatch(
      getDrivers({
        search: q,
      })
    );
  }, [q]);

  useEffect(() => {
    setSelectedDriver(driver);
  }, [driver]);

  const columns: ColumnsType<ContactData> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      className: "name-column",
    },
    {
      title: "Phone Numbers",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      className: "phone-column",
    },
  ];

  const onRowClick = (record: any) => {
    console.log(record, "record");
    return {
      onClick: () => {
        setSelectedDriver(record);
        handleSetDriver(record);
      },
    };
  };

  const rowClassName = (record: any) => {
    return record._id === selectedDriver?._id
      ? "vehicle-row-selected"
      : "vehicle-row";
  };

  return (
    <div className={styles["contact-list-container"]}>
      <Table
        columns={columns}
        dataSource={driverList?.data?.map((data: any) => {
          return {
            _id: data?._id,
            name: data?.name,
            phoneNumber: data?.phoneNumber,
          };
        })}
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
                getDrivers({
                  search: q,
                  page: page,
                })
              );
            }}
          />
        )}
      />
    </div>
  );
};

export default AssignDriver;
