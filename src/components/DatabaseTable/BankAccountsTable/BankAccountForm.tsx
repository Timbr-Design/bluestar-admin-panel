/* eslint-disable */
import { Form, Input, notification, Spin, Button, message } from "antd";
import {
  addBankAccount,
  updateBankAccount,
  setViewContentDatabase,
} from "../../../redux/slices/databaseSlice";
import { ReactComponent as EditIcon } from "../../../icons/edit-icon.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import styles from "../DutyTypeTable/index.module.scss";
import SecondaryBtn from "../../SecondaryBtn";
import PrimaryBtn from "../../PrimaryBtn";
import { useEffect } from "react";
import CustomizeRequiredMark from "../../Common/CustomizeRequiredMark";

interface IBankAccountForm {
  handleCloseSidePanel: () => void;
}

type NotificationType = "success" | "info" | "warning" | "error";

const BankAccountForm = ({ handleCloseSidePanel }: IBankAccountForm) => {
  const [api, contextHolder] = notification.useNotification();
  const {
    selectedBankAccount,
    bankAccountStates,
    updateBankAccountState,
    viewContentDatabase,
  } = useAppSelector((state) => state.database);

  const dispatch = useAppDispatch();

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Bank account added",
      description: "Bank account added to the database",
    });
  };

  const onSubmit = (values: any) => {
    if (Object.keys(selectedBankAccount).length) {
      dispatch(
        updateBankAccount({
          id: selectedBankAccount?.data?._id,
          payload: values,
        })
      );
    } else {
      dispatch(addBankAccount(values));
    }
  };
  const [form] = Form.useForm();

  useEffect(() => {
    if (Object.keys(selectedBankAccount).length) {
      form.setFieldsValue({
        accountName: selectedBankAccount?.data?.accountName || "",
        accountNumber: selectedBankAccount?.data?.accountNumber || "",
        bankName: selectedBankAccount?.data?.bankName || "",
        ifsc: selectedBankAccount?.data?.ifsc || "",
        branchName: selectedBankAccount?.data?.branchName || "",
        notes: selectedBankAccount?.data?.notes || "",
      });
    }
  }, [selectedBankAccount]);

  console.log(selectedBankAccount, "selectedBankAccount");
  return (
    <div className={styles.formContainer}>
      {contextHolder}
      {bankAccountStates.loading && (
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
            {Object.keys(selectedBankAccount)?.length
              ? viewContentDatabase
                ? "Bank Account"
                : "Edit Bank Account"
              : "New Bank Account"}
          </div>
          <div className={styles.primaryText}>
            {Object.keys(selectedBankAccount)?.length
              ? viewContentDatabase
                ? "View bank account details"
                : "Update or modify bank account details"
              : "Add details of your bank account"}
          </div>
        </div>
        <Form
          disabled={viewContentDatabase}
          onFinishFailed={() => {
            //for errors
          }}
          onFinish={(values) => {
            // passed validation

            const data = {
              ...values,
              accountNumber: Number(values.accountNumber),
            };
            onSubmit(data);
          }}
          requiredMark={CustomizeRequiredMark}
          layout="vertical"
          form={form}
          className={styles.form}
        >
          <div className={styles.typeContainer}>
            <Form.Item
              label="Account Name"
              id="accountName"
              name="accountName"
              rules={[
                {
                  required: true,
                  min: 3,
                },
              ]}
            >
              <Input placeholder="Enter account name..." />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              label="Account Number"
              id="accountNumber"
              name="accountNumber"
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^[0-9]{4,17}$/),
                  message: "Wrong format!",
                },
              ]}
            >
              <Input type="number" placeholder="Enter account number..." />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^[A-Z]{4}0[A-Z0-9]{6}$/),
                  message: "Wrong format!",
                },
              ]}
              label="IFSC Code"
              id="ifsc"
              name="ifsc"
            >
              <Input placeholder="Enter IFSC Code..." />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              label="Bank Name"
              id="bankName"
              name="bankName"
            >
              <Input placeholder="Enter Bank Name..." />
            </Form.Item>
          </div>
          <div className={styles.typeContainer}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              label="Bank Branch"
              id="branchName"
              name="branchName"
            >
              <Input placeholder="Enter Bank Branch..." />
            </Form.Item>
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
            loading={
              updateBankAccountState.loading || bankAccountStates.loading
            }
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default BankAccountForm;
