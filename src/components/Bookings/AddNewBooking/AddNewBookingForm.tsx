/* eslint-disable */
import { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./index.module.scss";
import {
  Form,
  Input,
  Switch,
  Space,
  Card,
  Radio,
  Button,
  Select,
  Checkbox,
  Row,
  Col,
  TimePicker,
  InputNumber,
} from "antd";
import { DeleteOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons";
import CustomizeRequiredMark from "../../Common/CustomizeRequiredMark";
import CustomDatePicker from "../../Common/CustomDatePicker";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { RootState } from "../../../types/store";
import {
  getAllDutyTypes,
  getCustomer,
  getVehicleGroup,
} from "../../../redux/slices/databaseSlice";
import {
  addNewBooking,
  updateBooking,
} from "../../../redux/slices/bookingSlice";
import dayjs from "dayjs";

const { TextArea } = Input;
interface AddNewBookingForm {
  initialData?: any;
  isEditable?: boolean;
  form: any;
}
const AddNewBookingForm = ({
  initialData,
  isEditable = true,
  form,
}: AddNewBookingForm) => {
  const { dutyTypeList, customersOption, vehicleGroupData } = useAppSelector(
    (state: RootState) => state.database
  );
  const dispatch = useAppDispatch();

  const getDutyTypeValue = (searchText: string) => {
    if (searchText) {
      dispatch(
        getAllDutyTypes({
          search: searchText,
        })
      );
    }
  };
  const getCustomerList = (searchText: string) => {
    if (searchText) {
      dispatch(
        getCustomer({
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
  const [useThisPassenger, setUseThisPassenger] = useState<boolean>(false);

  const randomCustomBookingId = useMemo(() => {
    return Math.floor(100000 + Math.random() * 900000);
  }, []);

  useEffect(() => {
    dispatch(
      getCustomer({
        page: "1",
        limit: "10",
        search: "",
      })
    );

    dispatch(
      getAllDutyTypes({
        page: "1",
        limit: "10",
        search: "",
      })
    );

    dispatch(
      getVehicleGroup({
        page: "1",
        limit: "10",
        search: "",
      })
    );
  }, []);

  useEffect(() => {
    if (Object.keys(initialData).length) {
      form.setFieldsValue({
        _id: initialData?._id,
        bookingId: initialData?.bookingId,
        bookingType: initialData?.bookingType,
        customerId: [
          {
            label: initialData?.customerId?.name,
            value: initialData?.customerId?._id,
          },
        ],
        bookedBy: initialData?.bookedBy,
        passengers: initialData?.passengers,
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
        assignAlternateVehicles: initialData?.assignAlternateVehicles,
        reportingAddress: initialData?.reportingAddress,
        dropAddress: initialData?.dropAddress,
        isAirportBooking: initialData?.isAirportBooking,
        duration: {
          startTime: initialData?.duration?.startTime
            ? dayjs(initialData?.duration?.startTime)
            : null,
          endTime: initialData?.duration?.endTime
            ? dayjs(initialData.duration.endTime)
            : null,

          startBefore: initialData?.duration?.startBefore
            ? dayjs(initialData.duration.startBefore)
            : null,
        },
        operatorNotes: initialData?.operatorNotes,
        driverNotes: initialData?.driverNotes,
        isUnconfirmed: initialData?.isUnconfirmed,
        isDeleted: initialData?.isDeleted,
        bookingStatus: initialData?.bookingStatus,
        address: initialData?.address,
      });
    } else {
      form.setFieldsValue({ bookingId: randomCustomBookingId });
    }
  }, [initialData, randomCustomBookingId]);

  const handleToggle = (checked: boolean) => {
    if (!useThisPassenger) {
      const bookedBy = form.getFieldValue("bookedBy") || [];

      // Set the new passengers array with the new data
      form.setFieldsValue({
        passengers: [
          {
            name: bookedBy.name,
            phoneNo: bookedBy.phoneNo,
          },
        ],
      });
    } else {
      form.setFieldsValue({
        passengers: [],
      });
    }
    setUseThisPassenger(!useThisPassenger);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      name="control-hooks"
      disabled={isEditable}
      onFinishFailed={(errorInfo) => {
        console.log("Failed:", errorInfo);
      }}
      onFinish={(values) => {
        if (isEditable && initialData._id) {
          dispatch(updateBooking({ id: initialData._id, ...values }));
        } else {
          dispatch(addNewBooking(values));
        }
      }}
      requiredMark={CustomizeRequiredMark}
      className={styles.form}
    >
      <Form.Item
        name="bookingId"
        label="Booking ID"
        rules={[{ required: true }]}
      >
        <Input type="text" disabled />
      </Form.Item>
      <Form.Item
        name={"customerId"}
        rules={[{ required: true, message: "Please select Customer" }]}
        label="Customer"
        style={{ marginTop: "12px" }}
      >
        <Select
          placeholder="Select customer"
          allowClear
          showSearch
          options={customersOption?.map(
            (option: { value: any; label: any }) => ({
              value: option.value,
              label: option.label,
            })
          )}
          onSearch={(text) => getCustomerList(text)}
          fieldNames={{ label: "label", value: "value" }}
          filterOption={false}
          notFoundContent={<div>No search result</div>}
        />
      </Form.Item>

      <Card className={styles.BookedByCardContainer}>
        <Form.Item
          name="bookedBy"
          id="bookedBy"
          label="Booked By"
          className={styles.secondaryContainer}
        >
          <Input.Group>
            <Form.Item
              name={["bookedBy", "name"]}
              label="Booked by name"
              style={{ marginTop: "12px" }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["bookedBy", "phoneNo"]}
              label="Phone Number"
              rules={[
                { required: false },
                {
                  pattern: /^(\+91)?[6-9][0-9]{9}$/,
                  message: "Please enter a valid Indian phone number",
                },
              ]}
              style={{ marginTop: "12px" }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["bookedBy", "email"]}
              label="Email"
              rules={[{ required: false, type: "email" }]}
              style={{ marginTop: "12px" }}
            >
              <Input type="email" />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <div className={styles[`passenger-switch`]}>
          <Switch
            checked={useThisPassenger}
            onChange={handleToggle}
            size="small"
          />
          <span className={styles["passenger-switch__label"]}>
            Use the same details for passenger
          </span>
        </div>
      </Card>
      {/*  passenger detail */}
      <Card className={styles.PassengerCardContainer}>
        <p>Passenger Details</p>
        <Form.List name="passengers">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Card key={key} className={styles.PassengerCard}>
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    label="Passenger name"
                  >
                    <Input placeholder="Passenger name" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "phoneNo"]}
                    rules={[
                      { required: false },
                      {
                        pattern: /^(\+91)?[6-9][0-9]{9}$/,
                        message: "Please enter a valid Indian phone number",
                      },
                    ]}
                    label="Passenger phone number"
                    style={{ marginTop: "16px" }}
                  >
                    <Input placeholder="Passenger phone number" />
                  </Form.Item>

                  {fields.length > 1 && (
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                      className={styles.deletePassengerButton}
                    />
                  )}
                </Card>
              ))}

              <Form.Item>
                <Button
                  className={styles.addPassengerButton}
                  type="text"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Add Passenger
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>
      <Form.Item
        name="dutyTypeId"
        rules={[{ required: true }]}
        label="Duty type"
      >
        <Select
          allowClear
          showSearch
          options={dutyTypeList?.data?.map(
            (option: { _id: string; dutyTypeName: string }) => ({
              value: option._id,
              label: option.dutyTypeName,
            })
          )}
          onSearch={(text) => getDutyTypeValue(text)}
          placeholder="Select Duty type"
          fieldNames={{ label: "label", value: "value" }}
          notFoundContent={<div>No search result</div>}
        />
      </Form.Item>
      <Form.Item
        name="vehicleGroupId"
        rules={[{ required: true }]}
        label="Vehicle Group"
        style={{ paddingTop: "16px" }}
      >
        <Select
          allowClear
          showSearch
          options={vehicleGroupData?.data?.map(
            (option: { _id: string; name: string }) => ({
              value: option._id,
              label: option.name,
            })
          )}
          onSearch={(text) => getVehicleGroupValue(text)}
          placeholder="Search vehicle group"
          fieldNames={{ label: "label", value: "value" }}
          notFoundContent={<div>No search result</div>}
        ></Select>
      </Form.Item>

      <Form.Item valuePropName="checked" name="assignAlternateVehicles">
        <Card
          style={{
            margin: "1rem 0rem",
          }}
        >
          <Checkbox>
            <p>Assign Alternate Vehicle Numbers for multiple duties per day </p>
            <p>
              Alternate vehicle numbers will only show on generated duty slips
            </p>
          </Checkbox>
        </Card>
      </Form.Item>

      <Space></Space>

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
        style={{ paddingTop: "16px" }}
      >
        <TextArea placeholder="Location (Google map link)"></TextArea>
      </Form.Item>
      <Form.Item
        style={{
          margin: "1rem 0rem",
        }}
        label="Booking type"
      >
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please select booking type",
            },
          ]}
          name="bookingType"
        >
          <Radio.Group className={styles.bookingType}>
            <Radio className={styles.item} value={"Local"}>
              <b>Local booking</b>
              <p>Local rates would apply</p>
            </Radio>
            <Radio className={styles.item} value={"Outstation"}>
              <b>Outstation booking</b>
              <p>Outstation rates would apply</p>
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Form.Item>
      <Form.Item name="isAirportBooking" valuePropName="checked">
        <Checkbox>This is an airport booking</Checkbox>
      </Form.Item>

      <Card className={styles.durationDetailsCard}>
        <b>Duration Details </b>
        <Input.Group>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                name={["duration", "startTime"]}
                label="Start Date"
              >
                <CustomDatePicker
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  showHour={true}
                  showMinute={true}
                  showTime={true}
                  format="DD-MM-YYYY hh:mm A"
                  use12Hours
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
                name={["duration", "endTime"]}
                label="End Date"
              >
                <CustomDatePicker
                  showHour={true}
                  showMinute={true}
                  showTime={true}
                  use12Hours
                  disabledDate={(current) => {
                    // Get the start time from form values
                    const startTime = form.getFieldValue([
                      "duration",
                      "startTime",
                    ]);

                    return (
                      current &&
                      (current < dayjs(startTime || undefined).startOf("day") ||
                        current < dayjs().startOf("day"))
                    );
                  }}
                  format="DD-MM-YYYY hh:mm A"
                />
              </Form.Item>
            </Col>

            {/* <Col span={12}>
              <Form.Item label="Reporting Time">
                <TimePicker
                  use12Hours
                  format="h:mm:ss A"
                  style={{
                    width: "100%",
                  }}
                  onChange={() => {}}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Est Drop Time">
                <TimePicker
                  use12Hours
                  format="h:mm:ss A"
                  style={{
                    width: "100%",
                  }}
                  onChange={() => {}}
                />
              </Form.Item>
            </Col> */}

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
      </Card>
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
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        <Form.Item name="operatorNotes" label="Operator Notes">
          <TextArea placeholder="Add a note...."></TextArea>
        </Form.Item>
        <Form.Item
          name="driverNotes"
          label="Driver Notes"
          style={{ paddingTop: "16px" }}
        >
          <TextArea placeholder="Add a note...."></TextArea>
        </Form.Item>
      </div>
      <Form.Item valuePropName="checked" name="isUnconfirmed" label="">
        <Checkbox>Mark as unconfirmed booking</Checkbox>
      </Form.Item>
    </Form>
  );
};

export default AddNewBookingForm;
