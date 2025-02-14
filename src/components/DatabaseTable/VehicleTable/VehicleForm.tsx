/* eslint-disable */
import {
  Select,
  Upload,
  message,
  notification,
  Switch,
  Form,
  Input,
  DatePicker,
  AutoComplete,
  Button,
} from "antd";
import { Fragment, useEffect, useState } from "react";
import type { UploadProps } from "antd";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  addNewVehicle,
  getDrivers,
  getVehicleGroup,
  updateVehicle,
  setViewContentDatabase,
  getVehicleGroupOptions,
} from "../../../redux/slices/databaseSlice";
import { debounce } from "lodash";
import SecondaryBtn from "../../SecondaryBtn";
import PrimaryBtn from "../../PrimaryBtn";
import { ReactComponent as EditIcon } from "../../../icons/edit-icon.svg";
import { ReactComponent as UploadIcon } from "../../../icons/uploadCloud.svg";
import { FuelType, IFile } from "../../../constants/database";
import styles from "../DutyTypeTable/index.module.scss";
import CustomizeRequiredMark from "../../Common/CustomizeRequiredMark";
import dayjs from "dayjs";
import { RootState } from "../../../types/store";
import UploadComponent from "../../Upload";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import CustomDatePicker from "../../Common/CustomDatePicker";

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
interface IVehicleForm {
  handleCloseSidePanel: () => void;
}
type NotificationType = "success" | "info" | "warning" | "error";

