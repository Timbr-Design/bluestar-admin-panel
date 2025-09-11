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
  const { currentSelectedBookingDuties } = useAppSelector(
    (state: RootState) => state.bookingDuties
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(dutyTypeOption);
  }, [dutyTypeOption]);

  useEffect(() => {
    dispatch(
      getAllDutyTypes({
        page: "1",
        limit: "10",
        search: "",
      })
    );
    dispatch(getVehicleGroup({ page: "1", search: "", limit: 10 }));
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
    console.log(values);
    if (Object.keys(currentSelectedBookingDuties).length) {
      dispatch(
        updateBookingDuties({
          currentSelectedBookingDuties,
        })
      );
    } else {
      dispatch(addNewBookingDuties(values));
    }
  };

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      form.setFieldsValue({
        id: initialData?.id,
        base_rate: initialData?.base_rate,
        duty_type_id: [
          {
            label: initialData?.duty_type_id?.name,
            value: initialData?.duty_type_id?.id,
          },
        ],
        vehicle_group_id: [
          {
            label: initialData?.vehicle_group_id?.name,
            value: initialData?.vehicle_group_id?.id,
          },
        ],
        reporting_address_map_link: initialData?.reporting_address_map_link,
        start_date: initialData?.start_date
          ? dayjs(initialData?.start_date)
          : null,
        end_date: initialData?.end_date ? dayjs(initialData.end_date) : null,

        start_from_garage_before_mins:
          initialData?.start_from_garage_before_mins
            ? dayjs(initialData.start_from_garage_before_mins)
            : null,
        drop_address_map_link: initialData?.drop_address_map_link,
        from_address_id: initialData?.from_address_id,
        to_address_id: initialData?.to_address_id,
        operator_notes: initialData?.operator_notes,
        driver_notes: initialData?.driver_notes,
        // address: initialData?.address,
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
        onSubmit(values);
        // booking_id
        // if (isEditable && initialData.id) {
        //   dispatch(updateBookingDuties({ id: initialData.id, ...values }));
        // } else {
        //   dispatch(addNewBookingDuties(values));
        // }
      }}
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
            rules={[
              { required: true, message: "Please provide a Google Maps link!" },
              {
                pattern:
                  /^(https:\/\/(www\.)?google\.(com|[a-z]{2})\/maps\/.+|https:\/\/maps\.app\.goo\.gl\/.+)/,
                message: "Please enter a valid Google Maps URL!",
              },
            ]}
            name="from_address_id"
            label="from Address"
          >
            <Input type="text" placeholder="Location (Google map link)"></Input>
          </Form.Item>
        </Col>
        <Col sm={12}>
          {/* to */}
          <Form.Item
            name="to_address_id"
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
                  name={"end_date"}
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
