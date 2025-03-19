/* eslint-disable */
import { useState } from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import { MailOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import cn from "classnames";
import styles from "./index.module.scss";

const { Title, Paragraph, Text } = Typography;

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function PersonalInfoForm() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "Oliva",
    lastName: "Rhye",
    email: "olivia@untitledui.com",
    role: "Product Designer",
  });

  const handleSubmit = (values: PersonalInfo) => {
    console.log("Form submitted:", values);
    setPersonalInfo(values);
    setIsEditing(false);

    // Example of how you might dispatch to Redux store
    // dispatch(updateUserProfile(values));
  };

  const toggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      form.resetFields();
    } else {
      form.setFieldsValue(personalInfo);
      setIsEditing(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={4} className={styles.title}>
            Personal info
          </Title>
          <Paragraph className={styles.subtitle}>
            Update and manage your personal information.
          </Paragraph>
        </div>
        {!isEditing ? (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={toggleEdit}
            className={styles.editButton}
          >
            Edit
          </Button>
        ) : (
          <div className={styles.actionButtons}>
            <Button onClick={toggleEdit} className={styles.cancelButton}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              className={styles.saveButton}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={personalInfo}
        onFinish={handleSubmit}
        disabled={!isEditing}
        className={styles.form}
      >
        <Divider className={styles.divider} />

        <Form.Item
          label={
            <span className={styles.label}>
              Name {isEditing && <span className={styles.required}>*</span>}
            </span>
          }
          className={styles.formItem}
        >
          <div className={styles.nameInputs}>
            <Form.Item
              name="firstName"
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}
              noStyle
            >
              <Input
                placeholder="First name"
                className={cn(styles.input, { [styles.name]: true })}
                size={"small"}
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[
                { required: true, message: "Please enter your last name" },
              ]}
              noStyle
            >
              <Input
                placeholder="Last name"
                className={cn(styles.input, { [styles.name]: true })}
                size={"small"}
              />
            </Form.Item>
          </div>
        </Form.Item>

        <Divider className={styles.divider} />

        <Form.Item
          label={
            <span className={styles.label}>
              Email address{" "}
              {isEditing && <span className={styles.required}>*</span>}
            </span>
          }
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
          className={styles.formItem}
        >
          <Input
            prefix={<MailOutlined className={styles.emailIcon} />}
            placeholder="Email"
            className={cn(styles.input, { [styles.email]: true })}
          />
        </Form.Item>

        <Divider className={styles.divider} />

        <Form.Item
          label={<span className={styles.label}>Role</span>}
          name="role"
          className={styles.formItem}
        >
          <Input
            placeholder="Role"
            className={cn(styles.input, { [styles.role]: true })}
          />
        </Form.Item>

        <Divider className={styles.divider} />

        <div className={styles.accessTypeSection}>
          <div className={styles.accessTypeHeader}>
            <Text strong className={styles.label}>
              Access Type
            </Text>
            <Text className={styles.ownerBadge}>Owner</Text>
          </div>
          <Paragraph className={styles.accessTypeDescription}>
            You have Owner access to your profile information and settings. This
            setting cannot be changed.
          </Paragraph>
        </div>
      </Form>
    </div>
  );
}
