/* eslint-disable */
import { useEffect } from "react";
import styles from "../AddNewBooking/index.module.scss";
import {
  Form,
  Input,
  Card,
  Row,
  Col,
  TimePicker,
  InputNumber,
  Select,
} from "antd";
import { SyncOutlined } from "@ant-design/icons";
import CustomizeRequiredMark from "../../Common/CustomizeRequiredMark";
import CustomDatePicker from "../../Common/CustomDatePicker";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { RootState } from "../../../types/store";
import {
  getAllDutyTypes,
  getVehicleGroup,
} from "../../../redux/slices/databaseSlice";
import { useParams } from "react-router-dom";
import {
  addNewBookingDuties,
  updateBookingDuties,
} from "../../../redux/slices/bookingDutiesSlice";

import dayjs from "dayjs";

const { TextArea } = Input;
interface AddNewDutyToBookingForm {
  initialData?: any;
  isEditable?: boolean;
  form: any;
}
const AddNewDutyToBookingForm = ({
  initialData,
  isEditable = true,
  form,
}: AddNewDutyToBookingForm) => {
  let { bookingId } = useParams();
  const { vehicleGroupSelectOption, dutyTypeOption, customersOption } =
    useAppSelector((state: RootState) => state.database);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(dutyTypeOption);
  }, [dutyTypeOption]);

  const getDutyTypeValue = (searchText: string) => {
    if (searchText) {
      dispatch(
        getAllDutyTypes({
          search: searchText,
        })
      );
    }
  };

  const getVehicleGroupValue = (searchText: string) => {
    if (searchText) {
      dispatch(
        getVehicleGroup({
          search: searchText,
        })
      );
    }
  };

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      form.setFieldsValue({
        _id: initialData?._id,
        dutyTypeId: [
          {
            label: initialData?.dutyTypeId?.name,
            value: initialData?.dutyTypeId?._id,
          },
        ],
        vehicleGroupId: [
          {
            label: initialData?.vehicleGroupId?.name,
            value: initialData?.vehicleGroupId?._id,
          },
        ],
        reportingAddress: initialData?.reportingAddress,
        duration: {
          startDateTime: initialData?.duration?.startDateTime
            ? dayjs(initialData?.duration?.startDateTime)
            : null,
          endDateTime: initialData?.duration?.endDateTime
            ? dayjs(initialData.duration.endDateTime)
            : null,

          startBefore: initialData?.duration?.startBefore
            ? dayjs(initialData.duration.startBefore)
            : null,
        },
        dropAddress: initialData?.dropAddress,
        fromLocation: initialData?.fromLocation,
        toLocation: initialData?.toLocation,
        operator_notes: initialData?.operator_notes,
        driverNotes: initialData?.driverNotes,
        address: initialData?.address,
      });
    }
  }, [initialData]);
  return (
    <Form
      layout="vertical"
      form={form}
      name="AddNewDutyToBookingForm"
      disabled={!isEditable}
      onFinishFailed={(errorInfo) => {
        console.log("Failed:", errorInfo);
      }}
      onFinish={(values) => {
        console.log(values);
        // handleFormSubmit(value);
        if (isEditable && initialData._id) {
          dispatch(updateBookingDuties({ id: initialData._id, ...values }));
        } else {
          dispatch(addNewBookingDuties({ bookingId, ...values }));
        }
      }}
      requiredMark={CustomizeRequiredMark}
      className={styles.form}
    >
      {/* dutyTypeId */}
      <Form.Item
        name="dutyTypeId"
        rules={[{ required: true }]}
        label="Duty type"
      >
        <Select
          allowClear
          showSearch
          options={dutyTypeOption}
          value={form.getFieldValue("dutyTypeId")}
          onSearch={(text) => getDutyTypeValue(text)}
          placeholder="Select Duty type"
          fieldNames={{ label: "label", value: "value" }}
          notFoundContent={<div>No search result</div>}
        />
      </Form.Item>
      {/* VehicleGroupId */}
      <Form.Item
        name="vehicleGroupId"
        id="VehicleGroupId"
        rules={[{ required: true }]}
        label="Vehicle Group"
      >
        <Select
          allowClear
          showSearch
          options={vehicleGroupSelectOption}
          onSearch={(text) => getVehicleGroupValue(text)}
          placeholder="Search drivers"
          fieldNames={{ label: "label", value: "value" }}
          notFoundContent={<div>No search result</div>}
        ></Select>
      </Form.Item>
      {/* from and to */}
      <Row gutter={12}>
        <Col sm={12}>
          {/* from */}
          <Form.Item
            rules={[
              { required: true, message: "Please provide a Google Maps link!" },
              {
                pattern:
                  /^(https:\/\/(www\.)?google\.(com|[a-z]{2})\/maps\/.+|https:\/\/maps\.app\.goo\.gl\/.+)/,
                message: "Please enter a valid Google Maps URL!",
              },
            ]}
            name="fromLocation"
            label="from Address"
          >
            <Input type="text" placeholder="Location (Google map link)"></Input>
          </Form.Item>
        </Col>
        <Col sm={12}>
          {/* to */}
          <Form.Item
            name="toLocation"
            rules={[
              { required: true, message: "Please provide a Google Maps link!" },
              {
                pattern:
                  /^(https:\/\/(www\.)?google\.(com|[a-z]{2})\/maps\/.+|https:\/\/maps\.app\.goo\.gl\/.+)/,
                message: "Please enter a valid Google Maps URL!",
              },
            ]}
            label="to Address"
          >
            <Input type="text" placeholder="Location (Google map link)"></Input>
          </Form.Item>
        </Col>
      </Row>
      {/* reportingAddress */}
      <Form.Item
        rules={[
          { required: true, message: "Please provide a Google Maps link!" },
          {
            pattern:
              /^(https:\/\/(www\.)?google\.(com|[a-z]{2})\/maps\/.+|https:\/\/maps\.app\.goo\.gl\/.+)/,
            message: "Please enter a valid Google Maps URL!",
          },
        ]}
        name="reportingAddress"
        label="Reporting Address"
      >
        <TextArea placeholder="Location (Google map link)"></TextArea>
      </Form.Item>
      {/* dropAddress */}
      <Form.Item
        name="dropAddress"
        rules={[
          { required: true, message: "Please provide a Google Maps link!" },
          {
            pattern:
              /^(https:\/\/(www\.)?google\.(com|[a-z]{2})\/maps\/.+|https:\/\/maps\.app\.goo\.gl\/.+)/,
            message: "Please enter a valid Google Maps URL!",
          },
        ]}
        label="Drop Address"
      >
        <TextArea placeholder="Location (Google map link)"></TextArea>
      </Form.Item>

      {/* Duration Details */}
      <Card className={styles.durationDetailsCard}>
        <b>Duration Details </b>
        <Form.Item name="duration">
          <Input.Group>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name={["duration", "startDateTime"]}
                  label="Start Date"
                >
                  <CustomDatePicker
                    showHour={true}
                    showMinute={true}
                    showTime={true}
                    format="DD-MM-YYYY HH:mm"
                    use12Hours
                    onChange={form.onChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name={["duration", "endDateTime"]}
                  label="End Date"
                >
                  <CustomDatePicker
                    showHour={true}
                    showMinute={true}
                    showTime={true}
                    use12Hours
                    format="DD-MM-YYYY"
                    onChange={form.onChange}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name={["duration", "startBefore"]}
                  label="Start from garage before (in mins)"
                >
                  <TimePicker
                    format="mm"
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Input.Group>
        </Form.Item>
      </Card>
      {/* Pricing Details */}
      <Card className={styles.pricingDetailsCard}>
        <div className={styles.pricingDetails}>
          <b>Pricing Details</b>
          <span>
            <SyncOutlined />
            Fetch from Contract
          </span>
        </div>
        <div>
          <Input.Group>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name={["pricingDetails", "baseRate"]}
                  label="Base Rate"
                  rules={[
                    {
                      required: true,
                      type: "number",
                    },
                  ]}
                >
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                    min={0}
                    placeholder="Prefilled based on Duty Type"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={["pricingDetails", "extraKmRate"]}
                  label="Per Extra KM Rate"
                  rules={[
                    {
                      required: true,
                      type: "number",
                    },
                  ]}
                >
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                    min={0}
                    placeholder="Per Extra KM Rate"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      type: "number",
                    },
                  ]}
                  name={["pricingDetails", "extraHrRate"]}
                  label="Per Extra Hour Rate"
                >
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                    min={0}
                    placeholder="Per Extra Hour Rate"
                  />
                </Form.Item>
              </Col>

              {/* <Col span={24}>
                <Form.Item label="Bill to">
                  <Select
                    placeholder="Company/Customer (Default)"
                    style={{ width: "100%" }}
                    onChange={() => {}}
                    options={[
                      { value: "jack", label: "Jack" },
                      { value: "lucy", label: "Lucy" },
                      { value: "Yiminghe", label: "yiminghe" },
                      { value: "disabled", label: "Disabled", disabled: true },
                    ]}
                  />
                </Form.Item>
              </Col> */}
            </Row>
          </Input.Group>
        </div>
      </Card>

      {/* operator_notes driverNotes */}
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        <Form.Item name="operator_notes" label="Operator Notes">
          <TextArea placeholder="Add a note...."></TextArea>
        </Form.Item>
        <Form.Item name="driverNotes" label="Driver Notes">
          <TextArea placeholder="Add a note...."></TextArea>
        </Form.Item>
      </div>
    </Form>
  );
};

export default AddNewDutyToBookingForm;
