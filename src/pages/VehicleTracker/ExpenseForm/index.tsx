/* eslint-disable */

import type React from "react";
import { useState } from "react";
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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import styles from "./index.module.scss";

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

  const handleSubmit = async (values: any) => {};

  return (
    <Drawer
      title="Add Expense"
      placement="right"
      width={630}
      onClose={onClose}
      open={open}
      className={styles.expenseDrawer}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          date: dayjs(),
          isRecurring: false,
          frequency: { every: 1, period: "Day", occurrences: 30 },
        }}
      >
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker className={styles.fullWidth} />
        </Form.Item>

        <Form.Item
          label="Repeat expense"
          name="isRecurring"
          valuePropName="checked"
        >
          <Switch onChange={setIsRecurring} />
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
          name="vehicle"
          rules={[{ required: true, message: "Please select a vehicle" }]}
        >
          <Select placeholder="Select Vehicle">
            {vehicles.map((vehicle) => (
              <Option key={vehicle.id} value={vehicle.id}>
                {vehicle.name} - {vehicle.number}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Expense Type"
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

        <Form.Item
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
        </Form.Item>

        <Form.Item
          label="Payment Mode"
          name="paymentMode"
          rules={[{ required: true, message: "Please select payment mode" }]}
        >
          <Select placeholder="Select payment mode">
            <Option value="cash">Cash</Option>
            <Option value="card">Card</Option>
            <Option value="upi">UPI</Option>
            <Option value="netbanking">Net Banking</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Receipts">
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
        </Form.Item>

        <Form.Item name="sendReminder" valuePropName="checked">
          <Switch />
        </Form.Item>
        <div className={styles.reminderText}>
          Send reminder
          <div className={styles.reminderSubtext}>
            You will receive an alert for this expense at your desired interval
          </div>
        </div>

        <div className={styles.footer}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default ExpenseForm;
