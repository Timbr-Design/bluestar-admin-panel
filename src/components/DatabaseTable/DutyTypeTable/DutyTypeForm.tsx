/* eslint-disable */
import { Select, Radio, Spin, Button, Table, InputNumber } from "antd";
import { useAppSelector, useAppDispatch } from "../../../hooks/store";
import classNames from "classnames";
import type { RadioChangeEvent } from "antd";
import {
  getVehicleGroup,
  updateDutyType,
  addDutyType,
  setViewContentDatabase,
  getVehicleGroupById,
} from "../../../redux/slices/databaseSlice";
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

type NotificationType = "success" | "info" | "warning" | "error";

const rowsArray = [
  {
    vehicleGroup: "Swift Dzire/Etios",
    baseRate: 2,
    extraKmRate: 3,
    extraHrRate: 4,
  },
  {
    vehicleGroup: "Toyota Innova",
    baseRate: 2,
    extraKmRate: 3,
    extraHrRate: 4,
  },
  {
    vehicleGroup: "Mini hatchbacks",
    baseRate: 2,
    extraKmRate: 3,
    extraHrRate: 4,
  },
];

export const useVehicleGroupNames = (ids: string[]) => {
  const [names, setNames] = useState<VehicleGroupName[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleGroupNames = async () => {
      try {
        setLoading(true);
        const promises = ids.map((id) =>
          apiClient
            .get(`/database/vehicle-group/${id}`)
            .then((response) => ({ id, name: response.data.name }))
        );
        const results = await Promise.all(promises);
        setNames(results);
      } catch (err) {
        setError("Failed to fetch vehicle group names");
        console.error("Error fetching vehicle group names:", err);
      } finally {
        setLoading(false);
      }
    };

    if (ids.length > 0) {
      fetchVehicleGroupNames();
    } else {
      setNames([]);
      setLoading(false);
    }
  }, [ids]);

  return { names, loading, error };
};

