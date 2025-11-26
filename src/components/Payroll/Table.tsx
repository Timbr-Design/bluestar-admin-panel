/* eslint-disable */
import { CopyOutlined, CheckOutlined, MoreOutlined } from "@ant-design/icons";
import styles from "./Payroll.module.scss";
import { MenuProps, TableColumnsType, Avatar, Dropdown, Table } from "antd";
import CustomPagination from "../Common/Pagination";
import row from "antd/es/row";
import PayrollForm from "./PayrollForm";
import { useDispatch } from "react-redux";
import {
  setIsDailyLogsOpen,
  setIsDriverPaymentOpen,
} from "../../redux/slices/attendanceSlice";
import { useAppSelector } from "../../hooks/store";
import DailyLogsForm from "./DailyLogsForm";
import AdvancePaymentModal from "./AdvancePaymentModal";
import ConfirmPaymentModal from "./ConfirmPaymentModal";
import { useState } from "react";
import useNotification from "../DeleteNotification/useNotification";
import { ReactComponent as SuccessOutlineIcon } from "../../icons/successOutline.svg";
import { ReactComponent as CheckCircle } from "../../icons/check-circle.svg";
import { ReactComponent as ClockIcon } from "../../icons/clock-check.svg";

const RupeeIcon = () => (
  <span style={{ fontSize: "16px", marginRight: "4px" }}>₹</span>
);

const items = new Array(3).fill(null).map((_, i) => {
  const id = String(i + 1);
  return {
    label: `Tab ${id}`,
    key: id,
    children: `Content of tab ${id}`,
  };
});
const PayrollTable = () => {
  const dispatch = useDispatch();
  const { isEditDriverPaymentOpen, isDailyLogsOpen } = useAppSelector(
    (state) => state.attendance
  );
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const notify = useNotification();

  const handleConfirmPayment = (amount: number) => {
    setIsConfirmModalOpen(false);
    const isPartial = true;
    if (!isPartial) {
      notify.success(
        "Payment confirmed successfully",
        `John dutes`,
        "",
        <SuccessOutlineIcon />
      );
    } else
      notify.success(
        "Payment partially successfully",
        `John dutes`,
        "",
        <CheckCircle stroke="#DC6803" />
      );
  };

  const handleAdvancePayment = (amount: number) => {
    setIsAdvanceModalOpen(false);
    notify.success(
      "Advance Payment recorded",
      `John dutes`,
      "",
      <SuccessOutlineIcon />
    );
  };

  function ReturnItemsPayroll(row: any) {
    const items: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <div
            className={styles.popoverContainer}
            onClick={() => dispatch(setIsDriverPaymentOpen(true))}
          >
            <RupeeIcon />
            Edit Driver Payment
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div
            className={styles.popoverContainer}
            onClick={() => dispatch(setIsDailyLogsOpen(true))}
          >
            <CopyOutlined twoToneColor="#52c41a" />
            View Expense logs
          </div>
        ),
      },
      {
        key: "3",
        label: (
          <div
            className={styles.popoverContainer}
            onClick={() => setIsAdvanceModalOpen(true)}
          >
            <ClockIcon />
            Record advance payment
          </div>
        ),
      },
      {
        key: "4",
        label: (
          <div
            className={styles.popoverContainer}
            onClick={() => setIsConfirmModalOpen(true)}
          >
            <CheckOutlined twoToneColor="#52c41a" />
            Confirm payment
          </div>
        ),
      },
    ];
    return items;
  }

  const pagination = {
    total: 30,
    page: 1,
    limit: 10,
  };

  const dataSource = [
    { key: "1", name: "Olivia", age: 32, attendance: "P" },
    { key: "2", name: "Ethan", age: 40, attendance: "A" },
    { key: "1", name: "Olivia", age: 32, attendance: "P" },
    { key: "1", name: "Olivia", age: 32, attendance: "P" },
    { key: "1", name: "Olivia", age: 32, attendance: "A" },
  ];

  const columnsPayroll: TableColumnsType<any> = [
    {
      title: "Full Name",
      width: 300,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      className: "vehicle-column-separator",
      render: (value, row) => {
        return (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Avatar
              style={{
                color: "#667085",
                background: "#F2F4F7",
                border: "0.75px solid rgba(0, 0, 0, 0.08)",
              }}
            >
              {value[0]}
              {value?.length > 1 ? value[1].toUpperCase() : ""}
            </Avatar>
            {value}
          </div>
        );
      },
    },
    {
      title: "Attendence",
      width: 100,
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Base Salary",
      width: 100,
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Allowances",
      width: 100,
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Fuel",
      width: 100,
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Car wash",
      width: 100,
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Fast tags",
      width: 100,
      dataIndex: "age",
      className: "vehicle-column-separator",
      key: "age",
    },
    {
      title: "Status",
      width: 100,
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: () => (
        <Dropdown menu={{ items: ReturnItemsPayroll(row) }} trigger={["click"]}>
          <MoreOutlined />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <Table
        pagination={false}
        columns={columnsPayroll}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        bordered
        footer={() => (
          <CustomPagination
            total={pagination?.total ?? 0}
            current={pagination?.page ?? 1}
            pageSize={pagination.limit ?? 10}
            onPageChange={(page: number) => {}}
          />
        )}
      />
      <PayrollForm
        open={isEditDriverPaymentOpen}
        onClose={() => dispatch(setIsDriverPaymentOpen(false))}
      />

      <DailyLogsForm
        open={isDailyLogsOpen}
        onClose={() => dispatch(setIsDailyLogsOpen(false))}
      />

      <AdvancePaymentModal
        open={isAdvanceModalOpen}
        onCancel={() => setIsAdvanceModalOpen(false)}
        onConfirm={(amount) => handleAdvancePayment(amount)}
        driverName="na"
        month="d"
      />
      <ConfirmPaymentModal
        open={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={(amount) => handleConfirmPayment(amount)}
        driverName="na"
        month="d"
        payrollData={{
          calculated: 20,
          advance: 20,
          rollover: 20,
          effective: 20,
        }}
      />
    </>
  );
};

export default PayrollTable;
