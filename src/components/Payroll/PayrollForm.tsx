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

const PayrollForm: React.FC<{
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

  return (
    <Drawer
      title="Edit Driver Payment"
      placement="right"
      closable={false} // Remove the default close button
      open={open}
      width={630}
      className={styles.drawer}
      footer={
        <div className={styles.footer}>
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
            className={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            className={styles.saveButton}
          >
            Save
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
        <Form.Item label="Base Payment" name="base_payment">
          <Input placeholder="Enter the amount..." min={0} disabled />
        </Form.Item>

        <Form.Item label="Allowances" name="allownaces">
          <Input placeholder="Enter the amount..." min={0} disabled />
        </Form.Item>

        <Form.Item label="Fuel Payment" name="fuel_payment">
          <Input placeholder="Enter the amount..." min={0} />
        </Form.Item>

        <div className={styles.secondaryContainer}>
          <Form.Item name="expenses" label="Expenses">
            <Input.Group className={"custom-input-group"}>
              <Form.List name="expenses">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Form.Item
                        labelCol={{
                          style: { fontWeight: 500, fontSize: "16px" },
                        }}
                        key={index}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "expense_type"]}
                          style={{
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                            marginTop: index !== 0 ? "-20px" : "",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              gap: "20px",
                              justifyContent: "space-between",
                            }}
                          >
                            <Select
                              // options={vehicleList?.map(
                              //   (option: { model_name: any; id: string }) => ({
                              //     value: option.id,
                              //     label: option.model_name,
                              //   })
                              // )}
                              placeholder="Search vehicle"
                              fieldNames={{ label: "label", value: "value" }}
                              filterOption={false}
                              notFoundContent={<div>No search result</div>}
                              style={{ width: "100% !important" }}
                            />
                            <Button
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                              className={styles.deletePassengerButton}
                            />
                          </div>
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "amount"]}
                          label="Amount"
                          // style={{ marginTop: "16px" }}
                        >
                          <Input placeholder="Enter amount" />
                        </Form.Item>

                        <Divider />

                        {index === fields.length - 1 && (
                          <Form.Item style={{ marginBottom: "-20px" }}>
                            <Button
                              className={styles.addPassengerButton}
                              type="text"
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                            >
                              Add Expense
                            </Button>
                          </Form.Item>
                        )}
                      </Form.Item>
                    ))}
                    {fields.length === 0 && (
                      <Form.Item>
                        <div className={styles.addExpense}>
                          <div className={styles.topContainer}>
                            <RupeeIcon width={48} height={48} />
                            <div className={styles.header}>
                              <p className={styles.title}>No expenses added</p>
                              <p className={styles.desc}>
                                Add your expenses here
                              </p>
                            </div>
                          </div>
                          <SecondaryBtn
                            btnText="+ Add expense"
                            onClick={() => add()}
                          />
                        </div>
                      </Form.Item>
                    )}
                  </>
                )}
              </Form.List>
            </Input.Group>
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default PayrollForm;
