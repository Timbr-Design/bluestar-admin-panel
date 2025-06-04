/* eslint-disable */

import { useAppDispatch, useAppSelector } from "../../../../hooks/store";
import { Avatar, Dropdown, Space, Table, Tooltip } from "antd";
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

import { MoreOutlined } from "@ant-design/icons";

interface IAverageTable {
  handleOpenSidePanel: () => void;
}

const AverageTable = ({ handleOpenSidePanel }: IAverageTable) => {
  const { averages, filters, pagination, vehicleTrackerState } = useAppSelector(
    (state) => state.vehicleTracker
  );
  const dispatch = useAppDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
  const columns: TableColumnsType<any> = [
    {
      title: "Vehicle Name and Number",
      dataIndex: "vehicleNameAndNumber",
      key: "vehicleNameAndNumer",
      className: styles.headerfont
    },
    {
      title: "Active Days/Total Days",
      dataIndex: "activeDays",
      key: "activeDays",
      className: styles.headerfont
    },
    {
      title: "Driver(s)",
      dataIndex: "drivers",
      key: "drivers",
      
      render: (drivers) => (
        <Avatar.Group>
          {drivers.map((driver: any) => (
            <Tooltip title={driver.name} placement="top">
              <Avatar style={{ backgroundColor: "#6941C6" }}>
                {driver.name[0]}
              </Avatar>
            </Tooltip>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: "Distance Travelled (km)",
      dataIndex: "distanceTravelled",
      key: "distanceTravelled",
      render: (text) => `${text} km`,
      className: styles.headerfont
    },
    {
      title: "Fuel Consumed (L)",
      dataIndex: "fuelConsumed",
      key: "fuelConsumed",
      render: (text) => `${text} L`,
      className: styles.headerfont
    },
    {
      title: "Vehicle Average (km/L)",
      dataIndex: "vehicleAverage",
      key: "vehicleAverage",
      render: (text) => `${text} km/L`,
      className: styles.headerfont
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (data: any, row: any) => {
        return (
          <div className={styles.columnsAction}>
            <Dropdown menu={{ items: returnItems(row) }}>
              <MoreOutlined className={styles.ellipsis}/>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const handleDeleteAllowance = () => {
    // dispatch(deleteAllowance({ id: allowanceId }));
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    dispatch(
      getAverage({
        search: filters.search,
      })
    );
  }, [filters.search]);

  const onChange = (
    selectedRowKeys: React.Key[],
    selectedRows: IAverageTable[]
  ) => {
    console.log(selectedRowKeys, "selectedRowKeys");
    // setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Rows: ", selectedRows);
  };

  return (
    <>
      <Table
        bordered
        onRow={(record) => {
          return {
            onClick: () => {},
          };
        }}
        columns={columns}
        dataSource={averages}
        loading={vehicleTrackerState?.loading}
        pagination={false}
        className= {styles.contentfont}
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
      />
      <Modal show={openDeleteModal} onClose={handleCloseModal}>
        <div className={styles.deleteContainer}>
          <DeleteIconRed />
        </div>
        <div className={styles.modalContainer}>
          <div className={styles.textContainer}>
            <div className={styles.primaryText}>Delete expense</div>
            <div className={styles.secondaryText}>
              Are you sure you want to delete this expense?{" "}
              <div className={styles.selectedSecondaryText}>
                {"Delete expense"}
              </div>
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button className={styles.cancelBtn} onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleDeleteAllowance}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AverageTable;
