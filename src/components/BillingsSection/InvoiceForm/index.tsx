/* eslint-disable */
import { Select, Dropdown, Form, Input, DatePicker } from "antd";
import DropdownBtn from "../../DropdownBtn";
import type { MenuProps } from "antd";
import CustomizeRequiredMark from "../../../components/Common/CustomizeRequiredMark";
import { ReactComponent as PlusIcon } from "../../../icons/plus-blue.svg";
import styles from "./index.module.scss";
import { useState } from "react";
import { addInvoice } from "../../../redux/slices/billingSlice";
import { useAppDispatch } from "../../../hooks/store";
import Taxable from "../Taxable/Taxable";

const TAXES = [{ value: "Preset tax - 10%", label: "Preset tax - 10%" }];

const InvoiceForm = ({ form }) => {
  const dispatch = useAppDispatch();
  const [isCustomRowSelected, setIsCustomRowSelected] = useState(false);

  const handleSave = (values: any) => {
    console.log(values);
    dispatch(addInvoice(values));
    // if (Object.keys(selectedExpense).length) {
    //   dispatch(
    //     updateExpense({ payload: values, id: selectedExpense._id })
    //   );
    // } else {
    //   dispatch(addNewExpense(values));
    // }
  };

  const handleCustomRow = () => {
    setIsCustomRowSelected(true);
  };

  const items: MenuProps["items"] = [
    {
      label: "Taxable",
      key: "0",
      onClick: handleCustomRow,
    },
    {
      label: "Non-taxable",
      key: "1",
    },
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.content}>
        <div className={styles.heading}>
          <div className={styles.header}>
            <div className={styles["header_1"]}>Invoice details</div>
            <div className={styles["header_2"]}>
              Fill customer and booking details here
            </div>
          </div>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <DropdownBtn
              btnText={"Add custom row"}
              onClick={() => {}}
              LeadingIcon={PlusIcon}
            />
          </Dropdown>
        </div>
        <div className={styles.customerContainer}>
          <div className={styles.customerHeading}>Customer details</div>
          <Form
            requiredMark={CustomizeRequiredMark}
            className={styles.form}
            layout="vertical"
            form={form}
            onFinish={(values) => {
              console.log(values);
              const valuesToSend = {
                billingAddress: values.billingAddress,
              };
              handleSave(valuesToSend);
            }}
          >
            <div className={styles.typeContainer}>
              <Form.Item
                label="Customer"
                rules={[
                  {
                    required: true,
                    message: "Please enter the customer",
                  },
                ]}
                name="customer"
                id="customer"
              >
                <Input placeholder="Expedia Services" />
              </Form.Item>
            </div>
            <div className={styles.typeContainer}>
              <Form.Item
                label="GSTIN Number"
                rules={[
                  {
                    required: false,
                  },
                ]}
                name="gstin"
                id="gstin"
              >
                <Input placeholder="GSIT00004821" />
              </Form.Item>
            </div>
            <div className={styles.typeContainer}>
              <Form.Item
                label="Billing Name"
                rules={[
                  {
                    required: false,
                  },
                ]}
                name="billingName"
                id="billingName"
              >
                <Input placeholder="Expedia Global Inc." />
              </Form.Item>
            </div>
            <div className={styles.typeContainer}>
              <Form.Item
                label="Billing Address"
                name="billingAddress"
                id="billingAddress"
              >
                <Input.TextArea
                  className={styles.textarea}
                  name="billingAddress"
                  placeholder="Parkway Centre 1 Marine Parade Central #13-03Singapore 449408"
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
                name="taxes"
                id="taxes"
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select One"
                  dropdownRender={(menu) => <>{menu}</>}
                  options={TAXES.map((tax) => ({
                    label: tax.label,
                    value: tax.value,
                  }))}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
        <div className={styles.invoicesContainer}>
          <div className={styles.invoiceHeading}>{`Invoice dates`}</div>
          <div className={styles.invoice}>
            <div className={styles.invoiceNumber}>
              <div className={styles.primary}>{`Invoice Number`}</div>
              <div className={styles.secondary}>{`GR2425-0005`}</div>
            </div>
            <div className={styles.invoiceNumber}>
              <div className={styles.primary}>{`Invoice Date`}</div>
              <div className={styles.secondary}>{`21/07/24`}</div>
            </div>
          </div>
        </div>
        <div className={styles.bookingsContainer}>
          <div className={styles.bookingHeading}>Bookings</div>
        </div>
        <div className={styles.taxesContainer}>
          <div className={styles.taxesHeading}>Tax</div>
        </div>
        <div className={styles.discountContainer}>
          <div className={styles.discountHeading}>Discount</div>
        </div>
        {isCustomRowSelected && <Taxable />}
      </div>
      <div className={styles.content}>
        <div className={styles.heading}>
          <div className={styles.header}>
            <div className={styles["header_1"]}>Preview</div>
            <div className={styles["header_2"]}>See your invoice here</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
