/* eslint-disable */

import { useAppDispatch, useAppSelector } from "../../../../hooks/store";
import { Dropdown, Space, Table } from "antd";
import { ReactComponent as DeleteIconRed } from "../../../../icons/trash-red.svg";
import { ReactComponent as Edit02 } from "../../../../icons/edit-02.svg";
import { ReactComponent as Eye } from "../../../../icons/eye.svg";
import { ReactComponent as Trash01 } from "../../../../icons/trash-01.svg";
import type { MenuProps, TableColumnsType } from "antd";
import Modal from "../../../Modal";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

import CustomPagination from "../../../Common/Pagination";

import { getExpenses } from "../../../../redux/slices/vehicleTrackerSlice";

import { MoreOutlined } from "@ant-design/icons";
import useDebounce from "../../../../hooks/common/useDebounce";
import { IExpense } from "../../../../interface/expense";
import {
  deleteExpense,
  setSelectedExpense,
} from "../../../../redux/slices/expenseSlice";
import DeleteModal from "../../../Modal/DeleteModal";

interface IExpenseTable {
  handleOpenSidePanel: () => void;
}

const ExpenseTable = ({ handleOpenSidePanel }: IExpenseTable) => {
  const { expenses, filters, pagination, vehicleTrackerState } = useAppSelector(
    (state) => state.vehicleTracker
  );
  const dispatch = useAppDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow,setSelectedRow] = useState(null);

  const handleEditExpenses = (row) => {
    dispatch(setSelectedExpense(row));
    handleOpenSidePanel();
  };

  const handleDeleteExpense = () => {
    dispatch(deleteExpense({ id: selectedRow?._id }));
  };

  function returnItems(row: any) {
    const items: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div
            onClick={(e: any) => {
              e.stopPropagation();
              handleEditExpenses(row);
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
              setSelectedRow(row)
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
      title: "Vehicle Name and Number",
      key: "vehicleNameNumber",
      render: (_: any, record: any) => (
        <div>
          <div>{record?.vehicleId?.modelName ?? "-"}</div>
          <div style={{ color: "#666", fontSize: "12px" }}>
            {record?.vehicleId?.vehicleNumber ?? "-"}
          </div>
        </div>
      ),
    },
    {
      title: "Expense Number",
      key: "expenseNumber",
      render: (_: any, record: any) => {
        const vehicleNumber = record?.vehicleId?.vehicleNumber ?? "-";
        const repeatInterval = record?.repeatExpense?.repeatInterval ?? "-";
        return `${vehicleNumber}-${repeatInterval}`;
      },
    },
    {
      title: "Expense Type",
      dataIndex: "expenseType",
      key: "expenseType",
      render: (text: any) => (Array.isArray(text) ? text.join(", ") : text),
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `₹${Number(text).toLocaleString("hi-IN")}`,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_: any, row: any) => (
        <div className={styles.columnsAction}>
          <Dropdown menu={{ items: returnItems(row) }}>
            <MoreOutlined />
          </Dropdown>
        </div>
      ),
    },
  ];
  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  };

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    dispatch(
      getExpenses({
        ...filters,
        search: debouncedSearch,
      })
    );
  }, [debouncedSearch]);

  const onChange = (
    selectedRowKeys: React.Key[],
    selectedRows: IExpenseTable[]
  ) => {
    console.log(selectedRowKeys, "selectedRowKeys");
    // setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Rows: ", selectedRows);
  };

  return (
    <>
      <Table
        bordered
        columns={columns}
        dataSource={expenses}
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
                getExpenses({
                  search: filters.search,
                  page,
                })
              );
            }}
          />
        )}
      />
      <DeleteModal title={"Delete Expense"} show={openDeleteModal} onClose={handleCloseModal} onDelete={handleDeleteExpense}  />
    </>
  );
};

export default ExpenseTable;
