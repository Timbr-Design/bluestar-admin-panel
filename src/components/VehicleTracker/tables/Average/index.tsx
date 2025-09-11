/* eslint-disable */

import { useAppDispatch, useAppSelector } from "../../../../hooks/store";
import { Avatar, Button, Space, Table, Tooltip } from "antd";
import { ReactComponent as DeleteIconRed } from "../../../../icons/trash-red.svg";
import { ReactComponent as Edit02 } from "../../../../icons/edit-02.svg";
import { ReactComponent as Eye } from "../../../../icons/eye.svg";
import { ReactComponent as Trash01 } from "../../../../icons/trash-01.svg";
import type { MenuProps, TableColumnsType } from "antd";
import Modal from "../../../Modal";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

import CustomPagination from "../../../Common/Pagination";

import { getAverage } from "../../../../redux/slices/vehicleTrackerSlice";

import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import useDebounce from "../../../../hooks/common/useDebounce";
import DeleteModal from "../../../Modal/DeleteModal";
import Title from "antd/es/skeleton/Title";

interface IAverageTable {
  handleOpenSidePanel: () => void;
}

const vehicleData = [
  {
    key: "jeep-compass",
    id: "jeep-compass",
    name: "Jeep Compass",
    number: "RJ90AB8264",
    activeDays: "23/31",
    drivers: "JD KE AF DE +3",
    distance: "482 KM",
    fuel: "35.67 L",
    average: "13.51",
    trips: [
      {
        key: 1,
        date: "10/08/2024 to 12/08/2024",
        driver: "John Dukes",
        distance: "32 KM",
        fuel: "3.12 L",
        average: "10.26",
      },
      {
        key: 2,
        date: "13/08/2024 to 15/08/2024",
        driver: "John Dukes, Kurt Bates, Autumn Philips",
        distance: "36 KM",
        fuel: "3.05 L",
        average: "11.80",
      },
      {
        key: 3,
        date: "16/08/2024 to 19/08/2024",
        driver: "Kurt Bates, Autumn Philips",
        distance: "16 KM",
        fuel: "1.25 L",
        average: "12.80",
      },
      {
        key: 4,
        date: "20/08/2024 to 22/08/2024",
        driver: "Autumn Philips",
        distance: "20 KM",
        fuel: "2.07 L",
        average: "9.7",
      },
      {
        key: 5,
        date: "23/08/2024 to 25/08/2024",
        driver: "Autumn Philips",
        distance: "48 KM",
        fuel: "4.04 L",
        average: "11.88",
      },
      {
        key: 6,
        date: "26/08/2024 to 31/08/2024",
        driver: "Autumn Philips",
        distance: "31 KM",
        fuel: "3.11 L",
        average: "9.97",
      },
    ],
  },
  {
    key: "maruti-swift",
    id: "maruti-swift",
    name: "Maruti Swift",
    number: "MP90AB8264",
    activeDays: "20/31",
    drivers: "JD KE AP",
    distance: "485 KM",
    fuel: "38.70 L",
    average: "12.53",
    trips: [],
  },
];

