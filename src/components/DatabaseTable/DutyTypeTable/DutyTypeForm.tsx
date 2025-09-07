/* eslint-disable */
import {
  Select,
  Radio,
  Spin,
  Button,
  Table,
  InputNumber,
  Form,
  Input,
} from "antd";
import { useAppSelector, useAppDispatch } from "../../../hooks/store";
import classNames from "classnames";
import type { RadioChangeEvent } from "antd";
import {
  getVehicleGroup,
  updateDutyType,
  addDutyType,
  setViewContentDatabase,
} from "../../../redux/slices/databaseSlice";
import { capitalize } from "../../../helper";
import { debounce } from "lodash";
import apiClient from "../../../utils/configureAxios";
import SecondaryBtn from "../../SecondaryBtn";
import PrimaryBtn from "../../PrimaryBtn";
import { notification } from "antd";
import { omit } from "lodash";
import { ReactComponent as EditIcon } from "../../../icons/edit-icon.svg";
import { DUTY_TYPES_TYPE } from "../../../constants/database";
import { ReactComponent as HelpCircle } from "../../../icons/help-circle.svg";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";

interface RateData {
  key: string;
  hours: string;
  baseRate: number;
}

interface IDutyForm {
  handleCloseSidePanel: () => void;
}

interface VehicleGroupName {
  id: string;
  name: string;
}

