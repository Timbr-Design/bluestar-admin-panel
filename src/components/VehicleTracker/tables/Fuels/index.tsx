/* eslint-disable */

import { useAppDispatch, useAppSelector } from "../../../../hooks/store";
import { Dropdown, Space, Table } from "antd";
import { ReactComponent as Edit02 } from "../../../../icons/edit-02.svg";
import { ReactComponent as Eye } from "../../../../icons/eye.svg";
import { ReactComponent as Trash01 } from "../../../../icons/trash-01.svg";
import type { MenuProps, TableColumnsType } from "antd";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

import CustomPagination from "../../../Common/Pagination";
import { getFuels } from "../../../../redux/slices/vehicleTrackerSlice";
import { MoreOutlined } from "@ant-design/icons";
import {
  deleteFuel,
  setSelectedFuel,
} from "../../../../redux/slices/FuelSlice";
import DeleteModal from "../../../Modal/DeleteModal";

interface IFuelsTable {
  handleOpenSidePanel: () => void;
}

const FuelsTable = ({ handleOpenSidePanel }: IFuelsTable) => {
  const { fuels, filters, pagination, vehicleTrackerState } = useAppSelector(
    (state) => state.vehicleTracker
  );
  // const {vehicleList} = useAppSelector((state)=>state.database)

  const dispatch = useAppDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow,setSelectedRow] = useState(null);

  const handleEditFuels = (row) => {
    dispatch(setSelectedFuel(row));
    handleOpenSidePanel();
  };

  const handleDeleteFuel = () => {
    dispatch(deleteFuel({ id: selectedRow?._id }));
  };

  function returnItems(row: any) {
    const items: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleEditFuels(row);
            }}
          >
            <Space align="center">
              <Edit02 />

              <p>Edit Fuels</p>
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
              setOpenDeleteModal(true)
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
  const columns: TableColumnsType<any> = [
    {
      title: "Vehicle Name",
      dataIndex: "vehicleName",
      key: "vehicleName",
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Driver",
      dataIndex: "driver",
      key: "driver",
    },
    {
      title: "Fuel Type",
      dataIndex: "fuelType",
      key: "fuelType",
    },
    {
      title: "Quantity (Litres)",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => `${text} L`,
    },
    {
      title: "Rate (₹/Litre)",
      dataIndex: "rate",
      key: "rate",
      render: (text) => `₹${text}`,
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `₹${text}`,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (data: any, row: any) => {
        return (
          <div className={styles.columnsAction}>
            <Dropdown menu={{ items: returnItems(row) }}>
              <MoreOutlined />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    dispatch(
      getFuels({
        search: filters.search,
      })
    );
  }, [filters.search]);

  return (
    <>
      <Table
        bordered
        columns={columns}
        dataSource={fuels}
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
                getFuels({
                  search: filters.search,
                  page,
                })
              );
            }}
          />
        )}
      />
      <DeleteModal title={"Delete Fuels"} desc={" Are you sure you want to delete this expense?"} show={openDeleteModal} onClose={handleCloseModal} onDelete={handleDeleteFuel}  />
    </>
  );
};

export default FuelsTable;
