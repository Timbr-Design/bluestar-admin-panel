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
  getAllAddresses,
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
  const {
    vehicleGroupSelectOption,
    dutyTypeOption,
    customersOption,
    addressList,
    addressListSelectOption,
  } = useAppSelector((state: RootState) => state.database);
  const { currentSelectedBookingDuties } = useAppSelector(
    (state: RootState) => state.bookingDuties
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getAllDutyTypes({
        page: "1",
        limit: "10",
        search: "",
      })
    );
    dispatch(getVehicleGroup({ page: "1", search: "", limit: 10 }));
    dispatch(getAllAddresses({}));
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

  const getVehicleGroupValue = (searchText: string) => {
    if (searchText) {
      dispatch(
        getVehicleGroup({
          search: searchText,
        })
      );
    }
  };

  const onSubmit = (values: any) => {
    const updatedValues = {
      ...values,
      start_date: dayjs(values.start_date).format("YYYY-MM-DD HH:mm:ss"),
      end_date: dayjs(values.start_date).format("YYYY-MM-DD HH:mm:ss"),
      start_from_garage_before_mins: new Date(
        values.start_from_garage_before_mins
      ).getTime(),
      reporting_time: dayjs(values.reporting_time).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      est_drop_time: dayjs(values.est_drop_time).format("YYYY-MM-DD HH:mm:ss"),
      booking_id: bookingId,
    };
    if (isEditable && initialData?.id) {
      dispatch(
        updateBookingDuties({ id: initialData.id, data: updatedValues })
      );
    } else {
      dispatch(addNewBookingDuties(updatedValues));
    }
  };

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      form.setFieldsValue({
        id: initialData?.id,
        base_rate: initialData?.base_rate,
        duty_type_id: [
          {
            label: initialData?.expand?.duty_type_id?.name,
            value: initialData?.expand?.duty_type_id?.id,
          },
        ],
        vehicle_group_id: [
          {
            label: initialData?.expand?.vehicle_group_id?.name,
            value: initialData?.expand?.vehicle_group_id?.id,
          },
        ],
        reporting_time: dayjs(initialData?.reporting_time),
        est_drop_time: dayjs(initialData?.est_drop_time),
        reporting_address_map_link: initialData?.reporting_address_map_link,
        start_date: initialData?.start_date
          ? dayjs(initialData?.start_date)
          : null,
        end_date: initialData?.end_date ? dayjs(initialData.end_date) : null,
        start_from_garage_before_mins:
          initialData?.start_from_garage_before_mins
            ? dayjs(initialData.start_from_garage_before_mins)
            : null,
        per_extra_km_rate: initialData?.per_extra_km_rate,
        per_extra_hour_rate: initialData?.per_extra_hour_rate,
        drop_address_map_link: initialData?.drop_address_map_link,
        from_address_id: initialData?.from_address_id,
        to_address_id: initialData?.to_address_id,
        operator_notes: initialData?.operator_notes,
        driver_notes: initialData?.driver_notes,
        // address: initialData?.address,
      });
    } else form.resetFields();
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
      onFinish={(values) => onSubmit(values)}
      requiredMark={CustomizeRequiredMark}
      className={styles.form}
    >
      {/* duty_type_id */}
      <Form.Item
        name="duty_type_id"
        rules={[{ required: true }]}
        label="Duty type"
      >
        <Select
          allowClear
          showSearch
          options={dutyTypeOption}
          value={form.getFieldValue("duty_type_id")}
          onSearch={(text) => getDutyTypeValue(text)}
          placeholder="Select Duty type"
          fieldNames={{ label: "label", value: "value" }}
          notFoundContent={<div>No search result</div>}
        />
      </Form.Item>
      {/* vehicle_group_id */}
      <Form.Item
        name="vehicle_group_id"
        id="vehicle_group_id"
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
            rules={[{ required: true }]}
            name="from_address_id"
            label="From (Service Location)"
          >
            <Select
              allowClear
              showSearch
              options={addressListSelectOption}
              // onSearch={(text) => getVehicleGroupValue(text)}
              placeholder="Location"
              fieldNames={{ label: "label", value: "value" }}
              notFoundContent={<div>No search result</div>}
            ></Select>
            {/* <Input type="text" placeholder="Location"></Input> */}
          </Form.Item>
        </Col>
        <Col sm={12}>
          {/* to */}
          <Form.Item name="to_address_id" label="To">
            <Select
              allowClear
              showSearch
              options={addressListSelectOption}
              placeholder="Location"
              fieldNames={{ label: "label", value: "value" }}
              notFoundContent={<div>No search result</div>}
            ></Select>
          </Form.Item>
        </Col>
      </Row>
      {/* reporting_address_map_link */}
      <Form.Item
        rules={[
          { required: true, message: "Please provide a Google Maps link!" },
          {
            pattern:
              /^(https:\/\/(www\.)?google\.(com|[a-z]{2})\/maps\/.+|https:\/\/maps\.app\.goo\.gl\/.+)/,
            message: "Please enter a valid Google Maps URL!",
          },
        ]}
        name="reporting_address_map_link"
        label="Reporting Address"
      >
        <TextArea placeholder="Location (Google map link)"></TextArea>
      </Form.Item>
      {/* drop_address_map_link */}
      <Form.Item
        name="drop_address_map_link"
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
                  name={"start_date"}
                  label="Start Date"
                >
                  <CustomDatePicker
                    showHour={false}
                    showMinute={false}
                    showTime={false}
                    format="DD-MM-YYYY"
                    use12Hours
                    onChange={form.onChange}
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
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
                  name={"end_date"}
                  label="End Date"
                >
                  <CustomDatePicker
                    showHour={false}
                    showMinute={false}
                    showTime={false}
                    format="DD-MM-YYYY"
                    use12Hours
                    onChange={form.onChange}
                    disabledDate={(current) => {
                      // Get the start time from form values
                      const startTime = form.getFieldValue("start_date");

                      return (
                        current &&
                        (current <
                          dayjs(startTime || undefined).startOf("day") ||
                          current < dayjs().startOf("day"))
                      );
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
                  name={"reporting_time"}
                  label="Reporting Time"
                >
                  <TimePicker
                    format="HH:mm" // 24-hour format
                    minuteStep={5}
                    defaultValue={dayjs("12:00", "HH:mm")}
                    style={{ width: "100%" }}
                    onChange={form.onChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: false,
                    },
                    {
                      validator: (_, value) => {
                        const start = form.getFieldValue("reporting_time");
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
                  name={"est_drop_time"}
                  label="Est Drop Time"
                >
                  <TimePicker
                    format="HH:mm"
                    minuteStep={5}
                    style={{ width: "100%" }}
                    onChange={form.onChange}
                    disabledTime={() => {
                      const start = form.getFieldValue("reporting_time");
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
              </Col>

              <Col span={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name={"start_from_garage_before_mins"}
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
                  name={"base_rate"}
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
                  name={"per_extra_km_rate"}
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
                  name={"per_extra_hour_rate"}
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

      {/* operator_notes driver_notes */}
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        <Form.Item name="operator_notes" label="Operator Notes">
          <TextArea placeholder="Add a note...."></TextArea>
        </Form.Item>
        <Form.Item name="driver_notes" label="Driver Notes">
          <TextArea placeholder="Add a note...."></TextArea>
        </Form.Item>
      </div>
    </Form>
  );
};

export default AddNewDutyToBookingForm;
