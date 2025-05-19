/* eslint-disable */
import { Select, Dropdown, Form, Input, DatePicker } from "antd";
import PrimaryBtn from "../PrimaryBtn";
import CancelBtn from "../CancelBtn";
import type { MenuProps } from "antd";
import { ReactComponent as CheckIcon } from "../../icons/check.svg";
import { ReactComponent as ArrowLeftOutlined } from "../../icons/arrow-left-blue.svg";
import InvoiceForm from "./InvoiceForm";
import ReceiptForm from "./ReceiptForm";

import styles from "./index.module.scss";
import { useState } from "react";

interface IBillingsSection {
  isEdit: boolean;
  isInvoice: boolean;
}

const BillingsSection = ({ isEdit, isInvoice }: IBillingsSection) => {
  const [dropdownValue, setDropdownValue] = useState<string>("BlueStar Prime");

  return (
    <div className={styles.container}>
      <div className={styles.headingContainer}>
        <a href="/billings" className={styles.backBtn}>
          <ArrowLeftOutlined />
          {isInvoice ? "Back to Invoices" : "Back to Receipts"}
        </a>
        <div className={styles.headingSection}>
          <div className={styles.header}>
            {isInvoice ? "Create invoice" : "New Receipt"}
          </div>
          <div className={styles.leftHeader}>
            {isInvoice && <div className={styles.text}>Billing as: </div>}
            {isInvoice && <Select value={dropdownValue} />}
            {isInvoice && <div className={styles.dash} />}
            <CancelBtn btnText="Cancel" onClick={() => {}} />
            <PrimaryBtn
              btnText={isInvoice ? "Save Invoice" : "Save Receipt"}
              onClick={() => {}}
              LeadingIcon={CheckIcon}
            />
          </div>
        </div>
      </div>
      {isInvoice ? <InvoiceForm /> : <ReceiptForm />}
    </div>
  );
};

export default BillingsSection;
