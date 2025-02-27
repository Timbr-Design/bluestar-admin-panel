/* eslint-disable */
import { Fragment, useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Upload, Button, Drawer } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ReactComponent as CrossIcon } from "../../../icons/x.svg";
import UploadComponent from "../../../components/Upload";
import { IFile } from "../../../constants/database";
import { useAppSelector, useAppDispatch } from "../../../hooks/store";
import { RootState } from "../../../types/store";
import { getDrivers, getVehicle } from "../../../redux/slices/databaseSlice";
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
  const [receiptDoc, setReceiptDoc] = useState<IFile>();
  const dispatch = useAppDispatch();

  const {
    driverOption: options,
    vehicleList,
    selectedVehicle,
    viewContentDatabase,
    vehicleGroupData,
  } = useAppSelector((state: RootState) => state.database);

  const handleReceiptDoc = (file: IFile) => {
    setReceiptDoc(file);
  };

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

  useEffect(() => {
    dispatch(getVehicle({ page: 1, limit: "10" }));
    dispatch(
      getDrivers({
        page: "1",
        limit: "10",
        search: "",
      })
    );
  }, []);

  const getPanelValue = (searchText: string) => {
    if (searchText) {
      dispatch(
        getDrivers({
          search: searchText,
        })
      );
    }
  };

  return (
    <Drawer
      title="Add Fuel"
      placement="right"
      closable={false} // Remove the default close button
      open={open}
      width={630}
      className={styles.drawer}
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
      <button className={styles.closeBtn} onClick={onClose}>
        <CrossIcon />
      </button>
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
          required
          rules={[{ required: true, message: "Please select vehicle" }]}
        >
          <Select
            showSearch
            allowClear
            options={vehicleList?.data?.map(
              (option: { value: any; label: any }) => ({
                value: option.value,
                label: option.label,
              })
            )}
            onSearch={(text) => getPanelValue(text)}
            placeholder="Search vehicle"
            fieldNames={{ label: "label", value: "value" }}
            filterOption={false}
            notFoundContent={<div>No search result</div>}
          />
        </Form.Item>

        <Form.Item
          label="Fuel Type"
          name="fuelType"
          required
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
          required
          rules={[{ required: true, message: "Please enter quantity" }]}
        >
          <Input placeholder="Enter the fuel quantity" type="number" min={0} />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          required
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <Input placeholder="Enter the amount..." min={0} />
        </Form.Item>

        <Form.Item
          label="Paid by"
          name="driverId"
          id="driverId"
          required
          rules={[{ required: true, message: "Please select payment method" }]}
        >
          <Select
            showSearch
            allowClear
            options={options?.map((option: { value: any; label: any }) => ({
              value: option.value,
              label: option.label,
            }))}
            onSearch={(text) => getPanelValue(text)}
            placeholder="Search drivers"
            fieldNames={{ label: "label", value: "value" }}
            filterOption={false}
            notFoundContent={<div>No search result</div>}
          />
        </Form.Item>

        <UploadComponent
          handleUploadUrl={handleReceiptDoc}
          isMultiple={false}
        />

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
