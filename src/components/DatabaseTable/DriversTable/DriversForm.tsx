/* eslint-disable */
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  TimePicker,
  notification,
} from "antd";
import SecondaryBtn from "../../SecondaryBtn";
import PrimaryBtn from "../../PrimaryBtn";
import { ADDRESS_TYPE, IFile } from "../../../constants/database";
import styles from "../DutyTypeTable/index.module.scss";
import CustomizeRequiredMark from "../../Common/CustomizeRequiredMark";
import dayjs, { Dayjs } from "dayjs";
import {
  addBankAccount,
  addNewDriver,
  updateDriver,
  setViewContentDatabase,
  addIdentification,
  addNewAddress,
  updateIdentification,
  updateAddress,
} from "../../../redux/slices/databaseSlice";
import UploadComponent from "../../Upload";
import { ReactComponent as EditIcon } from "../../../icons/edit-icon.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "../../../types/store";
import durationPlugin from "dayjs/plugin/duration";

// Extend dayjs with the duration plugin
dayjs.extend(durationPlugin);

// Declare the module augmentation for TypeScript
declare module "dayjs" {
  interface Dayjs {
    duration: typeof durationPlugin;
  }
}
interface IDriverForm {
  handleCloseSidePanel: () => void;
}
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import CustomDatePicker from "../../Common/CustomDatePicker";

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);

const convertIsoToDayjsObject = (isoString: string) => {
  const dayjsObject = dayjs(isoString);

  if (!dayjsObject.isValid()) {
    throw new Error("Invalid ISO string");
  }

  return dayjsObject;
};
type NotificationType = "success" | "info" | "warning" | "error";

