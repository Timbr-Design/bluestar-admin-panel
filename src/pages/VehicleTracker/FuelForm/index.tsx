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
import {
  addNewFuel,
  setOpenFuelForm,
  updateFuel,
} from "../../../redux/slices/FuelSlice";
import dayjs from "dayjs";
import CustomDatePicker from "../../../components/Common/CustomDatePicker";

const { TextArea } = Input;
const { Option } = Select;

interface FuelExpenseFormProps {
  open: boolean;
  onClose: () => void;
}

const FuelExpenseForm = ({ open, onClose }: FuelExpenseFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [receiptDoc, setReceiptDoc] = useState<IFile | null>();
  const dispatch = useAppDispatch();

  const { driverList, vehicleList } = useAppSelector((state) => state.database);
  const { selectedFuel } = useAppSelector((state) => state.fuels);

  const handleReceiptDoc = (file: IFile) => {
    setReceiptDoc(file);
  };

  const handleSubmit = async (values: any) => {
    if (selectedFuel) {
      dispatch(updateFuel({ payload: values, id: selectedFuel.id }));
    } else {
      dispatch(addNewFuel(values));
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

  useEffect(() => {
    if (selectedFuel && Object.keys(selectedFuel).length) {
      dispatch(setOpenFuelForm(true));
      setReceiptDoc(selectedFuel?.receipt);
      form.setFieldsValue({
        amount_inr: selectedFuel.amount_inr,
        transaction_date: dayjs(selectedFuel.transaction_date),
        driver_id: selectedFuel.driver_id,
        fuel_type: selectedFuel.fuel_type,
        driver_notes: selectedFuel.driver_notes,
        quantity_ltr: selectedFuel.quantity_ltr,
        vehicle_id: selectedFuel?.vehicle_id,
      });
    } else {
      form.resetFields();
    }
  }, [selectedFuel]);

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
        onFinish={(values) => {
          const valuesToSend = {
            ...values,
            transaction_date: dayjs(values.transaction_date).format(
              "YYYY-MM-DD"
            ),
          };
          handleSubmit(valuesToSend);
        }}
        className={styles.form}
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
          label="Vehicle"
          name="vehicle_id"
          required
          rules={[{ required: true, message: "Please select vehicle" }]}
        >
          <Select
            showSearch
            allowClear
            options={vehicleList?.map(
              (option: { model_name: any; id: string }) => ({
                value: option.id,
                label: option.model_name,
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
          name="fuel_type"
          required
          rules={[{ required: true, message: "Please select fuel type" }]}
        >
          <Select placeholder="Permanent Address">
            <Option value="Petrol">Petrol</Option>
            <Option value="Diesel">Diesel</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Quantity (in litres)"
          name="quantity_ltr"
          required
          rules={[{ required: true, message: "Please enter quantity" }]}
        >
          <Input placeholder="Enter the fuel quantity" type="number" min={0} />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount_inr"
          required
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <Input placeholder="Enter the amount..." min={0} />
        </Form.Item>

        <Form.Item
          label="Paid by"
          name="driver_id"
          id="driver_id"
          required
          rules={[{ required: true, message: "Please select payment method" }]}
        >
          <Select
            showSearch
            allowClear
            options={driverList?.map((option: { id: any; name: any }) => ({
              value: option.id,
              label: option.name,
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

export default FuelExpenseForm;