const AverageTable = ({ handleOpenSidePanel }: IAverageTable) => {
  const { averages, filters, pagination, vehicleTrackerState } = useAppSelector(
    (state) => state.vehicleTracker
  );
  const dispatch = useAppDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openVechileId, setOpenVechileId] = useState(null);

  const handleDetails = (row) => {
    console.log(row);
  };

  function returnItems(row: any) {
    const items: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Space align="center">
              <Edit02 />

              <p>Edit Expenses</p>
            </Space>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "2",
        label: (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Space>
              <Eye />
              See all car related expense
            </Space>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "4",
        label: (
          <div
            style={{
              color: "#F04438",
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Space>
              <Trash01 />
              Delete Expenses
            </Space>
          </div>
        ),
      },
    ];
    return items;
  }
  // const columns: TableColumnsType<any> = [
  //   {
  //     title: "Vehicle Name and Number",
  //     key: "vehicleName",
  //     render: (_: any, record: any) => (
  //       <div className={styles.VehicleBox}>
  //         <ArrowDownOutlined onClick={() => handleDetails(record)} />
  //         <div className={styles.veichleName}>
  //           <div>{record?.vehicleName ?? "-"}</div>
  //           <div style={{ color: "#666", fontSize: "12px" }}>
  //             {record?.vehicleNumber ?? "-"}
  //           </div>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Vehicle Number",
  //     dataIndex: "vehicleNumber",
  //     key: "vehicleNumber",
  //   },
  //   {
  //     title: "Active Days/Total Days",
  //     dataIndex: "activeDays",
  //     key: "activeDays",
  //   },
  //   {
  //     title: "Driver(s)",
  //     dataIndex: "drivers",
  //     key: "drivers",
  //     render: (drivers) => (
  //       <Avatar.Group>
  //         {drivers?.map((driver: any) => (
  //           <Tooltip title={driver.name} placement="top">
  //             <Avatar style={{ backgroundColor: "#6941C6" }}>
  //               {driver.name[0]}
  //             </Avatar>
  //           </Tooltip>
  //         ))}
  //       </Avatar.Group>
  //     ),
  //   },
  //   {
  //     title: "Distance Travelled (km)",
  //     dataIndex: "distanceTravelled",
  //     key: "distanceTravelled",
  //     render: (text) => `${text} km`,
  //   },
  //   {
  //     title: "Fuel Consumed (L)",
  //     dataIndex: "fuelConsumed",
  //     key: "fuelConsumed",
  //     render: (text) => `${text} L`,
  //   },
  //   {
  //     title: "Vehicle Average (km/L)",
  //     dataIndex: "vehicleAverage",
  //     key: "vehicleAverage",
  //     render: (text) => `${text} km/L`,
  //   },
  // ];

  const columns: TableColumnsType<any> = [
    {
      title: "Vehicle Name and Number",
      key: "vehicle",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, color: "#101828" }}>{record.name}</div>
          <div style={{ fontSize: "12px", color: "#667085" }}>
            {record.number}
          </div>
        </div>
      ),
    },
    {
      title: "Active days",
      dataIndex: "activeDays",
      key: "activeDays",
    },
    {
      title: "Driver(s)",
      dataIndex: "drivers",
      key: "drivers",
    },
    {
      title: "Distance travelled",
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: "Fuel filled",
      dataIndex: "fuel",
      key: "fuel",
    },
    {
      title: "Vehicle average",
      dataIndex: "average",
      key: "average",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
  ];
  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const handleDeleteAllowance = () => {
    // dispatch(deleteAllowance({ id: allowanceId }));
    setOpenDeleteModal(false);
  };

  const debouncedSearch = useDebounce(filters.search, 500);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const expandedRowRender = (record: any) => {
    const tripColumns: TableColumnsType<any> = [
      {
        title: "Date Range",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Driver(s)",
        dataIndex: "driver",
        key: "driver",
      },
      {
        title: "Distance",
        dataIndex: "distance",
        key: "distance",
      },
      {
        title: "Fuel",
        dataIndex: "fuel",
        key: "fuel",
      },
      {
        title: "Average",
        dataIndex: "average",
        key: "average",
      },
    ];

    return (
      <div style={{ margin: 0, padding: "16px", backgroundColor: "#f9fafb" }}>
        {/* <Title level={5} style={{ marginBottom: 16, color: "#101828" }}>
          Trip Details for {record.name}
        </Title> */}
        <Table
          columns={tripColumns}
          dataSource={record?.trips?.map((trip, index) => ({
            ...trip,
            key: index,
          }))}
          pagination={false}
          size="small"
          style={{ backgroundColor: "white" }}
        />
      </div>
    );
  };

  useEffect(() => {
    dispatch(
      getAverage({
        ...filters,
        search: debouncedSearch ?? "",
      })
    );
  }, [debouncedSearch]);

  return (
    <>
      {/* <Table
        bordered
        columns={columns}
        dataSource={averages}
        loading={vehicleTrackerState?.loading}
        pagination={false}
        scroll={{
          x: 756,
        }}
        footer={() => (
          <CustomPagination
            total={pagination?.total ?? 0}
            current={pagination?.page ?? 1}
            pageSize={pagination.limit ?? 10}
            onPageChange={(page: number) => {
              dispatch(
                getAverage({
                  search: filters.search,
                  page,
                })
              );
            }}
          />
        )}
      /> */}

      <Table
        columns={columns}
        dataSource={vehicleData}
        expandable={{
          expandedRowRender,
          expandedRowKeys,
          onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
          expandIcon: ({ expanded, onExpand, record }) => (
            <Button
              type="text"
              size="small"
              icon={expanded ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
              onClick={(e) => onExpand(record, e)}
              style={{ color: "#667085" }}
            />
          ),
        }}
        pagination={false}
        style={{ backgroundColor: "white", borderRadius: 8 }}
      />

      <DeleteModal
        show={openDeleteModal}
        onClose={handleCloseModal}
        title={"Delete expense"}
        desc={"Are you sure you want to delete this expense?"}
        onDelete={handleDeleteAllowance}
      />
    </>
  );
};

export default AverageTable;
