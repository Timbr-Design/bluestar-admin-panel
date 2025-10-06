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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import styles1 from "./index.module.scss";
import styles from "../FuelForm/index.module.scss";
import UploadComponent from "../../../components/Upload";
import { IFile } from "../../../constants/database";
import TextArea from "antd/es/input/TextArea";
import {
  addNewExpense,
  setOpenExpenseForm,
  updateExpense,
} from "../../../redux/slices/expenseSlice";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { IExpense } from "../../../interface/expense";
import CustomDatePicker from "../../../components/Common/CustomDatePicker";

const { Option } = Select;

// Mock data - replace with actual API data
const vehicles = [
  { id: "RJ90AB8264", name: "Jeep Compass", number: "RJ90AB8264" },
  { id: "MP90AB8264", name: "Maruti Swift", number: "MP90AB8264" },
  // ... other vehicles
];

const expenseTypes = [
  "Battery",
  "Suspension",
  "Air Conditioning",
  "Servicing",
  "Servicing Labour",
].map((name) => ({
  id: name.toLowerCase(),
  name,
}));

const ExpenseForm: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [receiptDoc, setReceiptDoc] = useState<IFile | []>();
  const [isReminder, setIsReminder] = useState(false);

  const { selectedExpense } = useAppSelector((state) => state.expenses);
  const { vehicleList } = useAppSelector((state) => state.database);
  const dispatch = useAppDispatch();

  const handleReceiptDoc = (file: IFile) => {
    setReceiptDoc(file);
  };

  useEffect(() => {
    if (selectedExpense && Object.keys(selectedExpense).length) {
      dispatch(setOpenExpenseForm(true));
      setReceiptDoc(selectedExpense?.reciept || []);
      form.setFieldsValue({
        amount_inr: selectedExpense.amount_inr,
        transaction_date: dayjs(selectedExpense.transaction_date),
        expenseTypes: selectedExpense.expenseTypes,
        is_approved: selectedExpense.is_approved,
        driver_notes: selectedExpense.driver_notes,
        payment_mode: selectedExpense.payment_mode,
        repeatExpense: selectedExpense.repeatExpense,
        vehicle_id: selectedExpense.vehicle_id,
        reciept: selectedExpense.reciept,
        send_reminder: selectedExpense.send_reminder,
      });
    } else {
      form.resetFields();
    }
  }, [selectedExpense]);

  const handleSave = (values: any) => {
    if (selectedExpense) {
      dispatch(updateExpense({ payload: values, id: selectedExpense.id }));
    } else {
      dispatch(addNewExpense(values));
    }
  };

  return (
    <Drawer
      title="Add Expense"
      placement="right"
      width={630}
      onClose={onClose}
      open={open}
      className={styles.drawer}
      footer={
        <div className={styles.footer}>
          <Button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            // loading={loading}
            className={styles.saveButton}
          >
            Save
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          const updatedValues = {
            ...values,
            transaction_date: dayjs(values.transaction_date).format(
              "YYYY-MM-DD"
            ),
          };
          handleSave(updatedValues);
        }}
        initialValues={{
          transaction_date: dayjs(),
          isRecurring: false,
          frequency: { every: 1, period: "Day", occurrences: 30 },
        }}
      >
        <Form.Item
          label="Date"
          name="transaction_date"
          required={false}
          rules={[{ required: true, message: "Please select date" }]}
        >
          <CustomDatePicker
            showHour={false}
            showMinute={false}
            showTime={false}
            format="DD-MM-YYYY"
          />
        </Form.Item>

        <Form.Item
          label="Repeat expense"
          name="isRecurring"
          valuePropName="checked"
        >
          <Checkbox
            value={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          >
            Repeat expense
          </Checkbox>
        </Form.Item>

        {isRecurring && (
          <div className={styles.recurringSection}>
            <Space align="baseline">
              <Form.Item label="Every" name={["frequency", "every"]}>
                <InputNumber min={1} />
              </Form.Item>

              <Form.Item name={["frequency", "period"]}>
                <Select style={{ width: 120 }}>
                  <Option value="Day">Day</Option>
                  <Option value="Week">Week</Option>
                  <Option value="Month">Month</Option>
                  <Option value="Year">Year</Option>
                </Select>
              </Form.Item>
            </Space>

            <Space align="baseline">
              <Form.Item label="Ends after" name={["frequency", "occurrences"]}>
                <InputNumber min={1} />
              </Form.Item>
              <span>Occurrences</span>
            </Space>

            <Form.Item label="On" name={["frequency", "endDate"]}>
              <DatePicker className={styles.fullWidth} />
            </Form.Item>
          </div>
        )}

        <Form.Item
          label="Vehicle"
          name="vehicle_id"
          rules={[{ required: true, message: "Please select a vehicle" }]}
        >
          <Select placeholder="Select Vehicle">
            {vehicleList?.map((vehicle) => (
              <Option key={vehicle.id} value={vehicle.id}>
                {vehicle.model_name} - {vehicle.vehicle_number}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Expense Description"
          name="expenseTypes"
          rules={[{ required: true, message: "Please select expense type(s)" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select Multiple"
            className={styles.fullWidth}
          >
            {expenseTypes.map((type) => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <InputNumber
            className={styles.fullWidth}
            formatter={(value) =>
              `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/₹\s?|(,*)/g, "")}
          />
        </Form.Item> */}

        <Form.Item
          label="Amount"
          name="amount_inr"
          required
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <Input placeholder="Enter the amount..." min={0} />
        </Form.Item>

        <Form.Item
          label="Payment Mode"
          name="payment_mode"
          rules={[{ required: true, message: "Please select payment mode" }]}
        >
          <Select placeholder="Select payment mode">
            <Option value="Cash">Cash</Option>
            <Option value="Card">Card</Option>
            <Option value="UPI">UPI</Option>
            <Option value="Net Banking">Net Banking</Option>
          </Select>
        </Form.Item>

        {/* <Form.Item label="Receipts">
          <Upload
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
          <div className={styles.uploadHint}>
            JPG, PNG, DOC or PDF (max. 10MB)
          </div>
        </Form.Item> */}
        <Form.Item name="reciept" label="Receipts" valuePropName="upload">
          <UploadComponent
            handleUploadUrl={handleReceiptDoc}
            isMultiple={false}
          />
        </Form.Item>

        <Form.Item name="send_reminder" valuePropName="checked">
          <div className={styles1.reminderContainer}>
            <div className={styles1.reminderText}>
              Send reminder
              <Switch
                value={isReminder}
                onChange={(e) => setIsReminder(!isReminder)}
              />
            </div>

            <div className={styles1.reminderSubtext}>
              You will receive an alert for this expense at your desired
              interval
            </div>
            {isReminder && (
              <div className={styles.recurringSection}>
                <div>Every</div>
                <InputNumber min={1} />
                <Select defaultValue={"Kilometeres"} style={{ width: 120 }}>
                  <Option value="Kilometeres">Kilometeres</Option>
                  <Option value="Week">Week</Option>
                  <Option value="Month">Month</Option>
                  <Option value="Year">Year</Option>
                </Select>
              </div>
            )}
          </div>
        </Form.Item>

        <Form.Item label="Notes" name="driver_notes">
          <TextArea
            placeholder="Add a note...."
            rows={4}
            className={styles.textarea}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ExpenseForm;
