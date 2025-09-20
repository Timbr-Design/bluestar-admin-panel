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
  getCustomerById,
  getDutyTypeById,
  getVehicleGroup,
  getVehicleGroupById,
} from "../../../redux/slices/databaseSlice";
import { getCompanies } from "../../../redux/slices/companySlice";
import dayjs from "dayjs";

const { TextArea } = Input;
interface AddNewBookingForm {
  initialData?: any;
  isEditable?: boolean;
  form: any;
  handleSetBookingValues?: (values: any) => void;
}
const AddNewBookingForm = ({
  initialData,
  isEditable = true,
  form,
  handleSetBookingValues,
}: AddNewBookingForm) => {
  const {
    dutyTypeList,
    customersOption,
    vehicleGroupData,
    currentDutyType,
    customers,
  } = useAppSelector((state: RootState) => state.database);
  const { companies } = useAppSelector((state: RootState) => state.company);
  const dispatch = useAppDispatch();

  const randomCustomBookingId = useMemo(() => {
    return Math.floor(100000 + Math.random() * 900000);
  }, []);

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

  const getCompanyValue = (searchText: string) => {
    if (searchText) {
      dispatch(getCompanies({ search: searchText }));
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

    dispatch(getCompanies({ page: 1, limit: 10 }));
  }, []);

  useEffect(() => {
    if (initialData?.id) {
      form.setFieldsValue({
        bookingId: initialData?.booking_id,
        customer: [
          {
            label: initialData?.expand?.customer_id?.name,
            value: initialData?.expand?.customer_id?.id,
          },
        ],
        booked_by_name: initialData?.booked_by_name,
        booked_by_email: initialData?.booked_by_email,
        booked_by_number: initialData?.booked_by_number,
        passenger: initialData?.passengers,
        dutyType: [
          {
            label: initialData?.expand?.duty_type_id?.name,
            value: initialData?.expand?.duty_type_id?.id,
          },
        ],
        vehicleGroup: [
          {
            label: initialData?.expand?.vehicle_group_id?.name,
            value: initialData?.expand?.vehicle_group_id?.id,
          },
        ],
        to: initialData?.to,
        from: initialData?.from,
        reporting_address: initialData?.reporting_address,
        drop_address: initialData?.drop_address,
        bookingType: initialData?.local_booking ? "Local" : "Outstation",
        airportBooking: initialData?.airportBooking,
        durationDetails: {
          start_date: initialData?.start_date
            ? dayjs(initialData?.start_date)
            : null,
          end_date: initialData?.end_date ? dayjs(initialData?.end_date) : null,
          reporting_time: initialData?.reporting_time
            ? dayjs(initialData?.reporting_time)
            : null,
          est_drop_time: initialData?.est_drop_time
            ? dayjs(initialData?.est_drop_time)
            : null,
          start_from_garage_before_mins:
            initialData?.start_from_garage_before_mins
              ? dayjs(initialData?.start_from_garage_before_mins)
              : null,
        },
        base_rate: initialData?.base_rate,
        per_extra_km_rate: initialData?.per_extra_km_rate,
        per_extra_hour_rate: initialData?.per_extra_hour_rate,
        // billTo: initialData?.billTo,
        billTo: [
          {
            label: initialData?.expand?.billed_customer_id?.name,
            value: initialData?.expand?.billed_customer_id?.id,
          },
        ],
        operator_notes: initialData?.operator_notes,
        notes: initialData?.driver_notes,
        isUnconfirmed: !initialData?.is_confirmed,
      });
    } else {
      form.setFieldsValue({
        bookingId: randomCustomBookingId.toString(),
      });
    }
  }, [initialData]);

  const handleToggle = (checked: boolean) => {
    if (!useThisPassenger) {
      const booked_by_name = form.getFieldValue("booked_by_name") || [];
      const booked_by_number = form.getFieldValue("booked_by_number") || [];

      // Set the new passenger array with the new data
      form.setFieldsValue({
        passenger: [
          {
            name: booked_by_name,
            phoneNo: booked_by_number,
          },
        ],
      });
    } else {
      form.setFieldsValue({
        passenger: [],
      });
    }
    setUseThisPassenger(!useThisPassenger);
  };

  useEffect(() => {
    dispatch(getDutyTypeById({ id: initialData?.duty_type_id }));
    dispatch(getVehicleGroupById({ id: initialData?.vehicle_group_id }));
    dispatch(getCustomerById({ id: initialData?.customer_id }));
  }, [initialData]);

  const handleDutyTypeChange = (value: string) => {
    dispatch(getDutyTypeById({ id: value }));
  };

  const handleVehicleGroupChange = (value: string) => {
    dispatch(getVehicleGroupById({ id: value }));
  };

  useEffect(() => {
    if (currentDutyType?.category === "custom") {
      form.setFieldsValue({
        base_rate: currentDutyType?.customDutyType?.ratePerKm,
        per_extra_km_rate:
          currentDutyType?.customDutyType?.["12+"].per_extra_km_rate,
        per_extra_hour_rate:
          currentDutyType?.customDutyType?.per_extra_hour_rate,
      });
    }
  }, [form.getFieldValue("vehicleGroup")]);

  return (
    <Form
      layout="vertical"
      form={form}
      name="control-hooks"
      disabled={!isEditable}
      onFinishFailed={(errorInfo) => {
        console.log("Failed:", errorInfo);
      }}
      onFinish={(values) => {
        handleSetBookingValues({
          ...values,
          localBooking: values?.bookingType === "Local",
          outstationBooking: values?.bookingType === "Outstation",
        });
      }}
      requiredMark={CustomizeRequiredMark}
      className={styles.form}
    >
      <div className={styles.typeContainer}>
        <Form.Item
          name="bookingId"
          label="Booking ID"
          rules={[{ required: true }]}
        >
          <Input type="text" disabled />
        </Form.Item>
      </div>

      <div className={styles.typeContainer}>
        <Form.Item
          name={"customer"}
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
      </div>

      <Form.Item
        // name="booked_by_name"
        // id="booked_by_name"
        label="Booked By"
        labelCol={{
          style: { fontWeight: 500, fontSize: "16px" },
        }}
        className={styles.secondaryContainer}
      >
        <div className={styles.typeContainer}>
          <Form.Item
            name="booked_by_name"
            label="Booked by Name"
            style={{ marginTop: "12px" }}
          >
            <Input placeholder="Name" />
          </Form.Item>
        </div>

        <Form.Item
          name="booked_by_number"
          label="Booked by Phone Number"
          rules={[
            { required: false },
            {
              pattern: /^(\+91)?[6-9][0-9]{9}$/,
              message: "Please enter a valid Indian phone number",
            },
          ]}
          style={{ marginTop: "12px" }}
        >
          <Input
            placeholder="Phone number"
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault(); // block anything that’s not a digit
              }
            }}
          />
        </Form.Item>
        <Form.Item
          name="booked_by_email"
          label="Booked by Email"
          rules={[{ required: false, type: "email" }]}
          style={{ marginTop: "12px" }}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>
        {!initialData?.id && (
          <Form.Item>
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
          </Form.Item>
        )}
      </Form.Item>

      <Form.List name="passenger">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <Form.Item
                label="Passenger Details"
                labelCol={{
                  style: { fontWeight: 500, fontSize: "16px" },
                }}
                className={styles.secondaryContainer}
              >
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
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                className={styles.addPassengerButton}
                type="text"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Add more
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item name="dutyType" rules={[{ required: true }]} label="Duty type">
        <Select
          allowClear
          showSearch
          options={
            dutyTypeList &&
            Array.isArray(dutyTypeList) &&
            dutyTypeList?.map((option: { id: string; name: string }) => ({
              value: option.id,
              label: option.name,
            }))
          }
          onSearch={(text) => getDutyTypeValue(text)}
          onChange={handleDutyTypeChange}
          placeholder="Select Duty type"
          fieldNames={{ label: "label", value: "value" }}
          notFoundContent={<div>No search result</div>}
        />
      </Form.Item>
      <Form.Item
        name="vehicleGroup"
        rules={[{ required: true }]}
        label="Vehicle Group"
        style={{ paddingTop: "16px" }}
      >
        <Select
          allowClear
          showSearch
          options={
            vehicleGroupData &&
            Array.isArray(vehicleGroupData) &&
            vehicleGroupData.map((option: { id: string; name: string }) => ({
              value: option.id,
              label: option.name,
            }))
          }
          onSearch={(text) => getVehicleGroupValue(text)}
          onChange={handleVehicleGroupChange}
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

      <div className={styles.locationContainer}>
        <Form.Item
          label="From (Service Location)"
          name="from"
          rules={[
            {
              required: true,
              message: "Please enter the From location",
            },
            {
              pattern:
                /^(https:\/\/(www\.)?google\.(com|[a-z]{2})\/maps\/.+|https:\/\/maps\.app\.goo\.gl\/.+)/,
              message: "Please enter a valid Google Maps URL!",
            },
          ]}
          style={{ width: "100%" }}
        >
          <Input placeholder="Enter the location" />
        </Form.Item>
        <Form.Item
          label="To"
          name="to"
          rules={[
            {
              pattern:
                /^(https:\/\/(www\.)?google\.(com|[a-z]{2})\/maps\/.+|https:\/\/maps\.app\.goo\.gl\/.+)/,
              message: "Please enter a valid Google Maps URL!",
            },
          ]}
          style={{ width: "100%" }}
        >
          <Input placeholder="Enter the location" />
        </Form.Item>
      </div>

      <Form.Item
        rules={[
          {
            pattern:
              /^(https:\/\/(www\.)?google\.(com|[a-z]{2})\/maps\/.+|https:\/\/maps\.app\.goo\.gl\/.+)/,
            message: "Please enter a valid Google Maps URL!",
          },
        ]}
        name="reporting_address"
        label="Reporting Address"
      >
        <TextArea placeholder="Location (Google map link)"></TextArea>
      </Form.Item>
      <Form.Item
        name="drop_address"
        rules={[
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
      <Form.Item name="airportBooking" valuePropName="checked">
        <Checkbox>This is an airport booking</Checkbox>
      </Form.Item>

      <Card className={styles.durationDetailsCard}>
        <b>Duration Details </b>
        <Input.Group>
          <div className={styles.timeRow}>
            <Form.Item
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                },
              ]}
              name={["durationDetails", "start_date"]}
              label="Start Date"
            >
              <CustomDatePicker
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
                showHour={false}
                showMinute={false}
                showTime={false}
                format="DD-MM-YYYY"
              />
            </Form.Item>
            <Form.Item
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                },
              ]}
              name={["durationDetails", "end_date"]}
              label="End Date"
            >
              <CustomDatePicker
                showHour={false}
                showMinute={false}
                showTime={false}
                format="DD-MM-YYYY"
                disabledDate={(current) => {
                  // Get the start time from form values
                  const startTime = form.getFieldValue([
                    "durationDetails",
                    "start_date",
                  ]);

                  return (
                    current &&
                    (current < dayjs(startTime || undefined).startOf("day") ||
                      current < dayjs().startOf("day"))
                  );
                }}
              />
            </Form.Item>
          </div>

          <div className={styles.timeRow}>
            <Form.Item
              style={{ width: "100%" }}
              rules={[
                { required: true, message: "Reporting time is required" },
              ]}
              name={["durationDetails", "reporting_time"]}
              label="Reporting Time"
            >
              <TimePicker
                format="HH:mm" // 24-hour format
                minuteStep={5}
                defaultValue={dayjs("12:00", "HH:mm")}
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* Est Drop Time */}
            <Form.Item
              style={{ width: "100%" }}
              name={["durationDetails", "est_drop_time"]}
              label="Est Drop Time"
              dependencies={[["durationDetails", "reporting_time"]]}
              rules={[
                {
                  validator: (_, value) => {
                    const start = form.getFieldValue([
                      "durationDetails",
                      "reporting_time",
                    ]);
                    if (!value || !start) return Promise.resolve();
                    if (dayjs(value).isAfter(dayjs(start))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("End time must be greater than start time")
                    );
                  },
                },
              ]}
            >
              <TimePicker
                format="HH:mm"
                minuteStep={5}
                style={{ width: "100%" }}
                disabledTime={() => {
                  const start = form.getFieldValue([
                    "durationDetails",
                    "reporting_time",
                  ]);
                  if (!start) return {};
                  const startHour = dayjs(start).hour();
                  const startMinute = dayjs(start).minute();

                  return {
                    disabledHours: () =>
                      Array.from({ length: startHour }, (_, i) => i),
                    disabledMinutes: (selectedHour) => {
                      if (selectedHour === startHour) {
                        return Array.from(
                          { length: startMinute + 1 },
                          (_, i) => i
                        );
                      }
                      return [];
                    },
                  };
                }}
              />
            </Form.Item>
          </div>

          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            name={["durationDetails", "start_from_garage_before_mins"]}
            label="Start from garage before (in mins)"
            style={{ paddingTop: "16px" }}
          >
            <TimePicker
              format="mm"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Input.Group>
      </Card>
      <Card className={styles.pricingDetailsCard}>
        <div className={styles.pricingDetails}>
          <b>Pricing Details</b>
          {/* <span>
            <SyncOutlined />
            Fetch from Contract
          </span> */}
        </div>
        <div>
          <Input.Group>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name={"base_rate"}
                  style={{ paddingTop: "16px" }}
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
                      textAlign: "left",
                      border: "1px solid #d9d9d9",
                      borderRadius: "6px",
                      height: "40px",
                    }}
                    min={0}
                    placeholder="Prefilled based on Duty Type"
                    precision={0}
                    controls={false}
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={"per_extra_km_rate"}
                  style={{ paddingTop: "16px" }}
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
                      textAlign: "left",
                      border: "1px solid #d9d9d9",
                      borderRadius: "6px",
                      height: "40px",
                    }}
                    min={0}
                    precision={0}
                    controls={false}
                    placeholder="Per Extra KM Rate"
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
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
                  name={"per_extra_hour_rate"}
                  style={{ paddingTop: "16px" }}
                  label="Per Extra Hour Rate"
                >
                  <InputNumber
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: "1px solid #d9d9d9",
                      borderRadius: "6px",
                      height: "40px",
                    }}
                    min={0}
                    placeholder="Per Extra Hour Rate"
                    precision={0}
                    controls={false}
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Bill to"
                  name={"billTo"}
                  style={{ paddingTop: "16px" }}
                >
                  <Select
                    placeholder="Select customer"
                    allowClear
                    showSearch
                    options={
                      customers &&
                      Array.isArray(customers) &&
                      customers?.map((option: any) => ({
                        value: option.id,
                        label: option.name,
                      }))
                    }
                    onSearch={(text) => getCompanyValue(text)}
                    fieldNames={{ label: "label", value: "value" }}
                    filterOption={false}
                    notFoundContent={<div>No search result</div>}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Input.Group>
        </div>
      </Card>
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        <Form.Item name="operator_notes" label="Operator Notes">
          <TextArea placeholder="Add a note...."></TextArea>
        </Form.Item>
        <Form.Item
          name="notes"
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
