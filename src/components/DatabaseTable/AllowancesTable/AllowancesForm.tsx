/* eslint-disable */
import SecondaryBtn from "../../SecondaryBtn";
import PrimaryBtn from "../../PrimaryBtn";
import { Select, notification, Button, Spin } from "antd";
import { useState, useMemo, useEffect, SetStateAction } from "react";
import {
  addNewAllowance,
  updateAllowance,
} from "../../../redux/slices/databaseSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { ALLOWANCES_TYPES, Allowance } from "../../../constants/database";
import styles from "../DutyTypeTable/index.module.scss";

interface IAllowancesForm {
  handleCloseSidePanel: () => void;
}

type NotificationType = "success" | "info" | "warning" | "error";

const AllowancesForm = ({ handleCloseSidePanel }: IAllowancesForm) => {
  const [allowanceType, setAllowanceType] = useState<string>("");
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useAppDispatch();
  const { selectedAllowance, updateAllowancesStates, allowanceStates } =
    useAppSelector((state) => state.database);
  const [rate, setRate] = useState<number>(
    selectedAllowance?.data?.rate ? selectedAllowance?.data?.rate : 0
  );

  const handleAllowanceType = (value: string) => {
    setAllowanceType(value);
  };

  useEffect(() => {
    if (Object.keys(selectedAllowance).length) {
      setRate(selectedAllowance?.data?.rate);
    }
  }, [selectedAllowance]);

  console.log(selectedAllowance, "selectedAllowance");

  const handleRateChange = (e: any) => {
    const value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(value)) {
      setRate(value);
    }
  };

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Allowance added",
      description: "Allowance added to the database",
    });
  };

  const allowanceLabel = useMemo(() => {
    return ALLOWANCES_TYPES.filter((type) => type.value === allowanceType)[0];
  }, [allowanceType]);

  const allowanceValue = useMemo(() => {
    return ALLOWANCES_TYPES.find(
      (type) => type.label === selectedAllowance?.data?.allowanceType
    );
  }, [selectedAllowance]);

  const handleAddNewAllowance = () => {
    if (Object.keys(selectedAllowance).length) {
      dispatch(
        updateAllowance({
          id: selectedAllowance?.data?._id,
          payload: {
            rate: Number(rate),
            allowanceType: allowanceLabel?.label,
          },
        })
      );
    } else {
      dispatch(
        addNewAllowance({
          rate: Number(rate),
          allowanceType: allowanceLabel?.label,
        })
      );
    }
  };

  useEffect(() => {
    if (allowanceValue) {
      setAllowanceType(allowanceValue?.value);
    }
  }, [allowanceValue]);

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      {allowanceStates.loading && (
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
            {Object.keys(selectedAllowance).length
              ? "Allowance"
              : "New Allowance"}
          </div>
          <div className={styles.primaryText}>Redesign of untitledui.com</div>
        </div>
        <div className={styles.form}>
          <div className={styles.typeContainer}>
            <div className={styles.text}>
              <p>Allowance Type</p>
            </div>
            <Select
              style={{ width: "100%" }}
              onChange={handleAllowanceType}
              placeholder="Select One"
              value={
                allowanceValue?.value ? allowanceValue?.value : allowanceType
              }
              dropdownRender={(menu) => <>{menu}</>}
              options={ALLOWANCES_TYPES.map((type) => ({
                label: type.label,
                value: type.value,
              }))}
            />
          </div>
          {allowanceType && (
            <div className={styles.allowance}>
              <p
                className={styles.allowanceType}
              >{`${allowanceLabel.label}:`}</p>
              {Allowance(allowanceType)}
            </div>
          )}
          {allowanceType && (
            <div className={styles.typeContainer}>
              <div className={styles.text}>
                <p>Add Rate (per hour)</p>
                <sup>*</sup>
              </div>
              <input
                type="number"
                className={styles.input}
                placeholder="Enter amount..."
                value={rate}
                onChange={handleRateChange}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <SecondaryBtn btnText="Cancel" onClick={handleCloseSidePanel} />
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleAddNewAllowance}
          loading={allowanceStates?.loading || updateAllowancesStates?.loading}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default AllowancesForm;