const VehicleForm = ({ handleCloseSidePanel }: IVehicleForm) => {
  const [api, contextHolder] = notification.useNotification();
  const [registrationDocument, setRegistrationDocument] = useState<IFile>();
  const [insuranceDocument, setInsuranceDocument] = useState<IFile>();
  const [rtoDocument, setRtoDocument] = useState<IFile>();
  const [vehicleDocuments, setVehicleDocuments] = useState<IFile[]>([]);
  const [loanDocument, setLoanDocument] = useState<IFile>();

  const handleRegistrationDocs = (file: IFile) => {
    setRegistrationDocument(file);
  };

  const handleInsuranceDocs = (file: IFile) => {
    setInsuranceDocument(file);
  };

  const handleRTODoc = (file: IFile) => {
    setRtoDocument(file);
  };

  const handleVehicleDocuments = (file: IFile) => {
    const tempFilesArr = [...vehicleDocuments, file];
    setVehicleDocuments(tempFilesArr);
  };

  const handleLoanDocument = (file: IFile) => {
    setLoanDocument(file);
  };

  const dispatch = useAppDispatch();
  const {
    driverOption: options,
    selectedVehicle,
    viewContentDatabase,
    vehicleGroupData,
  } = useAppSelector((state: RootState) => state.database);
  const [isActive, setIsActive] = useState(false); // Track checkbox value in state

  // Function to handle changes in form values
  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues?.loan?.isActive !== undefined) {
      setIsActive(changedValues?.loan?.isActive);
    }
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info?.file?.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info?.file?.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const getPanelValue = (searchText: string) => {
    if (searchText) {
      dispatch(
        getDrivers({
          search: searchText,
        })
      );
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

  const [form] = Form.useForm();

  useEffect(() => {
    if (Object.keys(selectedVehicle).length) {
      const values = selectedVehicle;
      setRegistrationDocument(
        values?.registration?.registrationDocument || null
      );
      setInsuranceDocument(values?.insurance?.insuranceDocument || null);
      setRtoDocument(values?.rto?.registrationDocument || null);
      setVehicleDocuments(values?.vehicleDocuments || []);
      setLoanDocument(values?.loan?.loanDocument || null);

      form.setFieldsValue(values);
      form.setFieldValue("vehicleGroupId", {
        value: selectedVehicle?.vehicleGroupId?._id,
        label: selectedVehicle?.vehicleGroupId?.name,
      });
      form.setFieldValue("driverId", {
        value: selectedVehicle?.driverId?._id,
        label: selectedVehicle?.driverId?.name,
      });
      setIsActive(values?.loan?.isActive);
    }
  }, [selectedVehicle]);

  useEffect(() => {
    dispatch(getVehicleGroup({ page: "1", size: 10 }));
    dispatch(
      getDrivers({
        page: "1",
        limit: "10",
        search: "",
      })
    );
  }, []);

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <div className={styles.header}>
            {Object.keys(selectedVehicle).length
              ? viewContentDatabase
                ? "Vehicle"
                : "Edit Vehicle"
              : "New Vehicle"}
          </div>
          <div className={styles.primaryText}>
            {Object.keys(selectedVehicle).length
              ? viewContentDatabase
                ? "View vehicle details"
                : "Update or modify vehicle details"
              : "Add details of your vehicle"}
          </div>
        </div>
        <Form
          requiredMark={CustomizeRequiredMark}
          disabled={viewContentDatabase}
          layout="vertical"
          form={form}
          onFinish={(Values) => {
            console.log(Values, "Values");
            if (Object.keys(selectedVehicle).length) {
              const tempValues = {
                ...Values,
                driverId: Values.driverId.value,
                vehicleGroupId: Values.vehicleGroupId.value,
              };

              console.log(tempValues, "tempValues");
              dispatch(
                updateVehicle({ id: selectedVehicle?._id, payload: tempValues })
              );
            } else {
              dispatch(addNewVehicle(Values));
            }
          }}
          initialValues={{
            modelName: "",
            vehicleNumber: "",
            fuelType: "",
            vehicleGroupId: "",
            driverId: "",
            fastTagId: "",
            registration: null,
            insurance: null,
            rto: null,
            parts: null,
            carExpiryDate: Date.now(),
            files: null,
            notes: null,
            loan: null,
          }}
          onValuesChange={handleValuesChange}
          className={styles.form}
        >
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              label="Model Name"
              name="modelName"
              id="modelName"
            >
              <Input placeholder="Enter model name..." />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              label="Vehicle Number"
              name="vehicleNumber"
              id="vehicleNumber"
            >
              <Input placeholder="Enter model name..." />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              label="Fuel type"
              name="fuelType"
              id="fuelType"
            >
              <Select
                style={{ width: "100%" }}
                allowClear
                placeholder="Select One"
                dropdownRender={(menu) => <>{menu}</>}
                options={FuelType.map((fuel) => ({
                  label: fuel.label,
                  value: fuel.value,
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
              label="Category - Vehicle Group"
              name="vehicleGroupId"
              id="vehicleGroupId"
            >
              <Select
                allowClear
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
                filterOption={false}
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
              label="Assigned Driver"
              name="driverId"
              id="driverId"
            >
              <Select
                showSearch
                allowClear
                options={options?.map((option: { value: any; label: any }) => ({
                  value: option.value,
                  label: option.label,
                }))}
                onSearch={(text) => getPanelValue(text)}
                placeholder="Search drivers"
                fieldNames={{ label: "label", value: "value" }}
                filterOption={false}
                notFoundContent={<div>No search result</div>}
              />
            </Form.Item>
            <div className={styles.secondaryText}>
              "If you don’t assign a driver then you’ll get an option to assign
              a driver for this vehicle during each booking"
            </div>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              label="FASTag Number"
              name="fastTagId"
              id="fastTagId"
            >
              <Input placeholder="Enter model name..." />
            </Form.Item>
          </div>
          {/* registration */}
          <div className={styles.secondaryContainer}>
            <Form.Item name="registration" label="Registration">
              <Input.Group className={"custom-input-group"}>
                <Form.Item
                  label="Owner name"
                  name={["registration", "ownerName"]}
                >
                  <Input placeholder="Owner Name" />
                </Form.Item>
                <Form.Item label="Date" name={["registration", "date"]}>
                  <CustomDatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item
                  label="Document"
                  name={["registration", "registrationDocument"]}
                >
                  <UploadComponent
                    handleUploadUrl={handleRegistrationDocs}
                    isMultiple={false}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </div>
          {/* Insurance */}
          <Form.Item
            className={styles.secondaryContainer}
            name="insurance"
            label="Insurance"
          >
            <Input.Group className={"custom-input-group"}>
              <div className={styles.typeContainer}>
                <Form.Item
                  label="Company name"
                  name={["insurance", "companyName"]}
                >
                  <Input placeholder="Enter company name..." />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item
                  label="Policy Number"
                  name={["insurance", "policyNumber"]}
                >
                  <Input placeholder="Enter policy number..." />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item label="Issue Date" name={["insurance", "issueDate"]}>
                  <CustomDatePicker format="DD-MM-YYYY" />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item label="Due Date" name={["insurance", "dueDate"]}>
                  <CustomDatePicker format="DD-MM-YYYY" />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item
                  label="Premium Amount"
                  name={["insurance", "premiumAmount"]}
                >
                  <Input
                    placeholder="Enter premium amount..."
                    type={"number"}
                    min={0}
                  />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item
                  label="Cover Amount"
                  name={["insurance", "coverAmount"]}
                >
                  <Input
                    placeholder="Enter cover amount..."
                    type={"number"}
                    min={0}
                  />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item
                  label="Insurance Document"
                  name={["insurance", "insuranceDocument"]}
                >
                  <UploadComponent
                    handleUploadUrl={handleInsuranceDocs}
                    isMultiple={false}
                  />
                </Form.Item>
              </div>
            </Input.Group>
          </Form.Item>
          {/* RTO */}
          <Form.Item
            className={styles.secondaryContainer}
            name="rto"
            label="RTO"
          >
            <Input.Group className={"custom-input-group"}>
              <div className={styles.typeContainer}>
                <Form.Item label="Owner name" name={["rto", "ownerName"]}>
                  <Input placeholder="Enter owner name..." />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item label="Registration Date" name={["rto", "date"]}>
                  <CustomDatePicker format="DD-MM-YYYY" />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item label="RTO Document" name={["rto", "rtoDocument"]}>
                  <UploadComponent
                    handleUploadUrl={handleRTODoc}
                    isMultiple={false}
                  />
                </Form.Item>
              </div>
            </Input.Group>
          </Form.Item>
          {/* parts */}
          <Form.Item
            className={styles.secondaryContainer}
            name="parts"
            label="Parts"
          >
            <Input.Group className={"custom-input-group"}>
              <div className={styles.typeContainer}>
                <Form.Item
                  label="Chasis number"
                  name={["parts", "chasisNumber"]}
                >
                  <Input placeholder="Enter chassis number..." />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item
                  label="Engine number"
                  name={["parts", "engineNumber"]}
                >
                  <Input placeholder="Enter engine number..." />
                </Form.Item>
              </div>
            </Input.Group>
          </Form.Item>
          <div className={styles.typeContainer}>
            <Form.Item label="Car expiry Date" name="carExpiryDate">
              <CustomDatePicker format="DD-MM-YYYY" />
            </Form.Item>
          </div>
          {/* TODO- LOAN */}

          <Form.Item name="loan" label="">
            <Input.Group
              className={styles.secondaryContainer}
              style={{
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "25px",
                }}
              >
                <div className={styles.text}>Loan</div>
                <Form.Item
                  valuePropName="checked"
                  name={["loan", "isActive"]}
                  id="isActive"
                >
                  <Switch />
                </Form.Item>
              </div>

              {isActive && (
                <Fragment>
                  <div className={styles.typeContainer}>
                    <Form.Item
                      label="Emi amount"
                      name={["loan", "emiAmount"]}
                      rules={[
                        {
                          required: true,
                          message: "EMI Amount is required",
                        },
                      ]}
                    >
                      <Input type="number" placeholder="Enter Emi amount" />
                    </Form.Item>
                  </div>
                  <div className={styles.typeContainer}>
                    <Form.Item
                      label="Start Date"
                      name={["loan", "startDate"]}
                      rules={[
                        {
                          required: true,
                          message: "startDate is required",
                        },
                      ]}
                    >
                      <CustomDatePicker format="DD-MM-YYYY" />
                    </Form.Item>
                  </div>
                  <div className={styles.typeContainer}>
                    <Form.Item
                      label="End Date"
                      name={["loan", "endDate"]}
                      rules={[
                        {
                          required: true,
                          message: "endDate is required",
                        },
                      ]}
                    >
                      <CustomDatePicker format="DD-MM-YYYY" />
                    </Form.Item>
                  </div>
                  <div className={styles.typeContainer}>
                    <Form.Item
                      label="Bank Name"
                      name={["loan", "bankName"]}
                      rules={[
                        {
                          required: true,
                          message: "Bank name is required",
                        },
                      ]}
                    >
                      <Input placeholder="Enter bank name" />
                    </Form.Item>
                  </div>
                  <div className={styles.typeContainer}>
                    <Form.Item
                      label="EMI Date (Every month)"
                      name={["loan", "emiDate"]}
                      rules={[
                        {
                          required: true,
                          message: "EMI date is required",
                        },
                      ]}
                    >
                      <CustomDatePicker format="DD" />
                    </Form.Item>
                  </div>
                  <div className={styles.typeContainer}>
                    <Form.Item
                      label="Loan Document"
                      name={["loan", "loanDocument"]}
                    >
                      <UploadComponent
                        handleUploadUrl={handleVehicleDocuments}
                        isMultiple
                      />
                    </Form.Item>
                  </div>
                </Fragment>
              )}
            </Input.Group>
          </Form.Item>

          <div className={styles.typeContainer}>
            <div className={styles.text}>
              <p>Attach Files</p>
            </div>
            <UploadComponent
              handleUploadUrl={handleLoanDocument}
              isMultiple={false}
            />
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              label="Notes"
              name="notes"
              id="notes"
              rules={[
                {
                  // required: true,
                  // message: "notes is required",
                },
              ]}
            >
              <Input.TextArea
                className={styles.textarea}
                placeholder="Add a note...."
                defaultValue={""}
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

export default VehicleForm;