const DriversForm = ({ handleCloseSidePanel }: IDriverForm) => {
  const [api, contextHolder] = notification.useNotification();
  const { selectedDriver, viewContentDatabase } = useAppSelector(
    (state: RootState) => state.database
  );
  const [filesArr, setFilesArr] = useState<IFile[]>([]);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);

  const dispatch = useAppDispatch();

  const randomDriverId = useMemo(() => {
    return Math.floor(100000 + Math.random() * 900000);
  }, []);

  const [form] = Form.useForm();
  const onSubmit = async (values: any) => {
    const identificationData = {
      details: {
        ...values.identification_id_list,
      },
      id_number: values.driverId,
      id_files: [],
    };

    const addressData = {
      line1: values.address.fullAddress,
      address_type: values.address.type,
    };

    if (selectedDriver?.id && Object.keys(selectedDriver).length > 0) {
      const resultAction: any = await dispatch(
        updateIdentification({
          id: selectedDriver.identification_id_list,
          data: identificationData,
        })
      );

      const resultAction2: any = await dispatch(
        updateAddress({ id: selectedDriver.address_id, data: addressData })
      );

      if (resultAction && resultAction2) {
        const updatedValues = {
          ...values,
          dob: dayjs(values.dob).format("DD-MM-YYYY"),
          identification_id_list: resultAction.id,
          address_id: resultAction.id,
        };
        dispatch(
          updateDriver({
            payload: updatedValues,
            id: selectedDriver?.id,
          })
        );
        handleCloseSidePanel();
      } else {
        console.log("ERROR");
      }

      handleCloseSidePanel();
    } else {
      const resultAction = await dispatch(
        addIdentification(identificationData)
      );

      const resultAction2 = await dispatch(addNewAddress(addressData));

      if (
        addIdentification.fulfilled.match(resultAction) &&
        addNewAddress.fulfilled.match(resultAction2)
      ) {
        const updatedValues = {
          ...values,
          dob: dayjs(values.dob).format("YYYY-MM-DD HH:mm:ss"),
          identification_id_list: resultAction.payload.id,
          address_id: resultAction2.payload.id,
        };
        dispatch(addNewDriver(updatedValues));
        handleCloseSidePanel();
      } else {
        console.log("ERROR");
      }
    }
  };

  useEffect(() => {
    if (selectedDriver && Object.keys(selectedDriver).length > 0) {
      const valuesToMaped = selectedDriver;
      setFilesArr(valuesToMaped?.files || []);
      form.setFieldsValue({
        address: {
          type: valuesToMaped?.expand?.address_id?.address_type,
          fullAddress: valuesToMaped?.expand?.address_id?.line1,
        },
        id: valuesToMaped.id,
        driverId: valuesToMaped.id,
        name: valuesToMaped.name,
        phone_number: valuesToMaped.phone_number,
        dob:
          valuesToMaped.dob && valuesToMaped.dob.length > 0
            ? dayjs(valuesToMaped.dob).format("YYYY-MM-DD")
            : "",
        identification_id_list: {
          pan: valuesToMaped?.expand?.identification_id_list?.details?.pan,
          aadhar:
            valuesToMaped?.expand?.identification_id_list?.details?.aadhar,
          drivingLicense:
            valuesToMaped?.expand?.identification_id_list?.details
              ?.drivingLicense,
        },
        monthly_salary: valuesToMaped.monthly_salary,
        daily_salary: valuesToMaped.daily_salary,
        timing: {
          start: convertIsoToDayjsObject(valuesToMaped?.timing?.start),
          end: convertIsoToDayjsObject(valuesToMaped?.timing?.end),
        },
        off_day: valuesToMaped.off_day,
        notes: valuesToMaped.notes,
        files: valuesToMaped?.files || [],
      });
    } else {
      form.setFieldsValue({
        driverId: randomDriverId.toString(),
      });
    }
  }, [selectedDriver]);

  const handleUploadUrl = (file: IFile) => {
    const tempFilesArr = [...filesArr, file];
    setFilesArr(tempFilesArr);
  };

  const formatTime = (timeString: string): string => {
    return dayjs(timeString).format("h:mm A"); // Changed format here
  };

  const disabledEndTime = () => {
    const startTime = form.getFieldValue(["timing", "start"]);

    if (!startTime) {
      return {};
    }
    const startDate = new Date(startTime);

    return {
      disabledHours: () =>
        Array.from({ length: startDate.getHours() }, (_, i) => i),

      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === startDate.getHours()) {
          return Array.from(
            { length: startDate.getMinutes() + 1 },
            (_, i) => i
          );
        }
        return [];
      },
    };
  };

  const calculateDuration = (start: any, end: any) => {
    const startTime = dayjs(start);
    const endTime = dayjs(end);
    const diff = endTime.diff(startTime);
    const durationObj = dayjs.duration(diff);
    const hours = Math.floor(durationObj.asHours());
    const minutes = durationObj.minutes();
    return `${hours}h ${minutes}m`;
  };
  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <div className={styles.header}>
            {Object.keys(selectedDriver).length
              ? viewContentDatabase
                ? "Driver"
                : "Edit Driver"
              : "New Driver"}
          </div>
          <div className={styles.primaryText}>
            {Object.keys(selectedDriver).length
              ? viewContentDatabase
                ? "View driver details"
                : "Update or modify driver details"
              : "Add details of new driver"}
          </div>
        </div>
        <Form
          onFinishFailed={(err) => {
            //for errors
            console.log("err", err);
          }}
          onFinish={(values) => {
            // passed validation
            const valuesToSubmit = {
              ...values,
              files: filesArr,
              monthly_salary: Number(values?.monthly_salary),
              daily_salary: Number(values?.daily_salary),
              phone_number: values?.phone_number.startsWith("+91")
                ? values?.phone_number
                : `+91${values?.phone_number}`,
              // timing: {
              //   start: parseTime(values.timing.start),
              //   end: parseTime(values.timing.end),
              // },
            };
            onSubmit(valuesToSubmit);
          }}
          requiredMark={CustomizeRequiredMark}
          layout="vertical"
          form={form}
          disabled={viewContentDatabase}
          className={styles.form}
        >
          <div className={styles.typeContainer}>
            <Form.Item
              name="driverId"
              id="driverId"
              label="Driver ID"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input placeholder="Enter Driver ID..." disabled />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name="name"
              id="name"
              label="Name"
            >
              <Input placeholder="Enter Name..." />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please enter your phone number.",
                },
                {
                  pattern: /^(\+91)?[6-9][0-9]{9}$/,
                  message: "Please enter a valid Indian phone number",
                },
              ]}
              name="phone_number"
              id="phone_number"
              label="Phone Number"
              getValueProps={(value) => ({
                value: value ? value.replace(/^\+91/, "") : "",
              })}
              // Ensure +91 is stripped when user enters phone number
              getValueFromEvent={(e) => {
                const inputValue = e.target.value;
                return inputValue.replace(/^\+91\s?/, ""); // Remove +91 if present
              }}
            >
              <Input prefix="+91" type="number" placeholder="Enter phone..." />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: false,
                },
              ]}
              name="dob"
              id="dob"
              label="Date of birth"
            >
              <CustomDatePicker
                showTime={false}
                showHour={false}
                showMinute={false}
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </div>
          {/* identification_id_list */}
          <Form.Item
            name="identification_id_list"
            id="identification_id_list"
            label="Unique IDs"
            className={styles.secondaryContainer}
          >
            <Input.Group className={"custom-input-group"}>
              <div className={styles.typeContainer}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name={["identification_id_list", "pan"]}
                  label="PAN Number"
                >
                  <Input placeholder="Enter PAN..." />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name={["identification_id_list", "aadhar"]}
                  label="Aadhaar Number"
                >
                  <Input placeholder="Enter aadhar " />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name={["identification_id_list", "drivingLicense"]}
                  label="Driver License"
                >
                  <Input placeholder="Enter driving  license" />
                </Form.Item>
              </div>
            </Input.Group>
          </Form.Item>
          <Form.Item
            name="address"
            id="address"
            label="Address"
            className={styles.secondaryContainer}
          >
            <Input.Group className={"custom-input-group"}>
              <div className={styles.typeContainer}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name={["address", "type"]}
                  label="Type"
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select One"
                    dropdownRender={(menu) => <>{menu}</>}
                    options={ADDRESS_TYPE.map((address) => ({
                      label: address.label,
                      value: address.value,
                    }))}
                  />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name={["address", "fullAddress"]}
                  label="Full Address"
                >
                  <Input.TextArea
                    className={styles.textarea}
                    placeholder="Enter address..."
                  />
                </Form.Item>
              </div>
            </Input.Group>
          </Form.Item>
          <div className={styles.typeContainer}>
            <Form.Item
              name="monthly_salary"
              id="monthly_salary"
              label="Salary per month"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter salary per month..."
                min={0}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: false,
                },
              ]}
              name="daily_salary"
              id="daily_salary"
              label="Daily Wages"
            >
              <Input
                type="number"
                placeholder="Enter daily wage..."
                min={0}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </Form.Item>
          </div>
          <Form.Item id="timing" name="timing">
            <Input.Group className={styles.twoSections}>
              <div className={styles.section}>
                <Form.Item
                  name={["timing", "start"]}
                  label="Shift Start Time"
                  rules={[
                    { required: false, message: "Please select a start time" },
                  ]}
                  getValueProps={(value) => {
                    if (!value) return { value: undefined };
                    const timeObj = dayjs(value);
                    return { value: timeObj.isValid() ? timeObj : undefined };
                  }}
                  getValueFromEvent={(time) => {
                    if (!time) {
                      setStartTime(null);
                      return undefined;
                    }

                    setStartTime(time);

                    return dayjs()
                      .hour(time.hour())
                      .minute(time.minute())
                      .second(0)
                      .millisecond(0)
                      .toISOString();
                  }}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    use12Hours
                    format="h:mm A"
                  />
                </Form.Item>
              </div>

              <div className={styles.section}>
                <Form.Item
                  name={["timing", "end"]}
                  label="Shift End Time"
                  rules={[
                    { required: false, message: "Please select an end time" },
                  ]}
                  getValueProps={(value) => {
                    if (!value) return { value: undefined };
                    const timeObj = dayjs(value);
                    return { value: timeObj.isValid() ? timeObj : undefined };
                  }}
                  getValueFromEvent={(time) => {
                    if (!time) return undefined;

                    return dayjs()
                      .hour(time.hour())
                      .minute(time.minute())
                      .second(0)
                      .millisecond(0)
                      .toISOString();
                  }}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    use12Hours
                    format="h:mm A"
                    disabled={!startTime} // Disable until start time is selected
                    disabledTime={disabledEndTime}
                  />
                </Form.Item>
              </div>

              {/* <div className={styles.section}>
                <Form.Item
                  rules={[
                    {
                      required: false,
                      message: "Please select an start time",
                    },
                  ]}
                  name={["timing", "start"]}
                  label="Shift Start Time"
                  getValueProps={(value) => {
                    if (!value) return { value: undefined };
                    try {
                      const timeObj = dayjs(value, "h:mm A", true);
                      return { value: timeObj.isValid() ? timeObj : undefined };
                    } catch (error) {
                      console.error("Error parsing time:", error);
                      return { value: undefined };
                    }
                  }}
                  getValueFromEvent={(time) => {
                    if (!time) return undefined;

                    // Create a new Day.js object based on the selected time
                    const selectedTime = dayjs(time);

                    // Combine with today's date to get an ISO format
                    const isoDate = dayjs()
                      .date(selectedTime.date())
                      .month(selectedTime.month())
                      .year(selectedTime.year())
                      .hour(selectedTime.hour())
                      .minute(selectedTime.minute())
                      .second(0)
                      .millisecond(0);

                    return isoDate?.toISOString();
                  }}
                >
                  <TimePicker
                    style={{
                      width: "100%",
                    }}
                    use12Hours
                    format="h:mm A"
                  />
                </Form.Item>
              </div>
              <div className={styles.section}>
                <Form.Item
                  rules={[
                    {
                      required: false,
                      message: "Please select an end time",
                    },
                  ]}
                  name={["timing", "end"]}
                  label="Shift End Time"
                  getValueProps={(value) => {
                    if (!value) return { value: undefined };
                    try {
                      const timeObj = dayjs(value, "h:mm A", true);
                      return { value: timeObj.isValid() ? timeObj : undefined };
                    } catch (error) {
                      console.error("Error parsing time:", error);
                      return { value: undefined };
                    }
                  }}
                  getValueFromEvent={(time) => {
                    if (!time) return undefined;

                    // Create a new Day.js object based on the selected time
                    const selectedTime = dayjs(time);

                    // Combine with today's date to get an ISO format
                    const isoDate = dayjs()
                      .date(selectedTime.date())
                      .month(selectedTime.month())
                      .year(selectedTime.year())
                      .hour(selectedTime.hour())
                      .minute(selectedTime.minute())
                      .second(0)
                      .millisecond(0);

                    return isoDate?.toISOString();
                  }}
                >
                  <TimePicker
                    style={{
                      width: "100%",
                    }}
                    disabledTime={disabledEndTime}
                    use12Hours
                    format="h:mm A"
                  />
                </Form.Item>
              </div> */}

              <div className={styles.totalText}>
                <Form.Item noStyle shouldUpdate>
                  {() => {
                    const start = form.getFieldValue(["timing", "start"]);
                    const end = form.getFieldValue(["timing", "end"]);
                    if (start && end) {
                      return (
                        <>
                          Total working hours: {formatTime(start)} -{" "}
                          {formatTime(end)} ({calculateDuration(start, end)})
                        </>
                      );
                    }
                    return "Total working hours: Not set";
                  }}
                </Form.Item>
              </div>
            </Input.Group>
          </Form.Item>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: false,
                },
              ]}
              name="off_day"
              id="off_day"
              label="Off Day"
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Select One"
                dropdownRender={(menu) => <>{menu}</>}
                options={[
                  { value: "Saturday", label: "Saturday" },
                  { value: "Sunday", label: "Sunday" },
                ].map((day) => ({
                  label: day.label,
                  value: day.value,
                }))}
              />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <div className={styles.text}>
              <p>Attach Files</p>
            </div>
            <UploadComponent handleUploadUrl={handleUploadUrl} isMultiple />
          </div>
          <div className={styles.typeContainer}>
            <Form.Item label="Notes" id="notes" name="notes">
              <Input.TextArea
                className={styles.textarea}
                placeholder="Add a note...."
              />
            </Form.Item>
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
            onClick={() => {
              form.submit();
            }}
            className="primary-btn"
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default DriversForm;
