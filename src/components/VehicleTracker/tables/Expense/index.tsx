import { useAppDispatch, useAppSelector } from "../../../../hooks/store";
import { Dropdown, Space, Table } from "antd";
import { ReactComponent as DeleteIconRed } from "../../../../icons/trash-red.svg";
import { ReactComponent as Edit02 } from "../../../../icons/edit-02.svg";
import { ReactComponent as Eye } from "../../../../icons/eye.svg";
import { ReactComponent as Trash01 } from "../../../../icons/trash-01.svg";
import { MoreOutlined } from "@ant-design/icons";
import type { MenuProps, TableColumnsType } from "antd";
import Modal from "../../../Modal";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

import CustomPagination from "../../../Common/Pagination";
import { getExpenses } from "../../../../redux/slices/vehicleTrackerSlice";

interface IExpenseTable {
  handleOpenSidePanel: () => void;
}

const ExpenseTable = ({ handleOpenSidePanel }: IExpenseTable) => {
  const { expenses, filters, pagination, vehicleTrackerState } = useAppSelector(
    (state) => state.vehicleTracker
  );
  const dispatch = useAppDispatch();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(
      getExpenses({
        search: filters.search,
        page: pagination.page || 1,
        limit: pagination.limit || 10,
      })
    );
  }, [filters.search, pagination.page]);

  const returnItems = (row: any): MenuProps["items"] => [
    {
      key: "1",
      label: (
        <div onClick={(e) => e.stopPropagation()}>
          <Space align="center">
            <Edit02 />
            <p>Edit Expenses</p>
          </Space>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "2",
      label: (
        <div onClick={(e) => e.stopPropagation()}>
          <Space>
            <Eye />
            See all car related expense
          </Space>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "4",
      label: (
        <div style={{ color: "#F04438" }} onClick={(e) => e.stopPropagation()}>
          <Space>
            <Trash01 />
            Delete Expenses
          </Space>
        </div>
      ),
    },
  ];

  const columns: TableColumnsType<any> = [
    {
      title: "Vehicle Name and Number",
      key: "vehicleNameAndNumber",
      className: styles.headerfont,
      render: (_: any, row: any) => (
        <div className={styles.vehicleNameNumber}>
          <div>{row.vehicleName}</div>
          <div>{row.vehicleNumber}</div>
        </div>
      ),
    },
    {
      title: "Expense Number",
      dataIndex: "expenseNumber",
      key: "expenseNumber",
      className: styles.headerfont,
    },
    {
      title: "Expense Type",
      dataIndex: "expenseType",
      key: "expenseType",
      className: styles.headerfont,
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
      className: styles.headerfont,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text: any) => `₹${text}`,
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
            <MoreOutlined className={styles.ellipsis} />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        bordered
        onRow={(record) => ({ onClick: () => {} })}
        columns={columns}
        dataSource={expenses}
        loading={vehicleTrackerState?.loading}
        pagination={false}
        className={styles.contentfont}
        scroll={{ x: 756 }}
        footer={() => (
          <CustomPagination
            total={pagination?.total ?? 0}
            current={pagination?.page ?? 1}
            pageSize={pagination.limit ?? 10}
            onPageChange={(page: number) => {
              dispatch(getExpenses({ search: filters.search, page, limit: pagination.limit ?? 10 }));
            }}
          />
        )}
      />

      <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <div className={styles.deleteContainer}>
          <DeleteIconRed />
        </div>
        <div className={styles.modalContainer}>
          <div className={styles.textContainer}>
            <div className={styles.primaryText}>Delete expense</div>
            <div className={styles.secondaryText}>
              Are you sure you want to delete this expense?
              <div className={styles.selectedSecondaryText}>Delete expense</div>
            </div>
          </div>
          <div className={styles.bottomBtns}>
            <button className={styles.cancelBtn} onClick={() => setOpenDeleteModal(false)}>
              Cancel
            </button>
            <button className={styles.deleteBtn} onClick={() => setOpenDeleteModal(false)}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExpenseTable;
