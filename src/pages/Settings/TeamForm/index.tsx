/* eslint-disable */
import { useState } from "react";
import { Form, Input, Select, Button } from "antd";
import styles from "./index.module.scss";
import CustomizeRequiredMark from "../../../components/Common/CustomizeRequiredMark";

const { Option } = Select;

const TeamForm = () => {
  const [form] = Form.useForm();

  const handleSubmitForm = (values: any) => {
    console.log(values);
    // Handle form submission
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.header}>Add Team Member</div>
        <div className={styles.primaryText}>
          Add a new team member to your workspace
        </div>
      </div>
      <Form
        name="TeamForm"
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
          role: "",
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
                  message: "Full name is required",
                },
              ]}
              label="Full Name"
              name="name"
            >
              <Input type="text" placeholder="Enter full name" />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Email is required",
                },
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
              label="Email"
              name="email"
            >
              <Input type="email" placeholder="Enter email address" />
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
              label="Phone Number"
              name="phone"
            >
              <Input type="tel" placeholder="Enter phone number" />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Role is required",
                },
              ]}
              label="Role"
              name="role"
            >
              <Select placeholder="Select role">
                <Option value="admin">Admin</Option>
                <Option value="manager">Manager</Option>
                <Option value="user">User</Option>
                <Option value="viewer">Viewer</Option>
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className={styles.formActions}>
          <Button className={styles.cancelButton}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Add Member
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TeamForm;