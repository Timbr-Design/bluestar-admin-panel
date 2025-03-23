/* eslint-disable */

import type React from "react";
import { Form, Input, Button, Card, Typography, Divider, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import styles from "./index.module.scss";
import { login, clearError } from "../../redux/slices/loginSlice";
interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.login);
  const { Title, Text } = Typography;

  const onFinish = async (values: LoginFormValues) => {
    try {
      dispatch(login({ email: values.email, password: values.password }));
    } catch (error) {
      message.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <Title level={2}>Welcome Back</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        <Divider />

        <Form
          name="login-form"
          className={styles.loginForm}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={
                <UserOutlined className={styles["site-form-item-icon"]} />
              }
              placeholder="Email"
              onChange={() => dispatch(clearError())}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.siteFormItemIcon} />}
              placeholder="Password"
              onChange={() => dispatch(clearError())}
              size="large"
            />
          </Form.Item>
          {error && <div className={styles.errorMessage}>{error}</div>}


          <Form.Item className={styles.loginFormButton}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>

          {/* <div className={styles.loginLinks}>
            <a href="/forgot-password" className={styles.forgotPasswordLink}>
              Forgot password?
            </a>
            <Text type="secondary">
              Don't have an account? <a href="/register">Sign up</a>
            </Text>
          </div> */}
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