const DutyTypeForm = ({ handleCloseSidePanel }: IDutyForm) => {
  const [form] = Form.useForm();
  const [value, setValue] = useState("P2P");
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useAppDispatch();
  const [dutyType, setDutyType] = useState("");
  const {
    selectedDutyType,
    updatedDutyTypeStates,
    dutyTypeStates,
    vehicleGroupData,
    vehicleGroupOptionStates,
    viewContentDatabase,
  } = useAppSelector((state) => state.database);
  const [vehicleGroupDataArray, setVehicleGroupDataArray] = useState<any[]>([]);
  const [data, setData] = useState<RateData[]>([
    {
      key: "o-6",
      hours: "0 - 6 hours",
      baseRate: 0,
    },
    {
      key: "6-12",
      hours: "6 - 12 hours",
      baseRate: 0,
    },
    {
      key: "12+",
      hours: "12+ hours",
      baseRate: 0,
    },
  ]);

  console.log(selectedDutyType);

  const handleBaseRateChange = (value: number | null, key: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, baseRate: value ?? 0 } : item
      )
    );
  };

  useEffect(() => {
    dispatch(getVehicleGroup({ page: "1", search: "", limit: 10 }));
  }, []);

  useEffect(() => {
    console.log(vehicleGroupData);
    if (Object.keys(selectedDutyType).length) {
      const tempArr = selectedDutyType?.pricing?.map((data: any) => {
        return {
          name: data?.vehicleGroup?.name,
          vehicleGroupId: data?.id,
          baseRate: data?.baseRate,
          extraKmRate: data?.per_extra_km_rate,
          extraHrRate: data?.extraKmRate,
        };
      });

      setVehicleGroupDataArray(tempArr);
      setDutyType(capitalize(selectedDutyType?.category));
      setValue(selectedDutyType?.secondary_type);

      if (capitalize(selectedDutyType?.category) === "Custom") {
        setData([
          {
            key: "o-6",
            hours: "0 - 6 hours",
            baseRate:
              selectedDutyType?.custom_duty_type?.rateBasePerHour["o-6"],
          },
          {
            key: "6-12",
            hours: "6 - 12 hours",
            baseRate:
              selectedDutyType?.custom_duty_type?.rateBasePerHour["6-12"],
          },
          {
            key: "12+",
            hours: "12+ hours",
            baseRate:
              selectedDutyType?.custom_duty_type?.rateBasePerHour["12+"],
          },
        ]);

        // Set form values for Custom duty type
        form.setFieldsValue({
          dutyType: capitalize(selectedDutyType?.category),
          name: selectedDutyType?.name,
          vehicleGroup: selectedDutyType?.custom_duty_type?.vehicle_group_id,
          thresholdKM: selectedDutyType?.custom_duty_type?.thresholdKm,
          ratePerKm: selectedDutyType?.custom_duty_type?.per_extra_km_rate,
        });
      } else {
        // Set form values for non-Custom duty type
        const pricingValues = selectedDutyType?.pricing?.map((data: any) => ({
          baseRate: data?.baseRate,
          extraKmRate: data?.extraKmRate,
          extraHrRate: data?.extraHrRate,
        }));

        form.setFieldsValue({
          dutyType: capitalize(selectedDutyType?.category),
          name: selectedDutyType?.name,
          pricing: pricingValues,
        });
      }
    } else {
      const tempArr =
        vehicleGroupData &&
        Array.isArray(vehicleGroupData) &&
        vehicleGroupData?.map((data: any) => {
          return {
            name: data?.name,
            vehicleGroupId: data?.id,
            baseRate: data?.baseRate ?? 0,
            extraKmRate: data?.extraKmRate ?? 0,
            extraHrRate: data?.extraHrRate ?? 0,
          };
        });

      setVehicleGroupDataArray(tempArr);

      // Reset form values for new duty type
      form.resetFields();
    }
  }, [vehicleGroupData, selectedDutyType, form]);

  const handleSelectChange = (value: any) => {
    setDutyType(value);
  };

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const columnHeader = [
    { id: 1, name: "Vehicle Group" },
    { id: 2, name: "Base Rate" },
    { id: 3, name: "Extra KM rate" },
    { id: 4, name: "Extra HR rate" },
  ];

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Validate base rates for custom duty type
      if (capitalize(dutyType) === "Custom") {
        const hasInvalidBaseRates = data.some((item) => item.baseRate === 0);
        if (hasInvalidBaseRates) {
          form.setFields([
            {
              name: "baseRates",
              errors: ["All base rates must be greater than 0"],
              touched: true,
            },
          ]);
          return;
        }
      }

      if (Object.keys(selectedDutyType).length) {
        if (capitalize(dutyType) === "Custom") {
          const customDutyType = {
            vehicleGroupId: values.vehicleGroup,
            thresholdKm: values.thresholdKM,
            ratePerKm: values.ratePerKm,
            rateBasePerHour: {
              "o-6": data[0]?.baseRate,
              "6-12": data[1]?.baseRate,
              "12+": data[2]?.baseRate,
            },
          };
          dispatch(
            updateDutyType({
              payload: {
                name: values.name,
                category: "Custom",
                secondary_type: value,
                custom_duty_type: customDutyType,
              },
              id: selectedDutyType?.id,
            })
          );
        } else {
          dispatch(
            updateDutyType({
              payload: {
                name: values.name,
                category: values.dutyType,
                secondary_type: value,
                pricing: vehicleGroupDataArray?.map((data: any) =>
                  omit(
                    {
                      ...data,
                      baseRate: Number(data.baseRate),
                      extraKmRate: Number(data.extraKmRate),
                      extraHrRate: Number(data.extraHrRate),
                    },
                    "name"
                  )
                ),
              },
              id: selectedDutyType?.id,
            })
          );
        }
      } else {
        if (capitalize(dutyType) === "Custom") {
          const customDutyType = {
            vehicle_group_id: values.vehicleGroup,
            thresholdKm: values.thresholdKM,
            per_extra_km_rate: values.ratePerKm,
            rateBasePerHour: {
              "o-6": data[0]?.baseRate,
              "6-12": data[1]?.baseRate,
              "12+": data[2]?.baseRate,
            },
          };

          dispatch(
            addDutyType({
              name: values.name,
              category: "Custom",
              secondary_type: value,
              custom_duty_type: customDutyType,
            })
          );
        } else {
          console.log(vehicleGroupDataArray, values);
          dispatch(
            addDutyType({
              name: values.name,
              category: values.dutyType,
              secondary_type: value,
              pricing: values.pricing,
            })
          );
        }
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handlePricingValueChange = (e: any, index: any) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(e.target.value)) {
      const tempVehicleGroupDataArray = vehicleGroupDataArray?.map(
        (data: any, i: any) => {
          if (i === index) {
            return { ...data, [e.target.name]: e.target.value };
          } else return data;
        }
      );
      setVehicleGroupDataArray(tempVehicleGroupDataArray);
    }
  };

  const getVehicleGroupValue = debounce((searchText: string) => {
    if (searchText) {
      dispatch(
        getVehicleGroup({
          search: searchText,
        })
      );
    }
  }, 200);

  const columns = [
    {
      title: "Hours",
      dataIndex: "hours",
      key: "hours",
    },
    {
      title: "Base Rate",
      dataIndex: "baseRate",
      key: "baseRate",
      align: "right" as const,
      render: (value: number, record: RateData) => (
        <InputNumber
          className={"input-number"}
          value={value}
          onChange={(newValue) => handleBaseRateChange(newValue, record.key)}
          min={0}
          precision={0}
          placeholder="Enter rate"
          controls={false}
          disabled={viewContentDatabase}
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
      ),
    },
  ];

  return dutyType === "Custom" ? (
    <div className={styles.formContainer}>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <div className={styles.header}>
            {Object.keys(selectedDutyType).length
              ? viewContentDatabase
                ? "Duty Type"
                : "Edit Duty Type"
              : "New Duty Type"}
          </div>
          <div className={styles.primaryText}>
            {Object.keys(selectedDutyType).length
              ? viewContentDatabase
                ? "View duty type details"
                : "Update or modify duty type details"
              : "Add details of your duty type"}
          </div>
        </div>
        <Form
          form={form}
          layout="vertical"
          className={styles.form}
          disabled={viewContentDatabase}
        >
          <Form.Item
            label={
              <div className={styles.text}>
                <p>Category</p>
                <sup>*</sup>
                <HelpCircle />
              </div>
            }
            name="dutyType"
            rules={[{ required: true, message: "Please select a category" }]}
            required={false}
          >
            <Select
              style={{ width: "100%" }}
              onChange={handleSelectChange}
              placeholder="Select One"
              dropdownRender={(menu) => <>{menu}</>}
              options={DUTY_TYPES_TYPE.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
            />
          </Form.Item>

          <Form.Item
            label={
              <div className={styles.text}>
                <p>Type Name</p>
                <sup>*</sup>
              </div>
            }
            name="name"
            rules={[{ required: true, message: "Please enter type name" }]}
            required={false}
          >
            <Input placeholder="Enter Type name" />
          </Form.Item>

          <Form.Item
            label={
              <div className={styles.text}>
                <p>Category - Vehicle Group</p>
                <sup>*</sup>
              </div>
            }
            name="vehicleGroup"
            rules={[
              { required: true, message: "Please select a vehicle group" },
            ]}
            required={false}
          >
            <Select
              allowClear
              options={
                vehicleGroupData &&
                Array.isArray(vehicleGroupData) &&
                vehicleGroupData?.map(
                  (option: { id: string; name: string }) => ({
                    value: option.id,
                    label: option.name,
                  })
                )
              }
              onSearch={(text) => getVehicleGroupValue(text)}
              placeholder="Search vehicle group"
              fieldNames={{ label: "label", value: "value" }}
              notFoundContent={<div>No search result</div>}
              filterOption={false}
            />
          </Form.Item>

          <Form.Item
            label={
              <div className={styles.text}>
                <p>Threshold KMs</p>
                <sup>*</sup>
              </div>
            }
            name="thresholdKM"
            rules={[{ required: true, message: "Please enter threshold KMs" }]}
            required={false}
          >
            <InputNumber
              className="number-input"
              style={{
                width: "100%",
                textAlign: "left",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                height: "40px",
              }}
              placeholder="Enter Threshold KMs"
              min={0}
              controls={false}
              precision={0}
              keyboard={true}
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
              onChange={(value) => {
                if (value === null) return;
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                  form.setFieldValue("thresholdKM", numValue);
                }
              }}
            />
          </Form.Item>

          <div className={styles["rate-table-container"]}>
            <div className={styles.text}>
              <p>
                Define rates basis hours if total duty kilometers are less than
                threshold kilometers
              </p>
              <sup>*</sup>
            </div>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              className={styles["custom-table"]}
            />
            <Form.Item name="baseRates" className={styles.errorText}>
              <div></div>
            </Form.Item>
          </div>

          <div className={styles.text}>
            <p>
              Define rates basis kilometers if total kilometers are more than
              threshold kilometers
            </p>
            <sup>*</sup>
          </div>

          <Form.Item
            label={
              <div className={styles.text}>
                <p>Rate per kilometer</p>
                <sup>*</sup>
              </div>
            }
            name="ratePerKm"
            rules={[
              { required: true, message: "Please enter rate per kilometer" },
            ]}
            required={false}
          >
            <InputNumber
              className="number-input"
              style={{
                width: "100%",
                textAlign: "left",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                height: "40px",
              }}
              placeholder="Enter Rate per KM"
              min={0}
              controls={false}
              precision={0}
              keyboard={true}
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
              onChange={(value) => {
                if (value === null) return;
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                  form.setFieldValue("ratePerKm", numValue);
                }
              }}
            />
          </Form.Item>

          <div className={styles.radio}>
            <Radio.Group
              onChange={onChange}
              value={value}
              disabled={viewContentDatabase}
            >
              <Radio value={"P2P"}>
                <div className={styles.radioContainer}>
                  <div className={styles.text}>Is Point to Point (P2P)?</div>
                  <div className={styles.secondary}>
                    Direct service between origin and destination.
                  </div>
                </div>
              </Radio>
              <Radio value={"G2G"}>
                <div className={styles.radioContainer}>
                  <div className={styles.text}>Is Garage to Garage (G2G)?</div>
                  <div className={styles.secondary}>
                    Service starts and ends at the garage facility.
                  </div>
                </div>
              </Radio>
            </Radio.Group>
          </div>
        </Form>
      </div>
      {viewContentDatabase ? (
        <div className={styles.bottomContainer}>
          <PrimaryBtn
            btnText={"Edit"}
            onClick={() => {
              dispatch(setViewContentDatabase(false));
            }}
            LeadingIcon={EditIcon}
          />
        </div>
      ) : (
        <div className={styles.bottomContainer}>
          <SecondaryBtn btnText="Cancel" onClick={handleCloseSidePanel} />
          <Button
            type="primary"
            htmlType="submit"
            loading={updatedDutyTypeStates?.loading}
            onClick={handleSave}
            className="primary-btn"
          >
            Save
          </Button>
        </div>
      )}
    </div>
  ) : (
    <div className={styles.formContainer}>
      {contextHolder}
      {(vehicleGroupOptionStates.loading || dutyTypeStates.loading) && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <div className={styles.header}>
            {Object.keys(selectedDutyType).length
              ? viewContentDatabase
                ? "Duty Type"
                : "Edit Duty Type"
              : "New Duty Type"}
          </div>
          <div className={styles.primaryText}>
            {Object.keys(selectedDutyType).length
              ? viewContentDatabase
                ? "View duty type details"
                : "Update or modify duty type details"
              : "Add details of your duty type"}
          </div>
        </div>
        <Form
          form={form}
          layout="vertical"
          className={styles.form}
          disabled={viewContentDatabase}
        >
          <Form.Item
            label={
              <div className={styles.text}>
                <p>Category</p>
                <sup>*</sup>
                <HelpCircle />
              </div>
            }
            name="dutyType"
            rules={[{ required: true, message: "Please select a category" }]}
            required={false}
          >
            <Select
              style={{ width: "100%" }}
              onChange={handleSelectChange}
              placeholder="Select One"
              dropdownRender={(menu) => <>{menu}</>}
              options={DUTY_TYPES_TYPE.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
            />
          </Form.Item>

          <Form.Item
            label={
              <div className={styles.text}>
                <p>Duty type name</p>
                <sup>*</sup>
              </div>
            }
            name="name"
            rules={[{ required: true, message: "Please enter duty type name" }]}
            required={false}
          >
            <Input placeholder="Enter Duty type name" />
          </Form.Item>

          <div className={styles.radio}>
            <Radio.Group
              onChange={onChange}
              value={value}
              disabled={viewContentDatabase}
            >
              <Radio value={"P2P"}>
                <div className={styles.radioContainer}>
                  <div className={styles.text}>Is Point to Point (P2P)?</div>
                  <div className={styles.secondary}>
                    Direct service between origin and destination.
                  </div>
                </div>
              </Radio>
              <Radio value={"G2G"}>
                <div className={styles.radioContainer}>
                  <div className={styles.text}>Is Garage to Garage (G2G)?</div>
                  <div className={styles.secondary}>
                    Service starts and ends at the garage facility.
                  </div>
                </div>
              </Radio>
            </Radio.Group>
          </div>
          {dutyType && (
            <div>
              <div className={styles.text}>
                <p>Set pricing for new duty type</p>
                <sup>*</sup>
              </div>
              <div className={styles.dutyTypeTable}>
                <div className={styles.columnsHeader}>
                  {columnHeader?.map((column) => {
                    return <div className={styles.column}>{column?.name}</div>;
                  })}
                </div>
                <div className={styles.rowsContainer}>
                  {vehicleGroupDataArray?.map((row: any, index: any) => {
                    return (
                      <div className={styles.row}>
                        <div
                          className={classNames(
                            styles.vehicleGroup,
                            styles.name
                          )}
                        >
                          {row?.name}
                        </div>
                        <div className={styles.rowItem}>
                          <Form.Item
                            name={["pricing", index, "baseRate"]}
                            rules={[{ required: true, message: "Required" }]}
                            initialValue={row?.baseRate}
                            required={false}
                          >
                            <InputNumber
                              className={styles.input}
                              disabled={viewContentDatabase}
                              placeholder="Enter base rate"
                              min={0}
                              style={{ width: "100%", textAlign: "left" }}
                              controls={false}
                              precision={0}
                              keyboard={true}
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
                              onChange={(value) => {
                                if (value === null) return;
                                const numValue = Number(value);
                                if (!isNaN(numValue)) {
                                  form.setFieldValue(
                                    ["pricing", index, "baseRate"],
                                    numValue
                                  );
                                }
                              }}
                            />
                          </Form.Item>
                        </div>
                        <div className={styles.rowItem}>
                          <Form.Item
                            name={["pricing", index, "extraKmRate"]}
                            rules={[{ required: true, message: "Required" }]}
                            initialValue={row?.extraKmRate}
                            required={false}
                          >
                            <InputNumber
                              className={styles.input}
                              disabled={viewContentDatabase}
                              placeholder="Enter extra KM rate"
                              min={0}
                              style={{ width: "100%", textAlign: "left" }}
                              controls={false}
                              precision={0}
                              keyboard={true}
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
                              onChange={(value) => {
                                if (value === null) return;
                                const numValue = Number(value);
                                if (!isNaN(numValue)) {
                                  form.setFieldValue(
                                    ["pricing", index, "extraKmRate"],
                                    numValue
                                  );
                                }
                              }}
                            />
                          </Form.Item>
                        </div>
                        <div className={styles.rowItem}>
                          <Form.Item
                            name={["pricing", index, "extraHrRate"]}
                            rules={[{ required: true, message: "Required" }]}
                            initialValue={row?.extraHrRate}
                            required={false}
                          >
                            <InputNumber
                              className={styles.input}
                              disabled={viewContentDatabase}
                              placeholder="Enter extra HR rate"
                              min={0}
                              style={{ width: "100%", textAlign: "left" }}
                              controls={false}
                              precision={0}
                              keyboard={true}
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
                              onChange={(value) => {
                                if (value === null) return;
                                const numValue = Number(value);
                                if (!isNaN(numValue)) {
                                  form.setFieldValue(
                                    ["pricing", index, "extraHrRate"],
                                    numValue
                                  );
                                }
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </Form>
      </div>
      {viewContentDatabase ? (
        <div className={styles.bottomContainer}>
          <PrimaryBtn
            btnText={"Edit"}
            onClick={() => {
              dispatch(setViewContentDatabase(false));
            }}
            LeadingIcon={EditIcon}
          />
        </div>
      ) : (
        <div className={styles.bottomContainer}>
          <SecondaryBtn btnText="Cancel" onClick={handleCloseSidePanel} />
          <Button
            type="primary"
            htmlType="submit"
            loading={updatedDutyTypeStates?.loading}
            onClick={handleSave}
            className="primary-btn"
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default DutyTypeForm;
