/* eslint-disable */

import type React from "react";
import { useEffect, useState } from "react";
import {
  Drawer,
  Form,
  DatePicker,
  Switch,
  InputNumber,
  Select,
  Upload,
  Button,
  Space,
  message,
  Checkbox,
  Input,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import { ReactComponent as CrossIcon } from "../../icons/x.svg";
import { DeleteOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons";

import { ReactComponent as RupeeIcon } from "../../icons/rupeeIcon.svg";
import styles from "./Payroll.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import PrimaryBtn from "../PrimaryBtn";
import SecondaryBtn from "../SecondaryBtn";

interface ExpenseItem {
  date: string;
  [key: string]: string | number;
}

const DailyLogsForm: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isReminder, setIsReminder] = useState(false);

  const { selectedExpense } = useAppSelector((state) => state.expenses);
  const { vehicleList } = useAppSelector((state) => state.database);
  const dispatch = useAppDispatch();

  const expenseList: ExpenseItem[] = [
    {
      date: "July 1, 2024",
      Allowances: 6380,
      Fuel: 345,
      "Past payment rollover": 500,
    },
    {
      date: "July 2, 2024",
      Allowances: 6380,
      "Fast tags": 123,
      Challan: 231,
    },
    {
      date: "July 5, 2024",
      Allowances: 6380,
    },
  ];

  const groupByDate = (list: ExpenseItem[]) => {
    const grouped: Record<string, ExpenseItem[]> = {};
    list.forEach((item) => {
      if (!grouped[item.date]) grouped[item.date] = [];
      grouped[item.date].push(item);
    });
    return grouped;
  };

  const handleAddExpense = () => {
    // if (!useThisPassenger) {
    //   const booked_by_name = form.getFieldValue("booked_by_name") || [];
    //   const booked_by_number = form.getFieldValue("booked_by_number") || [];
    //   // Set the new passenger array with the new data
    //   form.setFieldsValue({
    //     passenger: [
    //       {
    //         name: booked_by_name,
    //         phoneNo: booked_by_number,
    //       },
    //     ],
    //   });
    // } else {
    //   form.setFieldsValue({
    //     passenger: [],
    //   });
    // }
    // setUseThisPassenger(!useThisPassenger);
  };

  //   useEffect(() => {
  //     if (selectedExpense && Object.keys(selectedExpense).length) {
  //       dispatch(setOpenExpenseForm(true));
  //       setReceiptDoc(selectedExpense?.reciept || []);
  //       form.setFieldsValue({
  //         amount_inr: selectedExpense.amount_inr,
  //         transaction_date: dayjs(selectedExpense.transaction_date),
  //         expenseTypes: selectedExpense.expenseTypes,
  //         is_approved: selectedExpense.is_approved,
  //         driver_notes: selectedExpense.driver_notes,
  //         payment_mode: selectedExpense.payment_mode,
  //         repeatExpense: selectedExpense.repeatExpense,
  //         vehicle_id: selectedExpense.vehicle_id,
  //         reciept: selectedExpense.reciept,
  //         send_reminder: selectedExpense.send_reminder,
  //       });
  //     } else {
  //       form.resetFields();
  //     }
  //   }, [selectedExpense]);

  const handleSave = (values: any) => {};
  const groupedData = groupByDate(expenseList);

  return (
    <Drawer
      title="Daily Logs"
      placement="right"
      closable={false} // Remove the default close button
      open={open}
      width={630}
      className={styles.drawer}
      footer={
        <div className={styles.footer}>
          <Button
            type="primary"
            onClick={() => {
              form.resetFields();
              onClose();
            }}
            className={styles.saveButton}
          >
            Close
          </Button>
        </div>
      }
    >
      <button
        className={styles.closeBtn}
        onClick={() => {
          form.resetFields();
          onClose();
        }}
      >
        <CrossIcon />
      </button>
      <div className={styles.subtitle}>Add an individual car fuel here</div>

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          const valuesToSend = {
            ...values,
            transaction_date: dayjs(values.transaction_date).format(
              "YYYY-MM-DD"
            ),
          };
          handleSave(valuesToSend);
        }}
        className={styles.form}
      >
        {Object.entries(groupedData).map(([date, items]) => (
          <div key={date} className={styles.expenseDateGroup}>
            <h3 className={styles.expenseDate}>{date}</h3>
            {items?.map((item, idx) => (
              <div key={idx} className={styles.expenseCard}>
                {Object.entries(item)
                  .filter(([key]) => key !== "date")
                  .map(([key, value]) => (
                    <div key={key} className={styles.expenseRow}>
                      <span className={styles.expenseType}>{key}</span>
                      <span className={styles.expenseAmount}>{value}</span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
        {/* {expenseList.map((item) => {
          return (
            <Form.Item label={item.date}>
              <div className={styles.expenseLogs}>
                {item.map((li)=>{
                    return 
                })}
              </div>
            </Form.Item>
          );
        })} */}
      </Form>
    </Drawer>
  );
};

export default DailyLogsForm;