const DutyTypeForm = ({ handleCloseSidePanel }: IDutyForm) => {
  const [items, setItems] = useState(DUTY_TYPES_TYPE);
  const [value, setValue] = useState("P2P");
  const [typename, setTypeName] = useState("");
  const [thresholdKM, setThresholdKM] = useState<number>(0);
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useAppDispatch();
  const [dutyType, setDutyType] = useState("");
  const [name, setName] = useState("");
  const {
    selectedDutyType,
    updatedDutyTypeStates,
    dutyTypeStates,
    vehicleGroupData,
    vehicleGroupOptionStates,
    viewContentDatabase,
  } = useAppSelector((state) => state.database);
  const [vehicleGroupDataArray, setVehicleGroupDataArray] = useState<any[]>([]);
  // const { names, loading, error } = useVehicleGroupNames(vehicleGroupIds);

  useEffect(() => {
    dispatch(getVehicleGroup({ page: "1", search: "", limit: 10 }));
  }, []);

  useEffect(() => {
    if (Object.keys(selectedDutyType).length) {
      const tempArr = selectedDutyType?.data?.pricing?.map((data: any) => {
        return {
          name: data?.vehicleGroup?.name,
          vehicleGroupId: data?._id,
          baseRate: data?.baseRate,
          extraKmRate: data?.extraKmRate,
          extraHrRate: data?.extraKmRate,
        };
      });

      setVehicleGroupDataArray(tempArr);
      setDutyType(selectedDutyType?.data?.type);
      setName(selectedDutyType?.data?.name);
      setValue(selectedDutyType?.data?.secondaryType);
    } else {
      const tempArr = vehicleGroupData?.data?.map((data: any) => {
        return {
          name: data?.name,
          vehicleGroupId: data?._id,
          baseRate: 0,
          extraKmRate: 0,
          extraHrRate: 0,
        };
      });

      setVehicleGroupDataArray(tempArr);
    }
  }, [vehicleGroupData, selectedDutyType]);

  const handleSelectChange = (value: any) => {
    setDutyType(value);
  };

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  const handleTypeName = (e: any) => {
    setTypeName(e.target.value);
  };

  const columnHeader = [
    { id: 1, name: "Vehicle Group" },
    { id: 2, name: "Base Rate" },
    { id: 3, name: "Extra KM rate" },
    { id: 4, name: "Extra HR rate" },
  ];

  const handleSave = () => {
    if (Object.keys(selectedDutyType).length) {
      dispatch(
        updateDutyType({
          payload: {
            name,
            type: dutyType,
            secondaryType: value,
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
          id: selectedDutyType?.data?._id,
        })
      );
    } else {
      dispatch(
        addDutyType({
          name,
          type: dutyType,
          secondaryType: value,
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
        })
      );
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

  const handleThresholdKM = (e: any) => {
    setThresholdKM(e.target.value);
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

  const [data, setData] = useState<RateData[]>([
    {
      key: "1",
      hours: "0 - 6 hours",
      baseRate: 0,
    },
    {
      key: "2",
      hours: "6 - 12 hours",
      baseRate: 0,
    },
    {
      key: "3",
      hours: "12+ hours",
      baseRate: 0,
    },
  ]);

  const handleBaseRateChange = (value: number | null, key: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, baseRate: value ?? 0 } : item
      )
    );
  };

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
          className={styles["base-rate-input"]}
          value={value}
          onChange={(newValue) => handleBaseRateChange(newValue, record.key)}
          min={0}
          precision={2}
          bordered={false}
          placeholder="Enter rate"
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
        <div className={styles.form}>
          <div className={styles.typeContainer}>
            <div className={styles.text}>
              <p>Category</p>
              <sup>*</sup>
              <HelpCircle />
            </div>
            <Select
              style={{ width: "100%" }}
              onChange={handleSelectChange}
              disabled={viewContentDatabase}
              value={dutyType || undefined}
              placeholder={<>{"Select One"}</>}
              dropdownRender={(menu) => <>{menu}</>}
              options={items.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
            />
          </div>
          <div className={styles.typeContainer}>
            <div className={styles.text}>
              <p>Type Name</p>
              <sup>*</sup>
            </div>
            <input
              className={styles.input}
              disabled={viewContentDatabase}
              value={typename}
              onChange={handleTypeName}
              placeholder="Enter Type name"
            />
          </div>
          <div className={styles.typeContainer}>
            <div className={styles.text}>
              <p>Category - Vehicle Group</p>
              <sup>*</sup>
            </div>
            <Select
              allowClear
              options={vehicleGroupData?.data?.map(
                (option: { _id: string; name: string }) => ({
                  value: option._id,
                  label: option.name,
                })
              )}
              value={undefined}
              onSearch={(text) => getVehicleGroupValue(text)}
              placeholder="Search vehicle group"
              fieldNames={{ label: "label", value: "value" }}
              notFoundContent={<div>No search result</div>}
              filterOption={false}
            />
          </div>
          <div className={styles.typeContainer}>
            <div className={styles.text}>
              <p>Threshold KMs</p>
              <sup>*</sup>
            </div>
            <input
              className={styles.input}
              disabled={viewContentDatabase}
              value={typename}
              onChange={handleThresholdKM}
              placeholder="Enter Threshold KMs"
            />
          </div>
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
          </div>
          <div className={styles.text}>
            <p>
              Define rates basis kilometers if total kilometers are more than
              threshold kilometers
            </p>
            <sup>*</sup>
          </div>
          <div className={styles.text}>
            <p>Rate per kilometer</p>
            <sup>*</sup>
          </div>
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
        </div>
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
        <div className={styles.form}>
          <div className={styles.typeContainer}>
            <div className={styles.text}>
              <p>Category</p>
              <sup>*</sup>
              <HelpCircle />
            </div>
            <Select
              style={{ width: "100%" }}
              onChange={handleSelectChange}
              disabled={viewContentDatabase}
              value={dutyType || undefined}
              placeholder={<>{"Select One"}</>}
              dropdownRender={(menu) => <>{menu}</>}
              options={items.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
            />
          </div>
          <div className={styles.typeContainer}>
            <div className={styles.text}>
              <p>Duty type name</p>
              <sup>*</sup>
            </div>
            <input
              className={styles.input}
              disabled={viewContentDatabase}
              value={name}
              onChange={handleNameChange}
              placeholder="Enter Duty type name"
            />
          </div>
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
                        className={classNames(styles.vehicleGroup, styles.name)}
                      >
                        {row?.name}
                      </div>
                      <div className={styles.rowItem}>
                        <input
                          className={styles.input}
                          disabled={viewContentDatabase}
                          value={row?.baseRate}
                          onChange={(e) => handlePricingValueChange(e, index)}
                          name={"baseRate"}
                        />
                      </div>
                      <div className={styles.rowItem}>
                        <input
                          className={styles.input}
                          disabled={viewContentDatabase}
                          value={row?.extraKmRate}
                          name={"extraKmRate"}
                          onChange={(e) => handlePricingValueChange(e, index)}
                        />
                      </div>
                      <div className={styles.rowItem}>
                        <input
                          className={styles.input}
                          disabled={viewContentDatabase}
                          value={row?.extraHrRate}
                          name={"extraHrRate"}
                          onChange={(e) => handlePricingValueChange(e, index)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
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
