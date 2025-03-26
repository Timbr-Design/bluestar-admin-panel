/* eslint-disable */
import { useState, useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import styles from "./index.module.scss";
import CustomizeRequiredMark from "../../../components/Common/CustomizeRequiredMark";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  createTeamMember,
  updateTeamMember,
} from "../../../redux/slices/teamMemberSlice";
import SecondaryBtn from "../../../components/SecondaryBtn";

const { Option } = Select;
const { TextArea } = Input;

interface ITeamForm {
  handleCloseSidePanel: () => void;
}

const ROLES = ["owner", "admin", "managers", "staff"];

const TeamForm = ({ handleCloseSidePanel }: ITeamForm) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { currentTeamMember, loading } = useAppSelector(
    (state) => state.teamMember
  );

  console.log(currentTeamMember, "currentTeamMember");

  useEffect(() => {
    if (currentTeamMember) {
      form.setFieldsValue({
        fullName: currentTeamMember.fullName,
        email: currentTeamMember.email,
        phoneNumber: currentTeamMember.phoneNumber,
        address: currentTeamMember.address,
        notes: currentTeamMember.notes,
        role: currentTeamMember.role,
      });
    }
  }, [currentTeamMember, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (currentTeamMember?._id) {
        await dispatch(
          updateTeamMember({
            id: currentTeamMember._id,
            teamMemberData: values,
          })
        ).unwrap();
      } else {
        await dispatch(createTeamMember(values)).unwrap();
      }
      handleCloseSidePanel();
    } catch (error: any) {}
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <div className={styles.header}>
            {currentTeamMember ? "Edit Team Member" : "Add Team Member"}
          </div>
          <div className={styles.primaryText}>
            {currentTeamMember
              ? "Update team member details"
              : "Add a new team member to your workspace"}
          </div>
        </div>
        <Form
          name="TeamForm"
          layout="vertical"
          onFinish={handleSubmit}
          form={form}
          initialValues={{
            fullName: "",
            email: "",
            phoneNumber: "",
            address: "",
            notes: "",
            role: "",
          }}
          autoComplete="off"
          requiredMark={CustomizeRequiredMark}
          className={styles.form}
        >
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[{ required: true, message: "Full name is required" }]}
              label="Full Name"
              name="fullName"
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </div>

          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              label="Email"
              name="email"
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </div>

          <div className={styles.typeContainer}>
            <Form.Item
              rules={[{ required: true, message: "Phone number is required" }]}
              label="Phone Number"
              name="phoneNumber"
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </div>

          <div className={styles.typeContainer}>
            <Form.Item
              rules={[{ required: true, message: "Role is required" }]}
              label="Role"
              name="role"
            >
              <Select placeholder="Select role">
                {ROLES.map((role) => (
                  <Option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className={styles.typeContainer}>
            <Form.Item label="Address" name="address">
              <TextArea placeholder="Enter address" />
            </Form.Item>
          </div>

          <div className={styles.typeContainer}>
            <Form.Item label="Notes" name="notes">
              <TextArea placeholder="Add notes" />
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
          {currentTeamMember ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default TeamForm;
