/* eslint-disable */
import {
  Form,
  Input,
  Upload,
  Button,
  Collapse,
  Select,
  notification,
  Switch,
} from "antd";
import { ReactComponent as UploadIcon } from "../../../icons/uploadCloud.svg";
import { ReactComponent as EditIcon } from "../../../icons/edit-icon.svg";
import { ReactComponent as CrossIcon } from "../../../icons/x.svg";
import { DownOutlined } from "@ant-design/icons";
import { useState, useEffect, Fragment } from "react";
import styles from "./index.module.scss";
import CustomizeRequiredMark from "../../../components/Common/CustomizeRequiredMark";
import UploadComponent from "../../../components/Upload";
import SecondaryBtn from "../../../components/SecondaryBtn";
import PrimaryBtn from "../../../components/PrimaryBtn";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  createCompany,
  updateCompany,
} from "../../../redux/slices/companySlice";
import { IFile } from "../../../constants/database";

interface ICompanyForm {
  handleCloseSidePanel: () => void;
}

const CompanyForm = ({ handleCloseSidePanel }: ICompanyForm) => {
  const [activeKey, setActiveKey] = useState<string | string[]>(["1"]);
  const { Panel } = Collapse;
  const { Option } = Select;
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { currentCompany, loading } = useAppSelector((state) => state.company);
  const [api, contextHolder] = notification.useNotification();
  const [signature, setSignature] = useState<IFile>();

  // State for collapsible sections
  const [showDetails, setShowDetails] = useState(false);
  const [showGST, setShowGST] = useState(false);

  const handleSignature = (file: IFile) => {
    setSignature(file);
  };

  const customHeader = (
    <div className="details-header">
      <span>Details</span>
      <DownOutlined className="details-arrow" />
    </div>
  );

  useEffect(() => {
    if (currentCompany) {
      form.setFieldsValue({
        companyName: currentCompany.companyName,
        address: currentCompany.address,
        emailId: currentCompany.emailId,
        phoneNumber: currentCompany.phoneNumber,
        details: currentCompany.details,
        dutySlipTc: currentCompany.dutySlipTc,
        signature: currentCompany.signature,
        notes: currentCompany.notes,
      });
      setSignature(currentCompany.signature);
      setShowDetails(!!currentCompany.details);
      setShowGST(!!currentCompany.details?.gstInNumber);
    }
  }, [currentCompany, form]);

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        signature,
      };

      if (currentCompany?._id) {
        await dispatch(
          updateCompany({
            id: currentCompany._id,
            companyData: formData,
          })
        ).unwrap();
      } else {
        await dispatch(createCompany(formData)).unwrap();
      }
      handleCloseSidePanel();
    } catch (error: any) {
      api.error({
        message: "Error",
        description: error.message || "Something went wrong",
      });
    }
  };

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <div className={styles.header}>
            {currentCompany ? "Edit Company" : "New Company"}
          </div>
          <div className={styles.primaryText}>
            {currentCompany
              ? "Update or modify company details"
              : "Add details of your company"}
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          requiredMark={CustomizeRequiredMark}
          onFinish={handleSubmit}
          initialValues={{
            companyName: "",
            address: "",
            emailId: "",
            phoneNumber: "",
            details: {
              businessType: "",
              gstInNumber: "",
              serviceTaxNumber: "",
              cinNumber: "",
              cstTinNumber: "",
            },
            dutySlipTc: "",
            notes: "",
          }}
          className={styles.form}
        >
          <div className={styles.typeContainer}>
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true, message: "Please enter company name" }]}
            >
              <Input placeholder="Enter company name..." />
            </Form.Item>
          </div>

          <div className={styles.typeContainer}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="Enter phone number..." />
            </Form.Item>
          </div>

          <div className={styles.typeContainer}>
            <Form.Item
              label="Email ID"
              name="emailId"
              rules={[{ type: "email", message: "Please enter a valid email" }]}
            >
              <Input placeholder="Enter email..." />
            </Form.Item>
          </div>

          <div className={styles.typeContainer}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input.TextArea placeholder="Enter address..." />
            </Form.Item>
          </div>

          {/* Company Details Section */}
          <div className={styles.typeContainer}>
            <Collapse
              className="details-collapse"
              activeKey={activeKey}
              onChange={(key) => setActiveKey(key)}
              expandIcon={() => null} // Remove default icon as we're using custom header
              expandIconPosition="end"
            >
              <Panel key="1" header={customHeader} className="details-panel">
                <Form.Item
                  rules={[{ required: true }]}
                  name={["details", "businessType"]}
                  label="Business Type"
                  style={{ marginTop: "16px" }}
                >
                  <Select defaultValue="Telangana">
                    <Option value="telangana">Telangana</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name={["details", "gstInNumber"]}
                  style={{ marginTop: "16px" }}
                  label="GSTIN Number"
                >
                  <Input placeholder="Enter GSTIN Number" />
                </Form.Item>

                <Form.Item
                  name={["details", "serviceTaxNumber"]}
                  style={{ marginTop: "16px" }}
                  label="Service Tax Number"
                >
                  <Input placeholder="Enter Service Tax Number" />
                </Form.Item>

                <Form.Item
                  name={["details", "cinNumber"]}
                  label="CIN Number"
                  style={{ marginTop: "16px" }}
                >
                  <Input placeholder="Enter CIN Number" />
                </Form.Item>

                <Form.Item
                  name={["details", "cstTinNumber"]}
                  label="CST TIN Number"
                  style={{ marginTop: "16px" }}
                >
                  <Input placeholder="Enter CST TIN Number" />
                </Form.Item>
              </Panel>
            </Collapse>
          </div>

          <div className={styles.typeContainer}>
            <Form.Item label="Duty Slip T&C" name="dutySlipTc">
              <Input.TextArea placeholder="Enter terms and conditions..." />
            </Form.Item>
          </div>

          <div className={styles.typeContainer}>
            <Form.Item label="Signature" name="signature">
              <UploadComponent
                handleUploadUrl={handleSignature}
                isMultiple={false}
              />
            </Form.Item>
          </div>

          <div className={styles.typeContainer}>
            <Form.Item label="Notes" name="notes">
              <Input.TextArea
                placeholder="Add a note..."
                className={styles.textarea}
              />
            </Form.Item>
          </div>
        </Form>
      </div>

      <div className={styles.bottomContainer}>
        <SecondaryBtn btnText="Cancel" onClick={handleCloseSidePanel} />
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => form.submit()}
          loading={loading}
          className="primary-btn"
        >
          {currentCompany ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default CompanyForm;
