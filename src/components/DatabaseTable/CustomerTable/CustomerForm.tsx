/* eslint-disable */
import {
  Select,
  Upload,
  notification,
  Form,
  Input,
  Checkbox,
  Spin,
  Button,
} from "antd";
import type { UploadProps } from "antd";
import SecondaryBtn from "../../SecondaryBtn";
import PrimaryBtn from "../../PrimaryBtn";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  addNewCustomer,
  updateCustomer,
  setViewContentDatabase,
} from "../../../redux/slices/databaseSlice";
import UploadComponent from "../../Upload";
import { ReactComponent as EditIcon } from "../../../icons/edit-icon.svg";
import { ReactComponent as UploadIcon } from "../../../icons/uploadCloud.svg";
import { STATES, CUSTOMER_TAX_TYPES, IFile } from "../../../constants/database";
import { useState, useEffect } from "react";
import styles from "../DutyTypeTable/index.module.scss";
import CustomizeRequiredMark from "../../Common/CustomizeRequiredMark";

interface ICustomerForm {
  handleCloseSidePanel: () => void;
}

type NotificationType = "success" | "info" | "warning" | "error";

const CustomerForm = ({ handleCloseSidePanel }: ICustomerForm) => {
  const dispatch = useAppDispatch();
  const {
    selectedCustomer,
    customersStates,
    updateCustomersStates,
    viewContentDatabase,
  } = useAppSelector((state) => state.database);
  console.log("I RUNI", selectedCustomer);
  const { Dragger } = Upload;
  const [api, contextHolder] = notification.useNotification();
  const [customerPaylod, setCustomerPayload] = useState({
    customer_code: "",
    name: "",
    address: "",
    pin_code: "",
    state: "",
    email: "",
    files: [],
    autoCreateInvoice: false,
    default_discount: 0,
    notes: "",
    tax_details: {
      type: "",
      billingName: "",
      taxId: "66cb7ee1287de64cae6c6967",
      gstNumber: "",
      billingAddress: "",
    },
  });
  const [filesArr, setFilesArr] = useState<IFile[]>([]);

  const handleUploadUrl = (file: IFile) => {
    const tempFilesArr = [...filesArr, file];
    console.log(tempFilesArr, "tempFilesArr");
    setFilesArr(tempFilesArr);
  };

  const handleSelectChange = (value: string) => {
    setCustomerPayload({ ...customerPaylod, state: value });
  };
  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Customer added",
      description: "Customer added to the database",
    });
  };

  const handleCheckbox = (e: any) => {
    setCustomerPayload({
      ...customerPaylod,
      autoCreateInvoice: e.target.checked,
    });
  };

  const handleTaxesSelect = (value: string) => {
    setCustomerPayload({
      ...customerPaylod,
      tax_details: { ...customerPaylod.tax_details, type: value },
    });
  };

  const onChangetax_details = (e: any) => {
    setCustomerPayload({
      ...customerPaylod,
      tax_details: {
        ...customerPaylod.tax_details,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = (values: any) => {
    if (Object.keys(selectedCustomer).length) {
      dispatch(updateCustomer({ payload: values, id: selectedCustomer?.id }));
    } else {
      dispatch(addNewCustomer(values));
    }
  };
  const [form] = Form.useForm();

  useEffect(() => {
    if (Object.keys(selectedCustomer).length) {
      console.log(selectedCustomer, "HELLO");
      setFilesArr(selectedCustomer?.files || []);
      form.setFieldsValue({
        customer_code: selectedCustomer?.customer_code,
        name: selectedCustomer?.name,
        address: selectedCustomer?.address,
        pin_code: Number(selectedCustomer?.pin_code),
        state: selectedCustomer?.state,
        email: selectedCustomer?.email,
        phone_number: selectedCustomer?.phone_number,
        autoCreateInvoice: selectedCustomer?.autoCreateInvoice,
        default_discount: selectedCustomer?.default_discount,
        type: selectedCustomer?.tax_details?.type,
        billingName: selectedCustomer?.tax_details?.billingName,
        taxId: selectedCustomer?.tax_details?.taxId,
        gstNumber: selectedCustomer?.tax_details?.gstNumber,
        billingAddress: selectedCustomer?.tax_details?.billingAddress,
        files: selectedCustomer?.files,
      });
    }
  }, [selectedCustomer]);

  return (
    <div className={styles.formContainer}>
      {customersStates.loading && (
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
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <div className={styles.header}>
            {Object.keys(selectedCustomer).length
              ? viewContentDatabase
                ? "Customer"
                : "Edit Customer"
              : "New Customer"}
          </div>
          <div className={styles.primaryText}>
            {Object.keys(selectedCustomer).length
              ? viewContentDatabase
                ? "View customer details"
                : "Update or modify customer details"
              : "Add details of new customer"}
          </div>
        </div>
        <Form
          requiredMark={CustomizeRequiredMark}
          disabled={viewContentDatabase}
          layout="vertical"
          form={form}
          className={styles.form}
          onFinish={(values) => {
            console.log(values);
            const valuesToSend = {
              customer_code: values.customer_code,
              name: values.name,
              address: values.address,
              pin_code: Number(values.pin_code),
              state: values.state,
              email: values.email,
              phone_number: values.phone_number,
              autoCreateInvoice: values.autoCreateInvoice,
              default_discount: values.default_discount,
              tax_details: {
                type: values.type,
                billingName: values.billingName,
                taxId: values.taxId,
                gstNumber: values.gstNumber,
                billingAddress: values.billingAddress,
              },
              files: filesArr,
            };
            handleSubmit(valuesToSend);
          }}
          onFinishFailed={(error) => {
            console.log(error, "Error");
          }}
        >
          <div className={styles.typeContainer}>
            <Form.Item
              label="Customer Code"
              rules={[
                {
                  required: false,
                },
              ]}
              name="customer_code"
              id="customer_code"
            >
              <Input placeholder="Enter Customer code..." />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              label="Name"
              rules={[
                {
                  required: true,
                },
              ]}
              name="name"
              id="name"
            >
              <Input placeholder="Enter name..." name="name" />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              label="Address"
              rules={[
                {
                  required: true,
                },
              ]}
              name="address"
              id="address"
            >
              <Input.TextArea
                className={styles.textarea}
                placeholder="Enter address..."
              />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              label="Pin code"
              rules={[
                {
                  required: false,
                },
              ]}
              name="pin_code"
              id="pin_code"
            >
              <Input placeholder="Enter pin code..." />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              label="State"
              rules={[
                {
                  required: false,
                },
              ]}
              name="state"
              id="state"
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Select One"
                dropdownRender={(menu) => <>{menu}</>}
                options={STATES.map((state) => ({
                  label: state.label,
                  value: state.value,
                }))}
              />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              label="Phone Number"
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
            >
              <Input
                type="number"
                placeholder="Enter phone number..."
                defaultValue={""}
              />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              label="Email Address"
              rules={[
                {
                  required: false,
                },
              ]}
              name="email"
              id="email"
            >
              <Input
                type="email"
                name="email"
                placeholder="Enter email address..."
              />
            </Form.Item>
          </div>
          <Form.Item
            // name="identification_id_list"
            // id="identification_id_list"
            label="Customer Tax Details"
            className={styles.secondaryContainer}
          >
            <Input.Group className={"custom-input-group"}>
              {/* <div className={styles.customertax_details}> */}
              {/* <div className={styles.customerHeader}>Customer Tax Details</div> */}
              <div className={styles.typeContainer}>
                <Form.Item
                  label="Type"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                  name="type"
                  id="type"
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select One"
                    dropdownRender={(menu) => <>{menu}</>}
                    options={CUSTOMER_TAX_TYPES.map((state) => ({
                      label: state.label,
                      value: state.value,
                    }))}
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
                  label="GSTIN Number"
                  name="gstNumber"
                  id="gstNumber"
                >
                  <Input name={"gstNumber"} placeholder="Enter GSTIN ..." />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                  label="Billing Name"
                  name="billingName"
                  id="billingName"
                >
                  <Input
                    name={"billingName"}
                    placeholder="Enter Billing Name ..."
                  />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item
                  label="Billing Address"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                  name="billingAddress"
                  id="billingAddress"
                >
                  <Input.TextArea
                    className={styles.textarea}
                    name="billingAddress"
                    placeholder="Enter address..."
                  />
                </Form.Item>
              </div>
              <div className={styles.typeContainer}>
                <Form.Item
                  label="Taxes"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                  name="type"
                  id="type"
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select tax"
                    dropdownRender={(menu) => <>{menu}</>}
                    options={CUSTOMER_TAX_TYPES.map((state) => ({
                      label: state.label,
                      value: state.value,
                    }))}
                  />
                </Form.Item>
              </div>
              {/* <div className={styles.typeContainer}>
              <div className={styles.text}>
                <p>Taxes</p>
              </div>
              <Select
                style={{ width: "100%" }}
                placeholder="Select One"
                dropdownRender={(menu) => <>{menu}</>}
                options={CUSTOMER_TAX_TYPES.map((state) => ({
                  label: state.label,
                  value: state.value,
                }))}
              />
            </div> */}
              {/* </div> */}
            </Input.Group>
          </Form.Item>
          <div className={styles.typeContainer}>
            <Form.Item
              label="Default discount %"
              name="default_discount"
              id="default_discount"
              rules={[
                {
                  message: "Please enter a discount",
                },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === "")
                      return Promise.resolve();
                    if (value >= 0 && value <= 100) return Promise.resolve();
                    return Promise.reject(
                      new Error("Value must be between 0 and 100")
                    );
                  },
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter default discount..."
                onWheel={(e) => e.currentTarget.blur()}
                min={0}
                max={100}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <div className={styles.text}>
              <p>Attach Files</p>
            </div>
            <UploadComponent
              handleUploadUrl={handleUploadUrl}
              isMultiple
              files={filesArr[0]}
            />
          </div>
          <div className={styles.typeContainer}>
            <div className={styles.text}>
              <p>Notes</p>
            </div>
            <Form.Item name="notes" id="notes">
              <Input.TextArea
                className={styles.textarea}
                name="notes"
                placeholder="Add a note...."
              />
            </Form.Item>
          </div>
          <div className={styles.checkboxContainer}>
            <Form.Item
              valuePropName="checked"
              name="autoCreateInvoice"
              id="autoCreateInvoice"
            >
              <Checkbox>Auto create invoice when duty is completed</Checkbox>
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
            loading={customersStates?.loading || updateCustomersStates?.loading}
            className="primary-btn"
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerForm;
