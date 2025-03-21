/* eslint-disable */
import { Form, Input, Upload, Button, Collapse } from "antd";
import { ReactComponent as UploadIcon } from "../../../icons/uploadCloud.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-icon.svg";
import { ReactComponent as CrossIcon } from "../../../icons/x.svg";
import styles from "./index.module.scss";
import CustomizeRequiredMark from "../../../components/Common/CustomizeRequiredMark";
import UploadComponent from "../../../components/Upload";

const CompanyForm = () => {
  const [form] = Form.useForm();

  const handleSubmitForm = (values: any) => {
    console.log(values);
    // Handle form submission
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.header}>Company Details</div>
        <div className={styles.primaryText}>
          Add or update your company information
        </div>
      </div>
      <Form
        name="CompanyForm"
        layout="vertical"
        onFinishFailed={(err) => {
          console.log(err);
        }}
        onFinish={handleSubmitForm}
        form={form}
        initialValues={{
          name: "",
          email: "",
          phone: "",
          address: "",
          gstin: "",
          pan: "",
          logo: null,
          signature: null,
          // Additional details
          website: "",
          state: "",
          city: "",
          pincode: "",
          country: "",
          businessType: "",
          industry: "",
          registrationDate: "",
          taxRegistrationNumber: "",
        }}
        autoComplete="off"
        requiredMark={CustomizeRequiredMark}
      >
        <div className={styles.form}>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Company name is required",
                },
              ]}
              label="Company Name"
              name="name"
            >
              <Input type="text" placeholder="Enter company name" />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Phone number is required",
                },
              ]}
              label="Phone number"
              name="phone"
            >
              <Input type="tel" placeholder="Enter phone number" />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
              label="Email ID"
              name="email"
            >
              <Input type="email" placeholder="Enter email address" />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item label="Address" name="address">
              <Input.TextArea
                className={styles.textarea}
                placeholder="Enter company address"
              />
            </Form.Item>
          </div>

          <Collapse className={styles.detailsCollapse}>
            <Collapse.Panel header="Additional Details" key="1">
              <div className={styles.additionalDetails}>
                <div className={styles.typeContainer}>
                  <Form.Item label="Website" name="website">
                    <Input type="url" placeholder="Enter company website" />
                  </Form.Item>
                </div>
                <div className={styles.typeContainer}>
                  <Form.Item label="State" name="state">
                    <Input type="text" placeholder="Enter state" />
                  </Form.Item>
                </div>
                <div className={styles.typeContainer}>
                  <Form.Item label="City" name="city">
                    <Input type="text" placeholder="Enter city" />
                  </Form.Item>
                </div>
                <div className={styles.typeContainer}>
                  <Form.Item label="Pincode" name="pincode">
                    <Input type="text" placeholder="Enter pincode" />
                  </Form.Item>
                </div>
                <div className={styles.typeContainer}>
                  <Form.Item label="Country" name="country">
                    <Input type="text" placeholder="Enter country" />
                  </Form.Item>
                </div>
                <div className={styles.typeContainer}>
                  <Form.Item label="Business Type" name="businessType">
                    <Input type="text" placeholder="Enter business type" />
                  </Form.Item>
                </div>
                <div className={styles.typeContainer}>
                  <Form.Item label="Industry" name="industry">
                    <Input type="text" placeholder="Enter industry" />
                  </Form.Item>
                </div>
                <div className={styles.typeContainer}>
                  <Form.Item label="Registration Date" name="registrationDate">
                    <Input type="date" placeholder="Select registration date" />
                  </Form.Item>
                </div>
                <div className={styles.typeContainer}>
                  <Form.Item
                    label="Tax Registration Number"
                    name="taxRegistrationNumber"
                  >
                    <Input
                      type="text"
                      placeholder="Enter tax registration number"
                    />
                  </Form.Item>
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>
          <div className={styles.typeContainer}>
            <Form.Item label="Duty Slip - Terms and Condition" name="dutySlipNote" id="dutySlipNote">
              <Input.TextArea
                className={"textarea"}
                placeholder="Add a note...."
                defaultValue={""}
              />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              label="Attach Signature"
              name="signature"
              rules={[
                {
                  required: true,
                  message: "Signature is required",
                },
              ]}
            >
              <UploadComponent
                handleUploadUrl={(url) => {
                  form.setFieldValue("signature", url);
                }}
                isMultiple={false}
              />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item label="Notes" name="notes" id="notes">
              <Input.TextArea
                className={"textarea"}
                placeholder="Add a note...."
                defaultValue={""}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CompanyForm;
