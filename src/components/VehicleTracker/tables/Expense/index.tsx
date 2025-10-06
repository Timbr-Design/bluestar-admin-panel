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

import { MoreOutlined } from "@ant-design/icons";
import useDebounce from "../../../../hooks/common/useDebounce";
import { IExpense } from "../../../../interface/expense";
import {
  deleteExpense,
  getExpenses,
  setSelectedExpense,
} from "../../../../redux/slices/expenseSlice";
import DeleteModal from "../../../Modal/DeleteModal";
import useNotification from "../../../DeleteNotification/useNotification";
import { setVehicleTrackerFilter } from "../../../../redux/slices/vehicleTrackerSlice";

interface IExpenseTable {
  handleOpenSidePanel: () => void;
}

const ExpenseTable = ({ handleOpenSidePanel }: IExpenseTable) => {
  const { filters, pagination, vehicleTrackerState } = useAppSelector(
    (state) => state.vehicleTracker
  );

  const { expenses } = useAppSelector((state) => state.expenses);

  const dispatch = useAppDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const notify = useNotification();

  const handleEditExpenses = (row) => {
    dispatch(setSelectedExpense(row));
    handleOpenSidePanel();
  };
  const handleDeleteExpense = async () => {
    try {
      const resultAction = await dispatch(
        deleteExpense({ id: selectedRow?.id })
      );

      if (deleteExpense.fulfilled.match(resultAction)) {
        notify.success("Expense has been deleted");
      } else {
        notify.success("Failed to delete expense");
      }
    } catch (error) {
      console.log("ERRRO");
    }
    setOpenDeleteModal(false);
  };

  const handleAllExpenses = () => {
    dispatch(
      setVehicleTrackerFilter({
        search: selectedRow?.expand?.vehicle_id?.model_name,
      })
    );
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
              handleAllExpenses();
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
              setOpenDeleteModal(true);
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
      className: "vehicle-column-separator",
      render: (_: any, record: any) => (
        <div>
          <div>{record?.expand?.vehicle_id?.model_name ?? "-"}</div>
          <div style={{ color: "#666", fontSize: "12px" }}>
            {record?.expand?.vehicle_id?.vehicle_number ?? "-"}
          </div>
        </div>
      ),
    },
    {
      title: "Expense Number",
      key: "expenseNumber",
      render: (_: any, record: any) => {
        const vehicleNumber = record?.expand?.vehicle_id?.vehicle_number ?? "-";
        const repeatInterval = record?.repeatExpense?.repeatInterval ?? "-";
        return `${vehicleNumber}-${repeatInterval}`;
      },
    },
    {
      title: "Expense Type",
      dataIndex: "expenseTypes",
      key: "expenseTypes",
      render: (text: any) => (Array.isArray(text) ? text.join(", ") : text),
    },
    {
      title: "Payment Mode",
      dataIndex: "payment_mode",
      key: "payment_mode",
    },
    {
      title: "Amount",
      dataIndex: "amount_inr",
      key: "amount_inr",
      render: (text) => `₹${Number(text).toLocaleString("hi-IN")}`,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_: any, row: any) => {
        setSelectedRow(row);
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

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    dispatch(
      getExpenses({
        ...filters,
        search: debouncedSearch ?? "",
      })
    );
  }, [debouncedSearch]);

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
      <DeleteModal
        title={"Delete Expense"}
        desc={" Are you sure you want to delete this expense?"}
        show={openDeleteModal}
        onClose={handleCloseModal}
        onDelete={handleDeleteExpense}
      />
    </>
  );
};

export default ExpenseTable;
