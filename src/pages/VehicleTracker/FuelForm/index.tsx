/* eslint-disable */
import { useState } from "react";
import { Form, Input, Select, DatePicker, Upload, Button, Drawer } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import styles from "./index.module.scss";

const { TextArea } = Input;
const { Option } = Select;

interface FuelExpenseFormData {
  date: string;
  vehicle: string;
  fuelType: string;
  quantity: number;
  amount: number;
  paidBy: string;
  receipts?: UploadFile[];
  notes?: string;
}

interface FuelExpenseFormProps {
  open: boolean;
  onClose: () => void;
}

const FuelExpenseForm = ({ open, onClose }: FuelExpenseFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: FuelExpenseFormData) => {
    try {
      setLoading(true);
      // await onSubmit(values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Add Fuel"
      placement="right"
      onClose={onClose}
      open={open}
      width={630}
      className={styles.drawer}
      closeIcon={<CloseOutlined className={styles.closeIcon} />}
      footer={
        <div className={styles.footer}>
          <Button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
            className={styles.saveButton}
          >
            Save
          </Button>
        </div>
      }
    >
      <div className={styles.subtitle}>Add an individual car fuel here</div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
      >
        <Form.Item
          label="Date"
          name="date"
          required={false}
          rules={[{ required: true, message: "Please select date" }]}
        >
          <DatePicker
            className={styles.datePicker}
            placeholder="12/12/2024"
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          label="Vehicle"
          name="vehicle"
          required={false}
          rules={[{ required: true, message: "Please select vehicle" }]}
        >
          <Select placeholder="Select Vehicle">
            <Option value="car1">Car 1</Option>
            <Option value="car2">Car 2</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Fuel Type"
          name="fuelType"
          required={false}
          rules={[{ required: true, message: "Please select fuel type" }]}
        >
          <Select placeholder="Permanent Address">
            <Option value="petrol">Petrol</Option>
            <Option value="diesel">Diesel</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Quantity (in litres)"
          name="quantity"
          required={false}
          rules={[
            { required: true, message: "Please enter quantity" },
            { type: "number", min: 0, message: "Quantity must be positive" },
          ]}
        >
          <Select placeholder="Permanent Address">
            <Option value="10">10</Option>
            <Option value="20">20</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          required={false}
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          label="Paid by"
          name="paidBy"
          required={false}
          rules={[{ required: true, message: "Please select payment method" }]}
        >
          <Select placeholder="Permanent Address">
            <Option value="card1">Card 1</Option>
            <Option value="card2">Card 2</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Receipts" name="receipts">
          <Upload.Dragger
            accept=".jpg,.png,.doc,.pdf"
            maxCount={1}
            beforeUpload={() => false}
            className={styles.uploader}
          >
            <p className={styles.uploadText}>
              <UploadOutlined className={styles.uploadIcon} />
              <span className={styles.uploadLabel}>Click to upload</span>
              <span>or drag and drop</span>
            </p>
            <p className={styles.uploadHint}>
              JPG, PNG, DOC or PDF (max. 10MB)
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item label="Notes" name="notes">
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

export default FuelExpenseForm;
